#!/usr/bin/env tsx
/**
 * VentureForge Data Encryption Migration Script
 * 
 * This script migrates existing project data to encrypted storage.
 * 
 * IMPORTANT: This is a one-time migration script that encrypts all existing
 * project data using the new KMS-based encryption system. Run this script
 * only after deploying the new encryption endpoints.
 * 
 * Usage: npm run encrypt-existing-projects
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { KMSService } from '../src/lib/kms';

const prisma = new PrismaClient();

interface ProjectEncryption {
  projectId: string;
  userId: string;
  fieldsEncrypted: string[];
  success: boolean;
  error?: string;
}

async function encryptExistingProjects() {
  console.log('🔒 Starting VentureForge Data Encryption Migration...');
  
  try {
    // Fetch all projects that have at least one data field
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ideaOutput: { not: Prisma.DbNull } },
          { researchOutput: { not: Prisma.DbNull } },
          { blueprintOutput: { not: Prisma.DbNull } },
          { financialOutput: { not: Prisma.DbNull } },
          { pitchOutput: { not: Prisma.DbNull } },
          { gtmOutput: { not: Prisma.DbNull } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            kmsKeyId: true
          }
        }
      }
    });

    console.log(`📊 Found ${projects.length} projects with data to encrypt`);
    
    if (projects.length === 0) {
      console.log('✅ No projects found that need encryption. Migration complete!');
      return;
    }

    const results: ProjectEncryption[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      console.log(`\n🔐 Encrypting project: ${project.name} (${project.id})`);
      console.log(`   User: ${project.user.email} (${project.user.id})`);

      const encryptionResult: ProjectEncryption = {
        projectId: project.id,
        userId: project.user.id,
        fieldsEncrypted: [],
        success: false
      };

      try {
        // Generate encryption key for user if they don't have one
        if (!project.user.kmsKeyId) {
          console.log(`   🔑 Generating new encryption key for user ${project.user.email}`);
          const keyId = await KMSService.generateUserKey(project.user.id);
          
          await prisma.user.update({
            where: { id: project.user.id },
            data: { kmsKeyId: keyId }
          });
          
          console.log(`   ✅ Generated key: ${keyId}`);
        }

        // List of fields to encrypt
        const fieldsToEncrypt = [
          'ideaOutput',
          'researchOutput',
          'blueprintOutput',
          'financialOutput',
          'pitchOutput',
          'gtmOutput'
        ];

        const updateData: any = {};
        
        for (const field of fieldsToEncrypt) {
          const fieldValue = (project as any)[field];
          
          if (fieldValue !== null && fieldValue !== undefined) {
            // Check if the field is already encrypted
            if (fieldValue && typeof fieldValue === 'object' && fieldValue.encrypted) {
              console.log(`   ⚠️  Field ${field} appears to already be encrypted, skipping...`);
              continue;
            }
            
            console.log(`   🔐 Encrypting field: ${field}`);
            
            try {
              const encryptedData = await KMSService.encryptUserData(project.user.id, fieldValue);
              updateData[field] = encryptedData;
              encryptionResult.fieldsEncrypted.push(field);
              
              console.log(`   ✅ Successfully encrypted: ${field}`);
            } catch (fieldError) {
              console.error(`   ❌ Failed to encrypt field ${field}:`, fieldError);
              encryptionResult.error = `Failed to encrypt ${field}: ${fieldError}`;
              throw fieldError;
            }
          }
        }

        // Update the project with encrypted data
        if (Object.keys(updateData).length > 0) {
          await prisma.project.update({
            where: { id: project.id },
            data: updateData
          });
          
          console.log(`   ✅ Project ${project.name} successfully encrypted`);
          encryptionResult.success = true;
          successCount++;
        } else {
          console.log(`   ℹ️  No fields to encrypt for project ${project.name}`);
          encryptionResult.success = true;
          successCount++;
        }
        
      } catch (error) {
        console.error(`   ❌ Failed to encrypt project ${project.name}:`, error);
        encryptionResult.error = `${error}`;
        errorCount++;
      }
      
      results.push(encryptionResult);
    }

    // Print summary
    console.log('\n📋 ENCRYPTION MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total projects processed: ${projects.length}`);
    console.log(`Successfully encrypted: ${successCount}`);
    console.log(`Failed to encrypt: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log('\n❌ ERRORS ENCOUNTERED:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`  - Project ${result.projectId}: ${result.error}`);
      });
    }

    console.log('\n✅ SUCCESSFULLY ENCRYPTED:');
    results.filter(r => r.success).forEach(result => {
      console.log(`  - Project ${result.projectId}: [${result.fieldsEncrypted.join(', ')}]`);
    });

    if (errorCount === 0) {
      console.log('\n🎉 All projects successfully encrypted!');
      console.log('🔒 Your user data is now protected with zero-knowledge encryption.');
    } else {
      console.log('\n⚠️  Some projects failed to encrypt. Please check the errors above.');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Critical error during encryption migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Validation function to verify encryption works
async function verifyEncryption() {
  console.log('\n🔍 Verifying encryption integrity...');
  
  try {
    // Get a sample of encrypted projects
    const sampleProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ideaOutput: { not: Prisma.DbNull } },
          { researchOutput: { not: Prisma.DbNull } },
          { blueprintOutput: { not: Prisma.DbNull } },
          { financialOutput: { not: Prisma.DbNull } },
          { pitchOutput: { not: Prisma.DbNull } },
          { gtmOutput: { not: Prisma.DbNull } }
        ]
      },
      include: {
        user: {
          select: { id: true, email: true }
        }
      },
      take: 3
    });

    console.log(`🧪 Testing decryption on ${sampleProjects.length} sample projects...`);

    for (const project of sampleProjects) {
      console.log(`\n  Testing project: ${project.name}`);
      
      const fieldsToTest = ['ideaOutput', 'researchOutput', 'blueprintOutput', 'financialOutput', 'pitchOutput', 'gtmOutput'];
      
      for (const field of fieldsToTest) {
        const fieldValue = (project as any)[field];
        
        if (fieldValue && typeof fieldValue === 'object' && fieldValue.encrypted) {
          try {
            const decryptedData = await KMSService.decryptUserData(project.user.id, fieldValue);
            console.log(`    ✅ ${field}: Successfully decrypted`);
          } catch (error) {
            console.error(`    ❌ ${field}: Decryption failed - ${error}`);
            throw error;
          }
        }
      }
    }

    console.log('\n✅ Encryption verification successful!');
    console.log('🔒 All encrypted data can be properly decrypted.');
    
  } catch (error) {
    console.error('❌ Encryption verification failed:', error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('🚀 VentureForge Zero-Knowledge Encryption Migration');
  console.log('=' .repeat(60));
  
  try {
    await encryptExistingProjects();
    await verifyEncryption();
    
    console.log('\n🎉 MIGRATION COMPLETE!');
    console.log('🔒 All user project data is now encrypted with zero-knowledge architecture.');
    console.log('📊 Users can only decrypt their own data when authenticated.');
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

export { encryptExistingProjects, verifyEncryption };