import { connectDB } from '../src/config/db.js';
import app from '../src/app.js';

// On Vercel, containers are reused across warm invocations.
// Calling connectDB here ensures the connection is cached after the first request.
connectDB();

export default app;
