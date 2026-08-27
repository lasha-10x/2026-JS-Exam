# 10X CRM

A lightweight Client Relationship Management (CRM) web application built for sales managers. Track clients, manage deal pipeline stages, add notes, and view dashboard statistics — all in the browser with no backend required.

## Features

- **Authentication** — Sign up, log in, session persistence, auth guard on protected pages
- **Dashboard** — Live clock, 4 stat cards, pipeline overview, 5 most recent clients
- **Clients** — Load from DummyJSON API, search/filter/sort, add (POST), delete (DELETE), status change, notes, follow-up reminders
- **Profile** — Edit name/company, change password, reset client data
- **Theme** — Dark/Light mode saved in localStorage
- **Persistence** — All data survives page reload via localStorage

## Tech Stack

- HTML5
- SCSS (compiled to CSS)
- Vanilla JavaScript (ES6+)
- [DummyJSON API](https://dummyjson.com) for client data
- localStorage for users, session, clients, and theme

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/TarAndr/AnTar-CRM.git
   cd AnTar-CRM
   ```

2. Install dependencies (for SCSS compilation):
   ```bash
   npm install
   ```

3. Compile styles:
   ```bash
   npm run sass
   ```
   Or watch for changes:
   ```bash
   npm run sass:watch
   ```

4. Open the project with a local server (e.g. VS Code Live Server) and navigate to `index.html`.

## Live Demo

[AnTar-CRM](https://antar-crm.vercel.app/)

## Test Account

Register a new account via `signup.html`, or use credentials you created during development.

Example after registration:
- **Email:** demo@test.com
- **Password:** demo1234

## Project Structure

```
├── index.html          Login page
├── signup.html         Registration
├── dashboard.html      Dashboard (protected)
├── clients.html        Clients CRUD (protected)
├── profile.html        User profile (protected)
├── css/main.css        Compiled styles
├── scss/               SCSS source files
└── js/
    ├── storage.js      localStorage layer
    ├── guard.js        Auth guard
    ├── auth.js         Login & signup
    ├── data.js         API + client state
    ├── navigation.js   Sidebar, theme, logout
    ├── clients.js      Clients page logic
    ├── dashboard.js    Dashboard logic
    └── profile.js      Profile logic
```

## Credits

- Project built as part of the 10X Academy JavaScript exam.
- Client seed data from [DummyJSON](https://dummyjson.com/docs/users).
- AI assistance used during development — see `ai-log.md`.
