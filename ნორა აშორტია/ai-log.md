# AI Development Log

A log of the AI collaboration sessions used to build this project.

---

### Entry 1 — Project Scaffolding & Design System

Set up the base file structure (`css/`, `js/`) and established a clean, modern design system in `css/style.css`. Defined global CSS custom variables for themes, layout utilities, typography, and reusable component styles across all pages.

### Entry 2 — Authentication & Session Logic

Implemented core authentication flows in `js/auth.js`. Added client-side form validation for registration, user account storage (`crm_users`), credential verification on login, and active session tracking (`crm_session`) with proper error feedback.

### Entry 3 — Route Protection & Auth Guard

Added the `requireAuth()` route guard function to protect internal pages (`dashboard.html`, `clients.html`, `profile.html`). Unauthenticated visitors are automatically redirected to `login.html`. Implemented logout functionality to destroy the active session.

### Entry 4 — Mock API & Client CRUD Operations

Created `js/api.js` to simulate an asynchronous backend with network delays, Promise handling, and error management (`try/catch`). Built client management logic in `js/clients.js` including list rendering, add-client validation, and deletion confirmation.

### Entry 5 — Dynamic Dashboard, Polish & Documentation

Integrated dynamic metrics, live clock, and pipeline stats on the dashboard. Implemented persistent dark/light theme switching (`crm_theme`), fixed state persistence bugs, and completed project documentation (`README.md`, `glossary.md`, `research-note.md`).
