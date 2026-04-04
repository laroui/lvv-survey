# LVV Pre-Arrival Survey — Project Handover for Claude Code

## Context

You are continuing development of **LVV Pre-Arrival Survey**, a luxury guest profiling webapp built for the **Partnerships team at La Vallée Village** (Value Retail), in collaboration with **The Peninsula Paris**.

The project was initiated and architected by **Nacim Laroui** (IT Operations Manager, La Vallée Village), built with Claude (claude.ai), and is now being continued on a new machine via Claude Code.

---

## Project Purpose

La Vallée Village works with luxury hotel partners (starting with The Peninsula Paris). Before a guest's visit, the partnerships team wants to collect a **rich style & preference profile** to allow Personal Shoppers to prepare a tailored experience.

This tool serves two audiences:

1. **The guest** — fills in a beautiful, bilingual (EN/FR) pre-arrival survey in ~3 min
2. **The LVV partnerships / PS team** — uses the back-office to view responses, export data to SharePoint, and configure the form

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Pure CSS-in-JS (inline styles + CSS variables, no library) |
| Fonts | **Aimé** (display/serif) + **Brown Std** (sans-serif body) — both embedded as local OTF/TTF in `/public/fonts/` |
| State | React `useState` — no Redux or Zustand |
| Persistence | `localStorage` (demo mode) — designed to be swapped for Graph API / Power Automate webhook |
| Deployment | Vercel (free Hobby plan) — `vercel.json` included |
| No backend | Fully static, zero-cost deployment |

---

## Design Tokens (CSS Variables in `src/index.css`)

```css
--plum:       #523849   /* primary brand color */
--plum-dark:  #2a1a22   /* dark gradient end */
--plum-mid:   #6b4a5e   /* hover/focus states */
--gold:       #C9A84C   /* accent / selected states */
--beige:      #F5F0E6   /* page background */
--beige-mid:  #EDE6D8   /* card borders, dividers */
--beige-dark: #D8CFBD   /* input borders */
--font-display: 'Aime', Georgia, serif        /* titles, questions, hero */
--font-sans:    'BrownStd', system-ui, sans-serif  /* body, labels, inputs */
```

**Typography rule:**
- **Aimé** → hero title, step questions, section titles, stat numbers, card titles, nav brand, thank you message
- **Brown Std Light/Regular** → everything else (labels, body, inputs, buttons, hints)

---

## File Structure

```
lvv-survey/
├── public/
│   └── fonts/
│       ├── AIME-REGULAR.OTF
│       ├── AIME-THIN.OTF
│       ├── AIME-BOLD.OTF
│       ├── AIME-ITALIC.OTF
│       ├── AIME-BOLDITALIC.OTF
│       ├── AIME-THINITALIC.OTF
│       ├── BROWNSTD-LIGHT.OTF
│       ├── BROWNSTD-REGULAR.OTF
│       ├── BROWNSTD-BOLD.OTF
│       ├── BROWNSTD-THIN.OTF
│       ├── BROWNSTD-ITALIC.OTF
│       ├── BROWNSTD-BOLDITALIC.OTF
│       ├── BROWNSTD-LIGHTITALIC.OTF
│       └── BROWNSTD-THINITALIC.OTF  (+ Reclin variants)
├── src/
│   ├── index.css          ← @font-face declarations + all CSS variables
│   ├── main.jsx           ← React entry point
│   ├── App.jsx            ← Navigation shell + global state (responses, surveyState)
│   ├── data.js            ← All data constants (styles, brands, options, SP mapping)
│   ├── components.jsx     ← Shared UI primitives (Btn, Card, Field, OptionItem, etc.)
│   ├── SurveyForm.jsx     ← Full 14-step survey with branching logic
│   ├── ResponsesPage.jsx  ← Back-office: table, stats, CSV/JSON export
│   └── SettingsPage.jsx   ← Config UI + deploy guide + SP mapping reference
├── vercel.json            ← Vercel deploy config (SPA rewrite)
└── README.md              ← Setup + SP integration guide
```

---

## Survey Flow — 14 Steps

| Step | Screen | Key Logic |
|---|---|---|
| 0 | Language toggle | Sets `lang` state (`en` / `fr`) — drives all labels |
| 1 | Identity | First name, surname, email — initials **auto-generated** (`firstName[0] + surname[0]`) |
| 2 | Gender + Nationality | **Branching trigger**: Ms → Q12a styles / Mr → Q12b styles |
| 3 | Phone | Optional — for membership & PS coordination |
| 4 | Sizing | System auto-detected from nationality (EU/US/JP), grid selector + freetext |
| 5 | Purpose (Q9) | Single select, 4 options |
| 6 | PS Mode (Q10) | Single select, 3 options |
| 7 | Style Profile (Q12a/Q12b) | **Max 2 selections** — pool depends on gender from step 2 |
| 8 | Categories (Q11) | Multi-select, unlimited |
| 9 | Brands (Q13) | Multi-select **max 2**, filtered from selected styles + "None of the above" |
| 10 | Lifestyle | Multi-select, unlimited |
| 11 | Travel (Q14) | Multi-tag + freetext |
| 12 | Events (Q14) | Multi-tag + freetext |
| 13 | Review + Consent | Full recap + GDPR checkbox — submit writes to localStorage |

### Branching Rule (Q12)
```
form.gender === 'Ms'  →  STYLES_FEMALE  (Casual Luxury / Parisian Elegance / Bold & Colorful / Boho Romantic)
form.gender === 'Mr'  →  STYLES_MALE    (Casual / Classic / Bold / Street)
```
Each style archetype has its own brand pool — Q13 brands are **filtered from the styles selected in Q12**.

---

## Style Archetypes & Brands (from `src/data.js`)

