# BATCH-04 — Public Survey URL + Guest-Facing Page

## Commit
`feat(BATCH-04): public survey URL — unique /f/:token route + guest form page`

## Goal
Each form gets a unique shareable URL: `https://lvv-survey.vercel.app/f/{token}`
When a guest opens this URL, they see the full branded survey (no login required).
On submit, data is saved to the `responses` table in Neon.

## Depends On
BATCH-03 completed — forms exist in DB with public_url_token.

## How It Works
1. Partnership team creates a form → gets URL `/f/a1b2c3d4-...`
2. They share this URL with The Peninsula (email, QR code, welcome card)
3. Guest opens URL → sees the form with hotel branding
4. Guest submits → data saved to DB under `form_id`
5. Team sees responses in dashboard

## Backend Tasks

### 1. GET /api/forms/public/:token (already in BATCH-03)
Returns:
```json
{
  "formId": "...",
  "title": "Pre-Arrival Survey",
  "hotelName": "The Peninsula Paris",
  "config": { ... },
  "theme": { ... }
}
```

### 2. POST /api/responses
- PUBLIC — no auth required
- Body: `{ formToken, data }` (data = full guest form answers)
- Look up form by token
- Insert into `responses` table: `{ form_id, data, submitted_at }`
- Optionally trigger webhook if form has `config.webhookUrl` set
- Return `{ success: true, responseId }`

### 3. GET /api/responses?formId=:id
- Protected — for dashboard
- Return all responses for a form
- Support pagination: `?page=1&limit=50`

## Frontend Tasks

### 4. frontend/src/pages/PublicSurveyPage.jsx
Route: `/f/:token`

On mount:
- Fetch `GET /api/forms/public/:token`
- If not found or inactive → show elegant "This form is no longer available" page
- If found → render the full survey with form's config + theme

The survey renders the existing `SurveyForm.jsx` but:
- Reads questions/options from `form.config` (not hardcoded data.js)
- Applies `form.theme` colors dynamically via CSS custom properties
- Shows hotel name in header instead of hardcoded "Peninsula Paris"
- On submit → POST /api/responses (not localStorage)

### 5. Dynamic theming
In `PublicSurveyPage.jsx`, on mount apply theme:
```js
const root = document.documentElement
root.style.setProperty('--plum', theme.primaryColor)
root.style.setProperty('--gold', theme.accentColor)
root.style.setProperty('--beige', theme.backgroundColor)
```

### 6. Success / Thank You
After submit → show thank you screen with:
- Guest first name
- Hotel-specific message from `config.thankYouMessage`
- "Powered by La Vallée Village" subtle footer

### 7. Update SurveyForm.jsx
Make it accept props:
```jsx
<SurveyForm
  config={form.config}      // dynamic questions/options
  theme={form.theme}        // colors
  hotelName={form.hotelName}
  onComplete={handleSubmit} // called with form data
/>
```
All hardcoded references to STYLES_FEMALE etc. become fallbacks.

## Acceptance Criteria
- [ ] `/f/:token` loads correct form from DB
- [ ] Invalid/inactive token shows graceful error page
- [ ] Guest submits → row appears in `responses` table
- [ ] Dashboard response count updates after submission
- [ ] Theme colors applied correctly from form config
- [ ] Hotel name displayed correctly in survey header
- [ ] No login required to access `/f/:token`
- [ ] Git commit: `feat(BATCH-04): public survey URL — unique /f/:token route + guest form page`
