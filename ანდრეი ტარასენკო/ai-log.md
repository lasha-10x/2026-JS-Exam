# AI Usage Log — 10X CRM

Record of AI-assisted development for the **10X CRM** project, kept daily by student **Andrey Tarasenko** throughout the 11-day development cycle (July 16 – August 1, 2026). Each entry documents project goals, tools used, exact prompts, generated code evaluation, manual modifications, and key technical learnings, strictly aligned with Git commit history, PRD specifications, codebase implementation, and project README.

---

## Day 1 — July 16, 2026: Project Scaffolding & Initial HTML Markup

**Git Commits:** `57a94f3` (Initial commit), `890299d` (Update gitignore file), `5e36272` (Create index.html)  
**PRD Module:** Project Setup & Authentication UI Shell  
**Tool:** Cursor AI (Claude 3.5 Sonnet)

### Goal
Establish the initial project repository structure, `.gitignore` config, and construct the semantic HTML5 layout shell for the authentication login page ([index.html](./index.html)).

### Prompt
> "Read the PRD requirements for the 10X CRM exam project. Generate a clean, accessible HTML5 boilerplate for index.html representing the Login page. Include a form with email and password inputs, error message containers (`data-error`), submit button, link to signup.html, and script tags linking modern ES module files."

### Result & Evaluation
* **Generated:** Clean HTML structure with form attributes, semantic `<main>`, `<section>`, and `<form id="login-form">`.
* **Manual Adjustments:** Added global error container `<div data-error="global" class="form-error"></div>` above the submit button to handle general invalid credential alerts, as required by PRD section 3.1.
* **What I Learned:** AI generates generic HTML forms quickly, but PRD-specific data attributes (like `data-error="email"`) must be manually verified to ensure seamless DOM manipulation in JavaScript.

---

## Day 2 — July 17, 2026: SCSS Architecture, Custom Variables & Layout Grid

**Git Commits:** `932c094` (Add scss folder and create variables), `a86f914` (Add base css styles), `737e20e` (Create css layout)  
**PRD Module:** Design System & Responsive Layout  
**Tool:** Cursor AI / ChatGPT (GPT-4o)

### Goal
Design the SCSS modular architecture ([scss/](./scss/)), modern CSS design tokens in [_variables.scss](./scss/_variables.scss), base CSS reset in [_base.scss](./scss/_base.scss), and the responsive app layout shell in [_layout.scss](./scss/_layout.scss).

### Prompt
> "I am setting up SCSS for a CRM web application. I need modern CSS custom properties for light/dark mode themes (backgrounds, text, surface colors, borders, status badge colors for Lead, Contacted, Won, Lost) and a flexbox/grid layout for a sidebar + header + main content area."

### Result & Evaluation
* **Generated:** Modular SCSS partial files with `:root` and `[data-theme="light"]` CSS variables, typography reset, and `.app-layout` layout grid.
* **Manual Adjustments:** Resolved compilation errors with Dart Sass by replacing legacy `@import` with modern `@use 'variables' as *;` at the top of every partial file. Added dark mode defaults as specified in PRD.
* **What I Learned:** With modern Sass `@use` rules, variables and mixins are encapsulated per partial file. Each SCSS file using `$transition-fast` or CSS variables must explicitly include `@use 'variables' as *;`.

---

## Day 3 — July 18, 2026: Registration UI Shell & Dashboard HTML Layout

**Git Commits:** `20b3cd9` (Create signup page), `0177e0f` (Create dashboard page), `b8f453e` (Add style for authentication), `794f500` (Add style for dashboard)  
**PRD Module:** Auth Registration & Dashboard Structure  
**Tool:** Cursor AI (Claude 3.5 Sonnet)

### Goal
Construct [signup.html](./signup.html) for user registration, build the skeleton of [dashboard.html](./dashboard.html) (welcome header, live clock, 4 stat cards, pipeline breakdown, recent clients list), and style them via [_auth.scss](./scss/_auth.scss) and [_dashboard.scss](./scss/_dashboard.scss).

### Prompt
> "Generate signup.html with input fields for full name, email, company name, password, and confirm password, matching the validation fields from PRD. Also generate the HTML shell for dashboard.html with placeholders for a live clock, 4 statistics cards (Total Clients, Active Deals, Won Revenue, New This Week), pipeline overview, and a table/list for top 5 recent clients."

### Result & Evaluation
* **Generated:** Both HTML files and corresponding SCSS styling.
* **Manual Adjustments:** Refined grid columns on `_dashboard.scss` to ensure high-density responsiveness on mobile devices (`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`).
* **What I Learned:** Keeping HTML IDs consistent across views (e.g. `#stat-total`, `#stat-active`, `#stat-revenue`, `#stat-new`) makes future JS binding clean and predictable.

