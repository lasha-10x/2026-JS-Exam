# AI Usage Log

## Entry 1 — Project structure planning
**Goal:** Decide the file structure for a multi-page vanilla JS CRM.
**Tool:** Qwen Studio  
**Prompt:** "I'm building a 5-page vanilla JS CRM with shared auth logic. Suggest a file structure that avoids code duplication."
**Result:** Used the suggested structure: separate `auth.js`, `guard.js`, `data.js` shared across pages.
**Learned:** Separate shared JavaScript files provide modular organization and allow multiple pages to reuse the same functions without duplicating code..

## Entry 2 — Auth guard logic
**Goal:** Redirect unauthenticated users from protected pages.
**Tool:** Qwen Studio  
**Prompt:** "Write an auth guard that checks localStorage for crm_session and redirects."
**Result:** AI gave a working version, but I refactored it to handle both protected AND public pages in one function.
**Learned:** AI code often works but needs adaptation to your specific architecture.

## Entry 3 — Clients API mapping (refined prompt)
**Tool:** Qwen Studio  
**Initial prompt:** "Fetch users from DummyJSON."
**Result:** Returned raw API objects — not what I needed.
**Refined prompt:** "Map DummyJSON /users response to my Client model: {id, name: firstName+lastName, email, phone, company: company.name, image, status:'Lead', dealValue: random 500-10000, notes:[], createdAt: ISO}."
**Result:** Perfect mapping function.
**Learned:** Specific model shapes in prompts = better output.

## Entry 4 — getVisibleClients composition
**Goal:** Combine filter + search + sort without mutating original array.
**Tool:** Qwen Studio  
**Prompt:** "Write a function that filters an array of clients by status, then by search query on name/company, then sorts — without mutating the source."
**Result:** Used spread `[...clientsState]` to copy before sort. Worked perfectly.
**Learned:** Always copy before sort() — it mutates in place.

## Entry 5 — AI response I rejected
**Goal:** Password hashing for localStorage.
**Tool:** Qwen Studio  
**Prompt:** "Hash passwords before storing in localStorage."
**Result:** AI suggested CryptoJS library.
**Decision:** Rejected — PRD says no libraries. I added a comment explaining that real applications hash passwords on the server.
**Learned:** AI doesn't always know your constraints. Always evaluate suggestions against requirements.
## Entry 6 — Final PRD audit and bug fixing

**Goal:** Review the complete project against the exam PRD and identify missing or incorrect behavior.  
**Tool:** ChatGPT (Codex)  
**Prompt:** "Check my CRM project like an expert for the final exam. Fix incorrect parts or tell me which file and folder I need to change."  
**Result:** Reviewed authentication, client management, API requests, localStorage, security, responsive design, and documentation. Added safer HTML rendering, API error handling, and a demo account.  
**Learned:** A feature is not complete until it is tested against the original requirements.

## Entry 7 — CRM usability improvements

**Goal:** Add meaningful improvements without introducing frameworks or external libraries.  
**Tool:** ChatGPT (Codex)  
**Prompt:** "Suggest and implement real improvements for the remaining commits, and show exactly which files must be changed."  
**Result:** Added live validation clearing, password strength feedback, client editing with PUT, Dashboard tab synchronization, a call timer, and pipeline progress bars.  
**Learned:** Larger features are easier to implement safely when they are divided into small, testable steps.

## Entry 8 — Git workflow and deployment

**Goal:** Create meaningful commits and deploy only the intended project files.  
**Tool:** ChatGPT (Codex)  
**Prompt:** "Write the commits in order and explain which file I should add and push."  
**Result:** Used file-specific `git add` commands, created descriptive commits, connected the GitHub repository to Vercel, and documented the live URL.  
**Learned:** `git add` selects changes, `git commit` saves them locally, and `git push` uploads all unpushed commits.
