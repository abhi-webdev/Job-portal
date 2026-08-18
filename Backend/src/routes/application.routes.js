import express from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import {
  applyForJob,
  getMyApplications,
  getMyApplicationById,
  respondToInterview,
  respondToOffer,
} from '../controllers/application.controller.js';
import { scheduleInterview } from '../controllers/admin.controller.js';

const router = express.Router();

// Applications - apply allows both guest and authenticated users
router.post('/', optionalAuthenticate, applyForJob);

// Protected routes
router.get('/my', authenticate, getMyApplications);
router.get('/my/:applicationId', authenticate, getMyApplicationById);
router.get('/:applicationId', authenticate, getMyApplicationById);

// Interview & Offer responses
router.post('/:applicationId/interview', authenticate, scheduleInterview);
router.patch('/:applicationId/interview', authenticate, respondToInterview);
router.patch('/:applicationId/interview-response', authenticate, respondToInterview);
router.patch('/:applicationId/offer', authenticate, respondToOffer);
router.patch('/:applicationId/offer-response', authenticate, respondToOffer);

export default router;

