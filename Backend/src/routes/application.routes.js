import express from 'express';

import {
  applyForJob,
  getApplicantsByJob,
  getApplicationById,
} from '../controllers/application.controller.js';

const router = express.Router();

router.post('/', applyForJob);
router.get('/job/:jobId', getApplicantsByJob);
router.get('/:id', getApplicationById);

export default router;
