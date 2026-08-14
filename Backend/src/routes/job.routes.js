import express from "express";

const router = express.Router();
import { getAllJobs, matchJobs, getJobById } from "../controllers/job.controllers.js"

router.get('/', getAllJobs);

router.get('/:id', getJobById);

router.get('/match/:resumeId', matchJobs);

export default router;
