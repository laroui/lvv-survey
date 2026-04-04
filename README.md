# LVV Pre-Arrival Survey
## La Vallée Village × The Peninsula Paris

Guest profiling webapp for the partnerships team — Peninsula hotel guests.

### Stack
- **Frontend:** React 18 + Vite 5 — `frontend/`
- **Backend:** Node.js + Express (ES modules) — `backend/`
- **Database:** Neon PostgreSQL — `@neondatabase/serverless`
- **Auth:** JWT + bcrypt
- Aimé (display/serif) + Brown Std (body sans-serif) — fully embedded
- No external UI library — fully custom components

### Local Development
```bash
# Frontend (port 5173)
cd frontend && npm install && npm run dev

# Backend (port 3001)
cd backend && npm install && npm run dev
```

### Environment Setup
```bash
cp backend/.env.example backend/.env
# Fill in DATABASE_URL, JWT_SECRET
```

### Deploy to Vercel (free)
```bash
npm run build
vercel deploy ./dist --prod
```

### SharePoint Integration
**Option A — Power Automate Webhook**
1. Create an Automated cloud flow with trigger: "When an HTTP request is received"
2. Set VITE_PA_WEBHOOK_URL in Vercel env vars
3. POST entry JSON on submit

**Option B — Microsoft Graph API**
1. Register Azure App with Sites.ReadWrite.All permission
2. Set VITE_SP_SITE_URL, VITE_SP_LIST_NAME, VITE_AZURE_CLIENT_ID
3. Use MSAL.js + Graph /lists/{listId}/items endpoint

### SharePoint Column Mapping (LVV_PreArrival)
| Export Field | SP Column | Type |
|---|---|---|
| GuestName | Title / GuestName | Single line |
| Initials | Initials | Single line (auto) |
| Civilite | Civilite | Choice: Mr/Ms |
| GuestEmail | GuestEmail | Single line |
| Phone | Phone | Single line |
| Nationalite | Nationalite | Single line |
| SizingSystem | SizingSystem | Choice: EU/US/JP |
| SizingValue | SizingValue | Single line |
| Intention | Intention | Single line |
| ModePS | ModePS | Single line |
| Style1 | Style1 | Single line |
| Style2 | Style2 | Single line |
| Categories | Categories | Multi-line comma-sep |
| Brands | Brands | Multi-line comma-sep |
| Lifestyle | Lifestyle | Multi-line comma-sep |
| UpcomingTravel | UpcomingTravel | Single line |
| UpcomingEvent | UpcomingEvent | Single line |
| ConsentGiven | ConsentGiven | Yes/No |
| SubmittedAt | SubmittedAt | Date and Time |

*IT Operations — La Vallée Village*
