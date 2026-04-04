import { sql } from './db.js';

export async function runMigrations() {
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS description TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS website TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS contact_email TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS logo_url TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS theme_preset JSONB DEFAULT '{}'`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`;
  console.log('[migrations] Partner schema up to date');
}
