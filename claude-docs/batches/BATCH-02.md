# BATCH-02 — Authentication (Email/Password + JWT)

## Commit
`feat(BATCH-02): auth — email/password login + JWT + protected routes`

## Goal
Implement a simple but secure authentication system for the LVV partnership team.
No OAuth for now — email + password + JWT. Registration is admin-only (no public signup).

## Depends On
BATCH-01 completed — monorepo structure + DB schema in place.

## Backend Tasks

### 1. Install dependencies
```bash
cd backend
npm install bcryptjs jsonwebtoken
```

### 2. backend/src/routes/auth.js
Implement these endpoints:

**POST /api/auth/login**
- Body: `{ email, password }`
- Find user by email in DB
- Compare password with bcrypt
- Return signed JWT (24h expiry) + user info `{ id, email, fullName, role }`
- Return 401 if invalid credentials

**POST /api/auth/register** *(admin only — protected)*
- Body: `{ email, password, fullName, role }`
- Hash password with bcrypt (rounds: 12)
- Insert into `users` table
- Return new user (no password)

**GET /api/auth/me** *(protected)*
- Read JWT from Authorization header
- Return current user info

### 3. backend/src/middleware/auth.js
```js
// JWT middleware — attach to protected routes
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

### 4. Seed first admin user
Add a seed script `backend/src/seed.js`:
```js
// Run once: node src/seed.js
// Creates the first admin user
const email = 'admin@lavallee-village.com'
const password = 'LVV2025!' // change after first login
```

## Frontend Tasks

### 5. frontend/src/pages/LoginPage.jsx
Full-page login screen with:
- Aimé font for title "Partnership Hub"
- Brown Std for inputs/labels
- Email + password fields
- "Sign in" button (plum/gold style)
- Error message on failed login
- On success: store JWT in localStorage, redirect to `/dashboard`

### 6. frontend/src/hooks/useAuth.js
```js
// Custom hook — reads JWT from localStorage
// Exposes: { user, token, login(email, pw), logout() }
// login() calls POST /api/auth/login, stores token
// logout() clears token, redirects to /login
```

### 7. frontend/src/App.jsx — add routing
```bash
cd frontend && npm install react-router-dom
```
Add routes:
- `/login` → LoginPage (public)
- `/dashboard` → App (protected — redirect to /login if no token)
- `/f/:token` → PublicSurveyPage (public — BATCH-04)

### 8. frontend/src/components/ProtectedRoute.jsx
```js
// Wraps routes that require auth
// Reads token from localStorage
// If expired or missing → redirect to /login
```

## Acceptance Criteria
- [ ] `POST /api/auth/login` returns JWT for valid credentials
- [ ] `POST /api/auth/login` returns 401 for invalid credentials
- [ ] JWT verified on protected routes
- [ ] Login page renders with correct Aimé + Brown Std fonts
- [ ] Successful login redirects to `/dashboard`
- [ ] Logout clears token and redirects to `/login`
- [ ] Page refresh keeps user logged in (token in localStorage)
- [ ] Git commit: `feat(BATCH-02): auth — email/password login + JWT + protected routes`
