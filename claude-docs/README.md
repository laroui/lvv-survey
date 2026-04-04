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
