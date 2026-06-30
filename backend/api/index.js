import { connectDB } from '../src/config/db.js';
import app from '../src/app.js';

// Vercel serverless handler — waits for DB before passing the request to Express
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
