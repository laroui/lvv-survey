# BATCH-08 — Power Automate Webhook + SharePoint Injection

## Commit
`feat(BATCH-08): Power Automate webhook — SharePoint list injection on guest submit`

## Goal
When a guest submits a form, the backend fires a POST to a Power Automate HTTP trigger.
Power Automate creates a new item in the LVV_PreArrival SharePoint list.
This is the Microsoft 365 integration that makes the data available to the wider team.

## Depends On
BATCH-04 — responses saved to DB.

## Architecture
```
Guest submits form
      ↓
POST /api/responses (backend)
      ↓ (async, non-blocking)
backend fires webhook → Power Automate HTTP trigger
      ↓
Power Automate creates item in SharePoint LVV_PreArrival list
      ↓
Power Automate sends confirmation email to PS team
```

## Backend Tasks

### 1. Add webhookUrl to forms table (migration)
```sql
ALTER TABLE forms ADD COLUMN IF NOT EXISTS webhook_url TEXT;
```

### 2. Webhook service — backend/src/services/webhook.js
```js
export async function fireWebhook(webhookUrl, responseData) {
  if (!webhookUrl) return
  try {
    const spPayload = toSharePointPayload(responseData)
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spPayload),
    })
  } catch (err) {
    // Non-blocking — log but don't fail the response save
    console.error('Webhook failed:', err.message)
  }
}

function toSharePointPayload(data) {
  return {
    GuestName: `${data.firstName} ${data.surname}`,
    Initials: data.initials,
    Civilite: data.gender,
    GuestEmail: data.email || '',
    Phone: data.phone || '',
    Nationalite: data.nationality || '',
    SizingSystem: data.sizingSystem || '',
    SizingValue: data.sizingValue || '',
    Intention: data.purpose || '',
    ModePS: data.psMode || '',
    Style1: data.styles?.[0] || '',
    Style2: data.styles?.[1] || '',
    Categories: (data.categories || []).join(', '),
    Brands: (data.brands || []).filter(b => b !== 'none').join(', '),
    Lifestyle: (data.lifestyle || []).join(', '),
    UpcomingTravel: (data.travel || []).join(', '),
    UpcomingEvent: (data.events || []).join(', '),
    ConsentGiven: data.consent ? 'Yes' : 'No',
    SubmittedAt: data.submittedAt,
  }
}
```

### 3. Fire webhook in POST /api/responses
```js
// After inserting into DB — fire async, don't await
fireWebhook(form.webhook_url, req.body.data)
```

## Frontend Tasks

### 4. FormBuilderPage.jsx — add webhook config section
Under "Integrations" section:
- Label: "Power Automate Webhook URL"
- Input: URL field
- Help text: "Paste the HTTP trigger URL from your Power Automate flow"
- Test button: "Send test payload" → fires a sample payload to the URL

### 5. SettingsPage.jsx — global webhook
Optional: global fallback webhook URL if form has none.

## Power Automate Setup Guide (for the team)

Create a file: `claude-docs/guides/POWER-AUTOMATE-SETUP.md`

Contents:
1. Go to make.powerautomate.com
2. Create → Automated cloud flow
3. Trigger: "When an HTTP request is received"
4. Copy the generated HTTP POST URL → paste into FormBuilder
5. Add action: "SharePoint — Create item"
   - Site: your LVV SharePoint site
   - List: LVV_PreArrival
   - Map fields: GuestName → Title, Civilite → Civilite, etc.
6. Add action (optional): "Send an email (V2)" to PS team
7. Save + test with "Send test payload" button in FormBuilder

## Acceptance Criteria
- [ ] `webhook_url` saved per form in DB
- [ ] Webhook fires on guest submit (non-blocking)
- [ ] SharePoint payload uses correct column names
- [ ] Webhook failure does NOT block response save
- [ ] URL input + test button in FormBuilder
- [ ] Power Automate setup guide created
- [ ] Git commit: `feat(BATCH-08): Power Automate webhook — SharePoint injection on submit`
