import express from 'express';
import { getPropertyReviews, createReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:propertyId/reviews', getPropertyReviews);
router.post('/:propertyId/reviews', protect, createReview);

export default router;