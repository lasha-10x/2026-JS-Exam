# AI Usage Log - 10X CRM

## 1. Tools Used
* **ChatGPT (OpenAI)** - Used for architectural planning, debugging, and code optimization.

---

## 2. Specific Use Cases & Prompts

### A. Project Structure & Auth Guard
* **Prompt:** *"How to implement a secure client-side router/auth-guard in vanilla JS using localStorage?"*
* **AI Output:** Provided a basic redirection script using `window.location.href`.
* **My Refinement:** I separated the logic into `guard.js` (which runs at the very top of protected HTML headers to prevent page flicker) and `auth.js` for handling login/logout sessions.

### B. Dynamic Filtering & Search Sync
* **Prompt:** *"How can I search, filter by status, and sort an array of clients at the same time in JavaScript?"*
* **AI Output:** Suggested three separate event listener functions that directly render elements.
* **My Refinement:** I realized this approach would cause conflicts (e.g., searching would overwrite active filters). I refactored the code to use a single source of truth function, `getVisibleClients()`, which processes all filters sequentially and then triggers a single render function.

### C. CSS Theme Toggle (Dark/Light Mode)
* **Prompt:** *"Provide a CSS variable template for dark and light modes with a JS switcher."*
* **AI Output:** Provided a CSS file with `.dark-theme` classes.
* **My Refinement:** Integrated it into `style.css` using `:root` custom properties and updated `common.js` to ensure the selected theme persists in `localStorage` across page reloads.

---

## 3. Critical Evaluation & Code Corrections

While AI was extremely helpful in generating boilerplate code, I had to actively debug and correct several critical issues:

1. **State Mutation Bug:** ChatGPT initially suggested using `.reverse()` directly on the main client array for sorting. I corrected this by using the spread operator `[...clients]` to avoid mutating the original data state.
2. **Infinite Fetch Loop:** During the implementation of the DummyJSON fetch, a raw AI snippet would trigger a fetch on every single page render. I corrected this by checking if the data already exists in `localStorage` before initiating any API requests.
3. **API Data Mapping:** The DummyJSON user object properties (like `firstName` and `lastName`) did not match my CRM UI design. I manually wrote a mapper function to transform the API response into my custom Client schema.

---

## 4. Student Reflection
Using AI drastically sped up my layout creation and helped me debug tricky asynchronous operations (like combining `setTimeout` for follow-ups with UI renders). However, manual review, structured testing, and code refactoring were absolutely necessary to keep the codebase modular, secure, and clean.

**Author:** Tamta Bitadze