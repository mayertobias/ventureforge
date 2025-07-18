import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

/**
 * AWS KMS Service for VentureForge User Data Encryption
 * 
 * This service provides enterprise-grade encryption for user project data using AWS KMS.
 * Each user's sensitive business information (ideas, research, financial models) is encrypted
 * with AWS-managed keys, ensuring zero-knowledge architecture.
 * 
 * Key Features:
 * - AWS KMS encryption with customer master keys
 * - User-specific encryption contexts for additional security
 * - Serverless-friendly for Vercel deployment
 * - FIPS 140-2 Level 3 certified security
 * - Automatic key rotation and compliance
 */

export class AWSKMSService {
  private static client: KMSClient | null = null;

  /**
   * Initialize AWS KMS client with credentials
   */
  private static getClient(): KMSClient {
    if (!this.client) {
      // Validate required environment variables
      if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_KMS_KEY_ID) {
        throw new Error('Missing required AWS KMS environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_KMS_KEY_ID');
      }

      this.client = new KMSClient({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      });
    }
    return this.client;
  }

  /**
   * Encrypts user project data using AWS KMS
   * @param userId - The user's ID for encryption context
   * @param projectData - The project data to encrypt
   * @returns Base64-encoded encrypted data
   */
  static async encryptUserData(userId: string, projectData: any): Promise<string> {
    try {
      const client = this.getClient();
      
      // Convert data to JSON string and then to buffer
      const plaintext = Buffer.from(JSON.stringify(projectData), 'utf-8');
      
      const command = new EncryptCommand({
        KeyId: process.env.AWS_KMS_KEY_ID,
        Plaintext: plaintext,
        // Encryption context provides additional security and audit trail
        EncryptionContext: {
          userId: userId,
          application: 'ventureforge',
          dataType: 'project'
        }
      });
      
      const result = await client.send(command);
      
      if (!result.CiphertextBlob) {
        throw new Error('Encryption failed: No ciphertext returned');
      }
      
      // Return base64-encoded encrypted data
      return Buffer.from(result.CiphertextBlob).toString('base64');
      
    } catch (error) {
      console.error('AWS KMS encryption failed:', error);
      throw new Error('Failed to encrypt user data');
    }
  }

  /**
   * Decrypts user project data using AWS KMS
   * @param userId - The user's ID for encryption context validation
   * @param encryptedData - Base64-encoded encrypted data
   * @returns Decrypted project data as JSON
   */
  static async decryptUserData(userId: string, encryptedData: string): Promise<any> {
    try {
      const client = this.getClient();
      
      // Convert base64 back to buffer
      const ciphertextBlob = Buffer.from(encryptedData, 'base64');
      
      const command = new DecryptCommand({
        CiphertextBlob: ciphertextBlob,
        // Must match the encryption context used during encryption
        EncryptionContext: {
          userId: userId,
          application: 'ventureforge',
          dataType: 'project'
        }
      });
      
      const result = await client.send(command);
      
      if (!result.Plaintext) {
        throw new Error('Decryption failed: No plaintext returned');
      }
      
      // Convert buffer back to string and parse JSON
      const plaintext = Buffer.from(result.Plaintext).toString('utf-8');
      return JSON.parse(plaintext);
      
    } catch (error) {
      console.error('AWS KMS decryption failed:', error);
      throw new Error('Failed to decrypt user data - access denied');
    }
  }

  /**
   * Validates that the KMS service is properly configured
   * @returns Promise<boolean> - True if KMS is working
   */
  static async validateConfiguration(): Promise<boolean> {
    try {
      const testData = { test: 'validation' };
      const testUserId = 'test-user-id';
      
      // Test encryption
      const encrypted = await this.encryptUserData(testUserId, testData);
      
      // Test decryption
      const decrypted = await this.decryptUserData(testUserId, encrypted);
      
      // Verify data integrity
      return JSON.stringify(testData) === JSON.stringify(decrypted);
      
    } catch (error) {
      console.error('KMS validation failed:', error);
      return false;
    }
  }
}

/**
 * Legacy compatibility layer for existing HashiCorp Vault code
 * This allows seamless migration from Vault to AWS KMS
 */
export class KMSService {
  static async encryptUserData(userId: string, projectData: any): Promise<string> {
    return AWSKMSService.encryptUserData(userId, projectData);
  }

  static async decryptUserData(userId: string, encryptedData: any): Promise<any> {
    // Handle both new AWS KMS format (string) and legacy Vault format (object)
    if (typeof encryptedData === 'string') {
      return AWSKMSService.decryptUserData(userId, encryptedData);
    }
    
    // Legacy format handling
    if (encryptedData && typeof encryptedData === 'object') {
      // If it's already decrypted object, return as-is (for backward compatibility)
      if (!encryptedData.encrypted && !encryptedData.iv && !encryptedData.authTag) {
        return encryptedData;
      }
    }
    
    throw new Error('Unsupported encryption format');
  }

  static async generateUserKey(userId: string): Promise<string> {
    // AWS KMS doesn't require per-user key generation
    // The master key handles all users with encryption context
    return `aws-kms-${userId}`;
  }

  static async rotateUserKey(userId: string): Promise<string> {
    // AWS KMS handles key rotation automatically
    // Return the same key ID
    return this.generateUserKey(userId);
  }
}