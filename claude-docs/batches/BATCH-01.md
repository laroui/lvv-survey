# BATCH-01 — Backend Scaffold + Project Restructure

## Commit
`feat(BATCH-01): backend scaffold — Node/Express + Neon/PG + monorepo structure`

## Goal
Transform the current frontend-only Vite project into a proper fullstack monorepo
with a Node.js/Express backend connected to Neon PostgreSQL.

## Current State
- `lvv-survey/` is a Vite + React app (frontend only)
- No backend, no database, no auth
- Data stored in localStorage (demo only)

## Target Structure After This Batch
```
lvv-survey/
├── frontend/          ← move all current src/ here
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/           ← new
│   ├── src/
│   │   ├── index.js         ← Express entry point
│   │   ├── db.js            ← Neon PostgreSQL client
│   │   ├── routes/
│   │   │   └── health.js    ← GET /api/health
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── .env.example
│   └── package.json
├── claude-docs/
└── README.md
```

## Tasks

### 1. Restructure frontend
- Move `src/`, `public/`, `index.html`, `vite.config.js`, `package.json` into `frontend/`
- Update all relative paths
- Verify `npm run dev` still works from `frontend/`

### 2. Create backend
```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv pg @neondatabase/serverless
npm install -D nodemon
```

### 3. backend/src/index.js
```js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import healthRouter from './routes/health.js'

dotenv.config()
const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())
app.use('/api', healthRouter)
app.use(errorHandler) // import from middleware/errorHandler.js

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
```

### 4. backend/src/db.js
```js
import { neon } from '@neondatabase/serverless'
export const sql = neon(process.env.DATABASE_URL)
```

### 5. backend/.env.example
```
DATABASE_URL=postgresql://...
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace_this
```

### 6. backend/package.json scripts
```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  }
}
```

### 7. Database — initial schema (run once on Neon)
```sql
-- Partners (hotels/brands)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Users (LVV partnership team members)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'editor',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Form templates
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  created_by UUID REFERENCES users(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  public_url_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  theme JSONB DEFAULT '{}',
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Guest responses
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id),
  data JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Insert Peninsula as first partner
INSERT INTO partners (name, slug) VALUES ('The Peninsula Paris', 'peninsula-paris');
```

### 8. Root README.md — update with monorepo instructions
```
## Dev Setup
cd frontend && npm install && npm run dev   # port 5173
cd backend && npm install && npm run dev    # port 3001
```

## Acceptance Criteria
- [ ] `frontend/` builds without errors (`npm run build`)
- [ ] `backend/` starts without errors (`npm run dev`)
- [ ] `GET /api/health` returns `{ status: 'ok' }`
- [ ] Neon DB connected (no connection error on start)
- [ ] Schema tables created in Neon dashboard
- [ ] Git commit: `feat(BATCH-01): backend scaffold — Node/Express + Neon/PG + monorepo structure`
