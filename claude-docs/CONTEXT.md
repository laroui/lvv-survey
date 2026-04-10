# Project Context â€” LVV Survey Tool

> Read this file at the start of every session before doing anything.

## What This Project Is
A fullstack webapp for La VallÃ©e Village's partnerships team.
Lets them create branded guest survey forms, share unique URLs with hotel partners,
collect pre-arrival guest profiles, and export data to SharePoint.

## First Partner
**The Peninsula Paris** â€” luxury hotel, Avenue KlÃ©ber, Paris 16e.
Survey collects guest style preferences to personalise their shopping experience
at La VallÃ©e Village (luxury outlet, Marne-la-VallÃ©e, Paris region).

## Tech Stack
- **Frontend:** React 18 + Vite â€” `frontend/`
- **Backend:** Node.js + Express (ES modules) â€” `backend/`
- **Database:** Neon PostgreSQL â€” `@neondatabase/serverless`
- **Auth:** JWT + bcrypt â€” no OAuth
- **Deploy:** Vercel (frontend) + Railway (backend)
- **Fonts:** AimÃ© (display/serif) + Brown Std (sans body) â€” `frontend/public/fonts/`

## Design Tokens (DO NOT CHANGE)
```
--plum:       #233B2B   (vert sapin collection)
--plum-dark:  #111e16
--gold:       #C9A84C
--beige:      #F5F0E6
--font-display: 'Aime'
--font-sans:    'BrownStd'
```

## Key Rules
1. Always commit AND push after every change â€” Vercel auto-deploys on push
2. Never break existing functionality
3. Backend port 3001, frontend 5173
4. All API routes prefixed `/api`
5. JWT in localStorage key `lvv_token`
6. `public_url_token` UUID used in `/f/:token` â€” never expose DB id to guests
7. All DB queries use `@neondatabase/serverless` tagged template literals OR `sql(string, [params])` for dynamic WHERE
8. Brown Std Thin/Light for body, Regular for emphasis; AimÃ© Regular for titles

---

## Live Infrastructure

| Service | URL | Status |
|---|---|---|
| Frontend | https://lvv-survey.vercel.app | âœ… Live |
| Backend | https://lvv-survey-production-d4a4.up.railway.app | âœ… Live |
| Database | Neon PostgreSQL (gwc.azure) | âœ… Connected |

**Admin credentials:** `admin@lavallee-village.com` / `LVV2025!`

---

## What's Been Built (fully live)

### Auth
- `POST /api/auth/login` â†’ JWT 24h
- `POST /api/auth/register` (admin only)
- `requireAuth` middleware
- `LoginPage`, `ProtectedRoute`, `useAuth` hook

### Forms (admin)
- `GET/POST /api/forms` â€” list + create
- `GET/PUT /api/forms/:id` â€” detail + update
- `GET /api/forms/public/:token` â€” public guest endpoint (no auth), returns config + theme + partner_name + partner_logo_url
- `FormBuilderPage` â€” two-tab UI (Settings / Content)
  - Settings: title, partner, hotel name, language, optional sections toggles, thank-you messages (EN + FR)
  - Content tab: `FormContentEditor` â€” per-section overrides for all 7 survey sections
- `FormDetailPage` â€” view form, copy link, toggle active, edit/delete
- `FormCard` â€” dashboard grid card

### Partners (admin)
- `GET/POST /api/partners` â€” list + create with form_count + response_count
- `GET/PUT/DELETE /api/partners/:id` â€” detail + update + soft-delete
- `PartnersPage` â€” grid with `PartnerModal` (create/edit, theme color pickers)
- `PartnerDetailPage` â€” inline edit, theme swatches, forms list
- `partners` table columns: `name`, `slug`, `description`, `website`, `contact_email`, `logo_url`, `theme_preset` (JSONB), `is_active`
- `backend/src/migrations.js` â€” idempotent `ADD COLUMN IF NOT EXISTS` migrations, run at startup

### Responses (admin)
- `GET /api/responses?formId=&from=&to=&gender=&style=` â€” filtered, server-side
- `GET /api/responses/export` â€” CSV download with SharePoint-compatible headers (defined BEFORE `/:id` route)
- `GET /api/responses/:id` â€” single response detail
- `DELETE /api/responses/:id` â€” delete
- Dynamic WHERE built with positional `$N` params via `sql(queryString, [params])`
- `ResponsesPage` â€” per-form filter bar (date, gender, style), stats, detail drawer, export button
- `DetailDrawer` â€” fixed right panel, guest profile, delete with confirm

### Survey (guest-facing)
- 14-step flow: Language â†’ Identity â†’ Gender/Nationality â†’ Phone â†’ Sizing â†’ Purpose â†’ PS Mode â†’ Style â†’ Categories â†’ Brands â†’ Lifestyle â†’ Travel â†’ Events â†’ Review/Consent
- `SurveyForm.jsx` â€” all steps, config overrides for every section
- Config override pattern: all 7 sections default to `null` in `forms.config` (â†’ uses `data.js` defaults). When admin clicks "Customise", section is deep-cloned into config JSONB.
- `PublicSurveyPage` â€” fetches form by token, applies theme CSS vars, handles submit + thanks screen

