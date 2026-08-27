# 10X CRM

## About
10X CRM is a modern, lightweight, and highly responsive Client Relationship Management (CRM) dashboard built entirely with Vanilla JavaScript and CSS. It offers an intuitive interface for managing client data, tracking deal values, and maintaining detailed communication notes without relying on heavy front-end frameworks.

## Features
- **User Authentication:** Secure registration and login flows with strict, real-time input validation (e.g., Latin-only characters, live filtering).
- **Client Management:** Seamlessly add, filter (by status/search), and sort clients (by date or deal value).
- **Notes System:** A dedicated, chronological notes thread attached to each individual client to track interactions.
- **Dynamic Theming:** Flawless Light and Dark mode toggling with native browser UI adaptation (Scrollbars, Autofill).
- **Data Persistence:** Lightning-fast, offline-capable data management utilizing browser `localStorage`.
- **API Integration (Adapter Pattern):** Automatic initialization of mock client data from the DummyJSON API if the local storage is empty.

## Tech Stack
- **Structure:** Semantic HTML5
- **Styling:** Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid)
- **Logic:** Vanilla JavaScript (ES6+, Modules, Async/Await)
- **Storage:** Web Storage API (`localStorage`)
- **Icons:** Phosphor Icons

## How to Run
1. Clone the repository to your local machine:
   ```bash
   git clone git@github.com:KhatunaKhatuna/10X-CRM.git
   ```
2. Navigate into the project directory.
3. Open `index.html` in any modern web browser. 
   *(Tip: For the best experience, use a local server like the "Live Server" extension in VS Code).*

## Live Demo
[View Live Demo Here](#) *(https://10-x-crm.vercel.app/)*

## Test Account
To quickly evaluate the dashboard without going through the registration process, you can log in using the following test credentials:
- **Email:** `demo@test.com`
- **Password:** `Demo1234!`

## Credits
- Developed by: **[Khatuna Khatuna]**
- Built with the assistance of AI pair programming (Claude/Antigravity) for architectural planning, advanced CSS debugging, and code optimization.
