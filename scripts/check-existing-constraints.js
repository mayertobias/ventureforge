/**
 * Check existing database constraints
 */

const { PrismaClient } = require('@prisma/client');

async function checkExistingConstraints() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking existing database constraints...');
    
    // Check for existing constraints
    const constraints = await prisma.$queryRaw`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(c.oid) as constraint_definition
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      JOIN pg_class cl ON cl.oid = c.conrelid
      WHERE n.nspname = 'public' 
        AND cl.relname = 'Project'
        AND c.contype = 'c'
        AND conname LIKE 'privacy_constraint%'
      ORDER BY conname
    `;
    
    console.log('Found privacy constraints:');
    constraints.forEach((constraint, index) => {
      console.log(`${index + 1}. ${constraint.constraint_name}`);
      console.log(`   Definition: ${constraint.constraint_definition}`);
      console.log('');
    });
    
    // Check for existing triggers
    const triggers = await prisma.$queryRaw`
      SELECT 
        trigger_name,
        event_manipulation,
        action_timing,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'Project'
        AND trigger_name LIKE '%privacy%'
    `;
    
    console.log('Found privacy triggers:');
    triggers.forEach((trigger, index) => {
      console.log(`${index + 1}. ${trigger.trigger_name}`);
      console.log(`   Event: ${trigger.event_manipulation}`);
      console.log(`   Timing: ${trigger.action_timing}`);
      console.log('');
    });
    
    // Check for existing functions
    const functions = await prisma.$queryRaw`
      SELECT 
        proname as function_name,
        prosrc as function_source
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND proname LIKE '%privacy%'
    `;
    
    console.log('Found privacy functions:');
    functions.forEach((func, index) => {
      console.log(`${index + 1}. ${func.function_name}`);
      console.log('');
    });
    
    if (constraints.length === 0 && triggers.length === 0 && functions.length === 0) {
      console.log('✅ No existing privacy constraints found. Ready to apply new ones.');
    } else {
      console.log(`⚠️ Found ${constraints.length} constraints, ${triggers.length} triggers, ${functions.length} functions`);
      console.log('Some privacy enforcement may already be in place.');
    }
    
  } catch (error) {
    console.error('❌ Error checking constraints:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  checkExistingConstraints()
    .then(() => {
      console.log('✅ Constraint check complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to check constraints:', error);
      process.exit(1);
    });
}

module.exports = { checkExistingConstraints };