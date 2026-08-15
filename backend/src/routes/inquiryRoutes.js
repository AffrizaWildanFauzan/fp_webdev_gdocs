import express from 'express';
import {
  createInquiry,
  getInquiries,
  getAgentInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/my', protect, getInquiries);
router.get('/agent', protect, authorize('agent', 'admin'), getAgentInquiries);
router.put('/:id/status', protect, authorize('agent', 'admin'), updateInquiryStatus);

export default router;