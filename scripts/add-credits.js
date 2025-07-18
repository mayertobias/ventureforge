// Simple script to add credits to a user
// Usage: node scripts/add-credits.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCreditsToUser(email, credits) {
  try {
    // First, find or create the user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        credits: { increment: credits }
      },
      create: {
        email,
        credits: credits
      }
    });

    console.log(`✅ Successfully added ${credits} credits to ${email}`);
    console.log(`User now has ${user.credits} total credits`);
    return user;
  } catch (error) {
    console.error('❌ Error adding credits:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Add 2000 credits to the specified user
addCreditsToUser('aiml.deeplearner@gmail.com', 2000)
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });