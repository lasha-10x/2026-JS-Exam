# 10X CRM

A simplified customer relationship management (CRM) tool built for sales managers to track leads, deals, and client communication. Built as a graded individual project for a JavaScript exam, using only Vanilla JavaScript, localStorage, and the DummyJSON API — no frameworks or libraries.

> **Status:** CORE requirements complete (authentication, auth guard, navigation, client list/add/delete). FULL requirements (Dashboard, Profile, search/filter/sort, client details & notes) are in progress.

## Features

**Done (CORE):**

- Sign Up with 6 validation rules (name, email format + uniqueness, password strength, confirm match)
- Login with secure, generic error messages (prevents user enumeration)
- Auth Guard — protected pages redirect unauthenticated users; public pages redirect logged-in users
- Shared navigation bar with active-page highlighting, Dark/Light theme toggle, and Logout
- Clients page: loads 30 real users from the DummyJSON API on first visit, persists to localStorage afterward
- Add Client (with validation) via `POST /users/add`
- Delete Client (with confirmation) via `DELETE /users/{id}`

**Planned (FULL):**

- Dashboard with live stats, pipeline overview, and recent clients
- Client search, status filters, and sorting
- Client detail modal with notes and follow-up reminders
- Profile page (edit info, change password, reset data)
- Centralized error handling with retry

## Tech Stack

- JavaScript (ES6+), no frameworks or libraries
- HTML5 / CSS3
- Browser `localStorage` for all persistence (no backend)
- [DummyJSON](https://dummyjson.com) — public REST API used as the initial client data source

## Project Structure

```
10x-crm/
├── index.html            # Login page
├── signup.html           # Sign Up page
├── dashboard.html        # Dashboard (protected)
├── clients.html          # Clients (protected)
├── profile.html          # Profile (protected)
├── css/
│   └── style.css
├── js/
│   ├── storage.js        # all localStorage access
│   ├── ui.js             # toasts, field-error helpers
│   ├── guard.js           # auth guard, redirects, logout
│   ├── nav.js             # shared nav bar + theme toggle
│   ├── auth.js            # sign up / login logic
│   ├── clients.js         # client loading, render, add, delete
│   ├── dashboard.js       # stats, pipeline overview, recent clients
│   └── profile.js         # edit profile, change password, reset data
├── ai-log.md
├── glossary.md
└── README.md
```

## How to Run

No build step or dependencies required.

1. Clone this repository
2. Open `signup.html` (or `index.html` if you already have an account) directly in a browser

   OR, for the most reliable experience (recommended, since some browsers restrict `fetch`/localStorage on the `file://` protocol):

   ```bash
   npx serve .
   ```

   then open the printed local URL.

## Live Demo

(https://10x-crm-nodar-pirveli.vercel.app/)

## Test Account

This app has no shared backend — all accounts live only in your own browser's localStorage. There is no pre-existing account to log into.

**To try it:** open `signup.html` and register a new account with any email/password (password needs 8+ characters, at least one letter and one number). Client data loads automatically from a public API the first time you visit the Clients page.

## Credits

Built with the assistance of Claude.
