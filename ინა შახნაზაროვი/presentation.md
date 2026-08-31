# 10X CRM — Presentation Guide

## Project Overview

10X CRM is a browser-based customer relationship management application built with HTML, CSS, and Vanilla JavaScript.

The application allows sales managers to register, log in, manage clients, track deal statuses, write notes, set reminders, and review dashboard statistics.

## Demo Login

- Email: `demo@test.com`
- Password: `demo1234`

## Suggested Demo Flow

1. Log in with the demo account.
2. Show the protected Dashboard page.
3. Explain the client statistics and pipeline progress bars.
4. Open the Clients page.
5. Demonstrate search, status filtering, and sorting.
6. Add a new client.
7. Edit the client's information.
8. Change the client's pipeline status.
9. Open client details and add a note.
10. Demonstrate the reminder and call timer.
11. Open the Profile page.
12. Update profile information and switch the theme.
13. Log out and show that protected pages require authentication.

## Project Structure

- `auth.js` manages users, sessions, validation, theme, and shared helpers.
- `guard.js` protects private pages and redirects authenticated users.
- `data.js` manages client state, localStorage, and DummyJSON API requests.
- `clients.js` manages the Clients page interactions.
- `dashboard.js` calculates and displays CRM statistics.
- `profile.js` manages account and password updates.
- `style.css` contains shared and responsive styles.

## Data Persistence

User accounts, the active session, clients, and the selected theme are stored in `localStorage`.

DummyJSON is used to demonstrate GET, POST, PUT, and DELETE requests. Because DummyJSON does not permanently save changes, localStorage keeps the application's data after a page refresh.

## Security Decisions

User and API values are escaped before they are inserted with `innerHTML` to reduce stored XSS risks.

Passwords are stored as plain text only because this is a frontend-only educational project. A production application must hash passwords securely on a backend server.

## AI Usage

AI was used for project planning, code suggestions, and debugging. Every suggestion was reviewed, tested, and adapted to the project requirements. Detailed examples are documented in `ai-log.md`.

## Possible Questions

### Why did you use localStorage?

The project has no backend database, so localStorage provides persistence between page refreshes.

### Why did you copy arrays before sorting?

JavaScript's `sort()` method mutates the original array. Copying the array prevents accidental state changes.

### How are protected pages secured?

The auth guard checks for a valid session. If no session exists, the user is redirected to the login page.

### Is this application production-ready?

No. It is an educational frontend project. A production version would require a backend, secure password hashing, a real database, and server-side authorization.