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
2. Never break existing functionality — run `npm run build` before committing
3. Backend always on port 3001, frontend on 5173
4. All API routes prefixed with `/api`
5. JWT stored in localStorage key: `lvv_token`
6. Responses stored in Neon, not localStorage (localStorage = demo only)
7. `public_url_token` is the UUID used in `/f/:token` — never expose internal DB id to guests
8. All DB queries use `@neondatabase/serverless` neon tagged template literals
9. Brown Std Thin (weight 100) / Light (300) for body text, Regular (400) for emphasis
10. Aimé Regular (400) for titles, Aimé Italic for style card overlays

## File Structure (post BATCH-01)
```
lvv-survey/
├── frontend/
│   ├── src/
│   │   ├── pages/         ← LoginPage, DashboardPage, FormBuilderPage, PublicSurveyPage...
│   │   ├── components.jsx ← shared UI components
│   │   ├── data.js        ← style archetypes, categories, options
│   │   ├── SurveyForm.jsx ← main survey form (accepts config props from BATCH-04)
│   │   ├── App.jsx        ← routing
│   │   └── index.css      ← font declarations + CSS variables
│   └── public/fonts/      ← Aimé + Brown Std OTF files
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   └── .env.example
└── claude-docs/
    ├── README.md
    ├── CONTEXT.md          ← this file
    ├── batches/
    │   ├── BATCH-01.md ... BATCH-08.md
    └── guides/
        └── POWER-AUTOMATE-SETUP.md
```

## Environment Variables Needed
```
# backend/.env
DATABASE_URL=postgresql://...@...neon.tech/lvv_survey
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=<strong-random-string>

# frontend/.env
VITE_API_URL=http://localhost:3001
```
