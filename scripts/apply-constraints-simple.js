/**
 * Apply privacy constraints one by one to identify issues
 */

const { PrismaClient } = require('@prisma/client');

async function applyConstraintsSimple() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔒 Applying privacy constraints one by one...');
    
    const constraints = [
      {
        name: 'privacy_constraint_idea',
        sql: `ALTER TABLE "Project" ADD CONSTRAINT "privacy_constraint_idea" CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "ideaOutput" IS NOT NULL))`
      },
      {
        name: 'privacy_constraint_research',
        sql: `ALTER TABLE "Project" ADD CONSTRAINT "privacy_constraint_research" CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "researchOutput" IS NOT NULL))`
      },
      {
        name: 'privacy_constraint_blueprint',
        sql: `ALTER TABLE "Project" ADD CONSTRAINT "privacy_constraint_blueprint" CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "blueprintOutput" IS NOT NULL))`
      },
      {
        name: 'privacy_constraint_financial',
        sql: `ALTER TABLE "Project" ADD CONSTRAINT "privacy_constraint_financial" CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "financialOutput" IS NOT NULL))`
      },
      {
        name: 'privacy_constraint_pitch',
        sql: `ALTER TABLE "Project" ADD CONSTRAINT "privacy_constraint_pitch" CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "pitchOutput" IS NOT NULL))`
      },
      {
        name: 'privacy_constraint_gtm',
        sql: `ALTER TABLE "Project" ADD CONSTRAINT "privacy_constraint_gtm" CHECK (NOT ("storageMode" = 'MEMORY_ONLY' AND "gtmOutput" IS NOT NULL))`
      }
    ];
    
    for (const constraint of constraints) {
      try {
        console.log(`\n🛡️ Adding constraint: ${constraint.name}...`);
        
        // First check if constraint already exists
        const existing = await prisma.$queryRaw`
          SELECT conname 
          FROM pg_constraint c
          JOIN pg_namespace n ON n.oid = c.connamespace
          JOIN pg_class cl ON cl.oid = c.conrelid
          WHERE n.nspname = 'public' 
            AND cl.relname = 'Project'
            AND conname = ${constraint.name}
        `;
        
        if (existing.length > 0) {
          console.log(`⚠️ Constraint ${constraint.name} already exists, skipping...`);
          continue;
        }
        
        // Before applying constraint, check if any rows would violate it
        const violatingRows = await prisma.$queryRaw`
          SELECT id, "storageMode", 
                 CASE WHEN ${constraint.name.includes('idea')} THEN ("ideaOutput" IS NOT NULL) ELSE false END as has_idea,
                 CASE WHEN ${constraint.name.includes('research')} THEN ("researchOutput" IS NOT NULL) ELSE false END as has_research,
                 CASE WHEN ${constraint.name.includes('blueprint')} THEN ("blueprintOutput" IS NOT NULL) ELSE false END as has_blueprint,
                 CASE WHEN ${constraint.name.includes('financial')} THEN ("financialOutput" IS NOT NULL) ELSE false END as has_financial,
                 CASE WHEN ${constraint.name.includes('pitch')} THEN ("pitchOutput" IS NOT NULL) ELSE false END as has_pitch,
                 CASE WHEN ${constraint.name.includes('gtm')} THEN ("gtmOutput" IS NOT NULL) ELSE false END as has_gtm
          FROM "Project"
          WHERE "storageMode" = 'MEMORY_ONLY'
        `;
        
        console.log(`   Found ${violatingRows.length} MEMORY_ONLY projects to check...`);
        
        if (constraint.name.includes('idea')) {
          const violations = violatingRows.filter(row => row.has_idea);
          if (violations.length > 0) {
            console.log(`   ❌ Found ${violations.length} violations for ideaOutput`);
            continue;
          }
        }
        
        // Apply the constraint
        await prisma.$executeRaw`${constraint.sql}`;
        console.log(`   ✅ Successfully added ${constraint.name}`);
        
      } catch (error) {
        console.log(`   ❌ Failed to add ${constraint.name}: ${error.message}`);
        
        if (error.message.includes('23514')) {
          console.log(`   🔍 Constraint violation detected. Investigating...`);
          
          // Find the violating rows
          const field = constraint.name.split('_')[2] + 'Output'; // Extract field name
          const violatingProjects = await prisma.project.findMany({
            where: {
              storageMode: 'MEMORY_ONLY',
              [field]: { not: null }
            },
            select: {
              id: true,
              name: true,
              [field]: true
            }
          });
          
          console.log(`   Found ${violatingProjects.length} violating projects:`);
          violatingProjects.forEach(p => {
            console.log(`     - ${p.id}: ${p.name} (${field} is not null)`);
          });
        }
      }
    }
    
    console.log('\n🎉 Privacy constraint application complete!');
    
  } catch (error) {
    console.error('❌ Error applying constraints:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  applyConstraintsSimple()
    .then(() => {
      console.log('✅ Simple constraint application complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to apply simple constraints:', error);
      process.exit(1);
    });
}

module.exports = { applyConstraintsSimple };