import { Router } from 'express';
import { sql } from '../db.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    await sql`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

export default router;
