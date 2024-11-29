import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './src/server/routes/auth';
import adminRoutes from './src/server/routes/admin';
import { verifyToken } from './src/server/middleware/auth';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Protected API routes
app.use('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Serve index.html for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Static files served from:', path.join(__dirname, 'dist'));
});

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing Prisma Client...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing Prisma Client...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
