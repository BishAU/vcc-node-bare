import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';

dotenv.config();

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  console.log('Database name:', mongoose.connection.name);
  console.log('Database host:', mongoose.connection.host);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');
  process.exit(1); // Exit if we can't connect to the database
});

const app = express();

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

// API routes
app.use('/api', apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../../dist')));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error handler:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
