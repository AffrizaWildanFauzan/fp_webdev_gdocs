import express from 'express';
import { getAgentStats, getAgentProperties } from '../controllers/agentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('agent', 'admin'), getAgentStats);
router.get('/properties', protect, authorize('agent', 'admin'), getAgentProperties);

export default router;