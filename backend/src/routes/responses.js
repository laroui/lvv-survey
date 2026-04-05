import { Router } from 'express';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const SP_HEADERS = [
  'Full Name', 'Initials', 'Email', 'Phone', 'Civility', 'Nationality',
  'Sizing System', 'Size', 'Purpose', 'PS Mode', 'Style 1', 'Style 2',
  'Categories', 'Brands', 'Lifestyle', 'Travel', 'Events', 'Consent', 'Submitted At',
];

function toCSVRow(r) {
  const d = r.data || {};
  const vals = [
    `${d.firstName || ''} ${d.surname || ''}`.trim(),
    d.initials || '',
    d.email || '',
    d.phone?.full || d.phone || '',
    d.gender || '',
    d.nationality || '',
    d.sizingSystem || '',
    d.sizingValue || '',
    d.purpose || '',
    d.psMode || '',
    (d.styles || [])[0] || '',
    (d.styles || [])[1] || '',
    (d.categories || []).join(', '),
    (d.brands || []).filter(b => b !== 'none').join(', '),
    (d.lifestyle || []).join(', '),
    (d.travel || []).join(', '),
    (d.events || []).join(', '),
    d.consent ? 'Yes' : 'No',
    r.submitted_at || '',
  ];
  return vals.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
}

function buildWhere(formId, { from, to, gender, style }) {
  const conditions = ['form_id = $1'];
  const params = [formId];

  if (from) {
    params.push(from);
    conditions.push(`submitted_at >= $${params.length}::timestamptz`);
  }
  if (to) {
    params.push(to);
    conditions.push(`submitted_at < ($${params.length}::timestamptz + interval '1 day')`);
  }
  if (gender) {
    params.push(gender);
    conditions.push(`data->>'gender' = $${params.length}`);
  }
  if (style) {
    params.push(JSON.stringify([style]));
    conditions.push(`data->'styles' @> $${params.length}::jsonb`);
  }

  return { where: conditions.join(' AND '), params };
}

// PUT /api/responses/session — public (auto-save + final submit via session upsert)
router.put('/session', async (req, res, next) => {
  try {
    const { sessionId, formToken, data, deviceInfo, completionStep, isComplete } = req.body;
    if (!sessionId || !formToken) {
      return res.status(400).json({ success: false, error: 'sessionId and formToken required' });
    }

    const [form] = await sql`
      SELECT id FROM forms WHERE public_url_token = ${formToken} AND is_active = true
    `;
    if (!form) return res.status(404).json({ success: false, error: 'Form not found or inactive' });

    // Merge server-side IP into device_info
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || null;
    const enrichedDeviceInfo = { ...(deviceInfo || {}), ip };

    const step = completionStep ?? 0;
    const complete = isComplete ?? false;
    // Use a plain JS value — Neon sql fragments cannot be nested as parameter values
    const submittedAt = complete ? new Date().toISOString() : null;

    const [response] = await sql`
      INSERT INTO responses (form_id, data, device_info, completion_step, is_complete, session_id, submitted_at)
      VALUES (
        ${form.id},
        ${JSON.stringify(data || {})},
        ${JSON.stringify(enrichedDeviceInfo)},
        ${step},
        ${complete},
        ${sessionId},
        ${submittedAt}
      )
      ON CONFLICT (session_id) DO UPDATE SET
        data            = EXCLUDED.data,
        device_info     = EXCLUDED.device_info,
        completion_step = EXCLUDED.completion_step,
        is_complete     = EXCLUDED.is_complete,
        submitted_at    = CASE
          WHEN EXCLUDED.is_complete AND responses.submitted_at IS NULL THEN EXCLUDED.submitted_at
          WHEN EXCLUDED.is_complete THEN responses.submitted_at
          ELSE responses.submitted_at
        END
      RETURNING id
    `;
    res.json({ success: true, responseId: response.id });
  } catch (err) { next(err); }
});

// POST /api/responses — public (guests submit)
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

// GET /api/responses/export — protected, must come before /:id
router.get('/export', requireAuth, async (req, res, next) => {
  try {
    const { formId, format = 'csv', from, to, gender, style } = req.query;
    if (!formId) return res.status(400).json({ success: false, error: 'formId required' });

    const [form] = await sql`SELECT title FROM forms WHERE id = ${formId}`;
    const { where, params } = buildWhere(formId, { from, to, gender, style });

    const responses = await sql(
      `SELECT * FROM responses WHERE ${where} ORDER BY submitted_at DESC`,
      params
    );

    const date = new Date().toISOString().slice(0, 10);
    const safeTitle = (form?.title || 'LVV').replace(/\s+/g, '_');

    if (format === 'json') {
      res.setHeader('Content-Disposition', `attachment; filename="LVV_${safeTitle}_${date}.json"`);
      res.setHeader('Content-Type', 'application/json');
      return res.json(responses.map(r => ({ id: r.id, submittedAt: r.submitted_at, ...r.data })));
    }

    const header = SP_HEADERS.map(h => `"${h}"`).join(',');
    const rows = responses.map(toCSVRow);
    const csv = '\uFEFF' + [header, ...rows].join('\n');

    res.setHeader('Content-Disposition', `attachment; filename="LVV_${safeTitle}_${date}.csv"`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(csv);
  } catch (err) { next(err); }
});

// GET /api/responses — protected, paginated + filtered
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { formId, page = 1, limit = 50, from, to, gender, style } = req.query;
    if (!formId) return res.status(400).json({ success: false, error: 'formId required' });

    const offset = (Number(page) - 1) * Number(limit);
    const { where, params } = buildWhere(formId, { from, to, gender, style });

    const countParams = [...params];
    const [{ count }] = await sql(
      `SELECT COUNT(*)::int AS count FROM responses WHERE ${where}`,
      countParams
    );

    const queryParams = [...params, Number(limit), offset];
    const responses = await sql(
      `SELECT * FROM responses WHERE ${where} ORDER BY submitted_at DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams
    );

    res.json({
      success: true,
      data: responses,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) { next(err); }
});

// GET /api/responses/:id — protected
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const [response] = await sql`SELECT * FROM responses WHERE id = ${req.params.id}`;
    if (!response) return res.status(404).json({ success: false, error: 'Response not found' });
    res.json({ success: true, data: response });
  } catch (err) { next(err); }
});

// DELETE /api/responses/:id — protected
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await sql`DELETE FROM responses WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
