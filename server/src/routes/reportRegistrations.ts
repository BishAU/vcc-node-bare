import express from 'express';
import { createReportRegistration, getReportRegistrations } from '../controllers/reportRegistrations';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public route for creating registrations
router.post('/', createReportRegistration);

// Protected route for getting registrations (admin only)
router.get('/', authenticate, getReportRegistrations);

export default router;
