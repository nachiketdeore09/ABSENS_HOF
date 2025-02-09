import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
    createMissingPerson,
    searchMissingPersons,
    getMissingPersonById,
    updateMissingPersonStatus,
} from '../controllers/missingPersonController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// POST /api/v1/missing-persons
router.post(
    '/',
    verifyToken,
    //   authorize('authority', 'admin'),
      upload.array('photos', 5), // Handle multiple images (max 5)
    createMissingPerson,
);

// POST /api/v1/missing-persons/search (changed to POST for file upload)
router.post('/search', 
    upload.array('images', 5),
     searchMissingPersons);

// GET /api/v1/missing-persons/:id
router.get('/:id', getMissingPersonById);

// PUT /api/v1/missing-persons/:id/status
router.put(
    '/:id/status',
    verifyToken,
    //   authorize('authority', 'admin'),
    updateMissingPersonStatus,
);

export default router;
