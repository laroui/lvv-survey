# Project Context — LVV Survey Tool

> Read this file at the start of every session before doing anything.

## What This Project Is
A fullstack webapp for La Vallée Village's partnerships team.
Lets them create branded guest survey forms, share unique URLs with hotel partners,
collect pre-arrival guest profiles, and export data to SharePoint.

## First Partner
**The Peninsula Paris** — luxury hotel, Avenue Kléber, Paris 16e.
Survey collects guest style preferences to personalise their shopping experience
at La Vallée Village (luxury outlet, Marne-la-Vallée, Paris region).

## Tech Stack
- **Frontend:** React 18 + Vite — `frontend/`
- **Backend:** Node.js + Express (ES modules) — `backend/`
- **Database:** Neon PostgreSQL — `@neondatabase/serverless`
- **Auth:** JWT + bcrypt — no OAuth
- **Deploy:** Vercel (frontend) + Railway (backend)
- **Fonts:** Aimé (display/serif) + Brown Std (sans body) — `frontend/public/fonts/`

## Design Tokens (DO NOT CHANGE)
```
--plum:       #523849
--plum-dark:  #2a1a22
--gold:       #C9A84C
--beige:      #F5F0E6
--font-display: 'Aime'
--font-sans:    'BrownStd'
```

## Key Rules
1. Always commit AND push after every change — Vercel auto-deploys on push
2. Never break existing functionality
3. Backend port 3001, frontend 5173
4. All API routes prefixed `/api`
5. JWT in localStorage key `lvv_token`
6. `public_url_token` UUID used in `/f/:token` — never expose DB id to guests
7. All DB queries use `@neondatabase/serverless` tagged template literals OR `sql(string, [params])` for dynamic WHERE
8. Brown Std Thin/Light for body, Regular for emphasis; Aimé Regular for titles

---

## Live Infrastructure

| Service | URL | Status |
|---|---|---|
| Frontend | https://lvv-survey.vercel.app | ✅ Live |
| Backend | https://lvv-survey-production-d4a4.up.railway.app | ✅ Live |
| Database | Neon PostgreSQL (gwc.azure) | ✅ Connected |

**Admin credentials:** `admin@lavallee-village.com` / `LVV2025!`

---

## What's Been Built (fully live)

### Auth
- `POST /api/auth/login` → JWT 24h
- `POST /api/auth/register` (admin only)
- `requireAuth` middleware
- `LoginPage`, `ProtectedRoute`, `useAuth` hook

### Forms (admin)
- `GET/POST /api/forms` — list + create
- `GET/PUT /api/forms/:id` — detail + update
- `GET /api/forms/public/:token` — public guest endpoint (no auth), returns config + theme + partner_name + partner_logo_url
- `FormBuilderPage` — two-tab UI (Settings / Content)
  - Settings: title, partner, hotel name, language, optional sections toggles, thank-you messages (EN + FR)
  - Content tab: `FormContentEditor` — per-section overrides for all 7 survey sections
- `FormDetailPage` — view form, copy link, toggle active, edit/delete
- `FormCard` — dashboard grid card

### Partners (admin)
- `GET/POST /api/partners` — list + create with form_count + response_count
- `GET/PUT/DELETE /api/partners/:id` — detail + update + soft-delete
- `PartnersPage` — grid with `PartnerModal` (create/edit, theme color pickers)
- `PartnerDetailPage` — inline edit, theme swatches, forms list
- `partners` table columns: `name`, `slug`, `description`, `website`, `contact_email`, `logo_url`, `theme_preset` (JSONB), `is_active`
- `backend/src/migrations.js` — idempotent `ADD COLUMN IF NOT EXISTS` migrations, run at startup

### Responses (admin)
- `GET /api/responses?formId=&from=&to=&gender=&style=` — filtered, server-side
- `GET /api/responses/export` — CSV download with SharePoint-compatible headers (defined BEFORE `/:id` route)
- `GET /api/responses/:id` — single response detail
- `DELETE /api/responses/:id` — delete
- Dynamic WHERE built with positional `$N` params via `sql(queryString, [params])`
- `ResponsesPage` — per-form filter bar (date, gender, style), stats, detail drawer, export button
- `DetailDrawer` — fixed right panel, guest profile, delete with confirm

