# AI Usage Log - 10X CRM

This log records how I used AI (Claude) while building this project, as required by the PRD.

---

## Entry 1 - Designing the storage layer

**Goal:** Decide how to structure localStorage access before writing any feature code.

**Prompt:** "Lets build step by step, write minimal and optimal code. but the important part is that you should explain."

**Result:** Claude proposed a single `storage.js` module with generic `saveToStorage`/`loadFromStorage` helpers (using JSON.stringify/parse) wrapped by specific functions like `getUsers()`, `getSession()`, `clearSession()`.

**What I learned:** Centralizing all localStorage reads/writes in one file means every other file only ever calls a named function like `getClients()` - never `localStorage.getItem("crm_clients")` directly. If I ever mistype a key name, it becomes a JS "undefined variable" error instead of a silent bug where two files quietly use different key strings.

---

## Entry 2 - Prompt refinement on validation

**Goal:** Get the Sign Up form's validation logic right.

**Prompt (first attempt, too vague):** "add validation to the signup form"

**Refined prompt:** I specified the PRD's exact rules (full name >= 3 chars, email needs @ and a dot after it, password >= 8 chars with a letter and a digit, confirm must match, duplicate email check) and asked that ALL errors show at once, not just the first one found.

**Result:** Claude wrote `validateSignupForm()` returning an errors *object* keyed by field name, rather than returning on the first failure - which is what let all error messages display simultaneously.

**What I learned:** Vague prompts get generic, "textbook" validation. Being specific about the exact error text and the "show all errors, not just one" requirement produced code that actually matches the PRD instead of code I'd have had to rewrite.

---

## Entry 3 - Critical evaluation: the login error message

**Goal:** Review the login failure logic Claude generated.

**What Claude generated:** Two separate error checks - one for "no user with that email" and one for "wrong password" - each with its own specific message.

**My evaluation:** I pushed back, because showing "no account with that email" openly tells an attacker which emails are registered on the system - a real security smell, not just a style choice. I asked Claude to combine both cases into one generic "Invalid email or password" message.

**What I learned:** AI-generated code isn't automatically "correct" just because it runs - I had to catch a genuine security issue myself and ask for the fix. This is the kind of thing I now check for by habit.

---

## Entry 4 - Mapping the DummyJSON API to our Client model

**Goal:** Turn `https://dummyjson.com/users` results into the CRM's own client objects.

**Prompt:** Asked Claude to write a single `mapApiUserToClient()` function used by both the initial data load and future API calls, rather than duplicating the mapping logic.

**Result:** One function in `data.js` that both `dashboard.js` and `clients.js` rely on indirectly (through `getOrLoadClients()`), so the API's field names (`firstName`, `lastName`, `company.name`) only appear in one place in the whole codebase.

**What I learned:** Keeping "translation" logic between an external API's shape and our own app's shape in exactly one function makes it much easier to explain in an exam - I can point to one function and say "this is the only place that knows what DummyJSON's response looks like."

---

## Entry 5 - Fixing a real bug: shared helpers loaded on the wrong pages

**Goal:** Get `clients.js` and `profile.js` to be able to show form field errors, using the same `showFieldError`/`clearFieldErrors` functions written for the Sign Up page.

**What went wrong:** Those two functions were originally written inside `auth.js`, which only `signup.html` and `index.html` load - `clients.html` and `profile.html` don't include `auth.js` at all, so calling `showFieldError()` there would have thrown a "not defined" error.

**Fix:** I asked Claude to move both functions into `guard.js`, since every single page already loads that file for the auth check.

**What I learned:** Script *load order* and *which pages load which files* is something I have to actively verify, not assume - a function existing in one file doesn't mean it's available everywhere. This taught me to think about the app as five separate documents that each load their own subset of scripts, not one shared program.
