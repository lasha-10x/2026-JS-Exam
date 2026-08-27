# 10X CRM

**Student Name:** Ana Altunashvili  
**Repository:** 10x-crm-Ana-Altunashvili 
**Live Demo:** [https://10-x-crm-ana-altunashvili-exam.vercel.app]

A small client-relationship-management tool built as a JavaScript exam project. Sign up, log in, and manage a pipeline of clients — track their status (Lead → Contacted → Won/Lost), deal value, and notes, with a dashboard summarizing the whole pipeline at a glance.

## Features

**Authentication**
- Sign up and log in, with per-field validation (all errors shown at once, not one at a time)
- Session persisted in `localStorage`, protected pages redirect to login if there's no session
- Dark/light theme toggle, persisted across visits

**Dashboard**
- Live greeting with the logged-in user's name and a live clock
- Four stat cards: Total Clients, Active Deals, Won Revenue, New This Week
- Pipeline Overview: a proportional bar + legend showing how clients are distributed across the four statuses
- Recent Clients: the 5 most recently added

**Clients**
- Loads 30 starter clients from a public API on first visit, then works entirely from `localStorage`
- Add a client (with validation) / delete a client, both synced to the API
- Change a client's status directly from their card
- Search by name/company, filter by status, sort by name/deal value/date — all combinable
- Click a card for full details: notes log + a "remind me in 1 minute" follow-up toast

**Profile**
- Edit name/company, change password, and a "Reset CRM Data" option that restores the original 30 clients

## Tech stack

Vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Data lives in the browser's `localStorage`; the client list is seeded from [DummyJSON](https://dummyjson.com)'s public `/users` endpoint.

## Project structure

```
10x-crm/
├── index.html          # Login page (P2)
├── signup.html         # Sign Up page (P1)
├── dashboard.html      # Dashboard page (P3)
├── clients.html        # Clients management page (P4)
├── profile.html        # Profile & settings page (P5)
├── css/
│   └── style.css       # Global design system, theme variables, and components
├── js/
│   ├── storage.js      # Wrapper for localStorage interactions
│   ├── guard.js        # Auth Guard & session route protection
│   ├── validation.js    # Shared form field validation helpers
│   ├── ui.js           # Shared UI components (avatars, badges, currency formatting)
│   ├── nav.js          # Shared sidebar navigation, active state, theme, logout
│   ├── toast.js        # Notification toast engine
│   ├── data.js         # API fetch calls & data transformer
│   ├── auth.js         # Auth logic for Sign Up and Login
│   ├── clients.js      # Client page logic (CRUD, search, filters, modal notes)
│   ├── dashboard.js    # Dashboard stat calculations & clock
│   └── profile.js      # Profile update, password change, and reset logic
├── ai-log.md           # AI Usage Log (Module: Use of Artificial Intelligence)
├── glossary.md         # Technical English Glossary (Module: Technical English)
└── research-note.md    # Technical Research Note (Module: Technical English)
```

## How to run locally

This project has no dependencies and no build step. Because the Dashboard and Clients pages call `fetch()`, some browsers block that when a page is opened directly from disk (`file://`), so the simplest reliable way to run it is a tiny local server from the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

(Any static server works — VS Code's "Live Server" extension, `npx serve`, etc.)

## Trying it out

There's no shared backend, so there's no single pre-made test account — every browser's `localStorage` starts empty. Sign up with any name/email/password to create an account, then explore from there.

## Live demo

_[https://10-x-crm-ana-altunashvili-exam.vercel.app]_


## Security notes (by design, for a learning project)

- Passwords are stored in plain text in `localStorage`. This is **not** how a real product would work — passwords should be hashed and verified on a server, never readable client-side. It's only acceptable here because there is no backend.
- The login error message ("Invalid email or password") is intentionally generic — it never reveals whether the email exists or the password was wrong, which prevents an attacker from using the login form to discover which emails are registered.
- Deleting a manually-added client can return a `404` from the API, since DummyJSON never actually persisted it server-side. The client is still removed from local state regardless — see the comment in `js/data.js`.

## Credits & & AI Disclosure

Built with the assistance of Claude (Anthropic) — see `ai-log.md` for the prompt-by-prompt log of what was asked for, what was used as-is, and what was changed after review.
