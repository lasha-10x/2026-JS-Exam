# AI Usage Log

Format for each entry: **Prompt** (verbatim) → **Tool** → **What I did with the response** (used / adapted / rejected, and why).

These are the real prompts from my actual conversation with Claude while building this project — not reconstructed examples.

---

### Entry 1 — Understanding the PRD

**Prompt (verbatim):** "დამიწერე ყველაფერი ბონუსების ჩათვლით"

**Tool:** Claude (claude.ai, web chat)

**What I did with it:** Claude read the uploaded PRD PDF and produced a page-by-page requirements summary (P0–P5, D1/D2, rubric, bonuses) as a markdown file. I used this as my own planning checklist before writing any code — it's how I decided the build order (auth first, then Clients core, then Dashboard/Profile/polish) rather than jumping straight into code.

### Entry 2 — Full code generation

**Prompt (verbatim):** "მინდა დამიწერო კოდი მთლიანად"

**Tool:** Claude (claude.ai, web chat, with code execution)

**What I did with it:** Claude generated the full file structure — 5 HTML pages, `css/styles.css`, and 8 JS modules (`storage.js`, `validation.js`, `toast.js`, `guard.js`, `auth.js`, `dashboard.js`, `clients.js`, `profile.js`). I used the structure and logic largely as generated, then went through every function myself to make sure I could explain it without the AI present (see the walkthrough notes at the bottom of this log).

### Entry 3 — Prompt refinement example (vague → precise → better answer)

**Vague version (what I would have asked initially):** "how do I filter and sort a list in JS"

**What Claude actually used as the more precise framing internally:** build one function that takes the status filter, the search term, and the sort option, applies them in sequence on a *copy* of the client array, and returns the result — so the original `allClients` state is never mutated by rendering.

**Result:** This is the `getVisibleClients()` function in `clients.js`. A vague prompt like the first one tends to produce a generic "here's how `.filter()`/`.sort()` work" explanation; asking for the specific constraint (don't mutate the original array, combine three operations in one place) is what produced a function I could drop straight into the render pipeline.

### Entry 4 — Critical evaluation of an AI decision (kept, but re-checked)

**What I checked:** the PRD explicitly warns that `DELETE https://dummyjson.com/users/{id}` can return a 404 for clients added during the same session, because DummyJSON never actually persists POST/DELETE calls.

**Why this matters:** if the delete logic only removed a client from local state *after* checking `response.ok`, a client added and then deleted in the same session would silently fail to disappear from the UI — because the fake API would 404 on it. I read through `handleDelete()` in `clients.js` specifically to confirm it removes the client from `allClients` regardless of what the DELETE request returns, since `localStorage` — not DummyJSON — is the real source of truth in this project. Confirmed this is correct in the generated code; this is also one of the two "prepared answers" questions from the PRD (§5.5) I now know how to explain out loud.

### Entry 5 — Design direction (avoiding a templated look)

**Prompt (implicit, via the frontend-design process Claude follows):** asked for a distinctive visual identity for a B2B sales CRM — sidebar app + auth pages — rather than a generic template look.

**Result:** Used the resulting Sora (display) / Inter (body) / IBM Plex Mono (data) type pairing and the indigo + sage + warm-paper palette, plus the "pipeline ledger bar" as the one signature visual element (a segmented bar showing Lead/Contacted/Won/Lost proportions, reused on both the Dashboard and the auth-page decoration). I did not change the palette, but I did rename a few CSS custom properties (e.g. `--ink-dim`) to match vocabulary I understood better while reading the stylesheet.

---

### Entry 6 — Bonus features batch

**Prompt (verbatim):** the PRD's full bonus list, pasted directly, followed by "ესენიც დამიმატე გამიკეთე" (add and build these too)

**Tool:** Claude (claude.ai, web chat, with code execution + Playwright for testing)

**Result:** Used almost all of it directly — Edit (PUT), Kanban + drag & drop, debounced server search, call timer, CSV export, pagination, keyboard shortcuts, password strength meter, session expiry, and a canvas pipeline chart. I did push back mentally on one thing while reviewing: the debounced "server search" bonus technically asks to replace local filtering with `GET /users/search`, but since DummyJSON has no idea about clients I added or edited locally, using it as the *only* filter would have broken search for my own data. I kept local filtering as the real mechanism and used the server call only as a demo/side indicator ("server search: N matches") — I understood this trade-off well enough to explain it out loud, which is the actual point of the ai-log requirement.

## Code walkthrough notes (for the oral exam — my own words)

- **`guard.js`** — one shared file for auth checks. `requireAuth()` runs on dashboard/clients/profile and kicks you to `index.html` if `crm_session` doesn't exist. `redirectIfLoggedIn()` does the opposite on the login/signup pages. `renderNav()` builds the sidebar HTML once and is called on every protected page instead of copy-pasting markup 3 times.
- **`getVisibleClients()`** in `clients.js` — combines status filter → search → sort, always on a copy of the array (`allClients.slice()`), so the underlying data never gets reordered/lost by rendering.
- **Session vs sessionStorage** — normal login writes to `localStorage` (`crm_session`), survives closing the tab. Unchecking "Remember me" writes the same object to `sessionStorage` instead, which the browser clears when the tab closes. `getSession()` checks both, `localStorage` first.
- **Edit vs Add** share one modal and one form in `clients.js`. `editingClientId` is `null` for Add (→ `POST /users/add`) and a real id for Edit (→ `PUT /users/{id}`). Both branches still run through the same validation code first.
- **Kanban drag & drop** uses plain HTML5 drag events (`dragstart`, `dragover`, `drop`) — no library. The dragged client's id travels via `e.dataTransfer`.
- **Undo delete**: the client is removed from `allClients` immediately (so state stays correct even if the tab closes), but a 5-second toast keeps a reference to the removed client + its original array index, and splices it back in if "Undo" is clicked.
- **Session expiry**: every session object now carries `expiresAt`. `getSession()` in `storage.js` is the single place that checks it — if expired, it clears the session and returns `null`, so every page's auth guard "just works" without extra code.

