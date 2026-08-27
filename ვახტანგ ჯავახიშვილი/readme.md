# CRM Web Application

## Overview
This is a modern **Customer Relationship Management (CRM)** web application designed for managing client data, user authentication, and real-time filtering/sorting. The project is built using vanilla HTML5, CSS3, and JavaScript (ES6+).

## Features
* **User Authentication:** Registration and login workflows with form validation, strict password requirements, and duplicate email prevention.
* **Secure Session Management (`guard.js` & `sessionStorage`):** Active user sessions are stored in `sessionStorage` and automatically wiped out when the browser tab or window is closed.
* **Dynamic Client Database (API & LocalStorage):** Initial data is automatically seeded from the **DummyJSON API** (`https://dummyjson.com/users`), while subsequent updates and manual entries persist in `localStorage`.
* **Full CRUD Operations:** Add new clients, view comprehensive details, edit existing records, and delete clients using interactive modal dialogs.
* **Advanced Filtering & Search:** Search by name or email, filter by status (`Lead`, `Contacted`, `Won`, `Lost`), and sort records by gender or alphabetical order.

## Technologies Used
* **HTML5 / CSS3** – Page structure, layout, and styling.
* **JavaScript (ES6+)** – Asynchronous logic, Arrow Functions, Fetch API, DOM manipulation.
* **Web Storage API** – `localStorage` (for persistent client and user databases) and `sessionStorage` (for active login sessions).
* **External API** – DummyJSON Users API (`https://dummyjson.com/users`).

## Project Structure
```text
├── index.html / login.html   # Authentication and login landing pages
├── dashboard.html            # Main workspace and client management dashboard
├── guard.js                  # Route guard and authentication verification logic
├── script.js                 # Core client management and UI interaction logic
├── ai-log.md                 # AI collaboration and usage journal
└── README.md                 # Project documentation