import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// GET    /api/products
// GET    /api/products/:id
// POST   /api/products   (admin)
// PUT    /api/products/:id (admin)
// DELETE /api/products/:id (admin)

export default router;
