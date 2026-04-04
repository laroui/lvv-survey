# BATCH-03 — Form Builder (Create / Edit / Delete Templates)

## Commit
`feat(BATCH-03): form builder — create, edit, delete survey templates per partner`

## Goal
The partnership team can log in and create customised survey forms tied to a hotel partner.
Each form is based on the Louise preset (Peninsula template) and can be tweaked.
This is the core "generate a form" feature.

## Depends On
BATCH-02 completed — auth working, routing in place.

## Data Model (already created in BATCH-01)
```
forms { id, partner_id, created_by, title, slug, public_url_token, theme, config, is_active }
```
`config` JSONB stores the full form configuration:
```json
{
  "hotelName": "The Peninsula Paris",
  "language": "en",
  "bilingualEnabled": true,
  "questions": {
    "sizing": true,
    "lifestyle": true,
    "travel": true,
    "events": true
  },
  "styles": {
    "female": [...],
    "male": [...]
  },
  "categories": [...],
  "thankYouMessage": "Your Personal Shopper will be in touch..."
}
```
`theme` JSONB stores visual overrides:
```json
{
  "primaryColor": "#523849",
  "accentColor": "#C9A84C",
  "backgroundColor": "#F5F0E6",
  "heroImage": null
}
```

## Backend Tasks

### 1. backend/src/routes/forms.js

**GET /api/forms**
- Protected — return all forms for current user's partner
- Include partner name + response count

**POST /api/forms**
- Protected — create new form
- Body: `{ title, partnerId, config, theme }`
- Auto-generate `public_url_token` (UUID)
- Auto-generate `slug` from title

**GET /api/forms/:id**
- Protected — return single form with full config

**PUT /api/forms/:id**
- Protected — update form config/theme/title

**DELETE /api/forms/:id**
- Protected — soft delete (set is_active = false)

**GET /api/forms/public/:token**
- PUBLIC (no auth) — return form config for guest survey page
- Only return if is_active = true

### 2. backend/src/routes/partners.js

**GET /api/partners**
- Protected — list all partners

## Frontend Tasks

### 3. frontend/src/pages/DashboardPage.jsx
Main dashboard after login:
- Header with Aimé "Partnership Hub" + user name + logout
- Grid of form cards per partner
- Each card shows: form title, partner name, response count, public URL, status badge
- "+ New Form" button → opens FormBuilderPage
- Stats row: total forms, total responses, active forms

### 4. frontend/src/pages/FormBuilderPage.jsx
Create/edit a form. Two-column layout:
- Left: configuration panel
  - Form title input
  - Partner selector (dropdown)
  - Language toggle (EN / FR / Both)
  - Toggle switches for optional sections: Sizing, Lifestyle, Travel, Events
  - Style archetypes editor (female + male) — add/remove/rename
  - Thank you message textarea
- Right: live preview (mini iframe-like preview of the form's start screen)

On save → POST /api/forms or PUT /api/forms/:id
Show success toast + copy public URL button.

### 5. frontend/src/pages/FormDetailPage.jsx
View a single form:
- Public URL with copy button + QR code (use `qrcode` npm package)
- Response count + link to responses
- Edit / Deactivate / Delete actions
- Embed code snippet for SharePoint/website

### 6. frontend/src/components/FormCard.jsx
Reusable card component for the dashboard grid.

## Acceptance Criteria
- [ ] Create a form → appears in dashboard
- [ ] Edit form config → saved to DB
- [ ] Delete form → removed from list
- [ ] Each form has a unique `public_url_token` in DB
- [ ] Public URL displayed and copyable on FormDetailPage
- [ ] Partner "The Peninsula Paris" pre-exists and is selectable
- [ ] Dashboard shows response count per form
- [ ] Git commit: `feat(BATCH-03): form builder — create, edit, delete survey templates per partner`
