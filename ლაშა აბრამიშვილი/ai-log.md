# AI Usage Log

AI was used as a development assistant while building 10X CRM. It helped with planning, breaking the project into small tasks, generating initial code suggestions, debugging, reviewing requirements, and improving code quality. Every generated solution was reviewed before it was used, and the application was tested manually. Some suggestions were changed, partially used, or rejected when they did not match the PRD or the existing project. I remain responsible for understanding and explaining the final code.

## Tools Used

- ChatGPT — used to discuss ideas, clarify concepts, and improve prompts.
- Codex — used to inspect the project, suggest code changes, implement approved tasks, and check the result.

## Development Entries

### Entry 1 — Initial Project Structure

**Goal:**
Create a beginner-friendly foundation using only HTML, CSS, and vanilla JavaScript. The project needed separate pages, one shared stylesheet, page-specific scripts, and documentation files.

**Tool:**
Codex

**Prompt:**
> Create the initial 10X CRM project structure. Add five valid HTML5 pages, shared CSS, empty JavaScript files with responsibility comments, and the required documentation files.

**Result:**
The suggestion was used after checking the folders, filenames, page titles, stylesheet links, and script paths. No frameworks, packages, build tools, or application logic were added because they were outside the task.

**What changed and what I learned:**
I learned how a small multi-page project can separate structure, styling, page logic, shared logic, and documentation. Clear file responsibilities make later tasks easier to understand and debug.

### Entry 2 — Sign Up Validation

**Goal:**
Validate the Sign Up form before saving anything. The form needed to report all invalid fields together and use the exact PRD messages.

**Tool:**
Codex

**Prompt:**
> Validate full name, email, password, and password confirmation. Clear old errors first, add `input-error`, and return a boolean without redirecting.

**Result:**
The response was used with small readability adjustments. Separate `clearErrors()`, `showError()`, and `validateForm()` functions kept each responsibility simple. The result was manually tested with blank values, short names, invalid emails, weak passwords, and mismatched passwords.

**What changed and what I learned:**
I learned why `event.preventDefault()` keeps the browser from submitting too early, why `trim()` prevents spaces from counting as real content, and how a boolean validation result controls whether the next step is allowed.

### Entry 3 — Saving Users to localStorage

**Goal:**
Save a valid account in `crm_users` without creating duplicate email addresses.

**Tool:**
Codex

**Prompt:**
> Read and save the users array with `JSON.parse()` and `JSON.stringify()`. Use `some()` to reject a duplicate lowercase email, then add the new user with `push()`.

**Result:**
The response was used after confirming that validation still stopped invalid submissions. Email values were normalized to lowercase, a timestamp-based id was created, and the saved array was inspected in browser storage. The later success toast and redirect were added only in a separate task.

**What changed and what I learned:**
I learned that localStorage stores strings, so arrays and objects need JSON conversion. I also learned that `some()` returns `true` as soon as one matching email is found, which makes duplicate checking clear and efficient.

### Entry 4 — Login Authentication and Session

**Goal:**
Check Login credentials against registered users and create one current-session object without storing the password.

**Tool:**
Codex

**Prompt:**
> Use `find()` to match both the normalized email and unchanged password. Save only `userId`, `fullName`, `email`, and `loggedInAt` in `crm_session`.

**Result:**
The solution was modified during the PRD review. Successful and unsuccessful Login attempts were verified, the general “Invalid email or password” message was kept, and the final session uses the PRD timestamp property `loginAt`. Successful Login now redirects directly to the Dashboard.

**What changed and what I learned:**
I learned how `find()` returns the first matching object, why both credential checks belong in the same condition, and why session data should contain only information needed by the current browser session.

### Entry 5 — Authentication Guard and Logout

**Goal:**
Protect internal CRM pages and allow the current user to log out without deleting accounts, clients, or theme settings.

**Tool:**
Codex

**Prompt:**
> Read `crm_session` in a shared guard, redirect missing sessions to `index.html`, and make Logout remove only `crm_session`.

**Result:**
The response was used and checked on Dashboard, Clients, Client Details, and Profile pages. Protected pages redirected after the session was removed, while Login and Sign Up remained public. `localStorage.clear()` was rejected because it would remove unrelated application data.

**What changed and what I learned:**
I learned that an authentication guard runs before protected page logic and acts as a simple access check. I also learned why targeted storage removal is safer than clearing every localStorage key.