---

## Day 4 — July 19, 2026: Components Library, LocalStorage Layer & Auth Logic

**Git Commits:** `6a3ac48` (Add components style), `666efc8` (Complete main.scss file), `1b0891f` (Create localStorage wrapper), `e0e8b69` (Implement authentication)  
**PRD Module:** Design Components, Storage Abstraction & Auth State  
**Tool:** Cursor AI / ChatGPT (GPT-4o)

### Goal
Implement component styles in [_components.scss](./scss/_components.scss) (buttons, inputs, cards, status badges, modals), compile [scss/main.scss](./scss/main.scss), build [js/storage.js](./js/storage.js) (`STORAGE_KEYS`: `crm_users`, `crm_session`, `crm_clients`, `crm_theme`), and write [js/auth.js](./js/auth.js) for user signup and login validation.

### Prompt (Refined)
> "Write a robust Vanilla JavaScript localStorage wrapper module with safe getItem/setItem helpers that handle JSON parsing errors. Then write auth.js to handle signup and login form submissions: validate email format, enforce password strength (at least 8 chars with letter + digit), check password match, check duplicate emails in crm_users, and save session to crm_session."

### Result & Evaluation
* **Generated:** Helper methods `getItem()`, `setItem()`, `saveUsers()`, `saveSession()`, and form handlers `handleSignupSubmit()` and `handleLoginSubmit()`.
* **Manual Adjustments:** Enforced lowercase normalization for email storing (`email.trim().toLowerCase()`) and fixed password regex validation in `utils.js`.
* **What I Learned:** AI initially stored plain passwords without email normalization. Normalizing emails prevents duplicate accounts with different capitalization (e.g., `User@Test.com` vs `user@test.com`).

---

## Day 5 — July 20, 2026: Dashboard Calculations, Data Layer, Toast & Guard System

**Git Commits:** `26635d0` (Implement dashboard logic), `a7cb5c9` (Complete create data layer), `e8f5be4` (Create toast notification system), `8a16547` (Create application guard system)  
**PRD Module:** Data Abstraction, Dashboard Analytics, App Guard & Notifications  
**Tool:** Cursor AI (Claude 3.5 Sonnet)

### Goal
Implement [js/data.js](./js/data.js) (fetching from DummyJSON `https://dummyjson.com/users?limit=30`, mapping users, `loadClients()`), [js/dashboard.js](./js/dashboard.js) (live clock `setInterval`, stats calculation, pipeline breakdown, 5 recent clients), [js/toast.js](./js/toast.js), and [js/guard.js](./js/guard.js) for route protection.

### Prompt
> "Write data.js to fetch 30 users from https://dummyjson.com/users?limit=30, map them to client model (id, name, email, phone, company, status='Lead', dealValue=random, notes=[]), and sync with crm_clients in localStorage. Write dashboard.js to calculate total clients, active deals (status != Won/Lost), total won revenue, and new clients created within 7 days. Write guard.js to check crm_session and redirect unauthorized users to index.html."

### Result & Evaluation
* **Generated:** Complete data mapping function `mapApiUserToClient()`, `renderStats()`, `renderPipeline()`, `startLiveClock()`, and `requireAuth()`.
* **Manual Adjustments:** Corrected active deals calculation logic: PRD specifies active deals as any status other than 'Won' or 'Lost' (i.e. 'Lead' and 'Contacted').
* **What I Learned:** Seed API data from DummyJSON lacks CRM fields like `dealValue` and `status`. Generating default fallback values during API mapping creates realistic state for client data initialization.

---

## Day 6 — July 21, 2026: Profile Page, User Management & DOM Security Audit

**Git Commits:** `67a2fff` (Create profile page), `956fb74` (Add profile style), `c374332` (Implement profile page logic), `57d7600` (Complete create additional functions)  
**PRD Module:** User Profile, Data Reset & Helper Utilities  
**Tool:** Manual Code Review + Cursor AI

### Goal
Construct [profile.html](./profile.html), [_profile.scss](./scss/_profile.scss), write [js/profile.js](./js/profile.js) (profile editing, password update with current password validation, CRM data reset via `resetClientData()`), and expand [js/utils.js](./js/utils.js) with `escapeHtml()` sanitization.

### Prompt
> "Write profile.js to display current user details, update name/company, change password (verifying current password against stored crm_users password), and reset client data by clearing crm_clients storage and re-fetching from API. Also provide an HTML escaping utility function to prevent XSS."

