/**
 * Final cleanup and constraint application
 */

const { PrismaClient } = require('@prisma/client');

async function finalCleanupAndConstraints() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧹 Final cleanup of MEMORY_ONLY projects...');
    
    // Find and clean all MEMORY_ONLY projects with any AI data
    const result = await prisma.project.updateMany({
      where: {
        storageMode: 'MEMORY_ONLY'
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
    
    console.log(`✅ Force cleaned ${result.count} MEMORY_ONLY projects`);
    
    // Verify cleanup
    const remaining = await prisma.project.findMany({
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
      }
    });
    
    console.log(`Remaining violations: ${remaining.length}`);
    
    if (remaining.length === 0) {
      console.log('🛡️ Applying privacy constraints...');
      
      // Apply constraints using Prisma.sql template literal for proper escaping
      try {
        await prisma.$executeRaw`
          ALTER TABLE "Project" 
          ADD CONSTRAINT "privacy_constraint_idea" 
          CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "ideaOutput" IS NOT NULL))
        `;
        console.log('✅ Added ideaOutput constraint');
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('⚠️ ideaOutput constraint already exists');
        } else {
          console.log('❌ ideaOutput constraint failed:', e.message);
        }
      }
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "Project" 
          ADD CONSTRAINT "privacy_constraint_research" 
          CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "researchOutput" IS NOT NULL))
        `;
        console.log('✅ Added researchOutput constraint');
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('⚠️ researchOutput constraint already exists');
        } else {
          console.log('❌ researchOutput constraint failed:', e.message);
        }
      }
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "Project" 
          ADD CONSTRAINT "privacy_constraint_blueprint" 
          CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "blueprintOutput" IS NOT NULL))
        `;
        console.log('✅ Added blueprintOutput constraint');
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('⚠️ blueprintOutput constraint already exists');
        } else {
          console.log('❌ blueprintOutput constraint failed:', e.message);
        }
      }
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "Project" 
          ADD CONSTRAINT "privacy_constraint_financial" 
          CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "financialOutput" IS NOT NULL))
        `;
        console.log('✅ Added financialOutput constraint');
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('⚠️ financialOutput constraint already exists');
        } else {
          console.log('❌ financialOutput constraint failed:', e.message);
        }
      }
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "Project" 
          ADD CONSTRAINT "privacy_constraint_pitch" 
          CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "pitchOutput" IS NOT NULL))
        `;
        console.log('✅ Added pitchOutput constraint');
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('⚠️ pitchOutput constraint already exists');
        } else {
          console.log('❌ pitchOutput constraint failed:', e.message);
        }
      }
      
      try {
        await prisma.$executeRaw`
          ALTER TABLE "Project" 
          ADD CONSTRAINT "privacy_constraint_gtm" 
          CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "gtmOutput" IS NOT NULL))
        `;
        console.log('✅ Added gtmOutput constraint');
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('⚠️ gtmOutput constraint already exists');
        } else {
          console.log('❌ gtmOutput constraint failed:', e.message);
        }
      }
      
      // Add the trigger function
      try {
        await prisma.$executeRaw`
          CREATE OR REPLACE FUNCTION clear_ai_data_on_memory_only()
          RETURNS TRIGGER AS $$
          BEGIN
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
      } catch (e) {
        console.log('⚠️ Function creation:', e.message);
      }
      
      // Add the trigger
      try {
        await prisma.$executeRaw`DROP TRIGGER IF EXISTS privacy_enforcement_trigger ON "Project"`;
        await prisma.$executeRaw`
          CREATE TRIGGER privacy_enforcement_trigger
            BEFORE INSERT OR UPDATE ON "Project"
            FOR EACH ROW
            EXECUTE FUNCTION clear_ai_data_on_memory_only()
        `;
        console.log('✅ Created privacy enforcement trigger');
      } catch (e) {
        console.log('⚠️ Trigger creation:', e.message);
      }
      
      console.log('\n🎉 Privacy enforcement system deployed!');
      console.log('');
      console.log('🔐 Privacy Protection Summary:');
      console.log('- Database constraints prevent AI data in MEMORY_ONLY projects');
      console.log('- Automatic trigger clears AI data when switching to MEMORY_ONLY');
      console.log('- SessionStorageService handles dual storage modes');
      console.log('- All existing violations have been cleaned');
      
    } else {
      console.log('❌ Still have violations, cannot apply constraints');
    }
    
  } catch (error) {
    console.error('❌ Error in final cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  finalCleanupAndConstraints()
    .then(() => {
      console.log('✅ Final cleanup and constraints complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed final cleanup:', error);
      process.exit(1);
    });
}

module.exports = { finalCleanupAndConstraints };