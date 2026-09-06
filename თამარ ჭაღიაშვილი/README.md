# 10X CRM

## About

10X CRM is a simplified customer relationship management tool for sales managers, built as the final project for the JavaScript module. It covers registration, login, a dashboard, a client database backed by the DummyJSON API, and a profile page — all persisted with `localStorage` (no backend).

## Features

- **Auth**: sign up, log in, session-based auth guard, logout
- **Dashboard**: live clock, 4 key stats, pipeline overview, 5 most recent clients
- **Clients**: load from API on first run, add (POST), delete (DELETE), change status, search + filter + sort (combinable), client detail view with notes and a 1-minute follow-up reminder
- **Profile**: edit name/company, change password, reset CRM data back to a fresh API pull
- **Theme**: dark/light toggle, persisted per user
- **Toasts**: success/error notifications (no `alert()`, except `confirm()` for deletes)

## Tech Stack

Vanilla JavaScript (ES6+), HTML5, CSS3. No frameworks, no libraries. Data source: [DummyJSON](https://dummyjson.com). Fonts: Space Grotesk, Inter, IBM Plex Mono (Google Fonts).

## How to Run

1. Clone the repo.
2. Open `index.html` in a browser, or serve the folder with any static server (e.g. `npx serve .`).
3. No build step, no dependencies to install.

## Live Demo

`https://your-deployment-url.vercel.app` *(replace after deploying to Vercel/Netlify)*

## Test Account

You can sign up with any email, or register `demo@test.com` / `demo1234` as a shared test account for grading.

## Credits

Built solo with AI assistance (see `ai-log.md` for the full log of prompts, outputs, and what was kept vs. rewritten).

## Setup Instructions
Open index.html directly or use Live Server.

## Browser Support
Supports Chrome, Firefox, Edge, Safari.