### Female (Q12a)
| Archetype | Brands |
|---|---|
| Casual Luxury | Loro Piana, Brunello Cucinelli, Zegna, Burberry, Max Mara, JM Weston |
| Parisian Elegance | Saint Laurent, Chloé, Isabel Marant, Valentino, Burberry, Ami |
| Bold & Colorful | Gucci, Loewe, Marni, Balenciaga, Dolce & Gabbana, Versace |
| Boho Romantic | Chloé, Zimmermann, Isabel Marant, Valentino, Gucci, Prada / Miu Miu |

### Male (Q12b)
| Archetype | Brands |
|---|---|
| Casual | Loro Piana, Brunello Cucinelli, Ralph Lauren, Tod's, Barbour |
| Classic | Zegna, Brioni, Kiton, Canali, JM Weston |
| Bold | Gucci, Balenciaga, Versace, Dsquared2, Dolce & Gabbana |
| Street | Off-White, Palm Angels, Stone Island, CP Company, Ami |

---

## SharePoint Column Mapping

The export (CSV + JSON) uses these **exact column names** for direct SharePoint list injection into `LVV_PreArrival`:

| Export Key | SharePoint Column | Type |
|---|---|---|
| `GuestName` | Title / GuestName | Single line |
| `Initials` | Initials | Single line (auto) |
| `Civilite` | Civilite | Choice: Mr / Ms |
| `GuestEmail` | GuestEmail | Single line |
| `Phone` | Phone | Single line |
| `Nationalite` | Nationalite | Single line |
| `SizingSystem` | SizingSystem | Choice: EU / US / JP |
| `SizingValue` | SizingValue | Single line |
| `Intention` | Intention | Single line |
| `ModePS` | ModePS | Single line |
| `Style1` | Style1 | Single line |
| `Style2` | Style2 | Single line |
| `Categories` | Categories | Multiple lines (comma-sep) |
| `Brands` | Brands | Multiple lines (comma-sep) |
| `Lifestyle` | Lifestyle | Multiple lines (comma-sep) |
| `UpcomingTravel` | UpcomingTravel | Single line |
| `UpcomingEvent` | UpcomingEvent | Single line |
| `ConsentGiven` | ConsentGiven | Yes/No |
| `SubmittedAt` | SubmittedAt | Date and Time |

---

## Backlog — What's Left to Build

These are the confirmed next stages. Work through them in order unless instructed otherwise.

### Stage 2 — SharePoint Live Integration
- [ ] Add `VITE_PA_WEBHOOK_URL` env var support
- [ ] On survey submit, `POST` the SP-formatted JSON to a Power Automate HTTP trigger
- [ ] Fallback to localStorage if webhook URL is not set
- [ ] Add submission status UI (loading spinner, success, error)

### Stage 3 — Email Notifications
- [ ] PS team notification email (via Power Automate, triggered by SP list item creation)
- [ ] Guest confirmation email — bilingual (FR/EN based on `lang`)
- [ ] Email body should include: GuestName, Initials, Style1/2, Brands, SizingValue, Purpose

### Stage 4 — Dashboard (Power BI light)
- [ ] Simple analytics page: total completions, drop-off by step, top styles, top brands
- [ ] Chart: completions over time (bar)
- [ ] Chart: style archetype distribution (donut)
- [ ] All charts client-side from localStorage data (no backend needed for demo)

### Stage 5 — Style Visual Cards
- [ ] Add lifestyle imagery to Q12 style cards (as per Louise's design mockup)
- [ ] Photos overlaid with style name text (semi-transparent gradient overlay)
- [ ] Images served from `/public/images/` — one per style archetype

### Stage 6 — Settings Live Edit
- [ ] Make style archetypes, brands, categories, and purpose options fully editable in Settings
- [ ] Changes persist in localStorage and reflect immediately in the survey
- [ ] Export settings as JSON / import settings from JSON

### Stage 7 — Multi-hotel Support
- [ ] Allow creation of multiple survey configurations (one per hotel partner)
- [ ] Each config: hotel name, logo URL, brand palette override, custom questions
- [ ] Survey URL includes hotel slug: `/survey/peninsula-paris`

---

## Local Setup (new machine)

```bash
# 1. Unzip the project
unzip lvv-survey.zip
cd lvv-survey   # or cd home/claude/lvv-survey depending on zip structure

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build

# 5. Deploy to Vercel
npm install -g vercel
vercel deploy ./dist --prod
```

---

## Key Decisions & Conventions

- **No CSS framework** — all styles are inline React style objects using CSS variables. Do not introduce Tailwind, MUI, or any other CSS lib without asking.
- **No backend** — this is intentionally a zero-infrastructure frontend. Integrations go through Power Automate webhooks or Graph API client-side calls with MSAL.
- **Font loading** — fonts are served from `/public/fonts/` as static assets. Do not replace with Google Fonts or CDN fonts.
- **Bilingual** — every user-facing string must support EN and FR via the `t(lang, en, fr)` helper pattern already used throughout.
- **No em dashes** — use simple hyphens or colons in all copy.
- **Component pattern** — all reusable UI primitives live in `src/components.jsx`. Add new primitives there, not inline in page files.
- **Data pattern** — all content data (options, labels, brand lists) lives in `src/data.js`. Never hardcode options inside components.

---

## Owner

**Nacim Laroui** — IT Operations Manager, La Vallée Village  
GitHub: `laroui`  
Project: LVV Partnerships Tools  
Stack context: this developer also maintains Gamers Hub (React/Vite + Express + Neon), CrossWord App (Flutter), and Project Nova (Unity 6).

---

*Last updated: Session 1 — fonts integrated (Aimé + Brown Std), 14-step survey complete, responses back-office complete, Vercel deploy ready.*
