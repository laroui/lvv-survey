import { Router } from 'express';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);
}

// GET /api/partners — list all with stats
router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const partners = await sql`
      SELECT
        p.*,
        COUNT(DISTINCT f.id)::int AS form_count,
        COUNT(r.id)::int AS response_count
      FROM partners p
      LEFT JOIN forms f ON f.partner_id = p.id
      LEFT JOIN responses r ON r.form_id = f.id
      WHERE p.is_active = true OR p.is_active IS NULL
      GROUP BY p.id
      ORDER BY p.name
    `;
    res.json({ success: true, data: partners });
  } catch (err) { next(err); }
});

// POST /api/partners — create
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, website, contactEmail, logoUrl, themePreset = {} } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name required' });

    const slug = `${slugify(name)}-${Date.now()}`;
    const [partner] = await sql`
      INSERT INTO partners (name, slug, description, website, contact_email, logo_url, theme_preset, is_active)
      VALUES (
        ${name}, ${slug}, ${description || null}, ${website || null},
        ${contactEmail || null}, ${logoUrl || null}, ${JSON.stringify(themePreset)}, true
      )
      RETURNING *
    `;
    res.status(201).json({ success: true, data: partner });
  } catch (err) { next(err); }
});

// GET /api/partners/:id — detail with forms + stats
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const [partner] = await sql`
      SELECT
        p.*,
        COUNT(DISTINCT f.id)::int AS form_count,
        COUNT(r.id)::int AS response_count
      FROM partners p
      LEFT JOIN forms f ON f.partner_id = p.id
      LEFT JOIN responses r ON r.form_id = f.id
      WHERE p.id = ${req.params.id}
      GROUP BY p.id
    `;
    if (!partner) return res.status(404).json({ success: false, error: 'Partner not found' });

    const forms = await sql`
      SELECT f.*, (SELECT COUNT(*)::int FROM responses r WHERE r.form_id = f.id) AS response_count
      FROM forms f
      WHERE f.partner_id = ${req.params.id}
      ORDER BY f.created_at DESC
    `;

    res.json({ success: true, data: { ...partner, forms } });
  } catch (err) { next(err); }
});

// PUT /api/partners/:id — update
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, description, website, contactEmail, logoUrl, themePreset } = req.body;
    const [partner] = await sql`
      UPDATE partners SET
        name          = COALESCE(${name ?? null}, name),
        description   = COALESCE(${description ?? null}, description),
        website       = COALESCE(${website ?? null}, website),
        contact_email = COALESCE(${contactEmail ?? null}, contact_email),
        logo_url      = COALESCE(${logoUrl ?? null}, logo_url),
        theme_preset  = COALESCE(${themePreset ? JSON.stringify(themePreset) : null}::jsonb, theme_preset)
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!partner) return res.status(404).json({ success: false, error: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) { next(err); }
});

// DELETE /api/partners/:id — soft delete
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await sql`UPDATE partners SET is_active = false WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
