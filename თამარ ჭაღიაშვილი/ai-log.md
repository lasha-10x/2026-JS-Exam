# AI Usage Log — 10X CRM

Tool used throughout: Claude (Anthropic), in a code-execution/chat environment with direct file read/write access.

---

### 1. Project scaffolding and design system

**Goal:** Decide on a file structure and a visual identity before writing any page, so I wasn't restyling things later.

**Prompt:** "Set up the file structure for a vanilla JS CRM (index.html, signup.html, dashboard.html, clients.html, profile.html + css/ + js/), then design a distinctive dark UI — not the generic AI-cream-and-terracotta or near-black-neon look — themed around a sales 'control tower': dark surface, one amber accent, a signature visual for the pipeline stats."

**Result:** Used as-is. The "signal bar" pipeline visualization (small vertical bars per status, like a level meter) became the one distinctive visual element and got reused nowhere else, which kept the rest of the UI restrained.

**What I learned:** Deciding the token system (colors/type/one signature element) *before* building pages saved time — I never had to go back and re-theme a finished page.

---

### 2. Form validation logic matching the PRD exactly

**Goal:** Implement the 6 signup validation rules with the exact error strings from the spec.

**Prompt (first try, too vague):** "Add validation to the signup form."
**Result:** Generic messages like "Invalid email" and "Passwords don't match" — close, but not the literal text the PRD requires, and it didn't test password length before the letter/number check.

**Prompt (refined):** "Validate these 5 fields with these exact rules and these exact error strings: [pasted the P1.2 table verbatim]. All errors must appear at once on submit, not one at a time."

**Result:** Used as-is after refining. Correct now.

**What I learned:** For anything graded against exact text (error messages, key names), paste the spec's literal wording into the prompt instead of describing it — otherwise the model reasonably "improves" the copy and it stops matching what the grader checks for.

---

### 3. DummyJSON delete behavior — caught a wrong assumption

**Goal:** Implement DELETE for clients.

**Prompt:** "Write deleteClientViaApi(id) that DELETEs from DummyJSON and only removes the client from local state if the request succeeds."

**Result:** The first version only removed the client from `clientsState` when `res.ok` was true. I re-read the PRD note that DummyJSON returns 404 for ids it never actually stored (like ones we generated during Add Client) and realized this "safe" version would silently fail to delete locally-added clients — the exact case that would come up during grading. Rejected the first version and rewrote it to treat both 200 and 404 as "proceed with local delete," only throwing on other error codes.

**What I learned:** "Only trust it if the API confirms success" sounds like the safe default, but it was wrong for *this* API's documented quirk. Worth checking API-specific behavior notes in the spec before applying a generic error-handling pattern.

---

### 4. Refactor pass — duplicated helpers across files

**Goal:** Clean up after dashboard.js and clients.js were both written.

**Observation (no prompt needed, just review):** Noticed `initialsFor`/`initialsForClient` and `formatCurrency` were implemented twice, once in `dashboard.js` and once in `clients.js`, with slightly different variable names but identical logic.

**Result:** Pulled both into a shared `utils.js`, included on every page that needed them, and deleted the duplicates.

**What I learned:** Writing page-specific files in isolation is fast but creates drift-prone duplication; worth a dedicated pass at the end to grep for repeated function bodies before calling something done.

---

### 5. Getting/visible-clients pipeline (search + filter + sort)

**Goal:** Combine search, status filter, and sort without ever mutating the underlying `clientsState` array (P4.7 requirement).

**Prompt:** "Write one function, getVisibleClients(), that applies the active status filter, then the search term, then the active sort, in that order, on a copy of the array — never sort clientsState itself."

**Result:** Used as-is. Confirmed correctness by manually tracing: after sorting by "Deal value: high → low" and then switching back to "Newest first," the underlying add-order was still intact — i.e. the copy-before-sort approach actually worked and didn't silently corrupt state.

**What I learned:** Naming the exact anti-pattern to avoid ("never sort the original array") in the prompt was more reliable than just asking for "filtering and sorting" and hoping the immutability requirement got picked up implicitly.

---

### 6. Reminder timer scope

**Goal:** "Remind me in 1 min" should fire even if the client detail modal has since been closed.

**Prompt:** "Should the reminder setTimeout live inside the modal's close handler scope, or outside it?"

**Result:** Used a plain module-level `setTimeout` call (not attached to the modal's lifecycle), confirmed by manually closing the modal right after clicking the button and watching the toast still appear ~60s later.

**What I learned:** It's easy to accidentally scope a timer to a DOM element that might get torn down; keeping the timer as a free-standing async callback with just the data it needs (client name) avoided that.