### Survey (guest-facing)
- 14-step flow: Language → Identity → Gender/Nationality → Phone → Sizing → Purpose → PS Mode → Style → Categories → Brands → Lifestyle → Travel → Events → Review/Consent
- `SurveyForm.jsx` — all steps, config overrides for every section
- Config override pattern: all 7 sections default to `null` in `forms.config` (→ uses `data.js` defaults). When admin clicks "Customise", section is deep-cloned into config JSONB.
- `PublicSurveyPage` — fetches form by token, applies theme CSS vars, handles submit + thanks screen

### Landing Page (guest)
- Full-screen dark plum gradient (`#2a1520 → #3d1f2e → #52384a`)
- Pill "Start" button with frosted-glass style
- Logo footer: **LVV logo image** (`/images/LVV Logo Black transparent.png`, white-filtered) **×** partner name or logo
- `partner_logo_url` returned from public API → shown white-filtered if set, falls back to text

### Admin Navigation
- `AdminNav` component — shared across all admin pages
- Three tabs: Forms (`/dashboard`) · Responses (`/responses`) · Partners (`/partners`)

### Mobile / Responsive
- All inputs set to `fontSize: 16` inline — prevents iOS Safari viewport zoom on focus
- `Wrapper` is a real `div` with `overflowX: hidden; maxWidth: 100vw`
- `html, body, #root`: `overflow-x: hidden; width: 100%; max-width: 100vw`
- PhoneInput dropdown: `width: min(260px, calc(100vw - 32px))`
- Sizing grid: `repeat(auto-fill, minmax(68px, 1fr))`

---

## File Structure (current)
```
lvv-survey/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── FormBuilderPage.jsx
│   │   │   ├── FormDetailPage.jsx
│   │   │   ├── ResponsesPage.jsx
│   │   │   ├── PartnersPage.jsx
│   │   │   ├── PartnerDetailPage.jsx
│   │   │   └── PublicSurveyPage.jsx
│   │   ├── components/
│   │   │   ├── AdminNav.jsx
│   │   │   ├── FormCard.jsx
│   │   │   ├── FormContentEditor.jsx
│   │   │   ├── PhoneInput.jsx
│   │   │   ├── NationalityInput.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── components.jsx   ← shared UI primitives (Btn, Card, TextInput, etc.)
│   │   ├── data.js          ← STYLES_FEMALE/MALE, CATEGORIES, PURPOSES, PS_MODES, LIFESTYLE, TRAVEL_OPTIONS, EVENT_OPTIONS, SIZING_MAP
│   │   ├── SurveyForm.jsx   ← 14-step guest survey
│   │   └── App.jsx          ← routes
│   ├── public/
│   │   ├── fonts/           ← Aimé + Brown Std OTF
│   │   └── images/
│   │       ├── LVV Logo Black transparent.png
│   │       └── boho-chic.jpg
│   ├── index.html
│   ├── index.css
│   ├── .env                 ← VITE_API_URL=http://localhost:3001
│   └── .env.production      ← VITE_API_URL=https://lvv-survey-production-d4a4.up.railway.app
├── backend/
│   ├── src/
│   │   ├── index.js         ← Express entry, CORS, runMigrations() at startup
│   │   ├── db.js            ← Neon client export
│   │   ├── migrations.js    ← idempotent ADD COLUMN IF NOT EXISTS
│   │   ├── routes/
│   │   │   ├── health.js
│   │   │   ├── auth.js
│   │   │   ├── forms.js     ← /export route MUST be before /:id
│   │   │   ├── partners.js
│   │   │   └── responses.js ← /export route MUST be before /:id
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── seed.js
│   ├── schema.sql
│   ├── .env
│   └── .env.example
├── claude-docs/
│   └── CONTEXT.md           ← this file
├── railway.json
├── vercel.json
└── package.json
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
- `runMigrations()` runs on every backend startup — all migrations must be idempotent (`IF NOT EXISTS`)
- iOS Safari zooms viewport on input focus if `font-size < 16px` — ALL inputs must have `fontSize: 16` as inline style (CSS rules can't override inline in React)
- Partner logo displayed white-filtered on dark landing page via `filter: brightness(0) invert(1)`