### Entry 6 — Shared Theme Switching

**Goal:**
Support light and dark themes on protected pages and remember the selected theme between pages and Login sessions.

**Tool:**
Codex

**Prompt:**
> Save `light` or `dark` in `crm_theme`, apply it with a `data-theme` attribute on `<html>`, and update the button to show the opposite theme.

**Result:**
The response was used after checking navigation, cards, forms, badges, and buttons in both themes. CSS variables were overridden inside `html[data-theme="dark"]`, so component rules did not need to be duplicated. Logout continued to remove only the session.

**What changed and what I learned:**
I learned that one HTML data attribute can select a theme and that CSS variables centralize colors. The toggle label describes the action available next, not the theme already active.

### Entry 7 — Client Search, Status Filter, and Sorting

**Goal:**
Let users narrow and order the saved client cards while keeping the original client array unchanged.

**Tool:**
ChatGPT and Codex

**Prompt:**
> Combine search and status filtering, then sort a copied result by date or name. Search should update while typing and handle missing fields safely.

**Result:**
The response was modified during debugging and the final PRD audit. Safe fallback strings prevent missing fields from causing `.toLowerCase()` errors. Search uses `includes()` across client names and companies, status filter chips combine with the query, and sorting supports newest, oldest, name in both directions, and deal value in both directions.

**What changed and what I learned:**
I learned how `filter()` creates matching subsets, `includes()` checks text anywhere in a field, and `localeCompare()` orders names. Copying with `[...filteredClients]` prevents `sort()` from changing the original array, while numeric comparisons order dates and deal values.

### Entry 8 — API Client Loading and Retry

**Goal:**
Load clients from localStorage when available, otherwise fetch 30 DummyJSON users, transform them, save them, and show clear loading and failure states.

**Tool:**
Codex

**Prompt:**
> Use one shared async loader, check `response.ok`, transform `data.users` with `map()`, handle invalid stored JSON, and let Retry make a fresh request.

**Result:**
The response was used after both success and failure testing. The API URL was temporarily made invalid to confirm the exact error message and Retry button, then restored. API users are transformed consistently into the PRD client model with the `name` property and a generated deal value between 1,000 and 10,000.

**What changed and what I learned:**
I learned how `async/await` makes request steps readable, how `try/catch` handles rejected requests, why HTTP failures require an explicit `response.ok` check, and how `map()` transforms external data into the application’s own object shape.

### Entry 9 — Adding a Client

**Goal:**
Create a modal form that validates client data, prevents duplicate emails, saves a new client, and updates the client cards without refreshing.

**Tool:**
Codex

**Prompt:**
> Open and close an Add Client modal, validate all fields together, use `some()` for duplicate emails, save through the API, then reapply current filters and sorting.

**Result:**
The solution was used after testing Cancel, invalid values, duplicate email, API failure, and successful creation. The modal stays open when validation fails. A successful POST updates localStorage and the page’s in-memory array, then renders the current filtered and sorted card view.

**What changed and what I learned:**
I learned how DOM events control modal visibility and how rendering updated state avoids a page reload. New clients start with `notes: []` so the notes feature always has a predictable array to use later.

### Entry 10 — Editing and Deleting a Client

**Goal:**
Update or remove only the client selected by the id in the page URL.

**Tool:**
Codex

**Prompt:**
> Use `findIndex()` to update one selected client and `filter()` to delete it after confirmation. Preserve unrelated client data and other localStorage keys.

**Result:**
The response was partially used because the separate Client Details page came from an earlier plan that did not fully match the PRD’s modal description. Within the existing project structure, editing and deletion were implemented and tested without changing other clients. The delete operation required confirmation and verified that the array length actually changed.

**What changed and what I learned:**
I learned that `findIndex()` provides the exact array position needed for an update, while `filter()` creates a new array without the selected record. Numeric id conversion avoids mismatches between URL strings and stored number ids.

### Entry 11 — Client Notes and Follow-up Reminder

**Goal:**
Store notes inside the selected client and schedule a one-minute follow-up message during the current page session.

**Tool:**
Codex

**Prompt:**
> Add validated notes with `push()` and show them using `textContent`. Use `setTimeout()` with `60000` to show a follow-up toast containing the client’s name.

**Result:**
The response was used after checking empty, short, long, and valid notes. `textContent` was kept to avoid treating user-written note text as HTML. The reminder was tested as a page-session feature and was intentionally not saved to localStorage.

