# 10X CRM

## About

10X CRM is a lightweight client relationship management app for sales managers. It keeps all your leads and deals in one place — with statuses, notes, follow-up reminders and a summary dashboard — instead of a chaotic Excel sheet.

## Features

- **Authentication** — sign up and log in with full form validation; session survives page reloads; auth guard protects internal pages
- **Dashboard** — personalized greeting, live clock, 4 stat cards (total clients, active deals, won revenue, new this week), pipeline overview and 5 most recent clients
- **Clients** — initial base of 30 clients loaded from the DummyJSON API; add (POST) and delete (DELETE) clients; change deal status; search, filter by status and sort — all combinable
- **Client details** — modal with full info, dated notes, and a "Remind me in 1 min" follow-up toast
- **Profile** — edit name/company, change password, reset CRM data
- **Dark / light theme** — persisted across pages and reloads
- **Toast notifications** — green for success, red for errors, auto-dismiss in 3 seconds

## Tech Stack

- HTML5, CSS3 (custom properties for theming), vanilla JavaScript (ES6+, async/await)
- [DummyJSON](https://dummyjson.com) as a fake REST API (GET / POST / DELETE)
- `localStorage` for persistence (`crm_users`, `crm_session`, `crm_clients`, `crm_theme`)
- No frameworks, no libraries, no build step


## Live Demo

[10-x-crm-seven.vercel.app](10-x-crm-seven.vercel.app)
