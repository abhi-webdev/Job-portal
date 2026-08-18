import express from 'express';

import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';

import {
  getAdminDashboard,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  getAllApplicants,
  getApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  createOffer,
  updateInterviewResult,
  respondToOffer,
  getAdminInterviews,
  getAdminOffers,
  getRecruitmentAnalytics,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate, authorizeAdmin);

// DASHBOARD & ANALYTICS
router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getRecruitmentAnalytics);

// JOBS
router.get('/jobs', getAdminJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// APPLICANTS
router.get('/applicants', getAllApplicants);
router.get('/jobs/:jobId/applicants', getJobApplicants);
router.get('/applications/:applicationId', getApplicationById);
router.patch('/applications/:applicationId/status', updateApplicationStatus);

// INTERVIEWS
router.get('/interviews', getAdminInterviews);
router.post('/applications/:applicationId/interview', scheduleInterview);
router.patch('/applications/:applicationId/interview-result', updateInterviewResult);

// OFFERS
router.get('/offers', getAdminOffers);
router.post('/applications/:applicationId/offer', createOffer);
router.patch('/applications/:applicationId/offer-response', respondToOffer);

export default router;
