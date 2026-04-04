import { Router } from 'express';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/responses  — public, no auth (guests submit here)
router.post('/', async (req, res, next) => {
  try {
    const { formToken, data } = req.body;
    if (!formToken || !data) {
      return res.status(400).json({ success: false, error: 'formToken and data required' });
    }

    const [form] = await sql`
      SELECT id FROM forms
      WHERE public_url_token = ${formToken} AND is_active = true
    `;
    if (!form) return res.status(404).json({ success: false, error: 'Form not found or inactive' });

    const [response] = await sql`
      INSERT INTO responses (form_id, data)
      VALUES (${form.id}, ${JSON.stringify(data)})
      RETURNING id, submitted_at
    `;
    res.status(201).json({ success: true, responseId: response.id });
  } catch (err) { next(err); }
});

// GET /api/responses?formId=:id  — protected (dashboard)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { formId, page = 1, limit = 50 } = req.query;
    if (!formId) return res.status(400).json({ success: false, error: 'formId required' });

    const offset = (Number(page) - 1) * Number(limit);
    const responses = await sql`
      SELECT * FROM responses
      WHERE form_id = ${formId}
      ORDER BY submitted_at DESC
      LIMIT ${Number(limit)} OFFSET ${offset}
    `;
    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count FROM responses WHERE form_id = ${formId}
    `;
    res.json({
      success: true,
      data: responses,
      meta: { total: count, page: Number(page), limit: Number(limit) },
    });
  } catch (err) { next(err); }
});

export default router;
