# 10X-CRM-v1# 🚀 10X-CRM - Client Relationship Management System

10X-CRM is a modern, fast, and user-friendly Client Relationship Management system designed for sales teams and independent agents. The project operates entirely on the client side, leveraging `LocalStorage` for state synchronization and data persistence.

🔗 **Live Demo:** [https://10-x-crm-v1.vercel.app/](https://10-x-crm-v1.vercel.app/)

---

## ✨ Features

### 🔐 1. Authentication & Session Management (`index.html` & `signup.html`)

- **User Registration**: Secure account creation with automated user tracking.
- **Smart Route Guards**: Restricts dashboard access to logged-in users and forces redirection loops back to the app space if a live session exists.
- **Persistent Sessions**: Stores user tokens dynamically in local storage until a explicit logout event occurs.

### 📊 2. Analytics Dashboard (`dashboard.html`)

- **Dynamic Greetings**: Personalizes the dashboard interface using context from the current session.
- **Metric Overviews**: Calculates global values, won deal pipelines, and active lead indicators on the fly.
- **Recent Activity Logs**: Aggregates chronological modifications, new clients, and recent log notes.

### 👥 3. Clients Management (`clients.html`)

- **Advanced Pipeline Filters**: Instantly switch views using status chips (`Lead`, `Contacted`, `Won`, `Lost`) matched against real-time text query strings.
- **Multifunctional Sorting**: Organizes items chronologically, alphabetically, or sorted directly by financial deal size.
- **Interactive Modals**: Form inputs for creating clients with strict fields verification, along with options to inject inline tracking notes or execute permanent deletions.

### 👤 4. Profile & Data Safeguards (`profile.html`)

- **Dynamic Identity Blocks**: Automatically extracts name metadata to draw letter-initial user avatars and print formatted creation timestamps.
- **Profile Settings**: Updates active field listings while validating size bounds (minimum 3 characters after spacing trims).
- **Password Overhauls**: Validates current credentials against complex criteria rules (minimum 8 characters, containing at least 1 digit and 1 letter).
- **Database Resets**: A fail-safe mechanism to drop modified parameters and run a fallback API query to pull down the base 30 default entities.

---

## 🛠️ Tech Stack

- **HTML5** — Structured semantic elements, native forms, and layout modals.
- **CSS3** — Modular interface styles utilizing Flexbox, CSS Grid layouts, and custom theme variables.
- **Vanilla JavaScript (ES6+)** — Client-side state engines, asynchronous Fetch operations (`DummyJSON`), and dynamic DOM parsing.

---

## 📂 Project Structure

```text
├── css/
│   ├── clients.css
│   ├── dashboard.css
│   ├── navbar.css
│   ├── profile.css
│   ├── signup.css
│   └── style.css
├── js/
│   ├── app.js         # Global logic, theme controls, and API initializations
│   ├── clients.js     # Clients CRUD logic, search filters, and modal toggles
│   ├── dashboard.js   # Analytics metrics rendering and active log timelines
│   ├── profile.js     # Profile states, password configurations, and database resets
│   └── signup.js      # Form authorization rules and registration operations
├── clients.html       # Client directory view
├── dashboard.html     # Analytics dashboard interface
├── index.html         # Login entry point
├── profile.html       # User account configuration parameters
├── README.md          # Project documentation
└── signup.html        # New account creation layout
```
