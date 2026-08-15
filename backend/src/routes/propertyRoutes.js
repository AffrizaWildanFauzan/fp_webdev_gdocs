import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getProperty);
router.get('/agent/:agentId', getAgentProperties);

router.post('/', protect, authorize('agent', 'admin'), createProperty);
router.put('/:id', protect, authorize('agent', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);

export default router;