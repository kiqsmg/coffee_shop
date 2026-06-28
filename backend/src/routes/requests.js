import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import {
  createRequest,
  getRequests,
  attendRequest,
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/', protect, createRequest); // qualquer usuario autenticado
router.get('/', protect, isAdmin, getRequests); // admin
router.put('/:id', protect, isAdmin, attendRequest); // admin

export default router;
