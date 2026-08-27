# 10X CRM

A browser-based Customer Relationship Management application built with vanilla JavaScript, HTML, and Sass/SCSS. This educational project demonstrates a complete frontend workflow including authentication, client management, dashboard statistics, and theme preferences—all stored locally in the browser.

---

## Project Overview

10X CRM is a frontend-only CRM application designed for educational purposes. It implements a full user workflow—from account registration to client management—without any backend infrastructure. All data is persisted in the browser using `localStorage`.

> **Note:** This is a learning project. Passwords are stored in plaintext because this project has no backend. **Never** store passwords in plaintext in a production application.

---

## Core Features

- **User Authentication**
  - Account registration with form validation
  - Login with email and password verification
  - Session persistence across page reloads
  - Secure logout functionality

- **Client Management**
  - Create, view, and delete clients
  - Status tracking (Lead, Contacted, Won, Lost)
  - Search and filter by status
  - Sort by name, deal value, or creation date
  - CSV export of visible clients

- **Dashboard**
  - Pipeline statistics by status
  - Recent clients preview
  - Live clock display

- **Profile Management**
  - Edit full name and company
  - Change password with validation
  - Reset all client data

- **Theme System**
  - Light and dark mode toggle
  - Theme preference saved between sessions

---

## Bonus Features

- **Edit Client** — Modify existing client details including name, email, phone, company, image URL, deal value, and status
- **Next Follow-up Date** — Set and track follow-up appointments for each client
- **CSV Export** — Export filtered client data to a CSV file for sharing
- **Image URL Avatars** — Use custom avatar images via URL
- **Deterministic Fallback Avatars** — Generate consistent gradient avatars from client name and email when no image is provided

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup and accessibility |
| Vanilla JavaScript | Application logic and DOM manipulation |
| Sass/SCSS | Styling with variables and nesting |
| localStorage | Client-side data persistence |
| Fetch API | HTTP requests to DummyJSON |
| DummyJSON | Mock API for client data |

**No external dependencies:** This project uses no frameworks, libraries, or build tools beyond Sass.

---

## Architecture & File Structure

```
.
├── index.html          # Landing page / login
├── dashboard.html      # Main dashboard with statistics
├── clients.html        # Client list and management
├── profile.html        # User profile and settings
├── signup.html         # Registration page
├── css/
│   └── style.css       # Compiled CSS
├── js/
│   ├── core/
│   │   ├── auth.js           # User authentication logic
│   │   ├── constants.js      # Storage keys and theme constants
│   │   ├── guard.js          # Session protection
│   │   ├── modal.js          # Modal dialog controller
│   │   ├── notifications.js  # Toast notifications
│   │   ├── navigation.js     # Sidebar navigation
│   │   ├── storage.js        # localStorage utilities
│   │   └── theme.js          # Theme management
│   ├── data/
│   │   └── clients-repository.js # Client data layer
│   └── pages/
│       ├── dashboard.js
│       ├── profile.js
│       └── clients.js
├── scss/
│   ├── style.scss        # Main entry point
│   ├── _app-shell.scss
│   ├── _app-layout.scss
│   ├── _auth.scss
│   ├── _base.scss
│   ├── _tokens.scss
│   ├── _dashboard.scss
│   ├── _clients.scss
│   └── _profile.scss
└── assets/
    └── logo.svg
```

---

## localStorage Keys

| Key | Purpose | Data Type |
|-----|---------|-----------|
| `crm_users` | Registered user accounts | JSON array of user objects |
| `crm_session` | Active user session | JSON object with userId, email, loginAt |
| `crm_clients` | Client records | JSON array of client objects |
| `crm_theme` | Current theme preference | String: "light" or "dark" |

---

## API Usage with DummyJSON

This project uses [DummyJSON](https://dummyjson.com/) as a mock API:

- **GET** `/users?limit=30` — Fetches initial client seed data
- **POST** `/users/add` — Creates new client records
- **DELETE** `/users/{id}` — Removes client records

Client data is mapped from DummyJSON user objects to the local `Client` model structure.

---

## How to Run Locally

1. Install [Node.js](https://nodejs.org/) (includes npm)
2. Clone this repository
3. Install dependencies:

   ```bash
   npm install
   ```

4. Compile the Sass stylesheets:

   ```bash
   npm run sass:build
   ```

5. Start a local static server:

   ```bash
   python -m http.server 8000
   ```

   Or use any static file server (e.g., `npx serve`).

6. Open `http://localhost:8000` in your browser.

> **First-time users:** An internet connection is required to load initial client data from DummyJSON.

### Sass Development Mode

For active styling work, run:

```bash
npm run sass:watch
```

This automatically rebuilds `css/style.css` whenever SCSS files change.

---

## Live Demo

Live demo URL: **https://10x-crm-project-six.vercel.app/**

---

## Test / Demo Flow

1. Navigate to `signup.html`
2. Register a new account (email + password)
3. Log in with the same credentials
4. Use the dashboard to view statistics
5. Navigate to Clients to add, edit, or delete records
6. Try the CSV export feature
7. Visit Profile to edit your information
8. Test theme switching and session persistence

---

## Security Note

**This project stores passwords in plaintext in localStorage.** This is intentional for educational purposes only and demonstrates why backend authentication with password hashing is essential in real applications.

**Never** use this approach in production. A secure system would:
- Hash passwords with a strong algorithm (bcrypt, Argon2)
- Store only password hashes on a trusted server
- Implement proper session tokens (JWT, session cookies)
- Use HTTPS for all communications

---

## Credits

- **Created by:** [Artyush23](https://github.com/Artyush23) — Educational 10X CRM exam project
- **Mock API:** [DummyJSON](https://dummyjson.com/) for client seed data
- **Documentation:** [MDN Web Docs](https://developer.mozilla.org/)
- **Inspiration:** [Twenty CRM](https://twenty.com/) (visual reference only)

---

## License

This project is for educational purposes. Feel free to use it as a learning resource.
