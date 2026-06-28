import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import requestRoutes from './routes/requests.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check (raiz) - util para o servico de deploy verificar se esta no ar
app.get('/', (req, res) => res.json({ status: 'ok', api: 'coffee-shop' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
