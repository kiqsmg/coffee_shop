import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import {
  createRequest,
  getRequests,
  getMyRequests,
  attendRequest,
} from '../controllers/requestController.js';

const router = express.Router();

router.post('/', protect, createRequest); // qualquer usuario autenticado
router.get('/mine', protect, getMyRequests); // cliente: seus chamados pendentes
router.get('/', protect, isAdmin, getRequests); // admin
router.put('/:id', protect, isAdmin, attendRequest); // admin

export default router;
