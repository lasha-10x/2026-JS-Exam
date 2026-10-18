# 10X CRM

## About

10X CRM is a browser-based customer relationship management app for sales managers. It supports account creation, login, protected pages, client pipeline management, dashboard summaries, and profile settings using JavaScript and `localStorage`.

## Features

- Sign up and log in with validation and persistent sessions.
- Auth guard for Dashboard, Clients, and Profile pages.
- Load 30 starter clients from DummyJSON and save them in `crm_clients`.
- Add and delete clients with `POST` and `DELETE` requests.
- Search, filter, sort, change statuses, add notes, and set follow-up reminders.
- Dashboard stats, pipeline distribution, recent clients, and live clock.
- Profile editing, password change, theme toggle, and CRM data reset.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- DummyJSON API
- Browser `localStorage`

## How to Run

Open `index.html` in a browser, or run a local static server:

```bash
python3 -m http.server 5173
```

Then visit:

```text
http://localhost:5173
```

## Live Demo

Deployment link: https://omadzelevan.github.io/10x-exam/

## Test Account

You can register a new account from `signup.html`. A demo account is also seeded automatically:

```text
Email: demo@test.com
Password: demo1234
```

## Storage Keys

- `crm_users` stores registered users.
- `crm_session` stores the current login session.
- `crm_clients` stores client records.
- `crm_theme` stores the selected theme.

## Credits

Built by Levan Omadze with AI assistance from Codex. Dummy client data comes from DummyJSON.
