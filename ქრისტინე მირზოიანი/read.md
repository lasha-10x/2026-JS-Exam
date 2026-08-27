# 10X CRM — Client Relationship Management System

A streamlined, modern Client Relationship Management (CRM) web application designed for sales managers to track leads, manage customer pipelines, record notes, set reminders, and analyze key business metrics in real-time.

---

## 🌟 Key Features

* **P0 — Security & Global Controls**
  * **Auth Guard**: Protected routes (`dashboard.html`, `clients.html`, `profile.html`) redirect unauthenticated users to `index.html` (Login). Authenticated users visiting public pages are redirected to `dashboard.html`.
  * **Theme Switcher**: Instant Dark Mode and Light Mode toggle, persisting preference in `localStorage` under `crm_theme`.
  * **Toast Notifications**: Reusable, animated toast messages for user feedback (`success`, `error`, `info`).

* **P1 & P2 — Authentication (Sign Up & Login)**
  * **Client-side Registration**: Form validation requiring at least 3 characters for name, valid email format with duplicate prevention, and strong passwords (at least 8 chars with letter & number).
  * **Secure Login Flow**: Session object stored in `localStorage` (`crm_session`), removing session on Logout without clearing saved clients.

* **P3 — Interactive Dashboard**
  * **Personalized Greeting & Live Clock**: Displays user's first name and a live updating clock (`toLocaleDateString()` and `toLocaleTimeString()`).
  * **Real-time Stat Cards**:
    * **Total Clients**: Count of all active clients.
    * **Active Deals**: Clients in `Lead`, `Contacted`, or `Proposal` stage.
    * **Won Revenue**: Sum of deal values for `Won` status formatted in USD currency.
    * **New This Week**: Clients created within the last 7 days.
  * **Pipeline Overview**: Breakdown of clients across sales funnel stages.
  * **Recent Clients List**: Displays top 5 newest clients with direct link to full list.

* **P4 — Clients Management (Full CRUD + Search & Filter)**
  * **API Integration**: Fetches 30 realistic client profiles from `https://dummyjson.com/users?limit=30` on initial load and caches them in `localStorage` (`crm_clients`).
  * **Instant Search & Multi-Stage Filter Chips**: Search by name or company, filter by status (`All`, `Lead`, `Contacted`, `Won`, `Lost`), and sort (`Newest`, `Name A-Z`, `Deal Value High -> Low`).
  * **Add New Client Modal**: Full modal validation with real REST POST simulated payload.
  * **Interactive Status Select**: Change client pipeline status directly from card badge.
  * **Details & Notes Modal**: Click card to open modal displaying full client details, timeline notes history, and note addition.
  * **Follow-up Reminder**: Timed reminder button triggering background notification in 1 minute (`setTimeout`).
  * **Delete Client**: Confirmation dialog and REST DELETE payload simulation with local removal.

* **P5 — Profile & Data Management**
  * **User Profile Card**: Displays user avatar initials, full name, email, company, and registration date.
  * **Edit Profile**: Modify full name and company with instant updates across header and dashboard.
  * **Change Password**: Validates current password and updates credentials securely.
  * **Reset CRM Data**: Option to wipe local client storage and re-fetch clean default 30 clients from API.

---

## 🛠️ Tech Stack

* **Frontend Structure**: HTML5, CSS3 (Tailwind CSS utilities + custom CSS variables)
* **Logic & Interactivity**: Vanilla JavaScript (ES6+ Object-Oriented JavaScript Class Architecture)
* **State & Persistence**: Web Storage API (`localStorage`)
* **Asynchronous Operations**: Promises, `fetch` API, `async`/`await`
* **Icons & Assets**: Custom SVG & Unicode Icons

---

## 🚀 How to Run Locally

1. Clone or download the repository.
2. Open `index.html` directly in any modern browser, or launch using Vite / Live Server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:3000` (or `http://localhost:5173`).

---

## 🧪 Demo Test Account

* **Email**: `demo@gmail.com` (or `demo@example.com`)
* **Password**: `pasword123` (or `demo1234`)
*(Alternatively, click "Sign Up" to create a new local account).*

---

## 🌐 Live Deployment

* **Live Demo URL**: [https://10xcrmqristine.vercel.app/](https://10xcrmqristine.vercel.app/)

---

## 📚 Credits & Acknowledgments

Built for the **10X CRM Project Exam** (Product Requirements Document v3.0). Powered by Vanilla JavaScript, LocalStorage API, and DummyJSON Users API.
