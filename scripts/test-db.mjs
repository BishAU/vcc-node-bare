import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'test123', // In production, this should be hashed
        address1: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        postcode: '12345',
        country: 'Test Country',
        role: 'ADMIN'
      }
    });
    console.log('Test user created:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
