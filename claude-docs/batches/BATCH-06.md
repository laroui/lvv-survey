# BATCH-06 — Responses Dashboard + Export

## Commit
`feat(BATCH-06): responses dashboard — per-form analytics, filters + CSV/JSON export`

## Goal
A rich responses view for the partnership team.
Per form: see all submissions, filter, view individual profiles, export for SharePoint.

## Depends On
BATCH-04 — responses being saved to DB.

## Backend Tasks

### 1. GET /api/responses?formId=:id&page=1&limit=50
Already scaffolded in BATCH-04 — flesh out fully:
- Pagination
- Filter by date range: `?from=2025-01-01&to=2025-12-31`
- Filter by gender: `?gender=Ms`
- Filter by style: `?style=Parisian+Elegance`
- Return: `{ responses: [...], total, page, pages }`

### 2. GET /api/responses/:id
- Return single response full detail

### 3. DELETE /api/responses/:id
- Protected — delete a response

### 4. GET /api/responses/export?formId=:id&format=csv
- Protected
- Stream CSV file with SharePoint column headers
- Content-Disposition: attachment; filename="LVV_responses_{date}.csv"

## Frontend Tasks

### 5. frontend/src/pages/ResponsesPage.jsx (full rebuild)

**Top stats row** (4 cards):
- Total submissions
- This week
- % Female / % Male
- Top style archetype

**Filters bar:**
- Date range picker (use native `<input type="date">`)
- Gender filter (All / Ms / Mr)
- Style filter (dropdown)

**Responses table:**
Same columns as current but pulling from API (not localStorage).
Add: row click → opens ResponseDetailDrawer

**ResponseDetailDrawer** (slide-in panel from right):
Full guest profile card showing all fields in a clean layout:
- Initials avatar (plum circle)
- Name, email, phone, nationality
- All survey answers in labelled sections
- "Delete" button at bottom

**Export buttons:**
- Export CSV → GET /api/responses/export?formId=...&format=csv
- Export JSON → GET /api/responses/export?formId=...&format=json

### 6. frontend/src/pages/DashboardPage.jsx — add response counts
Each form card shows live response count from API.

## Acceptance Criteria
- [ ] Responses load from API (not localStorage)
- [ ] Pagination works (50 per page)
- [ ] Filters work (date, gender, style)
- [ ] Row click opens detail drawer
- [ ] Detail drawer shows all guest info
- [ ] CSV export downloads with correct SP column headers
- [ ] JSON export downloads SP-ready format
- [ ] Delete response works
- [ ] Git commit: `feat(BATCH-06): responses dashboard — analytics, filters, export`
