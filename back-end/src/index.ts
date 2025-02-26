import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import linksRouter from './routes/linksRouter';
import authRouter from './routes/authRouter';
import { Database } from '../database.types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/", (req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
})
// Use auth router
app.use('/api/auth', authRouter);

// Use links router
app.use('/api/links', linksRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});