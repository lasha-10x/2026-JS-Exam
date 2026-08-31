# 10X CRM

## About

10X CRM is a frontend customer relationship management application for individuals and small teams. It provides a simple way to create an account, review sales activity, organize clients, record notes, and manage a user profile. The project was built as an educational application using only browser technologies.

## Features

- **Authentication:** Sign Up and Login forms with validation, duplicate-email checks, browser-based sessions, protected pages, and Logout.
- **Dashboard:** Personalized greeting, live date and time, client statistics, pipeline totals, and the five newest clients.
- **Client management:** Add, view, edit, and delete clients.
- **Data transfer:** Export and import client JSON files between browsers or deployments.
- **Search:** Find clients by name or company while typing.
- **Filtering:** Filter clients by Lead, Contacted, Won, or Lost status.
- **Sorting:** Sort clients by date, name, or deal value in either direction.
- **Pagination:** Show 10 clients per page with Previous, Next, and page number controls.
- **Client details:** Review a selected client's avatar, contact information, status, deal value, and account date.
- **Notes:** Add dated notes to a selected client.
- **Reminder:** Schedule a one-minute follow-up toast for a client during the current page session.
- **Profile:** View account details, update name and company, change the password, and reset CRM client data.
- **Theme switching:** Switch between light and dark themes and keep the selected theme on every page.
- **10X Mode:** Use the hidden Shift-click logo interaction to toggle a persistent neon theme.
- **LocalStorage persistence:** Keep users, the current session, clients, and theme preferences in the browser.
- **Error handling and Retry:** Show loading and error states and retry a failed client API request.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage
- Fetch API
- DummyJSON API

## How to Run

1. Clone or download the repository.
2. Open the `10x-crm` folder in a code editor.
3. Start a local static server. For example, use the **Live Server** extension in Visual Studio Code and open `index.html`.
4. Open the local address shown by the server, such as `http://127.0.0.1:5500/10x-crm/index.html`.
5. Create an account on the Sign Up page, then log in to access the protected CRM pages.

A local server is recommended because the application uses the Fetch API to load initial client data.

## Live Demo

[Open the deployed 10X CRM application](https://10x-crm-lasha.vercel.app/)

## Test Account

Use this built-in account to review the application immediately:

```text
Email: demo@test.com
Password: demo1234
```

You can also create a separate account from the Sign Up page.

## Project Structure

```text
10x-crm/
├── index.html              # Login page
├── signup.html             # Account registration page
├── dashboard.html          # Dashboard and client statistics
├── clients.html            # Client list, controls, and Add Client form
├── client-details.html     # Client information, editing, notes, and reminder
├── profile.html            # Account settings and password management
├── css/
│   └── style.css           # Shared styles and themes
├── js/
│   ├── client-data.js      # Shared client storage and API loading
│   ├── client-details.js   # Client details page behaviour
│   ├── clients.js          # Client list and management behaviour
│   ├── common.js           # Shared storage, toast, theme, and Logout helpers
│   ├── dashboard.js        # Dashboard display and statistics
│   ├── guard.js            # Authentication guard
│   ├── login.js            # Login validation and session creation
│   ├── profile.js          # Profile and password behaviour
│   ├── signup.js           # Sign Up validation and user creation
│   └── theme-init.js       # Applies appearance before page rendering
├── ai-log.md               # AI usage and development reflection
├── glossary.md             # Project terminology
├── research-note.md        # Project research notes
└── README.md               # Project documentation
```

## Data Storage

The application uses LocalStorage for browser-based persistence:

- `crm_users` stores registered user accounts.
- `crm_session` stores the currently logged-in user's session.
- `crm_clients` stores client records and their notes. Each client has an `ownerId` so every logged-in account sees its own CRM data.
- `crm_client_owners_initialized` stores which accounts already received their initial API client list.
- `crm_theme` stores the selected light or dark theme.
- `crm_ten_x_mode` stores whether the hidden neon theme is active.

This data belongs only to the current browser and device. Because this is a frontend-only educational project, its LocalStorage authentication and plain-text passwords are not suitable for a production application.

## Client Data Transfer

Open the Profile page and use **Export Clients** to download the current
user's client list as a JSON file. Open the other version of the application,
choose **Import Clients**, and select that file. Importing replaces only the
current user's clients on that browser origin, while other accounts, sessions,
and themes remain unchanged.

## API

When the current user does not have an initialized client list, the application loads initial client data from:

```text
https://dummyjson.com/users?limit=30
```

The returned users are converted into the project's client format, connected to the logged-in user's `ownerId`, and saved in LocalStorage. If loading fails, the Clients page displays an error message and a Retry button that starts a fresh request.

## Screens

- **Login:** Validates credentials, creates the current session, and opens the Dashboard.
- **Sign Up:** Validates account information and saves a new user.
- **Dashboard:** Displays the user's first name, a live clock, statistics, pipeline totals, and recent clients.
- **Clients:** Displays client cards with search, status filters, sorting, inline status updates, creation, deletion, and details access.
- **Profile:** Displays account information and supports name/company updates, password changes, and CRM data reset.

## Future Improvements

- Replace LocalStorage authentication with a secure backend and hashed passwords.
- Add server-side data persistence so accounts and clients can be shared across devices.
- Store configurable reminders so they remain available after leaving or refreshing the page.
- Add automated tests for validation, storage, API errors, and client management.

## Author

Lasha Abrama

## Credits

Initial client data and client API requests use the [DummyJSON Users API](https://dummyjson.com/docs/users). The application code and documentation were created for the 10X JavaScript exam project.
