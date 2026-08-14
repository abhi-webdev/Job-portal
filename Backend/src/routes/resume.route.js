import express from 'express';
import upload from '../middleware/upload.middleware.js';
import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} from '../controllers/resume.controller.js';

const router = express.Router();

router.post('/upload', upload.single('resume'), uploadResume);

router.get('/', getMyResumes);

router.get('/:id', getResumeById);

router.delete('/:id', deleteResume);

export default router;
