# Exam Speech

## One-minute English overview

Hello, my project is called 10X CRM. It is a small customer relationship management application for sales managers. The app helps a user register, log in, manage clients, track deal statuses, add notes, set reminders, and review sales statistics on a dashboard.

I built the project with HTML, CSS, and vanilla JavaScript. The app does not use a backend, so it stores users, the current session, clients, and the selected theme in browser localStorage. The client list is loaded from the DummyJSON API with fetch and async/await. The app also uses POST when adding a client and DELETE when removing a client.

The hardest part was connecting all actions to the same state cycle: change the data, save it to localStorage, and render the interface again. This pattern is used in authentication, client management, filters, notes, and profile settings.

## Key code explanation points

- `assets/js/storage.js` contains helper functions for localStorage and keeps the required keys in one place.
- `assets/js/auth.js` checks whether a session exists and redirects users between public and protected pages.
- `assets/js/pages/clients.js` handles API loading, rendering, adding, deleting, filtering, sorting, notes, and reminders.
- `assets/js/pages/dashboard.js` calculates statistics from the same saved clients array.
- `assets/js/pages/profile.js` updates the current user, changes the password, and resets only CRM client data.

## Security note

In a real application, passwords should never be stored as plain text in localStorage. This project does it only because the exam requires a frontend-only app without a backend.
