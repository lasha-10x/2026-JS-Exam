# AI Usage Log: 10X CRM

Tool used throughout: **Claude (Claude Code in VS Code)**.

I used Gemini Ai for double checking some codes and also google Ai for discussing html/scss elements and styles.
This log documents how I used AI while building the project, what I kept,
what I changed, what I rejected, and what I learned.

---
My work style with Claude code was to discuss things together, what were best practices, why and how should have I worked with some logic as it adviced me and so on. 

## Entry 1: Dark/Light theme (prompt refinement)

**Goal:** Add a dark/light theme toggle that remembers the choice.

**Prompt v1 (too vague):**
> "how do I make a dark and light theme toggle in js, what is the best practice for it? don't write me the code, let's explain and I will work with you accordingly"

The first answer was generic and used hardcoded colors.

**Prompt v2 (refined):**
> "I use SCSS. Make a dark/light theme where colors are CSS custom
> properties, toggled by a `light` class on `<body>`, default dark, and the
> choice saved in localStorage under the key `crm_theme`."

**Result:** ✅ Used the refined version.

**What I learned:**  The refined prompt gave a far more useful answer - being specific about *my* setup mattered. I also have learned that #{$var-name} works for adding colors. 

---

## Entry 2: Semantic improvement 
I have noticed that in html structure must have been refined, and I insisted on semantic code in html, before my promt about semnatics, it only used main semantic tags and continued with div elements. 

"I changed a bit with logo part is it okay?"

"Yes — and honestly your change is an improvement. 👏 Wrapping the brand + headings in <header class="auth-header"> is semantically correct: <header> represents the introductory content of its section, and it's perfectly valid nested inside <section>. Nice instinct."

---

## Entry 3: Little debugging lesson 
I tried to rewrite the code Claude code made, because I wanted to know exactly what it was writing and how logic was working, so I also changed some function names which later led to errors. I worked with console to see exactly what was wrong. 

**Prompt:** I pasted my code and the console error:
> "Uncaught ReferenceError: applyTheme is not defined"
" there are three small mismatches — all from the same very common cause: you renamed things (which is totally fine!) but a couple of spots didn't get updated to match. This is a great debugging lesson."

**Result & What I learned:** ✅  Used the fix after understanding it. I have gotten more familiar to console and working in Dev Tool. Also, `ReferenceError: X is not defined` literally means the name doesn't exist - read the error and it points you to the fix.

---

## Entry 4: Change from scripts to ES modules

When I started working with JavaScript files, I have noticed that Claude code suggested adding scripts to the end of the html, but I wanted to make it modular so I have changed the promt: 

"ok I will do it but before we continue, we will also use modular way our js files right? with import/exort"

"Yes — great instinct, and this is exactly the right moment to decide it (before you type storage.js, so we don't rewrite it)"

**Result & What I learned:** ✅ I clearly better understood how modular js works, I got used to writing export each time for the functions which I was going to use in another files. I got more familiar to the syntax as well. 

---

## Entry 5: Refusing Claude Code :D 
So, I was changing function names as it was better for me to understand, Claude code changed once made name to different one, it adviced me to rename it but I refused, since clearer for me was the name I chose. 
"where is requireGuest written? we never created such code" 

"It does exist — my apologies, I caused this confusion. 🙋 Early on I called it redirectIfLoggedIn(), then later I started calling it requireGuest()"

" for me better name is redirectIfLoggedIn"

---

## Entry 6: Building client cards (critical evaluation)

**Goal:** Render each client as a card.

**Prompt:**
I gave to the Claude code requirements for each section and page, to make sure we were following the criterias
> "build one card element from a client object, for me is important to have the core elements fullfiled and full/ bonuses as well, but first all functions to work as they should be"

The AI's answer used `innerHTML` with a template string containing client data.
I recognized this could be an **XSS risk**! if a client name contained HTML,
`innerHTML` would execute it. I pushed back and asked to rewrite it safely.

"so I know that inner html is a bit unsafe to use could we change here this inner html to textContent?"

**Result:** 🔧 Modified. We replaced `innerHTML` with a small helper that uses
`document.createElement` and `textContent`.

**What I learned:** `innerHTML` parses its input as HTML (dangerous with
user/API data); `textContent` inserts it as plain text (safe). I now use
`textContent` for anything from users or an API, and only allow `innerHTML`
for static strings I control.

---


## Entry 7: Fetching clients from the API

**Goal:** Load 30 clients from DummyJSON with proper error handling.

**Prompt:**
> "async function to GET dummyjson users?limit=30, map them into my client
> model, wrapped in try/catch, and check response.ok"

**Result:** ✅ Used.

**What I learned:** `fetch` only **rejects** on a network failure :a 404 or 500
still **resolves** with `ok: false`. So `try/catch` alone isn't enough; I must
check `response.ok` and throw myself. I also learned `map()` is the clean way to
translate the API's shape into my own `Client` model.

---

## Entry 8: Signup validation (all errors at once)

**Goal:** Validate the signup form and show every error at the same time.

**Prompt:**
> "validate 5 fields on submit, show all errors at once not one by one,
> don't save if anything is invalid"

**Result:** ✅ Used.

**What I learned:** The `let isValid = true` flag pattern, check every rule,
set the flag to false on each failure, and only return at the end - shows
all errors together. 
I also learned the difference between `some()` (returns
true/false, used to detect a duplicate email) and `find()` (returns the object,
used in login to get the user).
