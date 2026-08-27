# 10X CRM

A lightweight client-relationship-management app for sales managers. Register and
log in, then manage a base of clients — add, delete, search, filter, sort, track
deal status, write notes, and set follow-up reminders. All data is stored in the
browser, with the initial client base loaded from a public API.

Built as a front-end-only project (no backend) for the JavaScript module final exam.

## 🌐 Live Demo

**https://10x-crm-mariam-grigolia.vercel.app/**

## 🔑 Test Account

Because the app has no backend, accounts are stored in your browser's localStorage
— so they don't transfer between devices or browsers. **Please register your own
account on first visit** (takes 10 seconds), or register this one and reuse it:

- **Email:** demo1@test.com
- **Password:** demo1234

## ✨ Features

**Authentication**
- Sign up with full validation (6 rules, exact error messages)
- Log in with a deliberately generic error (prevents user enumeration)
- Auth guard: protected pages redirect to login when there's no session
- Logout clears only the session — accounts and data are kept

**Clients** (the core of the app)
- Loads 30 clients from the DummyJSON API on first visit, then caches them in localStorage
- Add a client (validated form + `POST`) and delete one (confirm + `DELETE`)
- Live search by name, company, or email
- Filter chips by status and a sort dropdown (newest / name / deal value)
- Change a client's deal status right on the card
- Client details modal with timestamped notes and a 1-minute follow-up reminder

**Dashboard**
- Personalized greeting and a live clock
- 4 stat cards (total clients, active deals, won revenue, new this week)
- Pipeline overview and a "recent 5 clients" list

**Profile**
- Edit name and company, change password, and reset the client data
- Avatar with the user's initials

**UI / UX**
- Dark / light theme toggle that persists across pages and reloads
- Toast notifications (no `alert()`), red inline field errors
- Fully responsive with a slide-in hamburger menu on mobile
- Letter-by-letter title animation and a floating profile illustration

## 🛠 Tech Stack

- **HTML5** — semantic, accessible markup
- **SCSS** — design tokens, dark/light theming with CSS custom properties, BEM naming
- **Vanilla JavaScript (ES Modules)** — no frameworks or libraries
- **DummyJSON API** — initial client data via `fetch` + `async/await` (GET / POST / DELETE)
- **localStorage** — persistence for users, session, clients, and theme
- **Vercel** — deployment

## 🚀 How to Run Locally

The project uses ES modules, so it must be served over HTTP (not opened as a
`file://` path).

1. Clone the repository:
   ```bash
   git clone https://github.com/Mariam3120/10x-crm-Mariam-Grigolia.git


## Project Structure

├── index.html        # Login
├── signup.html       # Sign up
├── dashboard.html    # Dashboard (protected)
├── clients.html      # Clients (protected)
├── profile.html      # Profile (protected)
├── css/              # Compiled CSS
├── scss/             # Source styles (abstracts, base, components, layout, pages)
├── js/               # storage, guard, theme, nav, ui, validators, data + one file per page
├── ai-log.md         # AI usage log
├── glossary.md       # Technical terms
└── research-note.md  # Research source summary


🙏 Credits
Built by Mariam Grigolia.
AI assistance: Claude — see ai-log.md for how AI was used.