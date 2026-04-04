# Project Context — LVV Survey Tool

> Read this file at the start of every Claude Code session before executing any batch.

## What This Project Is
A fullstack webapp for La Vallée Village's partnerships team.
It lets them create branded guest survey forms, share unique URLs with hotel partners,
collect pre-arrival guest profiles, and export data to SharePoint.

## First Partner
**The Peninsula Paris** — luxury hotel, Avenue Kléber, Paris 16e.
The survey collects guest style preferences to personalise their shopping experience
at La Vallée Village (luxury outlet, Marne-la-Vallée, Paris region).

## Tech Stack
- **Frontend:** React 18 + Vite — `frontend/`
- **Backend:** Node.js + Express (ES modules) — `backend/`
- **Database:** Neon PostgreSQL — `@neondatabase/serverless`
- **Auth:** JWT + bcrypt — no OAuth
- **Deploy:** Vercel (frontend) + Railway (backend)
- **Fonts:** Aimé (display/serif) + Brown Std (sans body) — in `frontend/public/fonts/`

## Design Tokens (DO NOT CHANGE)
```
--plum:       #523849   (primary brand colour)
--plum-dark:  #2a1a22
--gold:       #C9A84C   (accent)
--beige:      #F5F0E6   (background)
--font-display: 'Aime'     (for all titles, questions, hero text)
--font-sans:    'BrownStd' (for body, labels, inputs)
```

## Key Rules
1. Every batch = one Git commit with the exact message in the batch file
2. Always commit AND push after every change — Vercel auto-deploys on push
3. Never break existing functionality — run `npm run build` before committing
4. Backend always on port 3001, frontend on 5173
5. All API routes prefixed with `/api`
6. JWT stored in localStorage key: `lvv_token`
7. Responses stored in Neon, not localStorage (localStorage = demo only)
8. `public_url_token` is the UUID used in `/f/:token` — never expose internal DB id to guests
9. All DB queries use `@neondatabase/serverless` neon tagged template literals
10. Brown Std Thin (weight 100) / Light (300) for body text, Regular (400) for emphasis
11. Aimé Regular (400) for titles, Aimé Italic for style card overlays

---

## Current Infrastructure (LIVE)

| Service | URL | Status |
|---|---|---|
| Frontend | https://lvv-survey.vercel.app | ✅ Live |
| Backend | https://lvv-survey-production-d4a4.up.railway.app | ✅ Live |
| Database | Neon PostgreSQL (gwc.azure region) | ✅ Connected |

### Admin credentials (first login)
- Email: `admin@lavallee-village.com`
- Password: `LVV2025!` — change after first login

---

## Completed Batches

### BATCH-01 — Backend Scaffold ✅
- Monorepo restructure: `frontend/` + `backend/` + `claude-docs/`
- Express + CORS + dotenv backend
- Neon PostgreSQL client (`backend/src/db.js`)
- `GET /api/health` → `{ status: 'ok', db: 'connected' }`
- DB schema created: `partners`, `users`, `forms`, `responses`
- Peninsula Paris seeded as first partner
- `railway.json` at root for Railway monorepo deploy
- `vercel.json` updated to build from `frontend/`

### BATCH-02 — Auth (JWT) ✅
- `POST /api/auth/login` — returns JWT (24h)
- `POST /api/auth/register` — admin only, bcrypt 12 rounds
- `GET /api/auth/me` — protected route
- `requireAuth` JWT middleware (`backend/src/middleware/auth.js`)
- Seed script: `node backend/src/seed.js` (creates first admin)
- `LoginPage.jsx` — plum/gold styled, Aimé + Brown Std fonts
- `useAuth` hook — login/logout, token in localStorage
- `ProtectedRoute` component — redirects to /login if expired
- React Router v6: `/login`, `/dashboard`, `/f/:token`
- Branding: "La Vallée Village" only (no × Peninsula in nav)

---

## File Structure (current)
```
lvv-survey/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── LoginPage.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── components.jsx   ← shared UI primitives
│   │   ├── data.js          ← style archetypes, categories, options
│   │   ├── SurveyForm.jsx   ← 14-step survey (localStorage for now)
│   │   ├── ResponsesPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── App.jsx          ← routing shell
│   │   └── index.css        ← font declarations + CSS variables
│   ├── public/fonts/        ← Aimé + Brown Std OTF files
│   ├── .env                 ← VITE_API_URL=http://localhost:3001
│   ├── .env.production      ← VITE_API_URL=https://lvv-survey-production-d4a4.up.railway.app
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── index.js         ← Express entry, CORS allowlist
│   │   ├── db.js            ← Neon client
│   │   ├── routes/
│   │   │   ├── health.js    ← GET /api/health
│   │   │   └── auth.js      ← POST /login, /register — GET /me
│   │   ├── middleware/
│   │   │   ├── auth.js      ← requireAuth JWT middleware
│   │   │   └── errorHandler.js
│   │   └── seed.js          ← run once to create admin user
│   ├── .env                 ← DATABASE_URL, JWT_SECRET, PORT, FRONTEND_URL
│   ├── .env.example
│   ├── schema.sql           ← full DB schema (already applied to Neon)
│   └── package.json
├── claude-docs/
│   ├── CONTEXT.md           ← this file
│   └── batches/
│       ├── BATCH-01.md ✅
│       ├── BATCH-02.md ✅
│       ├── BATCH-03.md ← NEXT
│       ├── BATCH-04.md
│       ├── BATCH-05.md
│       ├── BATCH-06.md
│       ├── BATCH-07.md
│       └── BATCH-08.md
├── railway.json             ← Railway monorepo config (build from backend/)
├── vercel.json              ← Vercel config (build from frontend/)
├── package.json             ← root scripts: npm run dev / build / start
└── README.md
```

## Environment Variables

### backend/.env (local) + Railway Variables (prod)
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

### frontend/.env.production (committed — not a secret)
```
VITE_API_URL=https://lvv-survey-production-d4a4.up.railway.app
```

## Next: BATCH-03
See `claude-docs/batches/BATCH-03.md`
