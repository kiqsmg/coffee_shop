import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { validate } from '../middleware/validate.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

const createRules = [
  body('code').trim().notEmpty().withMessage('Código é obrigatório'),
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
];

const updateRules = [
  body('price').optional().isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('code').optional().trim().notEmpty().withMessage('Código não pode ser vazio'),
  body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio'),
];

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, isAdmin, createRules, validate, createProduct);
router.put('/:id', protect, isAdmin, updateRules, validate, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

export default router;
