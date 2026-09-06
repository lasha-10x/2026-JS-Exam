# AI Usage Log

Format for each entry: **Goal** → **Prompt** (verbatim) and **Tool** → **Outcome** (used / adapted / rejected — why) → **What I learned**.

---

## 1. Scaffolding the project structure

**Goal:** Decide the file layout and shared CSS variables before writing any page.

**Prompt (Claude Code):** "Set up a vanilla JS CRM with 5 static HTML pages (index, signup, dashboard, clients, profile) sharing one css/ file and small JS modules. No frameworks, no build tooling."

**Outcome:** Used, with a small change — I kept `Storage`, `UI`, `DataStore` as single exported objects (namespaces) instead of many separate named exports, because it made autocomplete and reading call sites (`Storage.getUsers()`, `UI.showToast(...)`) clearer than a long list of bare imports.

**What I learned:** A flat file layout with one shared module per concern (storage, UI helpers, data fetching) avoids copy-pasting the same `localStorage` calls into five different page scripts.

---

## 2. Sign-up validation rules

**Goal:** Implement the six sign-up validation rules with the exact error text the PRD requires.

**Prompt (Claude Code):** "Write the sign-up form handler: validate full name, email format, duplicate email (case-insensitive), password strength, and confirm-password match, all at once on submit, using these exact error strings: [pasted the PRD table]."

**Outcome:** Used as-is. The regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` for email and the `password.length >= 8 && /[a-zA-Z]/.test() && /[0-9]/.test()` check for password strength matched exactly what I would have written, and collecting all errors into one pass (instead of stopping at the first invalid field) was already handled correctly.

**What I learned:** Validating everything before returning (instead of an early `return` per field) is what makes "all errors show at once" work — a small ordering detail that's easy to get wrong if you're not thinking about it up front.

---

## 3. Prompt refinement — the DummyJSON → Client mapping

**Goal:** Turn a DummyJSON `/users` response into the app's `Client` shape.

**First prompt:** "Convert DummyJSON users into clients for my CRM."
This produced a mapping that used `user.company` directly as a string, which crashes because DummyJSON's `company` is an object (`{ name, ... }`), not a string.

**Refined prompt:** "Convert DummyJSON users into clients. Each user has `company: { name: string }` — extract just the name, and default to an empty string if `company` is missing entirely."

**Outcome:** Used the second version — `apiUser.company ? apiUser.company.name : ''`. I added the null-guard myself after testing with a user object that had `company: null` and getting a `Cannot read properties of null` error.

**What I learned:** Vague prompts get you code that works for the "happy path" example but not the actual shape of the real API response. Pasting one real sample object into the prompt (or testing right away) catches this fast.

---

## 4. Critical evaluation — delete request error handling

**Goal:** Handle deleting a client whose id only exists locally (added by this session, never really saved by DummyJSON).

**Prompt (Claude Code):** "Implement the delete button: confirm, DELETE to DummyJSON, then remove from local state and localStorage."

**What the AI produced first:** A version that only removed the client from `state.clients` if the DELETE request resolved with `response.ok`, showing an error toast otherwise.

**Why I rejected this:** The PRD explicitly says DummyJSON will 404 for ids we added ourselves, because it doesn't persist writes — and that this is expected, not a real error. Treating a 404 as a failure would mean a client you just added could never be deleted again, which is wrong. I changed the code to always remove the client from local state regardless of the response, and only use `try/catch` to swallow network failures (not HTTP status codes) so a genuinely offline browser doesn't hang the UI.

**What I learned:** AI-generated error handling defaults to "treat any non-2xx as a failure," which is a reasonable default in general but is actually wrong for this specific API's documented quirk — reading the PRD's own explanation of _why_ DummyJSON behaves this way mattered more than following a generic best practice.

---

## 5. Dashboard stats with reduce/filter

**Goal:** Compute the four dashboard stat cards (Total Clients, Active Deals, Won Revenue, New This Week) from the same client list the Clients page uses.

**Prompt (Claude Code):** "Add a dashboard that computes total clients, active deals (not Won and not Lost), won revenue (sum of dealValue where status is Won), and clients created in the last 7 days, from the same DataStore.loadClients() the Clients page already uses."

**Outcome:** Used as-is. The `(Date.now() - new Date(client.createdAt)) / 86400000 <= 7` calculation for "last 7 days" matched the PRD's own formula, and reusing `DataStore.loadClients()` (instead of writing a second fetch) meant the dashboard and Clients page never disagree about the client list.

**What I learned:** Because DummyJSON clients are seeded with `createdAt: new Date().toISOString()` at load time, every client counts as "new this week" right after a fresh load — a good reminder to test this stat against clients from the previous week, not just freshly-seeded ones, when demoing the app.
