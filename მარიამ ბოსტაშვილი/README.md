# 10X CRM

A browser-based customer relationship management (CRM) application built with
vanilla JavaScript. It provides a focused workspace for registering, managing,
and tracking sales clients, monitoring key metrics on a dashboard, and
maintaining a user profile. Core CRM data stays browser-based, while optional
Jira and Asana connections run through serverless API proxies.

## About

10X CRM is an educational frontend project built around a practical sales
workflow. It combines authentication, client management, dashboard analytics,
notes, reminders, and Jira/Asana task integrations in a multi-page experience.
Data is persisted in the browser with the Web Storage API, and initial client
records are loaded from the DummyJSON test API.

## Live Demo

[View the live application on Vercel](https://10x-crm-mariami-bostashvili.vercel.app/)

## Features

### Authentication

- User registration with field-level validation (name, email, company,
  password, confirm password)
- Email/password sign-in with a generic "invalid credentials" message
- Persistent session stored in `localStorage`
- Auth guard that protects the dashboard, clients, and profile pages
- Sign-out that clears only the session

### Client Management

- Load 30 initial clients from the DummyJSON API on first visit, then persist
  them locally
- Render clients as cards built dynamically in JavaScript
- Add a new client through a validated modal (`POST /users/add`)
- Delete a client with confirmation (`DELETE /users/{id}`)
- Change a client's status (Lead / Contacted / Won / Lost) inline
- Search by name, company, email, or phone
- Filter by status chips and sort by newest, name, or deal value — all
  combined non-destructively through a single `getVisibleClients()` function
- Client detail modal with notes and a 1-minute follow-up reminder
- Loading, empty, and error states with a Retry button

### Import and Export

- Import clients from `.xlsx`, `.xls`, and `.csv` files (parsed with SheetJS,
  loaded on demand)
- Read records from every worksheet; skip invalid rows and duplicate emails
- Validate file size (max 2 MB) and row count (max 5,000)
- Export the client list as a UTF-8 CSV file, protected against
  spreadsheet-formula injection

### Dashboard

- Personalized greeting and a live clock that updates every second
- Four summary cards: Total Clients, Active Deals, Won Revenue, New This Week
- Pipeline overview with a per-status breakdown
- Recent Clients list (the five most recently added)

### Jira and Asana Integrations

- View recent Jira issues and Asana tasks together on the Tasks page
- Create a Jira issue or Asana task directly from a CRM client record
- Send requests through server-side `/api` proxies so credentials never reach
  the browser
- Use the current local/DummyJSON CRM client data today; the same integration
  flow can consume real CRM backend data later as long as it supplies the
  expected client fields (`name`, `email`, `company`, and `dealValue`)

### Profile

- View account details and initials-based avatar
- Edit full name and company
- Change the account password (with current-password verification)
- Reset CRM data — reload the original clients from the API without touching
  the account or session

### Productivity and UX

- In-app notification center with unread badge and reminder alerts
- Reminders that fire via `setTimeout` and survive page reloads
- Light and dark theme, remembered across visits
- Toast notifications for success and error feedback
- Keyboard-accessible modals with focus trapping, focus restoration, and
  Escape-to-close
- Cross-tab synchronization of client changes via the `storage` event
- Responsive layout for desktop, tablet, and mobile

## Technology Stack

| Area              | Technology            |
| ----------------- | --------------------- |
| Markup            | HTML5                 |
| Styling           | CSS3                  |
| Application logic | Vanilla JavaScript    |
| Data persistence  | Web Storage API       |
| Remote data       | DummyJSON REST API    |
| Task integrations | Jira Cloud, Asana     |
| Spreadsheet parse | SheetJS (on demand)   |
| Visual effects    | Three.js              |
| Typography        | Google Fonts (Inter)  |

No frontend framework, build step, or package installation is required.

## Application Pages

| Page             | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `index.html`     | Login (default landing page)                     |
| `signup.html`    | New account registration                         |
| `dashboard.html` | Metrics, pipeline, and recent activity           |
| `clients.html`   | Client list, CRUD, filters, import, and export   |
| `tasks.html`     | Jira issues and Asana tasks                     |
| `profile.html`   | Account details, password, and data reset        |

## Architecture

The project uses a page-based structure with shared JavaScript modules:

```text
10X-CRM-MARIAMI/
├── index.html
├── signup.html
├── dashboard.html
├── clients.html
├── profile.html
├── css/
│   ├── app.css
│   ├── glass.css
│   └── responsive.css
├── js/
│   ├── storage.js        # localStorage helpers and keys
│   ├── ui.js             # toasts, form errors, validators, formatting
│   ├── guard.js          # auth guard, navigation, theme, logout
│   ├── login.js          # login page logic
│   ├── signup.js         # registration logic
│   ├── data.js           # client loading, API mapping, stats helpers
│   ├── clients.js        # clients page: CRUD, filters, modals, import/export
│   ├── dashboard.js      # dashboard rendering
│   ├── profile.js        # profile and password logic
│   ├── notifications.js  # notification center and reminders
│   └── glass-*.js        # decorative glass/Three.js visual effects
├── glossary.md
├── GLASS-MARKUP.md
└── README.md
```

Shared logic (storage, auth guard, validation) lives in one place and is
included on every page, rather than being duplicated.

## Design Principles

The application follows a small set of deliberate patterns:

- **The Golden Cycle — State → Save → Render.** Every action changes the
  in-memory `clients` array first, saves it to `localStorage`, then re-renders
  the screen. The DOM is never edited directly, which keeps data in sync across
  pages and tabs.
- **Single source of truth.** The `clients` array is the one authoritative
  source of data; the interface only reflects it.
- **Separation of concerns.** Storage, auth, data, UI, and page logic each live
  in their own module.
- **Configuration-driven design.** Repeated values (statuses, storage keys,
  badge classes) are declared once in constants such as `CLIENT_STATUSES` and
  `STORAGE_KEYS`.
- **Immutability.** Client updates build a new array (`[newClient, ...clients]`)
  instead of mutating the original.
- **Event delegation.** A single listener on the clients container handles every
  card, including ones added later.
- **Guard clauses and defensive programming.** Early returns and `try/catch`
  keep the code readable and resilient to missing data or network errors.

## Data and Storage

Application state is persisted in `localStorage` under these keys:

| Key                 | Contents                                     |
| ------------------- | -------------------------------------------- |
| `crm_users`         | Registered user objects                      |
| `crm_session`       | The active session (who is signed in)        |
| `crm_clients`       | The client list (main application state)     |
| `crm_theme`         | `"light"` or `"dark"`                         |
| `crm_notifications` | In-app notifications                         |
| `crm_reminders`     | Pending follow-up reminders                  |

DummyJSON supplies the initial client data. Write operations (POST/DELETE) are
simulated by the API — the request succeeds but is not stored server-side, so
persistence is handled locally. Locally created clients receive a stable unique
`id`, while their optional API-returned identifier is kept separately as
`apiId` so that deletes target the correct record.

## Jira and Asana Configuration

The Jira and Asana features use Vercel serverless functions in `api/jira` and
`api/asana`. They connect to the real provider APIs only when these server-side
environment variables are configured:

```text
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_PROJECT_KEY=

ASANA_PAT=
ASANA_PROJECT_GID=
```

Add the values in the Vercel project settings and redeploy. When configuration
is missing, the Tasks page shows a clear integration error; no secret or token
is stored in frontend code or `localStorage`.

The integration currently builds tasks from the CRM clients loaded from
DummyJSON and saved locally. A future real CRM/CLM backend only needs to map its
client records to the same frontend fields; the Jira and Asana proxy endpoints
do not need to change.

## Security Notes

This is a browser-first learning project with small serverless integration
proxies. It applies several real security practices and documents where it
deliberately does not:

- **Password storage (learning trade-off).** Passwords are kept in plain text in
  `localStorage`. In a real product this is unacceptable — `localStorage` is
  readable by any script on the domain, so passwords must be hashed on a server
  (for example with bcrypt: salt + hash).
- **User-enumeration protection.** Login always returns the same generic message,
  `Invalid email or password`, so an attacker cannot discover which emails are
  registered.
- **XSS protection.** User-provided text is inserted with `textContent`, never
  `innerHTML`, so it cannot inject and execute scripts.
- **Integration secrets.** Jira and Asana credentials remain in server-side
  environment variables and are accessed only by the `/api` proxy functions.

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/maribostashvili-93/10x-crm-Mariami-Bostashvili.git
   ```

2. Enter the project directory:

   ```bash
   cd 10x-crm-Mariami-Bostashvili
   ```

3. Start a local web server (recommended, so external resources load
   correctly):

   ```bash
   npx serve .
   ```

4. Open the address shown in the terminal.

Opening `index.html` directly from the file system works for basic use, but a
local server is recommended.

## Test Account

A demo account is seeded automatically in every browser, so no registration is
needed to try the app:

```text
Email:    demo@crm.com
Password: Demo123!
```

You can also register a new account from the sign-up page and use those
credentials to sign in.

## Credits

Developed by **Mariami Bostashvili** as part of the 10X CRM frontend project.

- Repository:
  [github.com/maribostashvili-93/10x-crm-Mariami-Bostashvili](https://github.com/maribostashvili-93/10x-crm-Mariami-Bostashvili)
- Data API: [DummyJSON](https://dummyjson.com/)
- Spreadsheet parsing: [SheetJS](https://sheetjs.com/)
- 3D / visual effects: [Three.js](https://threejs.org/)

## Documentation

- [Technical glossary](glossary.md)
- [Glass interface implementation notes](GLASS-MARKUP.md)
