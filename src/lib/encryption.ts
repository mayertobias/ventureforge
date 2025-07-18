import crypto from 'crypto';

/**
 * VentureForge Encryption Service
 * 
 * This service provides AES-256-GCM encryption for user project data,
 * implementing client-side encryption where only the user can decrypt their data.
 * 
 * Key Features:
 * - AES-256-GCM encryption (authenticated encryption)
 * - User-specific encryption keys
 * - Secure random IV generation
 * - Base64 encoding for database storage
 */

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export interface DecryptionInput {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16; // 128 bits
  
  /**
   * Generates a secure random encryption key
   * @returns Base64 encoded encryption key
   */
  static generateEncryptionKey(): string {
    const key = crypto.randomBytes(this.KEY_LENGTH);
    return key.toString('base64');
  }

  /**
   * Encrypts data using AES-256-GCM
   * @param data - The data to encrypt (will be JSON stringified)
   * @param key - Base64 encoded encryption key
   * @returns Encryption result with encrypted data, IV, and auth tag
   */
  static encrypt(data: any, key: string): EncryptionResult {
    try {
      // Generate random IV for this encryption
      const iv = crypto.randomBytes(this.IV_LENGTH);
      
      // Convert base64 key to buffer
      const keyBuffer = Buffer.from(key, 'base64');
      
      // Create cipher
      const cipher = crypto.createCipheriv(this.ALGORITHM, keyBuffer, iv);
      cipher.setAAD(Buffer.from('ventureforge-encryption', 'utf8'));
      
      // Encrypt the data
      const jsonData = JSON.stringify(data);
      let encrypted = cipher.update(jsonData, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Get authentication tag
      const authTag = cipher.getAuthTag();
      
      return {
        encryptedData: encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64')
      };
      
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts data using AES-256-GCM
   * @param encryptedInput - Object containing encrypted data, IV, and auth tag
   * @param key - Base64 encoded encryption key
   * @returns Decrypted and parsed data
   */
  static decrypt(encryptedInput: DecryptionInput, key: string): any {
    try {
      // Convert base64 inputs to buffers
      const keyBuffer = Buffer.from(key, 'base64');
      const ivBuffer = Buffer.from(encryptedInput.iv, 'base64');
      const authTagBuffer = Buffer.from(encryptedInput.authTag, 'base64');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.ALGORITHM, keyBuffer, ivBuffer);
      decipher.setAAD(Buffer.from('ventureforge-encryption', 'utf8'));
      decipher.setAuthTag(authTagBuffer);
      
      // Decrypt the data
      let decrypted = decipher.update(encryptedInput.encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Parse JSON and return
      return JSON.parse(decrypted);
      
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data - key may be invalid');
    }
  }

  /**
   * Validates that encrypted data can be decrypted with the given key
   * @param encryptedInput - Encrypted data to validate
   * @param key - Encryption key to test
   * @returns True if decryption succeeds, false otherwise
   */
  static validateEncryption(encryptedInput: DecryptionInput, key: string): boolean {
    try {
      this.decrypt(encryptedInput, key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Encrypts all project data fields
   * @param projectData - Project data with ideaOutput, researchOutput, etc.
   * @param key - User's encryption key
   * @returns Object with encrypted versions of all data fields
   */
  static encryptProjectData(projectData: any, key: string): any {
    const encryptedProject = { ...projectData };
    
    // List of fields to encrypt
    const fieldsToEncrypt = [
      'ideaOutput',
      'researchOutput', 
      'blueprintOutput',
      'financialOutput',
      'pitchOutput',
      'gtmOutput'
    ];
    
    fieldsToEncrypt.forEach(field => {
      if (projectData[field]) {
        encryptedProject[field] = this.encrypt(projectData[field], key);
      }
    });
    
    return encryptedProject;
  }

  /**
   * Decrypts all project data fields
   * @param encryptedProjectData - Project data with encrypted fields
   * @param key - User's encryption key
   * @returns Object with decrypted versions of all data fields
   */
  static decryptProjectData(encryptedProjectData: any, key: string): any {
    const decryptedProject = { ...encryptedProjectData };
    
    // List of fields to decrypt
    const fieldsToDecrypt = [
      'ideaOutput',
      'researchOutput',
      'blueprintOutput', 
      'financialOutput',
      'pitchOutput',
      'gtmOutput'
    ];
    
    fieldsToDecrypt.forEach(field => {
      if (encryptedProjectData[field] && typeof encryptedProjectData[field] === 'object') {
        // Check if this field is encrypted (has the encryption structure)
        if (encryptedProjectData[field].encryptedData && 
            encryptedProjectData[field].iv && 
            encryptedProjectData[field].authTag) {
          decryptedProject[field] = this.decrypt(encryptedProjectData[field], key);
        }
      }
    });
    
    return decryptedProject;
  }
}

export default EncryptionService;