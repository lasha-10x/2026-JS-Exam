# 10X CRM AI Usage Log

This log records the ways I used OpenAI Codex as a learning and development assistant. I designed and built the project myself, using AI for targeted planning, debugging, review, and documentation support.

## Entry 1 — Planning the folder structure

**Goal:** Organize the project before building the CRM features.

**How AI helped:** I asked for a second opinion on separating page-specific code from shared code. Codex suggested keeping shared concerns such as storage, navigation, theme handling, and access guards in their own files, while leaving page behavior in `auth.js`, `dashboard.js`, `clients.js`, and `profile.js`.

**My contribution:** I chose the final page layout and adapted the structure to match the requirements of the project.

**What I learned:** Separating responsibilities early makes a project easier to test, explain, and change without affecting unrelated pages.

## Entry 2 — Fixing the light-theme flash

**Goal:** Stop a brief dark-theme flash when a visitor had previously selected light mode.

**How AI helped:** Codex explained that the normal theme script runs after the HTML is parsed, which can be too late for the first paint. It helped me use a small `theme-init.js` script that reads the saved theme before the main stylesheet finishes rendering.

**My contribution:** I tested the behavior in the browser, kept the existing theme-toggle logic, and confirmed that the saved theme still worked on both public and protected pages.

**What I learned:** Scripts placed early in the page can prevent visual flicker when they apply a saved preference before the browser paints the interface.

## Entry 3 — Understanding sessions and page protection

**Goal:** Make sure private CRM pages require a valid login.

**How AI helped:** I used Codex to explain how a small session object can identify the logged-in user without copying the entire user record. It reviewed the relationship between `getSession()`, `getUserForSession()`, `protectPage()`, and `clearSession()`.

**My contribution:** I implemented the final access rules and used `data-page-access` values to decide whether each page should redirect a visitor.

**What I learned:** A saved session must be checked against the saved users list; the presence of a localStorage key alone is not enough to prove that a user is valid.

## Entry 4 — Reviewing client-list behavior

**Goal:** Improve the Clients page while keeping search, filtering, sorting, and CRUD actions understandable.

**How AI helped:** Codex explained array methods such as `filter()`, `find()`, `some()`, and `sort()`, and why copying an array with `[...clients]` before sorting protects the original application state. It also helped me reason about event delegation for dynamically rendered cards.

**My contribution:** I built the interaction flow, selected the status rules and card content, and checked that changes persisted after refreshing the page.

**What I learned:** Rendering a changing list is simpler when the page state is kept in one array and the display is recreated from that state.

## Entry 5 — Creating the technical glossary

**Goal:** Better understand the JavaScript used in the project and document it for future reference.

**How AI helped:** I asked Codex to explain browser and JavaScript tools used throughout the codebase, including `preventDefault()`, `closest()`, `addEventListener()`, `localStorage`, `fetch()`, array methods, and session helpers.

**My contribution:** I used the explanations to review the code, added my own notes, and kept the glossary focused on the techniques actually used in this CRM.

**What I learned:** Understanding small built-in methods makes larger functions much easier to follow, because most application logic is made from those small pieces.

## Entry 6 — README and final documentation review

**Goal:** Make the repository easier for another person to understand and run.

**How AI helped:** Codex reviewed the README structure and suggested covering the project purpose, features, technologies, API endpoints, localStorage keys, setup instructions, test-account guidance, and the educational security limitation of browser-stored passwords.

**My contribution:** I wrote and verified the project-specific content, chose what to include, and made sure the documentation matched the final application.

**What I learned:** Good documentation explains both how to run a project and the important implementation choices behind it.
