# 10X CRM

## About

10X CRM is a simplified client relationship management tool built for the JavaScript module exam. It lets a sales manager sign up, log in, browse and manage a list of clients (add, delete, change status, add notes), and see a quick overview of their pipeline on a dashboard. It is built with plain HTML, CSS and vanilla JavaScript, with all data stored in the browser's localStorage and an initial client list loaded from the DummyJSON API.

## Features

- Sign up and log in with form validation (no backend, users are stored in localStorage)
- Auth guard: protected pages redirect to login if nobody is logged in
- Dashboard with a live clock, 4 key stats, a pipeline overview, and the 5 most recent clients
- Clients page: load clients from an API, add a new client (POST), delete a client (DELETE), change status inline, search, filter by status, and sort
- Client details modal with notes history and a 1-minute follow-up reminder
- Profile page: edit name/company, change password, reset local client data
- Dark / light theme toggle, saved between visits
- Toast notifications instead of `alert()`

## Tech Stack

- HTML5, CSS3 (custom properties for theming)
- Vanilla JavaScript (ES6+, `async`/`await`, `fetch`)
- [DummyJSON](https://dummyjson.com/) as a mock REST API for clients
- localStorage for persistence
- Deployed on Vercel / Netlify (no build step needed)

## How to Run

This project has no build step and no dependencies.

1. Clone or download the repository.
2. Open `index.html` directly in a browser, **or** serve the folder with any static server, for example:
   ```
   npx serve .
   ```
3. Sign up for a new account (or use the test account below) and explore.

## Live Demo

`10x-crm-mate-morchadze-amgf.vercel.app`

## Test Account

You can either sign up for a new account, or (after your first deploy) create this test account manually through the Sign Up page so the evaluator doesn't need to register:

```
Email: demo@test.com
Password: demo1234
```

## Notes on Data

- All data lives in the browser's `localStorage` under 4 keys: `crm_users`, `crm_session`, `crm_clients`, `crm_theme`.
- Passwords are stored in plain text in localStorage. **This is only acceptable because this is a learning project with no real backend.** In a real product, passwords must be hashed and stored server-side — never on the client.
- The DummyJSON API does not actually persist POST/DELETE requests on its server; it only simulates a correct response. This project keeps the real "source of truth" in localStorage so the CRUD flow still works and survives a page reload.

## Credits

Built individually for the exam. AI tools (Claude) were used throughout for planning, writing, and debugging code — see `ai-log.md` for details of where and how.
