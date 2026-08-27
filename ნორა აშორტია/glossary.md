# 📖 Project Glossary · 10x CRM

This document defines the core technical terms, patterns, and concepts used throughout the **10x CRM** codebase.

---

### 1. Architectural & Core Concepts

- **CRM (Customer Relationship Management):** Software system designed to manage interactions, track data, and streamline relationships with clients.
- **Auth Guard (`requireAuth`):** A client-side routing check executed before rendering protected pages. If no valid session exists in `localStorage`, it redirects the user to the login screen.
- **Session Management:** The process of persisting a user's logged-in state across page reloads using browser storage (`crm_session`).
- **Mock API:** A JavaScript module (`js/api.js`) that simulates backend network interactions, introducing artificial delays via Promises and handling asynchronous data fetching.

---

### 2. Technical Features & Data Management

- **CRUD Operations:** Acronym for the four basic data operations implemented for client records: **C**reate (add client), **R**ead (fetch list), **U**pdate (edit details/notes), and **D**elete (remove client).
- **`localStorage`:** A browser Web Storage API used to persist application state (users, sessions, clients, theme) locally on the client's machine across sessions.
- **Flicker-Free DOM Manipulation:** The technique of dynamically building and injecting HTML elements using JavaScript (`DOMContentLoaded`) to prevent visual content shifting during initial page load.
- **Client-Side Validation:** Form verification performed in JavaScript prior to processing data, providing instant UI/toast feedback for invalid inputs (e.g., short passwords or malformed emails).
- **Toast Notification:** Temporary floating feedback alerts (e.g., success messages or error warnings) displayed to notify users of system actions.

---

### 3. UI & Styling Terms

- **CSS Custom Properties (Variables):** Theme tokens (such as `--cream`, `--panel`, `--ink`) defined in CSS to allow dynamic light/dark mode switching at runtime.
- **Filter Chips:** Interactive UI components used to instantly filter client datasets by specific criteria (e.g., status) without altering or mutating the primary source data.