### Finding & Critical Review
* **Finding:** AI initially rendered client names and company names directly into innerHTML strings without escaping user input, creating potential XSS vulnerabilities.
* **Action:** Created `escapeHtml(str)` in `utils.js` using standard DOM text node encoding and applied it across card and list item renders.
* **What I Learned:** Never trust AI-generated template literals for dynamic HTML rendering. Always sanitize user-contributed strings before inserting them into innerHTML.

---

## Day 7 — July 22, 2026: Clients Page Layout, Status Badges & Modals

**Git Commits:** `88048f7` (Add clients page), `23eef65` (Create clients style)  
**PRD Module:** Clients Management Layout & Modal UI  
**Tool:** Cursor AI (Claude 3.5 Sonnet)

### Goal
Build [clients.html](./clients.html) markup (toolbar with search input, status filters, sort dropdown, Add Client button, client card grid container, Add Client modal, Client Details modal) and style it in [_clients.scss](./scss/_clients.scss).

### Prompt
> "Create clients.html with toolbar (search input, status filter select: All/Lead/Contacted/Won/Lost, sort select: newest/name/dealValue, 'Add Client' button), grid/card list container, and two hidden modal dialogs (#add-client-modal and #client-details-modal). Style cards and status badges."

### Result & Evaluation
* **Generated:** Full markup for clients page toolbar, card layout, status badges (`badge--lead`, `badge--contacted`, `badge--won`, `badge--lost`), and modal overlays.
* **Manual Adjustments:** Added accessibility `aria-hidden` and `hidden` attributes to modal overlay elements for clean toggle control.
* **What I Learned:** Native HTML5 `hidden` attribute with CSS overrides (`[hidden] { display: none !important; }`) provides simple, framework-free modal visibility management.

---

## Day 8 — July 23, 2026: Clients CRUD, DummyJSON Mock Integration & Navigation

**Git Commits:** `d6cd6e6` (Implement clients page logic), `f7a1cd2` (Complete create application navigation), `b9db71d` (Render all style to main file)  
**PRD Module:** Clients Logic, API Requests, Reminders & Global Navigation  
**Tool:** Cursor AI / ChatGPT (GPT-4o)

### Goal
Implement [js/clients.js](./js/clients.js) (filtering/searching/sorting, client status update, client deletion with `deleteClientFromApi`, Add Client form validation & `postClientToApi`, Client Details modal with notes list & 1-minute `setTimeout` follow-up reminder), [js/navigation.js](./js/navigation.js) (active link detection, theme toggle saved in `crm_theme`, logout), and recompile all SCSS into [css/main.css](./css/main.css).

### Prompt (Refined)
> "Write clients.js to handle: 1) Client search, filter, and sort in memory. 2) Add client modal validation matching exact PRD error strings (Name >= 3, email unique, positive deal value), sending POST to https://dummyjson.com/users/add, appending to state and crm_clients. 3) Client details modal allowing note addition and setting a 60-second follow-up timer via setTimeout. 4) Delete client with DELETE request to https://dummyjson.com/users/:id, handling simulated 404 gracefully."

### Result & Evaluation
* **Generated:** `getVisibleClients()`, `validateAddClientForm()`, `postClientToApi()`, `handleReminder()`, `handleDeleteClient()`, and navigation logic.
* **Manual Adjustments:** Fixed DELETE issue where DummyJSON API returns HTTP 404 when deleting newly added local clients because DummyJSON does not persist POST data on its real backend servers. Handled HTTP 404 in `deleteClientFromApi()` as a non-fatal error so local state removal still succeeds.
* **What I Learned:** Simulated mock APIs (like DummyJSON) don't actually save POSTed records on their servers. The frontend state (`clientsState`) synced to `localStorage` must act as the true single source of truth.

---

## Day 9 — July 24, 2026: Documentation, Package Build Scripts & Audit

**Git Commits:** `778446b` (Add readme file), `24caa4b` (Add package files to project)  
**PRD Module:** Project Finalization, Documentation & Build Configuration  
**Tool:** Cursor AI (Claude 3.5 Sonnet)

### Goal
Create comprehensive project documentation in [README.md](./README.md), configure [package.json](./package.json) with Sass build scripts (`npm run sass`, `npm run sass:watch`), and perform a complete end-to-end verification against PRD specifications.

### Prompt
> "Generate package.json with dependencies for sass compilation scripts. Generate a clear README.md in English covering About, Features, Tech Stack, How to Run, Live Demo link (Vercel), Test Account credentials, Project Structure, and Credits."

