# 10X CRM

A lightweight client relationship management tool for sales managers, built with vanilla HTML, CSS, and JavaScript — no frameworks, no backend.

## About

10X CRM helps a sales manager track every client through the pipeline: from a fresh lead, through contact and negotiation, to a won (or lost) deal. It replaces a messy spreadsheet with a single source of truth: a live dashboard, a searchable client list, notes and reminders per client, and a personal profile.

## Features

- **Authentication** — sign up, log in, session-based auth guard, logout. Sessions persist across page reloads.
- **Dashboard** — live greeting and clock, 4 key stats (total clients, active deals, won revenue, new this week), a pipeline overview bar + a canvas donut chart, and the 5 most recent clients.
- **Clients** — loads 30 clients from a public API on first visit, then everything lives in the browser. Search, filter by status, sort, add/edit (POST + PUT) delete (with a 5-second Undo), open a details modal with notes, a 1-minute follow-up reminder, and a call timer.
- **Profile** — edit name/company, change password, reset the local client database back to the original 30.
- **Dark / light theme**, saved and applied on every page.

## Bonus Features

- **Edit Client (PUT)** — the Edit button reuses the Add Client modal pre-filled, and saves via `PUT /users/{id}`, covering all four REST methods (GET/POST/PUT/DELETE) in one page.
- **Remember me + session expiry** — checked = 7-day session in `localStorage`; unchecked = session in `sessionStorage` (gone on tab close) with a 2-hour expiry either way.
- **Password strength meter** — live weak/medium/strong indicator while typing on Sign Up.
- **Debounced server search** — the search box waits 300ms after you stop typing, then both re-filters locally and calls `GET /users/search?q=...` to show a live "server search" match count.
- **Call timer** — Start/End Call stopwatch (mm:ss) in the client details modal; the duration is saved as a note automatically.
- **Kanban board** — a List/Board toggle on the Clients page; drag and drop a card between Lead/Contacted/Won/Lost columns to update its status.
- **Mini pipeline chart** — a hand-drawn `<canvas>` donut chart on the Dashboard, next to the ledger bar.
- **CSV export** — download the currently filtered/sorted client list as a `.csv` file.
- **Pagination ("Load More")** — the client list loads 10 at a time.
- **Keyboard shortcuts** — `/` focuses search, `N` opens Add Client, `B` toggles Board view, `Esc` closes any open modal.
- **Undo delete** — deleting a client shows a toast with an "Undo" button for 5 seconds before it's gone for good.
- Fully responsive down to mobile widths.

## Tech Stack

- HTML5, CSS3 (custom properties, no framework)
- Vanilla JavaScript (ES6+), no libraries
- [DummyJSON](https://dummyjson.com) as the mock REST API for the initial client list
- `localStorage` / `sessionStorage` for all persistence
- Fonts: Sora (display), Inter (body), IBM Plex Mono (data) via Google Fonts

## How to Run

1. Clone this repository.
2. Open `index.html` directly in a browser, or serve the folder with any static server (e.g. `npx serve .`).
3. No build step, no `npm install`, no environment variables required.

## Live Demo

https://10x-crm-guram-abramishvili.netlify.app/

## Test Account

Register your own account on the Sign Up page — there is no seeded account, since all user data lives in your browser's `localStorage`. Alternatively, use:

- Email: `demo@test.com`
- Password: `demo1234`

(create it once on the Sign Up page before logging in with it.)

## Credits

Built solo as an individual exam project. AI tools (Claude) were used throughout the build process — see `ai-log.md` for the full log of prompts, what was kept, changed, or rejected.
