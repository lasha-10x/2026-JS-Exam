# AI Usage Log — 10X CRM

This log documents how I used AI (Claude, Anthropic) while building this project: what I asked for, what I did with the answer, and what I actually learned from it. Per the assignment rules, using AI for the whole build is allowed — this file (plus being able to explain the code live) is what proves I understand what it produced.

> **Note to self before the exam:** re-read this the night before. If any entry doesn't ring true anymore — if I can't actually explain *why* a decision was made — go re-read that part of the code until I can.

---

### Entry 1 — Understanding the assignment and picking an approach

**Goal:** Turn the PRD into an actual build plan before writing any code.

**Prompt:** "I have to do an individual project and exam project. [uploaded the PRD] Please explain everything to me step by step and do this project for me."

**Tool:** Claude (Anthropic), claude.ai, web/chat interface.

**Result — used:** Claude summarized the grading structure (quiz + project + AI log + English), and confirmed the PRD's own recommendation: build CORE completely (auth + basic Clients CRUD) before touching any FULL feature. It proposed a file structure (`storage.js`, `guard.js`, `nav.js`, `toast.js`, `data.js`, plus one JS file per page) instead of putting everything in one big script.

**What I learned:** Splitting "one thing does one job" (e.g. `storage.js` is the *only* file that touches `localStorage` directly) isn't just neat — it's exactly what makes it possible to answer "why is your code organized this way?" at the exam without rehearsing a speech. If I only remember one thing from this whole log, it should be this file layout and why it exists.

---

### Entry 2 — Sign Up / Login validation rules

**Goal:** Implement the exact validation rules from the PRD (all errors at once, exact error text).

**Prompt:** "Build signup.html and index.html with the validation table from the PRD — full name, email, password, confirm password rules, all errors shown at once, not stopping at the first failure."

**Tool:** Claude (Anthropic).

**Result — used, with one change:** The generated `auth.js` originally had the field-error helper functions (`setFieldError`, `clearFieldError`) written directly inside `auth.js`. When the Clients page later needed the exact same "show error under a field" behavior for the Add Client form, I asked Claude to pull those functions into their own `validation.js` file instead of copy-pasting them a second time — same principle as `storage.js`.

**What I learned:** The password rule (`length >= 8` AND has a letter AND has a digit) needs all three checks combined with `&&`/`||` correctly — I made sure I could rewrite that regex-and-condition combo from memory, since "change the minimum password length" is exactly the kind of live edit the exam might ask for.

---

### Entry 3 — Clients: search + filter + sort combined (prompt refinement example)

**Goal:** Add search, status filters, and sorting to the Clients page, all usable together.

**First prompt (too vague):** "Add search to the clients page."

**What happened:** This alone doesn't say *how* search should interact with the filter chips and sort dropdown that also needed to exist — a literal reading could search only, ignoring that all three had to combine without stepping on each other.

**Refined prompt:** "Search, the 4 status filter chips, and the sort dropdown all need to work *together* — e.g. searching within only 'Lead' clients, sorted by deal value. None of them should be allowed to mutate the original `clients` array, since Delete and Add still need to work on the full, untouched list."

**Tool:** Claude (Anthropic).

**Result — used:** This produced `getVisibleClients()` — one function that takes a *copy* of `clients` (`[...clients]`), applies the status filter, then the search text, then the sort, and returns that as a new array. `renderClients()` never receives `clients` directly anymore, always `getVisibleClients()`.

**What I learned:** The vague version of the prompt would have technically "worked" for search alone but would have broken the moment I combined it with a filter chip. Being specific about *how features interact*, not just what each one does in isolation, mattered more than I expected.

---

### Entry 4 — Delete: the DummyJSON 404 quirk (critical evaluation example)

**Goal:** Wire up the Delete button to actually call the API, per the PRD.

**Prompt:** "Add delete: confirm(), then DELETE https://dummyjson.com/users/{id}, then remove from state and save."

**Tool:** Claude (Anthropic).

**Result — reviewed and specifically tested, not just accepted:** I deliberately tested deleting a client I had just added through the "+ Add Client" form (as opposed to one of the original 30 loaded from the API). That delete call came back `404 Not Found` — because DummyJSON's `/users/add` endpoint never actually saves the new user server-side, it just echoes back a fake ID. A naive implementation that treats any non-`ok` response as a failure would silently refuse to delete that client from the UI, which is a real bug a user would notice immediately.

I asked Claude to explain why, then had it change `deleteClientFromAPI()` so it does **not** throw on a non-OK status — it just performs the request and lets local removal happen regardless, since `localStorage` (not DummyJSON) is this project's actual source of truth. A genuine network failure (not just a 404) still gets caught and logged.

**What I learned:** "The AI's code ran without errors" and "the AI's code is correct" are not the same thing — I only caught this because I tested the *specific case* of deleting a self-added client, not just one of the pre-loaded ones. This is the exam-question answer for "why doesn't delete throw on 404?"

---

### Entry 5 — Dashboard: reusing, not duplicating, the data logic

**Goal:** Build the Dashboard's 4 stats + pipeline bar + recent list.

**Prompt:** "Dashboard needs to read the same client data Clients page uses — same localStorage-first-then-API loading — don't write a second version of that logic."

**Tool:** Claude (Anthropic).

**Result — used:** `loadClients()` (in `data.js`) is called from both `dashboard.js` and `clients.js`. The stat calculations (`filter`+`length`, `filter`+`reduce` for Won Revenue) live only in `dashboard.js` since only the Dashboard needs them, but the *loading* logic is shared.

**What I learned:** "Shared" doesn't mean everything goes in one file — it means shared *data* and shared *rules* (like how a status maps to a badge color, which ended up in `ui.js`) go in one place, while page-specific display logic stays on its own page. Deciding what counts as "shared" vs "page-specific" was the actual judgment call here, not something to accept blindly.

---

### Entry 6 — Profile: password change validation order

**Goal:** Build the Change Password form with the PRD's three rules.

**Prompt:** "Change Password: current password must match, new password needs the same strength rule as signup, new must differ from current, confirm must match new."

**Tool:** Claude (Anthropic).

**Result — used, with a correction:** An early version compared the *new* password against the submitted *current-password input* to check "must be different from current" — but if the user had mistyped their current password, that comparison would be against the wrong value. I asked Claude to compare the new password against `user.password` (the actual stored value) instead, so the "must be different" check is meaningful even when the current-password field itself is wrong.

**What I learned:** Small variable-naming mix-ups (comparing against user input instead of stored state) are an easy AI mistake to miss on a skim — I only found it by tracing through the "what if the current password is wrong AND the new password happens to equal it" case by hand.

---

## Summary

Six entries above cover the whole build: architecture, auth validation, combinable list features (with a documented vague→refined prompt), a caught-and-fixed API-behavior bug, shared-vs-page-specific data logic, and a caught logic error in a validation comparison. Two things stayed constant across all of them: I tested edge cases myself (self-added-client delete, wrong-current-password), and I asked "why" before accepting a change to the architecture.