**What changed and what I learned:**
I learned how nested arrays can keep notes connected to one client. I also learned that `setTimeout()` runs once after a delay, while `setInterval()` repeats until stopped; only `setTimeout()` matched this reminder requirement.

### Entry 12 — Profile and Password Management

**Goal:**
Display and update the logged-in user’s profile and allow a validated password change without ending the session.

**Tool:**
Codex

**Prompt:**
> Find the current user using `crm_session` and `crm_users`. Update Full Name and Company, and validate current, new, and confirmed passwords before saving.

**Result:**
The response was modified to match the PRD exactly. Profile updates change only `fullName` and `company`, while email, id, password, and creation date stay unchanged. The session name is synchronized, and password changes update only the selected user’s password.

**What changed and what I learned:**
I learned how session identifiers connect stored records and how `findIndex()` targets one account without replacing unrelated data. I also learned that plain-text passwords are unsafe in real applications and must be hashed securely on a server.

### Entry 13 — Client Data Transfer and Demo Access

**Goal:**
Transfer client progress between localhost and the deployed website, provide a working demo account, and correct older API clients that all had the same deal value.

**Tool:**
Codex

**Prompt:**
> Add client JSON export and import, document a demo email and password, and verify the PRD rule for generated deal values.

**Result:**
The Profile page now exports and imports the current user's client list, so other accounts and themes are not overwritten. A built-in demo account provides immediate access, and API clients receive generated deal values between 1,000 and 10,000.

**What changed and what I learned:**
I learned that localStorage is isolated by origin, so localhost and Vercel cannot share data automatically. A JSON file provides a simple frontend-only transfer method, and each client can be connected to an account with an `ownerId`.

## Prompt Improvement Example

### Initial Prompt

> Add pagination to the Clients page so only a small number of clients appear at once.

### Problem

The prompt was useful because the client list could become long after loading 30 API users. Pagination was added carefully so it worked together with search, status filtering, and sorting.

### Improved Prompt

> Add simple pagination to the Clients page. Keep the existing search, status filter, and sorting working together.

### Improvement

The improved prompt clearly defined the allowed work and protected the existing list behaviour. Pagination now shows 10 clients per page and recalculates after search, filter, sort, add, or delete changes.

## Critical Evaluation Example

An earlier AI response suggested client requirements that did not fully match both the PRD and the project’s existing data model. Examples included an incorrect status model, continued use of `fullName` where the PRD described the Client property as `name`, and a separate Client Details page where the PRD described a details modal.

The response was not accepted blindly. The PRD was checked again, and the current HTML, JavaScript, and stored client structure were inspected before continuing. Statuses were corrected to Lead, Contacted, Won, and Lost. The property mismatch was documented and handled carefully so existing features were not broken by mixing `name` and `fullName`. The already-created details page was recognized as a difference from the PRD instead of being falsely presented as an exact match. This review showed that AI output can be useful while still requiring human judgment and consistency checks.

## Main Concepts Learned

- **DOM selection and events:** Selecting elements and responding to submit, input, change, and click events.
- **Form validation:** Checking values, showing all errors, and preventing invalid data from being saved.
- **Arrays and objects:** Representing users, clients, notes, and sessions as structured data.
- **Array methods:** Using `find()`, `findIndex()`, `some()`, `filter()`, `map()`, and `reduce()` for searching, updating, checking, transforming, and calculating.
- **localStorage and JSON:** Converting arrays and objects with `JSON.stringify()` and `JSON.parse()`.
- **Sessions and authentication guards:** Identifying the current user and protecting internal pages.
- **`async/await` and `fetch()`:** Loading external data in clear sequential steps.
- **`try/catch`:** Handling API and JSON errors without crashing the page.
- **Timers:** Using `setTimeout()` for one delayed action and understanding that `setInterval()` repeats an action.
- **Rendering state:** Updating tables, cards, details, notes, loading messages, and errors after data changes.

## Final Reflection

AI made development faster by helping divide a large project into smaller, understandable tasks. Precise prompts produced better answers because they clearly stated the required behavior and limits. However, every response still needed verification through code review, manual testing, and comparison with the PRD. Checking the PRD exposed incorrect assumptions about statuses, pagination, and the client data model. The most important result was not copying generated code, but understanding why the final code works and being able to explain it confidently.
