# 10X CRM

A customer relationship management app for sales managers, built as the final project for the JavaScript module.

## About

10X CRM gives a sales manager one place to track every potential client: a shared client base loaded from an API, deal statuses across the pipeline (Lead → Contacted → Won / Lost), notes on every relationship, follow-up reminders, and a summary dashboard. Everything persists in the browser via localStorage — no backend required.

## Features

- **Authentication** — sign up and log in with full client-side validation; session survives page reloads; auth guard protects internal pages and redirects logged-in users away from public ones
- **Dashboard** — personalized greeting, live clock, 4 key stats (Total Clients, Active Deals, Won Revenue, New This Week), pipeline overview, and the 5 most recent clients
- **Clients** — initial base of 30 clients loaded from DummyJSON (GET), add clients via a validated modal (POST), delete with confirmation (DELETE), change deal status inline, and combine search + status filter + sort freely
- **Client details** — modal with full info, dated notes history, and a "Remind me in 1 min" follow-up reminder that fires even after the modal closes
- **Profile** — edit name/company, change password, and reset the CRM database back to the initial API data
- **Dark / light theme** — persisted across pages and reloads
- **Toast notifications** — green for success, red for errors, auto-dismiss in 3 s

## Tech Stack

- Vanilla JavaScript (ES6+) — no frameworks, no libraries
- HTML5, CSS3 (custom properties for theming)
- DummyJSON REST API (`GET /users`, `POST /users/add`, `DELETE /users/{id}`)
- localStorage for persistence (`crm_users`, `crm_session`, `crm_clients`, `crm_theme`)

## How to Run

1. Clone the repository:
   ```
   https://github.com/Katherin3/10x-CRM-Eka-Gadakhabadze.git
   ```
2. Open the folder and start any static server (or just open `index.html` in a browser):
   ```
   
   ```
3. Sign up with a new account, then log in — you land on the dashboard.

No build step, no dependencies.

## Live Demo

https://10x-crm-eka-gadakhabadze.vercel.app/

## Test Account

Register once and reuse, or use:

- **Email:** eka@test.ge
- **Password:** Pass123#

*(Note: accounts live in your browser's localStorage, so the test account must be registered once in each browser.)*

## Security Note

Passwords are stored in plain text in localStorage **only because this is a study project with no backend**. In a real product passwords are stored server-side, hashed (e.g. bcrypt), and never reach client storage.

## Credits

- Seed data: [DummyJSON](https://dummyjson.com)
- Created by Claude Code
