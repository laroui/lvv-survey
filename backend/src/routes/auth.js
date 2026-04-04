import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const [user] = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register (admin only)
router.post('/register', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin only' });
    }

    const { email, password, fullName, role = 'editor' } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await sql`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${fullName || null}, ${role})
      RETURNING id, email, full_name, role, created_at
    `;

    res.status(201).json({ success: true, user });
  } catch (err) {
    if (err.message?.includes('unique')) {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    next(err);
  }
});

// GET /api/auth/me (protected)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [user] = await sql`
      SELECT id, email, full_name, role, created_at FROM users WHERE id = ${req.user.id}
    `;
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

export default router;
