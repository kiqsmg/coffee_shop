import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  getCommentsByProduct,
  addComment,
  deleteComment,
} from '../controllers/commentController.js';

const router = Router();

router.get('/product/:productId', protect, getCommentsByProduct);
router.post('/product/:productId', protect, addComment);
router.delete('/:id', protect, deleteComment);

export default router;
