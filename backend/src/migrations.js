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
  // Drop old constraint/index if it exists so we can recreate it cleanly.
  // Must drop as CONSTRAINT (not INDEX) when it was created via ADD CONSTRAINT,
  // because PostgreSQL won't allow DROP INDEX on a constraint-backed index.
  await sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'responses_session_id_unique'
      ) THEN
        ALTER TABLE responses DROP CONSTRAINT responses_session_id_unique;
      ELSIF EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'responses_session_id_unique'
      ) THEN
        DROP INDEX responses_session_id_unique;
      END IF;
    END $$
  `;
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

  // BATCH-12: rebrand plum → forest green for Peninsula Paris
  await sql`
    UPDATE partners SET theme_preset = ${JSON.stringify({
      primaryColor: '#233B2B',
      primaryDark: '#111e16',
      accentColor: '#C9A84C',
      backgroundColor: '#F5F0E6',
    })}::jsonb
    WHERE slug = 'peninsula-paris'
  `;
  console.log('[migrations] Peninsula Paris theme updated to forest green');
}
