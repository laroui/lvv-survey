import { Router } from 'express';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function slugify(title) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);
}

// GET /api/forms
router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const forms = await sql`
      SELECT f.*, p.name AS partner_name,
        (SELECT COUNT(*) FROM responses r WHERE r.form_id = f.id) AS response_count
      FROM forms f
      LEFT JOIN partners p ON p.id = f.partner_id
      ORDER BY f.created_at DESC
    `;
    res.json({ success: true, data: forms });
  } catch (err) { next(err); }
});

// POST /api/forms
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, partnerId, config = {}, theme = {} } = req.body;
    if (!title || !partnerId) {
      return res.status(400).json({ success: false, error: 'title and partnerId required' });
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now()}`;

    const [form] = await sql`
      INSERT INTO forms (partner_id, created_by, title, slug, config, theme)
      VALUES (${partnerId}, ${req.user.id}, ${title}, ${slug}, ${JSON.stringify(config)}, ${JSON.stringify(theme)})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: form });
  } catch (err) { next(err); }
});

// GET /api/forms/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const [form] = await sql`
      SELECT f.*, p.name AS partner_name,
        (SELECT COUNT(*) FROM responses r WHERE r.form_id = f.id) AS response_count
      FROM forms f
      LEFT JOIN partners p ON p.id = f.partner_id
      WHERE f.id = ${req.params.id}
    `;
    if (!form) return res.status(404).json({ success: false, error: 'Form not found' });
    res.json({ success: true, data: form });
  } catch (err) { next(err); }
});

// PUT /api/forms/:id
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { title, config, theme, isActive } = req.body;
    const [form] = await sql`
      UPDATE forms SET
        title     = COALESCE(${title ?? null}, title),
        config    = COALESCE(${config ? JSON.stringify(config) : null}::jsonb, config),
        theme     = COALESCE(${theme ? JSON.stringify(theme) : null}::jsonb, theme),
        is_active = COALESCE(${isActive ?? null}, is_active)
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!form) return res.status(404).json({ success: false, error: 'Form not found' });
    res.json({ success: true, data: form });
  } catch (err) { next(err); }
});

// DELETE /api/forms/:id  (soft delete)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await sql`UPDATE forms SET is_active = false WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) { next(err); }
});

// GET /api/forms/public/:token  (no auth — for guests)
router.get('/public/:token', async (req, res, next) => {
  try {
    const [form] = await sql`
      SELECT f.config, f.theme, f.title, p.name AS partner_name, p.logo_url AS partner_logo_url
      FROM forms f
      LEFT JOIN partners p ON p.id = f.partner_id
      WHERE f.public_url_token = ${req.params.token}
        AND f.is_active = true
    `;
    if (!form) return res.status(404).json({ success: false, error: 'Form not found' });
    res.json({ success: true, data: form });
  } catch (err) { next(err); }
});

export default router;