### Landing Page (guest)
- Full-screen dark plum gradient (`#0d1a10 â†’ #1a2e1e â†’ #233B2B`)
- Pill "Start" button with frosted-glass style
- Logo footer: **LVV logo image** (`/images/LVV Logo Black transparent.png`, white-filtered) **Ã—** partner name or logo
- `partner_logo_url` returned from public API â†’ shown white-filtered if set, falls back to text

### Admin Navigation
- `AdminNav` component â€” shared across all admin pages
- Three tabs: Forms (`/dashboard`) Â· Responses (`/responses`) Â· Partners (`/partners`)

### Mobile / Responsive
- All inputs set to `fontSize: 16` inline â€” prevents iOS Safari viewport zoom on focus
- `Wrapper` is a real `div` with `overflowX: hidden; maxWidth: 100vw`
- `html, body, #root`: `overflow-x: hidden; width: 100%; max-width: 100vw`
- PhoneInput dropdown: `width: min(260px, calc(100vw - 32px))`
- Sizing grid: `repeat(auto-fill, minmax(68px, 1fr))`

---

## File Structure (current)
```
lvv-survey/
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ LoginPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ DashboardPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ FormBuilderPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ FormDetailPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ ResponsesPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ PartnersPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ PartnerDetailPage.jsx
â”‚   â”‚   â”‚   â””â”€â”€ PublicSurveyPage.jsx
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ AdminNav.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ FormCard.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ FormContentEditor.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ PhoneInput.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ NationalityInput.jsx
â”‚   â”‚   â”‚   â””â”€â”€ ProtectedRoute.jsx
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”‚   â””â”€â”€ useAuth.js
â”‚   â”‚   â”œâ”€â”€ components.jsx   â† shared UI primitives (Btn, Card, TextInput, etc.)
â”‚   â”‚   â”œâ”€â”€ data.js          â† STYLES_FEMALE/MALE, CATEGORIES, PURPOSES, PS_MODES, LIFESTYLE, TRAVEL_OPTIONS, EVENT_OPTIONS, SIZING_MAP
â”‚   â”‚   â”œâ”€â”€ SurveyForm.jsx   â† 14-step guest survey
â”‚   â”‚   â””â”€â”€ App.jsx          â† routes
â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â”œâ”€â”€ fonts/           â† AimÃ© + Brown Std OTF
â”‚   â”‚   â””â”€â”€ images/
â”‚   â”‚       â”œâ”€â”€ LVV Logo Black transparent.png
â”‚   â”‚       â””â”€â”€ boho-chic.jpg
â”‚   â”œâ”€â”€ index.html
â”‚   â”œâ”€â”€ index.css
â”‚   â”œâ”€â”€ .env                 â† VITE_API_URL=http://localhost:3001
â”‚   â””â”€â”€ .env.production      â† VITE_API_URL=https://lvv-survey-production-d4a4.up.railway.app
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ index.js         â† Express entry, CORS, runMigrations() at startup
â”‚   â”‚   â”œâ”€â”€ db.js            â† Neon client export
â”‚   â”‚   â”œâ”€â”€ migrations.js    â† idempotent ADD COLUMN IF NOT EXISTS
â”‚   â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”‚   â”œâ”€â”€ health.js
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.js
â”‚   â”‚   â”‚   â”œâ”€â”€ forms.js     â† /export route MUST be before /:id
â”‚   â”‚   â”‚   â”œâ”€â”€ partners.js
â”‚   â”‚   â”‚   â””â”€â”€ responses.js â† /export route MUST be before /:id
â”‚   â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.js
â”‚   â”‚   â”‚   â””â”€â”€ errorHandler.js
â”‚   â”‚   â””â”€â”€ seed.js
â”‚   â”œâ”€â”€ schema.sql
â”‚   â”œâ”€â”€ .env
â”‚   â””â”€â”€ .env.example
â”œâ”€â”€ claude-docs/
â”‚   â””â”€â”€ CONTEXT.md           â† this file
â”œâ”€â”€ railway.json
â”œâ”€â”€ vercel.json
â””â”€â”€ package.json
```

## Environment Variables

### backend/.env + Railway
```
DATABASE_URL=postgresql://neondb_owner:...@ep-quiet-boat-a988ce07-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3001
FRONTEND_URL=https://lvv-survey.vercel.app
JWT_SECRET=lvv_jwt_secret_replace_in_prod_2026
```

### frontend/.env (local)
```
VITE_API_URL=http://localhost:3001
```

### frontend/.env.production
```
VITE_API_URL=https://lvv-survey-production-d4a4.up.railway.app
```

## Known Gotchas
- Dynamic SQL with neon: use `sql(queryString, [params])` form for conditional WHERE, not template literals
- Express route ordering: `/export` must be defined before `/:id` in both forms.js and responses.js
- `runMigrations()` runs on every backend startup â€” all migrations must be idempotent (`IF NOT EXISTS`)
- iOS Safari zooms viewport on input focus if `font-size < 16px` â€” ALL inputs must have `fontSize: 16` as inline style (CSS rules can't override inline in React)
- Partner logo displayed white-filtered on dark landing page via `filter: brightness(0) invert(1)`



