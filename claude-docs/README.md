# LVV Survey — Claude Docs

This folder contains all batch instruction files for Claude Code.
Each batch is a self-contained `.md` file that Claude Code executes in one session.

## Methodology

- One `.md` file = one Claude Code session = one Git commit
- Batches are numbered: `BATCH-01`, `BATCH-02`, etc.
- Each batch has a clear scope, file list, and acceptance criteria
- Commit message format: `feat(BATCH-XX): short description`

## Roadmap

| Batch | Scope | Status |
|-------|-------|--------|
| BATCH-01 | Project cleanup + backend scaffold (Node/Express + Neon/PG) | 🔜 Ready |
| BATCH-02 | Auth — email/password + JWT + protected routes | 🔜 Ready |
| BATCH-03 | Form Builder — create/edit/delete form templates | 🔜 Ready |
| BATCH-04 | Unique URL per form + public guest-facing survey page | 🔜 Ready |
| BATCH-05 | Style photos in survey (Q12a/Q12b visual cards like Louise's design) | 🔜 Ready |
| BATCH-06 | Responses dashboard — per-form analytics + export CSV/JSON | 🔜 Ready |
| BATCH-07 | Hotel/Partner management — Peninsula as first partner | 🔜 Ready |
| BATCH-08 | Power Automate webhook — SharePoint list injection on submit | 🔜 Ready |

## Architecture Decision

**Frontend:** React + Vite (already built)
**Backend:** Node.js + Express (new — Railway deploy)
**Database:** Neon PostgreSQL (already used in Gamers Hub)
**Auth:** JWT + bcrypt (email/password, no OAuth for now)
**Hosting:** Vercel (frontend) + Railway (backend)
**Fonts:** Aimé (display) + Brown Std (body) — embedded in /public/fonts/

## Key Design Principles

- Each form generates a **unique UUID-based URL**: `/f/{uuid}`
- Forms are tied to a **partner** (e.g. Peninsula Paris)
- The **partnership team** logs in, creates/customises forms, shares the URL
- Guests fill the form — data goes to the DB + optional SP webhook
- Louise's **visual style preset** is the default theme

## Roadmap (updated)

| Batch | Scope | Status |
|-------|-------|--------|
| BATCH-01 | Backend scaffold — Node/Express + Neon/PG + monorepo | ✅ Done |
| BATCH-02 | Auth — email/password + JWT + protected routes | ✅ Done |
| BATCH-03 | Form builder — create/edit/delete templates | ✅ Done |
| BATCH-04 | Unique URL /f/:token + public guest survey page | ✅ Done |
| BATCH-05 | Style photo cards (Louise's visual design) | ✅ Done |
| BATCH-06 | Responses dashboard — analytics + export | ✅ Done |
| BATCH-07 | Partner management — Peninsula as first partner | ✅ Done |
| BATCH-08 | Power Automate webhook → SharePoint (backlog) | ⏸ Paused |
| BATCH-09 | Multilingual — Spanish + Arabic, RTL support | 🔜 Next |
| BATCH-10 | Visual polish — parallax, glassmorphism, animations | 🔜 Next |

## How to Use With Claude Code

1. Open Claude Code in the project root
2. Start every session: drag `claude-docs/CONTEXT.md` + the target `BATCH-XX.md`
3. Say: "Read these files and execute the batch"
4. Claude Code implements → you review → commit with exact message from batch file
5. Push → Vercel/Railway auto-deploy

## Key Notes
- BATCH-09 and BATCH-10 are independent — can run in parallel or either order
- BATCH-09 adds `translations.js` — make sure all SurveyForm.jsx `t()` calls are migrated
- BATCH-10 animations must respect `prefers-reduced-motion`
- Arabic (AR) requires `dir="rtl"` on the survey wrapper — test thoroughly on mobile
