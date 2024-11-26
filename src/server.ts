import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Basic CORS
app.use(cors());
app.use(express.json());

// Health check - keep this dead simple
app.get('/api/health', (req, res) => {
  console.log('Health check hit');
  res.json({ status: 'ok' });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Parse port from environment variable or use default
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log('Static files served from:', path.join(__dirname, '../../dist'));
  console.log('Environment:', process.env.NODE_ENV);
});
