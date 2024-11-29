import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get the test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!user) {
      throw new Error('Test user not found');
    }

    // Create an activity log
    const activityLog = await prisma.activityLog.create({
      data: {
        type: 'LOGIN',
        userId: user.id,
        metadata: JSON.stringify({ ip: '127.0.0.1', userAgent: 'Test Browser' })
      }
    });

    console.log('Activity log created:', activityLog);

    // Verify we can query the log with its relations
    const logWithUser = await prisma.activityLog.findUnique({
      where: { id: activityLog.id },
      include: { user: true }
    });

    console.log('Activity log with user:', logWithUser);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
