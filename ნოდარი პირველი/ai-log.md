# AI Usage Log — 10X CRM

This log documents how I used Claude (Anthropic) while building this project. Every entry below reflects a real interaction, not a fabricated example.

---

## Entry 1 — Prompt refinement (broad assessment → structured, iterative workflow)

**Goal:** Figure out how difficult the assignment was and how to approach 10 days of work.

**Initial prompt (vague):**
> "Review this and assess what level of assignment I have to complete."

**Result:** A general difficulty assessment and a rough day-by-day plan — useful for orientation, but not something I could act on directly.

**Refined prompt:**
> "Let's go through this step by step, make sure you understand it too, and let's build it together from zero — I have 10 days, learning while doing."

**Why I refined it:** The first prompt produced an overview; the second one specified the actual working format I needed — explanation before code, one concept at a time, with checks for understanding.

**Outcome:** Used as-is. The entire rest of the project followed this format: concept explained → code written → tested → comprehension check.

**What I learned:** A prompt describing the *process* you want gets a far more useful response than one that only asks for an evaluation.

---

## Entry 2 — Bug: missing `ui.js` script tag (critical evaluation)

**Goal:** Get the Sign Up form working end-to-end.

**What happened:** `auth.js` called `showToast()` and `showFieldError()`, both defined in `ui.js` — but `signup.html` only linked `storage.js` and `auth.js`. Submitting the form would have thrown "showToast is not defined."

**How I caught it:** Reviewed the generated `<script>` tags against what `auth.js` actually calls, rather than assuming the AI-written HTML was complete.

**Fix:** Added `<script src="js/ui.js"></script>` in the correct load order (after `storage.js`, before `auth.js`).

**What I learned:** Script dependencies have to be checked manually — a file "using" a function from another file doesn't make that dependency visible in the file itself.

---

## Entry 3 — Bug: `applyTheme()` called before `<body>` exists (critical evaluation)

**Goal:** Wire up the Auth Guard and shared navigation for the three protected pages.

**What happened:** The generated code called `requireAuth(); applyTheme();` together in `<head>`, before any scripts ran. `applyTheme()` reads `document.body`, which doesn't exist yet at that point in page load — this would throw a TypeError.

**How I caught it:** Traced through what each function actually touches (`requireAuth()` only reads `localStorage`; `applyTheme()` touches the DOM) before deciding where each should run.

**Fix:** Moved `applyTheme()` into the `DOMContentLoaded` handler, alongside `renderNav()`. Left `requireAuth()` in `<head>` since it has no DOM dependency and benefits from running as early as possible (avoids a flash of protected content).

**What I learned:** Where a function runs (`<head>` vs. `DOMContentLoaded`) has to match what that function actually needs, not just when it's convenient to call it.

---

## Entry 4 — Bug: dark theme text invisible (critical evaluation)

**Goal:** Fix dark mode after noticing some text was unreadable.

**What happened:** Two separate issues stacked: (1) CSS custom properties like `--text` were never redefined inside `.dark-theme`, only `body`'s own `color` was set directly, so any element using `var(--text)` explicitly stayed on the light-mode color; (2) `.nav-icon-btn` (Theme/Logout buttons) had no `color` rule at all — buttons don't inherit text color from ancestors by default in most browsers.

**Fix:** Rewrote dark mode to redefine the CSS variables themselves inside `.dark-theme` (so every consumer updates automatically), and added an explicit `color` to `.nav-icon-btn`.

**What I learned:** CSS custom properties should usually be *redefined at a scope*, not overridden element-by-element — it's less code and harder to miss a spot.

---

## Entry 5 — Rejected an external avatar service dependency

**Goal:** Generate an avatar image for manually-added clients.

**AI's first suggestion:** An external service (`api.dicebear.com`) generating an initials avatar via URL.

**Why I rejected it:** A graded project shouldn't depend on a third-party service being reachable — if it's down or blocked on exam day, avatars silently break, even though the app itself has nothing to do with that service.

**What I did instead:** Asked for a self-contained alternative. Got a small function generating an SVG data URI locally, no network request involved.

**What I learned:** For a small learning project, a self-contained solution is worth slightly more code if it removes a dependency on something outside my control.

---

## Entry 6 — Rejected an icon-font dependency for the password toggle

**Goal:** Add a show/hide password icon that looked more "solid" than an emoji.

**What happened:** I was shown a preview using a Tabler Icons webfont (`<i class="ti ti-eye">`) — it looked good, but that font isn't loaded anywhere in my actual project, only in the tool used to preview it.

**Fix:** Asked for the same visual style without the external font — got two small inline SVG icons (eye / eye-off) using `stroke="currentColor"`, so they automatically match the button's text color in both themes without extra CSS.

**What I learned:** A preview that "looks right" can hide an unstated dependency (a font, a library) — always check what the real project actually has loaded before trusting that a snippet will work as shown.

---

## Entry 7 — Bug: JS unicode escapes don't work in raw HTML (critical evaluation)

**Goal:** Add eye/hide-eye emoji to the password toggle buttons.

**What happened:** I was given `\u{1F441}\u{FE0F}` to paste directly inside an HTML `<button>` tag — this is valid inside a JavaScript string, but HTML has no such escape syntax, so the browser rendered it as literal text (`\u{1F441}\u{FE0F}`) instead of an eye emoji.

**How I caught it:** Saw the literal escape codes rendered on the page instead of an emoji, and asked why.

**Fix:** Used the actual emoji character directly in HTML instead of the JS escape sequence (later replaced with inline SVG icons entirely, see Entry 6).

**What I learned:** The same "unicode text" can require different syntax depending on which language/file it's embedded in — a JS-valid escape isn't automatically HTML-valid.

---

## Entry 8 — Refactor: sharing client-loading logic between Clients and Dashboard

**Goal:** Build the Dashboard page, which needs the same client data as the Clients page.

**What happened:** Rather than duplicating the "check localStorage, else fetch from the API" logic inside a new `dashboard.js`, the AI suggested splitting the existing `loadClients()` into two functions: `ensureClientsLoaded()` (pure data loading, no DOM) and `loadClients()` (adds the "Loading..." text + render, specific to the Clients page). Dashboard then only calls `ensureClientsLoaded()`.

**Outcome:** Used as suggested — it matched the PRD's explicit instruction that "the dashboard should use the same shared logic as the Clients page."

**What I learned:** When two pages need the same data, it's worth asking whether the *loading* logic and the *page-specific UI* logic can be separated, rather than copying the whole function.
