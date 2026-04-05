import { sql } from './db.js';

export async function runMigrations() {
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS description TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS website TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS contact_email TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS logo_url TEXT`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS theme_preset JSONB DEFAULT '{}'`;
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`;
  console.log('[migrations] Partner schema up to date');

  // Session tracking + device info
  await sql`ALTER TABLE responses ADD COLUMN IF NOT EXISTS session_id TEXT`;
  await sql`ALTER TABLE responses ADD COLUMN IF NOT EXISTS device_info JSONB DEFAULT '{}'`;
  await sql`ALTER TABLE responses ADD COLUMN IF NOT EXISTS completion_step INTEGER DEFAULT 0`;
  await sql`ALTER TABLE responses ADD COLUMN IF NOT EXISTS is_complete BOOLEAN DEFAULT false`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS responses_session_id_unique ON responses(session_id) WHERE session_id IS NOT NULL`;
  console.log('[migrations] Response session/device schema up to date');
}
