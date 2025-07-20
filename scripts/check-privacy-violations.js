/**
 * Check for privacy violations in the database
 */

const { PrismaClient } = require('@prisma/client');

async function checkPrivacyViolations() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking for privacy violations...');
    
    // Check for MEMORY_ONLY projects with AI data
    const violations = await prisma.project.findMany({
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
      select: {
        id: true,
        name: true,
        storageMode: true,
        userId: true,
        createdAt: true,
        ideaOutput: true,
        researchOutput: true,
        blueprintOutput: true,
        financialOutput: true,
        pitchOutput: true,
        gtmOutput: true
      }
    });
    
    console.log(`Found ${violations.length} privacy violations:`);
    
    violations.forEach((project, index) => {
      console.log(`\n${index + 1}. Project: ${project.id}`);
      console.log(`   Name: ${project.name}`);
      console.log(`   User: ${project.userId}`);
      console.log(`   Created: ${project.createdAt}`);
      console.log(`   Storage Mode: ${project.storageMode}`);
      console.log(`   Has AI Data:`);
      console.log(`     - Idea: ${!!project.ideaOutput}`);
      console.log(`     - Research: ${!!project.researchOutput}`);
      console.log(`     - Blueprint: ${!!project.blueprintOutput}`);
      console.log(`     - Financial: ${!!project.financialOutput}`);
      console.log(`     - Pitch: ${!!project.pitchOutput}`);
      console.log(`     - GTM: ${!!project.gtmOutput}`);
    });
    
    if (violations.length > 0) {
      console.log(`\n⚠️ Found ${violations.length} MEMORY_ONLY projects with AI data!`);
      console.log('These must be cleaned before privacy constraints can be applied.');
      
      // Force cleanup
      console.log('\n🧹 Force cleaning privacy violations...');
      
      const cleanupResult = await prisma.project.updateMany({
        where: {
          id: { in: violations.map(v => v.id) }
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
      
      console.log(`✅ Force cleaned ${cleanupResult.count} projects`);
    } else {
      console.log('✅ No privacy violations found!');
    }
    
  } catch (error) {
    console.error('❌ Error checking privacy violations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  checkPrivacyViolations()
    .then(() => {
      console.log('✅ Privacy check complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to check privacy:', error);
      process.exit(1);
    });
}

module.exports = { checkPrivacyViolations };