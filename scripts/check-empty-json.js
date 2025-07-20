/**
 * Check for MEMORY_ONLY projects with empty JSON objects (not NULL)
 */

const { PrismaClient } = require('@prisma/client');

async function checkEmptyJson() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking for MEMORY_ONLY projects with empty JSON...');
    
    // Check for MEMORY_ONLY projects with any non-null JSON values
    const projects = await prisma.project.findMany({
      where: {
        storageMode: 'MEMORY_ONLY'
      },
      select: {
        id: true,
        name: true,
        storageMode: true,
        ideaOutput: true,
        researchOutput: true,
        blueprintOutput: true,
        financialOutput: true,
        pitchOutput: true,
        gtmOutput: true
      }
    });
    
    console.log(`Found ${projects.length} MEMORY_ONLY projects. Checking for non-null JSON values...`);
    
    const violations = [];
    
    projects.forEach((project) => {
      const hasNonNull = [
        project.ideaOutput,
        project.researchOutput,
        project.blueprintOutput,
        project.financialOutput,
        project.pitchOutput,
        project.gtmOutput
      ].some(field => field !== null);
      
      if (hasNonNull) {
        violations.push({
          ...project,
          violations: {
            idea: project.ideaOutput !== null,
            research: project.researchOutput !== null,
            blueprint: project.blueprintOutput !== null,
            financial: project.financialOutput !== null,
            pitch: project.pitchOutput !== null,
            gtm: project.gtmOutput !== null
          }
        });
      }
    });
    
    console.log(`\nFound ${violations.length} projects with non-null JSON values:`);
    
    violations.forEach((project, index) => {
      console.log(`\n${index + 1}. Project: ${project.id}`);
      console.log(`   Name: ${project.name}`);
      console.log(`   Violations:`);
      Object.entries(project.violations).forEach(([field, hasValue]) => {
        if (hasValue) {
          const actualValue = project[field + 'Output'];
          console.log(`     - ${field}: ${typeof actualValue} (${JSON.stringify(actualValue).substring(0, 100)}...)`);
        }
      });
    });
    
    if (violations.length > 0) {
      console.log(`\n⚠️ Found ${violations.length} violations! Cleaning them up...`);
      
      // Clean up all violations by setting them to NULL
      for (const project of violations) {
        await prisma.project.update({
          where: { id: project.id },
          data: {
            ideaOutput: null,
            researchOutput: null,
            blueprintOutput: null,
            financialOutput: null,
            pitchOutput: null,
            gtmOutput: null
          }
        });
        console.log(`✅ Cleaned project ${project.id}`);
      }
    } else {
      console.log('✅ No violations found!');
    }
    
  } catch (error) {
    console.error('❌ Error checking empty JSON:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  checkEmptyJson()
    .then(() => {
      console.log('✅ JSON check complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to check JSON:', error);
      process.exit(1);
    });
}

module.exports = { checkEmptyJson };