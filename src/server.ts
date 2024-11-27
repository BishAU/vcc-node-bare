import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Basic CORS and security headers
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "img-src 'self' data: https:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval';"
  );
  next();
});

// Health check - keep this dead simple
app.get('/api/health', (req, res) => {
  console.log('Health check hit');
  res.json({ status: 'ok' });
});

// Serve static files
const distPath = path.resolve(process.cwd(), 'dist');
console.log('Static files served from:', distPath);
app.use(express.static(distPath));

// Catch all route
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  if (!indexPath.includes('..')) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found');
  }
});

// Parse port from environment variable or use default
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log('Environment:', process.env.NODE_ENV);
});
