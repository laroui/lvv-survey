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
  // Drop old partial index if it exists (partial indexes don't work with ON CONFLICT without exact WHERE match)
  await sql`DROP INDEX IF EXISTS responses_session_id_unique`;
  // Create a proper unique constraint so ON CONFLICT (session_id) works
  // NULL values are always considered distinct in PostgreSQL so multiple NULL session_ids are allowed
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'responses_session_id_unique'
      ) THEN
        ALTER TABLE responses ADD CONSTRAINT responses_session_id_unique UNIQUE (session_id);
      END IF;
    END $$
  `;
  console.log('[migrations] Response session/device schema up to date');
}
