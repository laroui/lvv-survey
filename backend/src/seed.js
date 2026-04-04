// Run once: node src/seed.js
// Creates the first admin user — change password after first login

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { sql } from './db.js';

const email = 'admin@lavallee-village.com';
const password = 'LVV2025!';
const fullName = 'Nacim Laroui';

const passwordHash = await bcrypt.hash(password, 12);

try {
  const [user] = await sql`
    INSERT INTO users (email, password_hash, full_name, role)
    VALUES (${email}, ${passwordHash}, ${fullName}, 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    RETURNING id, email, full_name, role
  `;
  console.log('Admin user ready:', user.email, '| role:', user.role);
} catch (err) {
  console.error('Seed error:', err.message);
}
