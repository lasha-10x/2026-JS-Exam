# 10X CRM

A simplified CRM (Customer Relationship Management) web app for a sales manager who needs to track leads through a pipeline — built with plain HTML, CSS, and JavaScript, no frameworks or build tooling.

## About

10X CRM lets a sales manager sign up, log in, and manage a client base: a dashboard summarizing pipeline health at a glance, a searchable/filterable/sortable client list backed by a real API, per-client notes and follow-up reminders, and a profile page for account settings. All data is persisted in the browser's `localStorage`; the initial 30 clients are seeded from the [DummyJSON](https://dummyjson.com) API.

## Features

- **Sign Up / Login** — full client-side form validation with exact required error messages; passwords are stored in `localStorage` (deliberately plain-text for this learning project — see the security note below).
- **Auth guard** — protected pages (Dashboard, Clients, Profile) redirect to Login when there's no active session; Login/Sign Up redirect straight to the Dashboard when there already is one.
- **Dashboard** — a live clock, four stat cards (Total Clients, Active Deals, Won Revenue, New This Week), a Pipeline Overview broken down by status, and the 5 most recently added clients.
- **Clients**
  - Loads 30 seed clients from the DummyJSON API on first visit, cached in `localStorage` after that (so a page reload never re-fetches).
  - Search by name/company, filter by pipeline status (`All` / `Lead` / `Contacted` / `Won` / `Lost`), and sort (Newest first / Name A–Z / Deal value) — all three combine together.
  - Add a client (`POST` to DummyJSON) with full validation, including a duplicate-email check.
  - Delete a client (`DELETE` to DummyJSON) with a confirmation prompt.
  - Change a client's pipeline status inline from a dropdown on their card.
  - Open a client's details for their full info, notes history, and a "Remind me in 1 min" follow-up toast.
  - Loading and error states (with a Retry button) around the initial API fetch.
- **Profile** — view account info, edit full name/company, change password (checked against the current password), and reset all client data back to a fresh 30 from the API (without touching the account or session).
- **Dark/light theme** toggle, persisted across visits and pages.
- **Toast notifications** for every create/update/delete action, auto-dismissing after 3 seconds.

## Tech Stack

- **Vanilla JavaScript** (ES modules — `import`/`export`, no bundler) — no frameworks or libraries, per project constraints.
- **HTML5 / CSS3** — one shared stylesheet using CSS custom properties for the dark/light theme.
- **[DummyJSON](https://dummyjson.com)** as the mock REST API for seed client data (`GET /users`, `POST /users/add`, `DELETE /users/{id}`).
- **Browser `localStorage`** for all persistence — no backend/server. Fixed keys: `crm_users`, `crm_session`, `crm_clients`, `crm_theme`.
- **[`node:test`](https://nodejs.org/api/test.html)** for unit tests of pure logic (no external test dependencies).

## How to Run

This is a static site — no build step. Because it uses ES modules, open it through a local server rather than double-clicking the HTML file (some browsers block `fetch()`/module imports on `file://` URLs):

```bash
git clone https://github.com/Noahfisherrrr/10x-CRM.git
cd 10x-CRM
npx serve .
# then open the printed http://localhost:... URL
```

Any static server works (VS Code's "Live Server" extension, `python -m http.server`, etc.) — there's nothing to install or build.

To run the unit tests:

```bash
npm test
```

## Live Demo

_Add the deployed Vercel/Netlify URL here once the site is deployed._

## Test Account

The app seeds one working demo account automatically the first time it loads in a browser, so you can log in immediately without signing up:

| Field    | Value              |
| -------- | ------------------ |
| Email    | `arthur@gmail.com` |
| Password | `Arthur123`        |

You can also create your own account from the Sign Up page — full name (3+ characters), a valid email, and a password of at least 8 characters containing a letter and a number.

## Credits

Built with AI assistance (Claude) throughout — see [`ai-log.md`](ai-log.md) for specific prompts, what was used vs. rejected, and what was learned along the way.
