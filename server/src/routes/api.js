import express from 'express';
import { eventsApi } from '../controllers/events.js';
import { resourcesApi } from '../controllers/resources.js';
import { reportRegistrationsApi } from '../controllers/reportRegistrations.js';

const router = express.Router();

// Events routes
router.get('/events', eventsApi.getAll);
router.get('/events/:id', eventsApi.getById);
router.post('/events', eventsApi.create);
router.put('/events/:id', eventsApi.update);
router.delete('/events/:id', eventsApi.delete);

// Resources routes
router.get('/resources', resourcesApi.getAll);
router.get('/resources/:id', resourcesApi.getById);
router.post('/resources', resourcesApi.create);
router.put('/resources/:id', resourcesApi.update);
router.delete('/resources/:id', resourcesApi.delete);

// Report Registration routes
router.post('/report-registrations', reportRegistrationsApi.create);
router.get('/report-registrations', reportRegistrationsApi.getAll);

export default router;
