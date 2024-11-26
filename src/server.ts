import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// API routes will go here
// TODO: Add your API routes

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    dirname: __dirname,
    staticPath: path.join(__dirname, '../dist'),
    exists: {
      dist: require('fs').existsSync(path.join(__dirname, '../dist')),
      index: require('fs').existsSync(path.join(__dirname, '../dist/index.html'))
    }
  });
});

// Serve static files from the React app
const staticPath = path.join(__dirname, '../dist');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  console.log('Serving index.html from:', indexPath);
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'index.html not found', path: indexPath });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express error handler:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on 0.0.0.0:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current directory:', __dirname);
  console.log('Static path:', staticPath);
});

export default app;
