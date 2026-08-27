# AI Usage Log

## Entry 1 - Sign Up validation

**Goal:** Build validation for the registration form.

**Prompt:**  
“js code ის გადაკოპირება არ მინდა ეს კოდი აქ იყოს მაგრამ უბრალოდ ნაბიჯ ნაბიჯ მითხარი მე რა გავაკეთო რომ მაგ დონეზე მივიდე”

**Tool:** OpenAI Codex

**Result:**  
I used the explanations to write validation for full name, email, duplicate email, password, and confirm password. I learned why `preventDefault()` is needed and why all validation errors should be checked in one submit event.

## Entry 2 - Array methods for authentication

**Goal:** Understand how to check whether a user already exists and how to log in.

**Prompt:**  
“how does some works give me example have never used it before”

**Tool:** OpenAI Codex

**Result:**  
I used the explanation of `some()` for duplicate email checking and `find()` for finding a user during login. I learned that `some()` returns true or false, while `find()` returns the matching object.

## Entry 3 - Client rendering and filtering

**Goal:** Render CRM clients dynamically and add filters.

**Prompt:**  
“პირდაპირ დაწერილ კოდს ნუ მაძლევ მოდი ადრე როგორც შვებოდი ისე ქენი”

**Tool:** OpenAI Codex

**Result:**  
I used step-by-step guidance to create client cards with `document.createElement()`, `append()`, `filter()`, `sort()`, and search with `includes()`. I learned why a copy of the clients array is needed before sorting it.



## Entry 4 - Critical evaluation of an AI answer

**Goal:** Prepare the required Markdown documentation files.

**Prompt:**  
“md ფაილებში რაები უნდა დავწერო?”

**Tool:** OpenAI Codex

**Result:**  
At first, the AI answer said that only `README.md` was necessary. I checked the PRD again and found that this was incomplete. The PRD also requires `ai-log.md`, and for the FULL level it requires `glossary.md` and `research-note.md`. I corrected the plan based on the PRD instead of using the first answer without checking it.

**What I learned:**  
AI answers should be checked against the project requirements. The PRD is the main source of truth for this project.
