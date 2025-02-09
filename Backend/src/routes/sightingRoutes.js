import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  createSightingReport,
  getSightingReports,
  getSightingReportById,
  updateSightingStatus
} from '../controllers/sightingController.js';
// import { upload } from '../config/cloudinary.js';

const router = express.Router();

// POST /api/v1/sightings
router.post(
  '/',
  verifyToken,
//   upload.array('photos', 5),
  createSightingReport
);

// GET /api/v1/sightings
router.get('/', verifyToken, getSightingReports);

// GET /api/v1/sightings/:id
router.get('/:id', verifyToken, getSightingReportById);

// PUT /api/v1/sightings/:id/status
router.put(
  '/:id/status',
  verifyToken,
//   authorize('admin', 'authority'),
  updateSightingStatus
);

export default router;