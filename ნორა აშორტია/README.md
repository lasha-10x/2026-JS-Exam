# 10x-crm-nora-ashortia

# 10x CRM

A lightweight, front-end-only CRM built with plain HTML, CSS and JavaScript — no build step, no framework. Data is stored in the browser's `localStorage`, and a small mock API layer (`js/api.js`) simulates real network calls (loading delays, promises, error handling) so the app behaves the way it would against a real backend.

## Features

- **Sign up** — Client-side validation (valid email, 6+ character password) with specific error messages and toast feedback.
- **Login** — Validates credentials against stored accounts; incorrect email/password shows an "Invalid email or password" error.
- **Auth Guard** — Protected pages (`dashboard.html`, `clients.html`, `profile.html`) call `requireAuth()` before rendering. Unauthenticated users are redirected to `login.html`. `Log out` clears the session.
- **Dashboard** — Includes a live clock (`liveClock`), personalized welcome message, 4 dynamic stats (Total Clients, Active Clients, Revenue, Recent Activity), interactive pipeline, and flicker-free DOM rendering.
- **Clients Management**:
    - Mock API integration with loading states and `try/catch` error handling (with Retry options).
    - Clean table layout for client records with status badges.
    - Client details modal, dated notes, and native `setTimeout` reminder notifications.
    - Form validation for adding clients and confirmation prompts before deletion (`DELETE`-style call).
- **Profile** — Edit profile details, update password (invalidates old credentials), and option to reset application data.
- **Theme Toggle** — Persistent light/dark mode driven by CSS custom variables (`--cream`, `--panel`, `--ink`, `--line`).

## Project Structure

````10x-crm
├── index.html # redirects to dashboard or login based on session
├── signup.html # user registration page
├── login.html # user login page
├── dashboard.html # main metrics and activity board
├── clients.html # client management, search, and sorting
├── profile.html # user profile and settings
├── css/
│ └── style.css # global design tokens, dynamic theme variables & component styles
└── js/
├── ui.js # toast notifications, modals & UI helpers
├── theme.js # dark/light theme toggle controller
├── auth.js # user registration, authentication guard, session management
├── api.js # mock API layer, error handling & localStorage fallback sync
├── clients.js # CRUD actions, search, filtering, and client modal logic
├── dashboard.js # live clock, metrics calculation, recent activity feed
└── profile.js # profile management, password changes, data reset```

````

## Storage Keys

| Key           | Shape                                    | Purpose                      |
| ------------- | ---------------------------------------- | ---------------------------- |
| `crm_users`   | `[{ name, email, password }]`            | Accounts created via sign up |
| `crm_session` | `{ name, email, loggedInAt }`            | The currently logged-in user |
| `crm_clients` | `[{ id, name, company, value, status }]` | Client records               |
| `crm_theme`   | `"light"` \| `"dark"`                    | UI theme preference          |

## Running the Project

No build tools or installation required. Open `index.html` directly in any web browser, or serve the directory using a static local server:

```bash
npx serve .

```