### Result & Evaluation
* **Generated:** Complete `package.json` build setup and structured `README.md`.
* **Manual Adjustments:** Verified test credentials (`demo@test.com` / `demo1234`), confirmed live Vercel deployment link (`https://antar-crm.vercel.app/`), and audited all 9 project files against PRD requirements.
* **What I Learned:** Clear documentation and build scripts turn a collection of scripts into a professional, reproducible portfolio project ready for exam submission and team collaboration.

---

## Day 10 — July 25, 2026: Comprehensive Technical Documentation & Architecture Synthesis

**Git Commits:** `9d9ce30` (Complete write AI log file), `a6f6938` (Complete write glossary), `b784ead` (Complete write research notes)  
**PRD Module:** Documentation & Technical Audit  
**Tool:** Cursor AI (Claude 3.5 Sonnet)

### Goal
Synthesize technical learnings into a comprehensive documentation suite: write initial development logs ([ai-log.md](./ai-log.md)), build a bilingual technical glossary ([glossary.md](./glossary.md)) with EN/KA explanations and file references, and document deep-dive research notes ([research-note.md](./research-note.md)) covering Fetch API, LocalStorage wrappers, SCSS modular architecture, and XSS sanitization.

### Prompt
> "Generate structured project documentation: 1) ai-log.md detailing daily goals, tools, prompts, manual edits, and learnings aligned with git commits. 2) glossary.md defining 12 core technical terms in English and Georgian with code pointers. 3) research-note.md detailing research topics on Fetch API, localStorage singleton wrappers, SCSS @use modules, and OWASP XSS prevention."

### Result & Evaluation
* **Generated:** Structured markdown documentation for `ai-log.md`, `glossary.md`, and `research-note.md`.
* **Manual Adjustments:** Verified all internal markdown file links and line references across `js/` and `scss/` directories. Enforced dual English and Georgian technical explanations for maximum clarity.
* **What I Learned:** Technical documentation serves as a critical bridge between raw git commits and architectural understanding, highlighting key engineering decisions such as state synchronization, security sanitization, and error boundary handling.

---

## Day 11 — August 1, 2026: UX Polish, Dynamic Form States & Branding Assets

**Git Commits:** `bf8e376` (Implement profile submit button disable funtionality), `319bbf9` (Add favicon)  
**PRD Module:** Profile UX Polish & Brand Identity  
**Tool:** Cursor AI / ChatGPT (GPT-4o)

### Goal
Enhance [profile.html](./profile.html) form UX by disabling the "Save Changes" submit button (`#profile-form-btn`) when input values match stored user data and enabling it dynamically upon input changes. Add custom disabled styling in SCSS and attach application favicon ([favicon.ico](./favicon.ico)) to all HTML pages.

### Prompt
> "Modify profile.js so that the Save Changes button is disabled by default when rendering profile data. Add input event listeners on fullName and company fields to check if current values differ from stored user session, toggling button disabled state accordingly. Add Sass styling for disabled primary button using a dedicated color token ($color-primary-disabled: #a5b4fc) and cursor: not-allowed. Also add favicon.ico link tag to all 5 HTML headers."

### Result & Evaluation
* **Generated:** JS event handling functions `handleProfileFormChanges()` and `renderProfileInfo()`, SCSS design token `$color-primary-disabled`, disabled state styling in `_components.scss`, and `<link rel="icon" href="favicon.ico" type="image/x-icon">` tags in all HTML files.
* **Manual Adjustments:** Corrected initial state render in `renderProfileInfo()` to explicitly set `btn.disabled = true` upon page load or reset, preventing invalid submit triggers before user interaction.
* **What I Learned:** Dynamic form state management ("dirty checking") prevents unnecessary storage writes, reduces redundant user clicks, and provides clear visual feedback through CSS `:disabled` states and tokens.

---

## Summary of Key AI Learnings across 11 Days

1. **Boilerplate vs Business Logic:** AI excels at rapidly generating standard boilerplate (HTML markup, basic CSS layouts), but requires tight prompt parameters to enforce specific PRD constraints (e.g. exact error strings, field validation rules).
2. **Architecture & Module Boundaries:** Modern build tools (Sass `@use` modules, ES6 imports) require strict manual verification to prevent global namespace pollution or silent build failures.
3. **Mock API Reality:** When working with simulated APIs (DummyJSON), client-side state management in `localStorage` must be designed as the ultimate source of truth.
4. **Security Responsibility:** AI model output does not automatically include XSS protection or data sanitization (`escapeHtml()`); security audits are always the developer's manual responsibility.
5. **Interactive UI State & Micro-UX:** Subtle state improvements—such as dirty-checking form inputs to disable redundant submit actions and standardizing branding with favicons—greatly enhance application polish and user clarity.
