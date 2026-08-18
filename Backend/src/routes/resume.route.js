import express from 'express';

import upload from '../middleware/upload.middleware.js';

import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  streamResumePdf,
} from '../controllers/resume.controller.js';

import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/upload', optionalAuthenticate, upload.single('resume'), uploadResume);

// Public/authenticated streaming for PDF viewing
router.get('/:id/file', streamResumePdf);
router.get('/:id/view', streamResumePdf);

router.get('/', authenticate, getMyResumes);

router.get('/:id', authenticate, getResumeById);

router.delete('/:id', authenticate, deleteResume);

export default router;
