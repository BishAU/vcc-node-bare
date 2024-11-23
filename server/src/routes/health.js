import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Basic application info
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    const healthCheck = {
      uptime: process.uptime(),
      message: error.message,
      timestamp: Date.now()
    };
    res.status(503).json(healthCheck);
  }
});

export default router;
