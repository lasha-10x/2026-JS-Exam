# 10X CRM

A browser-based CRM (Customer Relationship Management) system built with vanilla JavaScript for sales managers. It provides authentication, persistent client management, dashboard statistics, notes, reminders, profile settings, and theme switching without a framework.

## Features

- User registration and login with validation
- Protected routes with auth guard
- Dashboard with live stats and clock
- Clients list with search, filter, sort
- Add / Edit / Delete clients (POST / PUT / DELETE with DummyJSON API)
- Client details with notes and reminders
- Profile editing and password change
- Dark / Light theme toggle
- All data persisted in localStorage

## Tech Stack

- HTML5, CSS3 (custom variables, responsive)
- Vanilla JavaScript (ES6+)
- DummyJSON API (https://dummyjson.com)
- localStorage for state persistence
- Deployment: Vercel

## How to Run

1. Clone or download the repository.
2. Open the project folder in VS Code.
3. Start it with Live Server (recommended) and open `index.html`.
4. Register an account, log in, and start using the CRM.

## Live Demo

[Open 10X CRM](https://10x-crm-inna.vercel.app/)

## Test Account

The app automatically creates this test account in every fresh browser:

- Email: `demo@test.com`
- Password: `demo1234`

You can also register a separate account from the Sign Up page.

## Recent Improvements

- Validation errors disappear while the user corrects a field
- Password strength indicator on the Sign Up page
- Existing client information can be edited and saved
- Dashboard updates when client data changes in another browser tab
- Client details include a call duration timer
- Pipeline statuses include visual percentage bars

## Manual Testing

| Area | Test | Result |
|---|---|---|
| Authentication | Register, log in, log out, and use the demo account | Passed |
| Route protection | Open protected pages without a session | Passed |
| Validation | Submit invalid login, signup, client, and profile forms | Passed |
| Clients API | Load, add, edit, and delete clients | Passed |
| Client tools | Search, filter, sort, notes, reminder, and call timer | Passed |
| Dashboard | Statistics, recent clients, pipeline bars, and tab sync | Passed |
| Persistence | Refresh the page after changing users or clients | Passed |
| Responsive UI | Check desktop and mobile layouts | Passed |

## Credits

Built by Inna for the 10X JavaScript final exam. AI tools were used for planning and code assistance; all generated code was reviewed, tested, and adapted for the PRD.

## Security Note

This is a frontend-only educational project. Passwords are stored in `localStorage` only because the PRD does not include a backend; a production application must store hashed passwords securely on a server. User-provided text is escaped before HTML rendering to prevent stored XSS.
