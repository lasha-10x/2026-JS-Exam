# AI Usage Log (10X CRM)

### Entry 1
* **Goal**: Implement login validation logic.
* **Prompt**: "Write vanilla JavaScript validation for email and password inputs."
* **Result**: Used with modification. Added custom error span logic adhering to PRD requirements.
* **Learned**: Event prevention on form submit and custom visual error indicators.

### Entry 2
* **Goal**: State synchronization with LocalStorage.
* **Prompt**: "How to handle dummyjson fetch fallback if localstorage has data?"
* **Result**: Used directly. Created conditional load flow (`Storage.getClients() || fetchClients()`).
* **Learned**: Preventing unnecessary API network calls when local cache exists.

### Entry 3
* **Goal**: Implement combining search, filtering, and sorting in JavaScript.
* **Prompt**: "Create a single function in JS that filters an array by category, text search, and then sorts it without mutating original state."
* **Result**: Critical evaluation & used. AI originally mutated array using `.sort()`. Refactored to spread operator `[...array].sort()`.
* **Learned**: Importance of non-mutating array operations in application state management.

### Entry 4
* **Goal**: Prompt refinement for Dashboard stats calculation.
* **Prompt (Initial)**: "Calculate revenue from clients array." (Too vague)
* **Prompt (Refined)**: "Write JS function using array reduce to sum dealValue property of objects where status equals 'Won'."
* **Result**: Refined prompt yielded exact reduce standard function.
* **Learned**: Precise prompts yield correct array methods (`filter()` + `reduce()`).

### Entry 5
* **Goal**: Build dynamic modal with timer for reminders.
* **Prompt**: "How to implement a 1-minute delayed notification in JavaScript toast without blocking UI?"
* **Result**: Used `setTimeout` with non-blocking callback.
* **Learned**: Asynchronous timers in browser event loop.

### Entry 6
* **Goal**: Full pre-exam review of the whole project - check that every HTML page, its CSS, and its JS actually agree with each other and with the PRD.
* **Prompt**: "Review this PRD against my code and fix whatever is broken so the app actually works end-to-end."
* **Result**: Critical evaluation & heavily modified. Found that `signup.html`/`index.html` never loaded `storage.js`/`guard.js`, so `signup.js`/`login.js` fell back to a second, incompatible local-storage schema (`10x_crm_users`, plain `alert()`s) instead of the PRD's `crm_users`/`crm_session`. `dashboard.html` had hard-coded fake numbers with no matching element `id`s, so `dashboard.js` updated nothing. `clients.html` and `profile.html` used completely different element `id`s than the ones `clients.js`/`profile.js` expected (e.g. `clients-container` vs `clientsContainer`), and neither page even had the Add-Client/Details modals or the Reset-Data button in the markup. `nav.js`'s logout ran `localStorage.clear()`, wiping accounts and clients, not just the session. Rewrote `signup.js`/`login.js`/`dashboard.js`/`nav.js` against the shared `Storage`/`UI` modules, rebuilt all five HTML pages so every `id` and class actually matches the JS and CSS, pulled the duplicated client-fetch logic out into one shared `js/data.js` (per P3.5), and verified the full flow (signup → login → dashboard → clients CRUD/notes/reminder → profile edit/password/reset → logout → re-login → reload-persistence) with an automated headless-browser test.
* **Learned**: Individual files can each look correct in isolation and still add up to a broken product if the `id`s/classes connecting HTML, CSS, and JS were never actually checked against each other - this is exactly why the exam grades "does it work end-to-end" separately from "is each piece well written." Writing an automated test that clicks through the whole PRD happy-path is a fast way to catch these wiring gaps before the live demo.