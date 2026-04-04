# BATCH-07 — Partner Management + Peninsula Onboarding

## Commit
`feat(BATCH-07): partner management — hotel profiles, Peninsula as first live partner`

## Goal
The partnership team manages hotel partners (Peninsula, Bicester Village, Kempinski, etc.).
Each partner has a profile, can have multiple forms, and its own branding presets.
Peninsula Paris is the first real partner — fully set up and ready for pilot.

## Depends On
BATCH-03 — forms tied to partners.

## Backend Tasks

### 1. Full CRUD for /api/partners
**GET /api/partners** — list all
**POST /api/partners** — create new partner
**GET /api/partners/:id** — detail + forms count + responses count
**PUT /api/partners/:id** — update name, logo, theme preset
**DELETE /api/partners/:id** — soft delete

Partner schema additions (migration):
```sql
ALTER TABLE partners ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS theme_preset JSONB DEFAULT '{}';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
```

### 2. Seed Peninsula data (migration script)
```sql
UPDATE partners SET
  description = 'The Peninsula Paris — 5-star luxury hotel, Avenue Kléber, Paris 16e',
  website = 'https://www.peninsula.com/paris',
  contact_email = 'concierge.paris@peninsula.com',
  theme_preset = '{
    "primaryColor": "#523849",
    "accentColor": "#C9A84C",
    "backgroundColor": "#F5F0E6",
    "heroTitle": "Pre-Arrival Survey",
    "heroSubtitle": "We would love to tailor your shopping and styling experience to you!"
  }'
WHERE slug = 'peninsula-paris';
```

## Frontend Tasks

### 3. frontend/src/pages/PartnersPage.jsx
Partner list page:
- Grid of partner cards (logo + name + form count + response count)
- "+ Add Partner" button
- Click → PartnersDetailPage

### 4. frontend/src/pages/PartnerDetailPage.jsx
- Partner info (name, logo, contact)
- Theme preset editor (primary color, accent color, hero text)
- List of forms for this partner
- Quick "Create form for this partner" shortcut
- Stats: total responses, active forms

### 5. frontend/src/pages/PartnerFormPage.jsx
Create/edit partner modal/page:
- Name, slug (auto-generated), website, contact email
- Logo URL upload (simple URL for now)
- Theme preset color pickers (use `<input type="color">`)
- Save → creates/updates partner

### 6. Navigation update
Add "Partners" to the main nav:
`Survey | Responses | Partners | Settings`

### 7. Pre-populate Peninsula form
When Peninsula partner is selected in FormBuilder:
- Auto-fill theme from partner's theme_preset
- Auto-fill hotel name in config
- Suggest "Pre-Arrival Experience Survey" as default title

## Acceptance Criteria
- [ ] Partners list page shows Peninsula Paris
- [ ] Can create a new partner
- [ ] Partner detail shows forms + response count
- [ ] Theme preset saved and applied when creating a form
- [ ] Peninsula has correct data (name, theme, contact)
- [ ] Nav includes Partners tab
- [ ] Git commit: `feat(BATCH-07): partner management — Peninsula as first live partner`
