# AI Usage Log (D1 - AI Usage)

This document outlines 5 specific instances of using Artificial Intelligence during the development of the 10X CRM project, focusing on architecture, optimization, and best practices.

---

### Entry 1: Architecture and Task Breakdown
- **Goal:** Properly structure the application architecture and break down the PRD into actionable tasks.
- **Prompt:** "I am building a 10X CRM project using HTML, CSS and Vanilla JS. Let's start by breaking down the PRD into modular tasks. We need to separate the data layer (localStorage/fetch API) from the UI rendering logic. Create a structured task list that we can follow step-by-step to maintain separation of concerns."
- **Tool:** Claude/Antigravity
- **Result:** **Used**. The AI generated a `task.md` file with a precise, modular plan separating data logic (`data.js`, `storage.js`) and UI manipulation (`app.js`, `clients.js`).
- **What I learned:** The critical importance of upfront architectural planning and the "Separation of Concerns" principle. Breaking code into modules prevents spaghetti code and makes scaling easier.

---

### Entry 2: Code Refactoring and DRY Principle (Critical Evaluation)
- **Goal:** Avoid code duplication and extract validation logic into a shared module.
- **Prompt:** "Here are my signup.js and auth.js files. Both have their own copy of an email-format check and a version of a function that adds a red error class under an input. It violates DRY principles. Let's split this out into a shared validation.js module."
- **Tool:** Claude/Antigravity
- **Result:** **Modified / Rejected partially**. The AI suggested creating a shared file, but it tried to attach global DOM events directly inside the validation file, which creates tight coupling and potential memory leaks. I rejected the DOM manipulation part, kept only the "Pure Functions" (`isValidEmail`, `isValidPassword`) in `validation.js`, and handled the DOM logic locally.
- **What I learned:** AI often tries to do too much in one function. I learned that separating pure logical functions from DOM-manipulating functions is crucial for testability and clean architecture.

---

### Entry 3: Performance Optimization (Debounce & Memoization)
- **Goal:** Optimize the live search functionality for the clients table.
- **Prompt:** "When searching for clients, the render function is called on every single 'keyup' event. Wouldn't it be better to use a memoizing function or debounce here to prevent excessive DOM repaints?"
- **Tool:** Claude/Antigravity
- **Result:** **Used**. The AI agreed and provided a `debounce` function that waits for 300ms after the user stops typing before re-rendering the DOM.
- **What I learned:** I learned how resource-intensive DOM updates (`Reflow / Repaint`) are for the browser, and how techniques like `Debounce` or `Memoization` save system resources when filtering large datasets.

---

### Entry 4: API Integration and Data Normalization (Adapter Pattern)
- **Goal:** Adapt users fetched from DummyJSON to our specific CRM schema.
- **Prompt:** "I need to populate my CRM with initial data on page load. Write a function that fetches users from dummyjson.com/users?limit=30, maps them to our schema by adding a default 'status' of 'Lead' and a random 'dealValue' between 500 and 10000, and then saves this array directly into localStorage so the UI can render it."
- **Tool:** Claude/Antigravity
- **Result:** **Modified**. The AI wrote the correct fetch and mapping logic, but it executed the fetch unconditionally on every page load. I had to wrap the AI's code in a condition to check if `localStorage` is empty first, otherwise it would overwrite any local edits every time the user refreshed the page.
- **What I learned:** The concept of the Adapter Pattern. External APIs should not dictate our internal application state structure; data must be mapped and transformed as soon as it arrives.

---

### Entry 5: Advanced UI/UX (Prompt Refinement)
- **Goal:** Create a flawless, synchronized animation when switching to Dark Mode.
- **Prompt 1 (Vague):** "Write CSS to transition colors smoothly when switching to dark mode."
- **AI Response:** The AI globally applied `* { transition: all 0.3s ease; }`. This worked, but it made hover states sluggish and caused browser performance drops.
- **Prompt 2 (Refined):** "Using universal selectors `*` for transitions causes massive layout recalculation costs and makes hover states sluggish. Can we instead implement a solution where we inject a temporary `.theme-transition` class on the body only during the toggle event, and remove it after animation ends with `{ once: true }` using JS?"
- **Result:** **Used**. The AI provided the exact logic requested, allowing perfectly synchronized color changes without hurting performance.
- **What I learned:** Global CSS transitions are an anti-pattern for performance. Orchestrating temporary CSS classes via JavaScript provides a much higher quality UX without overhead.

---

### Entry 6: Overriding Browser Native Styles (Chrome Autofill Bug)
- **Goal:** Fix Chrome's autofill styling overriding Dark Mode text colors.
- **Prompt:** "When using Dark Mode, Chrome's autofill forcibly changes my input background and text color to light mode styles. I tried overriding `:-webkit-autofill` using CSS variables like `var(--bg-card)` and `var(--text-primary)`, but the text still renders black when focused. How do I fix this CSS variable resolution bug in Chromium's Shadow DOM?"
- **Tool:** Claude / Antigravity
- **Result:** **Used**. The AI explained that CSS variables inside `:-webkit-autofill` pseudo-classes often fail to update dynamically when the parent `.dark-theme` class changes. It provided a robust fix using explicit hardcoded hex values contextually mapped to `.dark-theme input:-webkit-autofill`, and advised adding `color-scheme: dark;` to the CSS root.
- **What I learned:** I learned how aggressively browsers protect their native UI elements and how to bypass Chromium Shadow DOM variable bugs using hardcoded contextual CSS rules and the `color-scheme` property.
