# 10X CRM

### About
10X CRM is a simplified customer relationship management tool for sales managers. A user can sign up, log in, track a client base end-to-end (add, delete, filter, search, sort, notes, follow-up reminders), see a live dashboard of their pipeline, and manage their own profile — all with data persisted in the browser via `localStorage`. Built as a vanilla JavaScript exam project — no frameworks, no libraries.

### Features
- **Sign Up** with 6 validation rules (name length, email format/uniqueness, password strength, password match), exact error messages, and a success toast before redirecting to Login.
- **Login** with session persistence (reload-safe) and a generic "Invalid email or password" message on failure (never reveals which part was wrong).
- **Auth Guard**: protected pages (`dashboard`, `clients`, `profile`) redirect to Login when logged out; public pages (`index`, `signup`) redirect to Dashboard when already logged in.
- **Dashboard**: personalized greeting, live clock, 4 live stat cards (Total Clients, Active Deals, Won Revenue, New This Week), Pipeline Overview by status, and the 5 most recently added clients.
- **Clients**: loads 30 clients from the DummyJSON API on first visit, then persists to `localStorage`. Search by name/company, filter by status chip, sort (newest / name / deal value) — all combinable without mutating the underlying data. Add Client (validated, `POST`), Delete (confirmation + `DELETE`), inline status change, client-details modal with notes history and a 1-minute follow-up reminder toast.
- **Profile**: edit name/company, change password (old password verified, new password can't match the old one), and Reset CRM Data (reloads the client list from the API without touching the account).
- Dark/light theme toggle, shared and persisted across all pages (default: dark).
- Toast notifications and inline field errors everywhere — no `alert()` (except the allowed `confirm()` for destructive actions).
- Loading state + error/Retry UI if the DummyJSON API is unreachable.

### Tech Stack
- HTML5, CSS3 (custom properties for theming)
- Vanilla JavaScript (ES6+): `fetch`, `async/await`, `localStorage`, DOM APIs
- [DummyJSON](https://dummyjson.com) as a mock REST API

### How to Run
1. Clone the repo.
2. Open `index.html` directly in a browser, or serve the folder with any static server (e.g. VS Code "Live Server").
3. No build step, no dependencies.


### Project Structure
```
10x-crm/
├── index.html          # Login (P2)
├── signup.html         # Sign Up (P1)
├── dashboard.html       # Dashboard (P3)
├── clients.html         # Clients (P4)
├── profile.html         # Profile (P5)
├── css/
│   └── style.css
├── js/
│   ├── storage.js       # localStorage helpers (single source of truth for keys)
│   ├── guard.js         # auth guard (P0.1)
│   ├── ui.js            # toast, field-error helpers, and theme (P0.3 / P0.4)
│   ├── nav.js           # shared nav active-state + logout (P0.2)
│   ├── data.js           # shared client-loading logic used by Dashboard and Clients (P3.5)
│   ├── signup.js
│   ├── login.js
│   ├── dashboard.js
│   ├── clients.js
│   └── profile.js
├── ai-log.md
├── glossary.md
├── research-note.md
└── README.md
```

### Live Demo
🌐 Domain:  https://nodo991-10x-crm.vercel.app/

### Suggested test values:

* Email: test@test.com  
* Password: test1234

### Notes on the localStorage password (security)
Storing plaintext passwords in `localStorage` is unacceptable in a real product — passwords belong on a server, hashed. This project does it only because it's a backend-free learning exercise.

### Credits
AI tools were used for planning, code review, UI/UX discussion, debugging, and organizing documentation. However, the overall understanding, final project decisions, and exam explanations remain entirely my responsibility.

Developed by Nodari Kiknadze for the "10X CRM" exam project.


