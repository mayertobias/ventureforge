/**
 * Apply privacy constraints to ensure MEMORY_ONLY projects
 * cannot have sensitive AI data persisted to database
 */

const { PrismaClient } = require('@prisma/client');

async function applyPrivacyConstraints() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔒 Applying privacy constraints...');
    
    // Step 1: Clean up existing MEMORY_ONLY projects with AI data
    console.log('📧 Cleaning up existing MEMORY_ONLY projects...');
    
    const result = await prisma.project.updateMany({
      where: {
        storageMode: 'MEMORY_ONLY',
        OR: [
          { ideaOutput: { not: null } },
          { researchOutput: { not: null } },
          { blueprintOutput: { not: null } },
          { financialOutput: { not: null } },
          { pitchOutput: { not: null } },
          { gtmOutput: { not: null } }
        ]
      },
      data: {
        ideaOutput: null,
        researchOutput: null,
        blueprintOutput: null,
        financialOutput: null,
        pitchOutput: null,
        gtmOutput: null
      }
    });
    
    console.log(`✅ Cleaned up ${result.count} MEMORY_ONLY projects with AI data`);
    
    // Step 2: Apply database constraints using raw SQL
    console.log('🛡️ Adding database constraints...');
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Project" 
        ADD CONSTRAINT "privacy_constraint_idea" 
        CHECK (
          NOT ("storageMode" = 'MEMORY_ONLY' AND "ideaOutput" IS NOT NULL)
        )
      `;
      console.log('✅ Added ideaOutput privacy constraint');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ ideaOutput constraint already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Project" 
        ADD CONSTRAINT "privacy_constraint_research" 
        CHECK (
          NOT ("storageMode" = 'MEMORY_ONLY' AND "researchOutput" IS NOT NULL)
        )
      `;
      console.log('✅ Added researchOutput privacy constraint');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ researchOutput constraint already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Project" 
        ADD CONSTRAINT "privacy_constraint_blueprint" 
        CHECK (
          NOT ("storageMode" = 'MEMORY_ONLY' AND "blueprintOutput" IS NOT NULL)
        )
      `;
      console.log('✅ Added blueprintOutput privacy constraint');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ blueprintOutput constraint already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Project" 
        ADD CONSTRAINT "privacy_constraint_financial" 
        CHECK (
          NOT ("storageMode" = 'MEMORY_ONLY' AND "financialOutput" IS NOT NULL)
        )
      `;
      console.log('✅ Added financialOutput privacy constraint');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ financialOutput constraint already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Project" 
        ADD CONSTRAINT "privacy_constraint_pitch" 
        CHECK (
          NOT ("storageMode" = 'MEMORY_ONLY' AND "pitchOutput" IS NOT NULL)
        )
      `;
      console.log('✅ Added pitchOutput privacy constraint');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ pitchOutput constraint already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Project" 
        ADD CONSTRAINT "privacy_constraint_gtm" 
        CHECK (
          NOT ("storageMode" = 'MEMORY_ONLY' AND "gtmOutput" IS NOT NULL)
        )
      `;
      console.log('✅ Added gtmOutput privacy constraint');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ gtmOutput constraint already exists');
      } else {
        throw error;
      }
    }
    
    // Step 3: Add trigger function for automatic cleanup
    console.log('🔄 Adding automatic privacy enforcement trigger...');
    
    try {
      await prisma.$executeRaw`
        CREATE OR REPLACE FUNCTION clear_ai_data_on_memory_only()
        RETURNS TRIGGER AS $$
        BEGIN
          -- If storageMode is being set to MEMORY_ONLY, clear all AI data
          IF NEW."storageMode" = 'MEMORY_ONLY' THEN
            NEW."ideaOutput" := NULL;
            NEW."researchOutput" := NULL;
            NEW."blueprintOutput" := NULL;
            NEW."financialOutput" := NULL;
            NEW."pitchOutput" := NULL;
            NEW."gtmOutput" := NULL;
          END IF;
          
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
      `;
      console.log('✅ Created privacy enforcement function');
    } catch (error) {
      console.log('⚠️ Privacy function already exists or error:', error.message);
    }
    
    try {
      await prisma.$executeRaw`
        DROP TRIGGER IF EXISTS privacy_enforcement_trigger ON "Project"
      `;
      
      await prisma.$executeRaw`
        CREATE TRIGGER privacy_enforcement_trigger
          BEFORE INSERT OR UPDATE ON "Project"
          FOR EACH ROW
          EXECUTE FUNCTION clear_ai_data_on_memory_only()
      `;
      console.log('✅ Created privacy enforcement trigger');
    } catch (error) {
      console.log('⚠️ Trigger creation error:', error.message);
    }
    
    console.log('🎉 Privacy constraints applied successfully!');
    console.log('');
    console.log('🔐 Privacy Protection Summary:');
    console.log('- MEMORY_ONLY projects cannot store AI data in database');
    console.log('- Automatic cleanup when storage mode changes');
    console.log('- Database-level enforcement prevents accidental persistence');
    console.log('- Existing non-compliant data has been cleaned');
    
  } catch (error) {
    console.error('❌ Error applying privacy constraints:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  applyPrivacyConstraints()
    .then(() => {
      console.log('✅ Privacy constraints setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to apply privacy constraints:', error);
      process.exit(1);
    });
}

module.exports = { applyPrivacyConstraints };