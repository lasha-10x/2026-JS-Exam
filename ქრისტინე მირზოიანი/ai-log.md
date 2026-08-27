# AI Usage Log (10X CRM)

This log documents key prompts, AI tool interactions (Gemini / AI Studio), generated outcomes, and developer learnings during the development of **10X CRM**.

---

### Entry 1: AuthGuard & Page Session Management
* **Goal / Purpose**: Prevent unauthorized users from viewing protected pages (`dashboard.html`, `clients.html`, `profile.html`) and redirect logged-in users away from `index.html`.
* **Prompt**: "Create a single AuthGuard class in guard.js that checks localStorage for crm_session. If session is missing and user is on protected page, redirect to index.html. If session exists and user is on login/signup, redirect to dashboard.html."
* **Tool Used**: Gemini (AI Studio)
* **Result**: Generated `AuthGuard.check()` and `AuthGuard.getCurrentPage()` using `window.location.pathname.split('/').pop()`.
* **What I Learned**: Learned how URL pathname parsing works with `.split('/')` and `.pop()`, and how `window.location.href` handles immediate client-side redirects.

---

### Entry 2: Asynchronous API Fetching & LocalStorage Caching
* **Goal / Purpose**: Fetch 30 initial users from DummyJSON API (`https://dummyjson.com/users?limit=30`) on first load and store them in `localStorage`.
* **Prompt**: "Write an async load() method in ClientsPage class. Check if crm_clients exists in localStorage. If yes, load it. If no, show loading indicator, fetch 30 users from DummyJSON, map them to Client objects, save to localStorage, and render."
* **Tool Used**: Gemini (AI Studio)
* **Result**: Implemented robust `try/catch` block with `response.ok` check, array `map` transformation, `localStorage` caching, and error state UI with retry button.
* **What I Learned**: Mastered `async/await` syntax, error handling with `try/catch/finally`, and transforming external API payloads into application state schemas.

---

### Entry 3: Multi-Stage Filtering & Sorting Logic
* **Goal / Purpose**: Combine real-time search input, pipeline status filter chips, and sorting dropdown into a single reactive function.
* **Prompt**: "Create a getVisibleClients() helper function that takes the raw clients array, applies text search on name or company, filters by status chip if not 'All', and sorts by newest date, name A-Z, or deal value high-to-low."
* **Tool Used**: Gemini (AI Studio)
* **Result**: Produced a clean, non-mutating pure function that operates on a shallow copy (`[...this.clients]`) using JS Array methods: `.filter()`, `.sort()`, and `.localeCompare()`.
* **What I Learned**: Understood the importance of immutability when sorting/filtering arrays so the primary state array is never corrupted or destroyed.

---

### Entry 4: Event Delegation for Client Action Buttons & Cards
* **Goal / Purpose**: Handle clicks for dynamically generated client cards, status dropdowns, and delete buttons without binding event listeners to each individual card.
* **Prompt**: "Use event delegation on clientsContainer. Detect if click target is .btn-delete to delete client, .card-status-select to ignore card modal, or .client-card to open details modal."
* **Tool Used**: Gemini (AI Studio)
* **Result**: Attached a single `click` event listener to `this.container` using `e.target.classList.contains()` and `e.target.closest('.client-card')`.
* **What I Learned**: Learned Event Delegation pattern, `e.stopPropagation()` to prevent unwanted parent click triggers, and `dataset.id` HTML attribute reading.

---

### Entry 5: LED Glow Style Action Buttons & Light/Dark Theme CSS Variables
* **Goal / Purpose**: Design vibrant LED/neon style action buttons with soft `box-shadow` glows and maintain full visual clarity across Dark Mode and Light Mode.
* **Prompt**: "Add CSS rules for .btn-card-edit and .btn-delete with translucent background, colored border, and soft glowing box-shadow. Also implement complete light theme overrides in CSS under body.light-theme."
* **Tool Used**: Gemini (AI Studio)
* **Result**: Created glowing LED button styling with hover elevation and detailed `body.light-theme` CSS rules covering cards, inputs, chips, badges, and modals.
* **What I Learned**: Deepened knowledge of CSS `box-shadow` layers (`inset` + outer glow), CSS color contrast ratios, and `body.light-theme` class toggle architecture.
