import express from 'express';

import {
  authenticate,
} from '../middleware/auth.middleware.js';

import {
  respondToInterview,
  respondToOffer,
} from '../controllers/candidate.controller.js';

const candidateRouter = express.Router();

candidateRouter.use(authenticate);

candidateRouter.patch(
  '/applications/:applicationId/interview',
  respondToInterview,
);

candidateRouter.patch(
  '/applications/:applicationId/offer',
  respondToOffer,
);

export default candidateRouter;