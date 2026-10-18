# 10X CRM

## About

10X CRM is a responsive customer relationship management application for sales managers. It is built with HTML, CSS, and Vanilla JavaScript and uses browser storage for its educational, backend-free data model.

## Features

- Account sign up and login with custom validation
- Shared authentication guards and a persistent session
- Dark and light themes
- Dashboard greeting, live clock, statistics, pipeline overview, and recent clients
- Initial client loading through DummyJSON
- Client search, status filters, and sorting
- Add Client flow with a simulated API POST
- Client status changes and deletion with a simulated API DELETE
- Client details modal, persistent notes, and one-minute reminders
- Profile editing and password changing
- Reset Data action that restores the initial 30 clients
- localStorage persistence and responsive design

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- localStorage
- Fetch API
- DummyJSON API

## localStorage keys

- `crm_users` stores registered user accounts.
- `crm_session` stores the current authenticated session.
- `crm_clients` stores the complete client collection.
- `crm_theme` stores either `dark` or `light`.

## API endpoints

- `GET https://dummyjson.com/users?limit=30`
- `POST https://dummyjson.com/users/add`
- `DELETE https://dummyjson.com/users/{id}`

DummyJSON simulates POST and DELETE responses. The lasting application state is saved in localStorage.

## How to run locally

1. Download or clone the project.
2. Start any simple static web server in the project folder.
3. Open the server's `index.html` URL in a browser.

Opening the files through a local server is recommended because browser behavior for localStorage on direct `file:` URLs can vary.

## Live demo

[Open the live 10X CRM application](https://10x-crm-brown.vercel.app/)

## Test Account

Register a new account through the Sign Up page, then use those credentials to
log in. No shared demonstration account is stored in the repository.

## Credits

Created by Viktoria Kazarova. OpenAI Codex was used as an AI development
assistant for planning, implementation support, review, and debugging.

## Security note

Passwords are stored in localStorage only because this is a backend-free educational project. A production application must authenticate on a trusted server, hash passwords with a suitable password-hashing algorithm, and protect sessions with secure mechanisms.

## Project structure

- `index.html` — Login page
- `signup.html` — Sign Up page
- `dashboard.html` — CRM overview
- `clients.html` — Client management
- `profile.html` — Account management and data reset
- `css/styles.css` — Shared responsive styles and themes
- `js/storage.js` — Storage, User, and Session helpers
- `js/data.js` — Shared client loading and normalization
- `js/auth.js` — Sign Up and Login behavior
- `js/guard.js` — Route protection and logout
- `js/theme.js` — Theme persistence
- `js/dashboard.js` — Dashboard calculations and rendering
- `js/clients.js` — Client management behavior
- `js/profile.js` — Profile, password, and Reset Data behavior
