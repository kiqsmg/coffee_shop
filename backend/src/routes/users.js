import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getUserById, updateUser } from '../controllers/userController.js';

const router = express.Router();

const updateRules = [
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio'),
];

router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateRules, validate, updateUser);

export default router;
