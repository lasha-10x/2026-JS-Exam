# 10X CRM

A browser-based CRM for managing client relationships, sales-pipeline data, notes, and follow-up reminders. The project uses Vanilla JavaScript modules and localStorage; no backend server is required for account or application state.

## Live demo

[Open 10X CRM](https://crm-pavlepritula.netlify.app)

## Main features

- Sign up, login, and strict protected routes
- Client list with search, filtering, sorting, create, edit, delete, and status changes
- Client details with editable and removable notes
- Persistent follow-up reminders and a Notification history page
- Dashboard metrics, pipeline overview, and recent clients
- Profile editing, password updates, data reset, theme preference, and language preference
- English as the default language plus Georgian (`ქართული`)
- Mobile-first responsive layout, dark/light theme, and accessible controls

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Login |
| `signup.html` | Account creation |
| `dashboard.html` | Sales summary and pipeline metrics |
| `clients.html` | Client management and details |
| `profile.html` | Account, password, language, and reset settings |
| `notifications.html` | Reminder history and client links |

## Local storage

| Key | Purpose |
| --- | --- |
| `crm_users` | Registered browser-only accounts |
| `crm_session` | Active session |
| `crm_clients` | Client records, statuses, and notes |
| `crm_notifications` | Reminder history and status |
| `crm_theme` | Light or dark theme preference |
| `crm_language` | `en` or `ka` interface language |

## Run locally

```bash
npm install
npm run sass:build
npm test
```

Serve the project with VS Code Live Server or another static server. For example:

```bash
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run sass:build` | Compile SCSS into `css/main.css` |
| `npm run sass:watch` | Watch and compile SCSS during development |
| `npm test` | Run the Node.js test suite |

## Verification checklist

- Create an account and log in.
- Open a protected page in a fresh browser session and confirm redirect to Login.
- Create, edit, filter, and delete a client.
- Add, edit, and delete a client note.
- Set a reminder, verify it appears in Notifications, and open its client.
- Change theme and language in Profile, then reload the page.
- Check the layout at 320px, 375px, and desktop widths.

## Credits

- Product requirements: 10X CRM exam PRD
- Client API: [DummyJSON](https://dummyjson.com/)
- AI usage details: [ai-log.md](ai-log.md)
