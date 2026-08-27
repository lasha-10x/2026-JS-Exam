# 📝 Research & Architecture Notes · 10x CRM

## 1. Overview & Goals

The objective of this project is to build a responsive, lightweight, and modern **10x CRM** web application. It features real-time client management, dynamic dashboard stats, theme switching, and local session management.

---

## 2. Technical Stack

- **Frontend:** Semantic HTML5, CSS3 (Vanilla CSS with custom variables for themes).
- **Scripting:** Pure JavaScript (ES6+ Modules/Scripts).
- **Storage:** `localStorage` (simulating persistence for clients, auth sessions, and user preferences).
- **Styling & Fonts:** Google Fonts (`Baloo 2`, `Nunito`), CSS Grid, and Flexbox.

---

## 3. Core Features & Key Fixes

### 3.1. Dashboard & Dynamic Updates

- **Live Clock:** Integrated real-time digital clock in the topbar (`liveClock` element).
- **Flicker-Free Rendering:** Optimized DOM loading by removing hardcoded static elements from HTML and dynamically injecting client state on `DOMContentLoaded`.
- **Metrics:**
    - **Total Clients:** Calculated from active dataset.
    - **Active Clients:** Filtered by `status === 'active'`.
    - **Revenue:** Calculated based on aggregate client contract values.
    - **Recent Activity:** Displays top 4 most recently added clients.

### 3.2. Authentication & Session Management

- Session checks are required via `requireAuth()` before rendering main app screens.
- Session tokens/data stored in `localStorage`.

### 3.3. Theme Management

- Light/Dark mode toggling driven by CSS variables (`--cream`, `--panel`, `--ink`, `--line`) and managed via `theme.js`.

---

## 4. File Structure References

- `css/styles.css` — Global design tokens, layout styles, and theme variables.
- `js/auth.js` — Authentication flows and session protection.
- `js/api.js` — API wrapper & fallback `localStorage` data sync.
- `js/clients.js` — CRUD actions for client management.
- `js/dashboard.js` — Live metrics, clock, and activity feed logic.
- `js/profile.js` — Profile page state and user info binding.
- `js/theme.js` — Dark mode state controller.
- `js/ui.js` — Global UI helper components (toasts, modals).

---

## 5. Future Enhancements & Ideas

- [ ] Add pagination and filtering for client tables.
- [ ] Implement backend server API (replace `localStorage` with REST/GraphQL endpoints).
- [ ] Add chart visualizers for Revenue trends in Dashboard.
