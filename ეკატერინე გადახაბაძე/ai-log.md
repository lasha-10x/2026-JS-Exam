# AI Usage Log — 10X CRM

A record of how AI tools were used while building this project. Format per entry: **Goal → Prompt (verbatim) + tool → Result → What I learned.**

---

## Entry 1 — Planning the file structure

- **Goal:** Decide how to split the code into files so shared logic (storage, auth guard, toasts) is written once, not copied onto 5 pages.
- **Prompt (Claude):** "I'm building a multi-page vanilla JS app (5 HTML pages) with localStorage auth and a shared nav. How should I structure my js/ folder so the auth guard and storage helpers aren't duplicated per page?"
- **Result:** **Used.** AI suggested `storage.js` (all localStorage access), `guard.js` (one `runAuthGuard(pageType)` function), `ui.js` (theme/toasts/nav), `data.js` (clients state + API), plus one file per page. I adopted this layout as-is.
- **What I learned:** With plain `<script>` tags, load order matters — `storage.js` must load before `guard.js` because the guard calls `getSession()`. Script order in HTML is a real dependency graph.

## Entry 2 — Auth guard without a "flash"

- **Goal:** Make protected pages redirect before any content is visible.
- **Prompt v1 (Claude):** "Write an auth guard in JS." → The answer put the check inside `DOMContentLoaded`, so the page briefly flashed before redirecting.
- **Prompt v2 (refined):** "The redirect must happen before the page renders. I load scripts in `<head>`. Rewrite the guard so it runs synchronously at parse time, and explain why head scripts block rendering."
- **Result:** **Reworked.** Final version: `storage.js` + `guard.js` load in `<head>` and an inline `<script>runAuthGuard('protected')</script>` runs immediately. The vague prompt gave a working-but-worse answer; the specific one gave the right one.
- **What I learned:** Scripts in `<head>` without `defer` block parsing — normally a performance problem, but exactly what an auth guard wants.

## Entry 3 — getVisibleClients: filter + search + sort together

- **Goal:** Combine status filter, search, and sort without breaking the source array.
- **Prompt (Claude):** "I have an array `clientsState`. I need one function that applies a status filter, then a text search on name/company, then one of three sorts — without mutating the original array. Show the pipeline."
- **Result:** **Used with a fix.** The first AI version called `list.sort()` directly on `clientsState` in the 'no filter' branch — `sort()` mutates in place, so the original order would have been destroyed. I added `clientsState.slice()` at the top of the function.
- **What I learned (critical evaluation example):** AI code can look correct and still hide a mutation bug. `Array.prototype.sort` mutates; `filter`/`map` don't. Now I check every array method for mutation before trusting it.

## Entry 4 — DummyJSON DELETE returns 404 for my own clients

- **Goal:** Understand why deleting a client I added myself sometimes fails on the API side.
- **Prompt (ChatGPT):** "DummyJSON POST /users/add returns an id, but DELETE /users/{that id} returns 404. Why, and how should my app handle it?"
- **Result:** **Used.** DummyJSON only *simulates* writes — POST returns a fake created object but stores nothing, so the id doesn't exist for a later DELETE. Correct handling: send the DELETE anyway (to show real request flow), but remove the client from local state regardless of the response.
- **What I learned:** The API is a mock; localStorage is my real database. Separating "network communication" from "persistence" made the whole architecture click.

## Entry 5 — Toast system instead of alert()

- **Goal:** Build the required toast component (green/red, auto-hide in 3 s, X button) since `alert()` is banned.
- **Prompt (Claude):** "Vanilla JS toast function: showToast(message, type). Types success/error, appended to a fixed container, auto-removed after 3 seconds with setTimeout, plus a close button. No libraries."
- **Result:** **Used, then rejected part of it.** The AI version injected the message with `innerHTML` — a potential XSS problem because client names (which appear in the reminder toast) are user input. I switched it to `textContent`.
- **What I learned:** `innerHTML` with user data is unsafe; `textContent`/`createTextNode` is the safe default. This applies to the client card rendering too, so I used `createElement` + `textContent` throughout `renderClients`.
