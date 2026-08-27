
# 10x CRM

10x CRM is a small customer relationship management app built with Vanilla JavaScript.
Users can create an account, manage clients, track deal progress, add notes, update their profile, and switch between light and dark themes. The application uses localStorage to save accounts and client data.

## Live Demo

[Open 10x CRM](https://10xcrm.netlify.app)

## Features

- User registration, login, and logout
- Protected Dashboard, Clients, and Profile pages
- Dashboard statistics and recent clients
- Client search, filtering, sorting, and pagination
- Add, edit, delete, and update clients
- Client details, notes, and follow-up reminders
- Profile and password management
- Light and dark themes
- Responsive desktop, tablet, and mobile layouts
- CRM data reset

## Tech Stack

- HTML5
- SCSS
- Vanilla JavaScript
- JavaScript modules
- localStorage
- Fetch API
- DummyJSON API
- Git and GitHub
- Netlify

## How to Run Locally

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Open the project folder:

   ```bash
   cd 10x-crm-mariamchemia
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the Sass compiler:

   ```bash
   npm run sass
   ```

5. Open `index.html` using a local development server such as Live Server.

## Test Account

- **Email:** `demo@10xcrm.com`
- **Password:** `Demo1234`

A new account can also be created through the Sign Up page.

## Project Notes

The first client list is loaded from DummyJSON and then saved in localStorage.

## API Integration

The application uses the DummyJSON API to retrieve the initial client list.

## Limitations

**Because DummyJSON returns the same ID(209) for repeated POST requests, the application generates a unique ID locally for every newly added client. This prevents conflicts for operations that rely on client ID.**
This project does not use a real backend. Client data is shared between accounts in the same browser and all information is saved locally to the browser memory.

## Credits

- Client data provided by [DummyJSON](https://dummyjson.com)