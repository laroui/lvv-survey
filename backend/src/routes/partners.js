import { Router } from 'express';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/partners
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const partners = await sql`
      SELECT p.*, COUNT(f.id) AS form_count
      FROM partners p
      LEFT JOIN forms f ON f.partner_id = p.id
      GROUP BY p.id
      ORDER BY p.name
    `;
    res.json({ success: true, data: partners });
  } catch (err) { next(err); }
});

export default router;
