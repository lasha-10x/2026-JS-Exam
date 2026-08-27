# AI Usage Log - CRM Project

This document represents the collaboration log with artificial intelligence (Google Gemini) during the development of the CRM web application.

---

## Entry 1: Initial Client Data Integration from API
* **Objective:** Fetch 30 users from the DummyJSON API and use them as the initial CRM client base (`localStorage`).
* **Prompt (Verbatim) & Tool:** 
  > "How can I make it so that if there are no clients in localStorage, it fetches them using fetch from https://dummyjson.com/users?limit=30 and transforms them into our CRM structure?" (Tool: Gemini Chat)
* **Result (Used / Modified / Rejected - Why):** **Used**. The suggested asynchronous function `initializeClients` and `fetch` logic worked out of the box and seamlessly integrated into the project structure.
* **What I Learned:** How to fetch data asynchronously using `async/await` and map API object structures into custom application arrays using `.map()`.

---

## Entry 2: Dynamic Welcome Text & Profile Logic (Prompt Evolution)
* **Objective:** Display the user's actual full name instead of their email on the dashboard and navigation panel.
* **Prompt Evolution (Refinement):**
  1. *Vague Prompt:* "Why does it show email on the dashboard?"
  2. *Refactored Prompt:* "How can I make the user's name appear on the dashboard?"
  3. *Final/Better Prompt:* "The dashboard shows email for clients and 'user' for profiles; I want it to show first and last name everywhere. Create a helper function that checks the session first, then `crm_users`, and falls back to extracting from email if needed." (Tool: Gemini Chat)
* **Result (Used / Modified / Rejected - Why):** **Used with minor modifications**. AI provided a comprehensive helper function handling session, database lookup, and email fallback.
* **What I Learned:** Detailed context specification (where data resides and what fallbacks are required) yields much more accurate and production-ready code from AI.

---

## Entry 3: UI Layout Bug & Critical Evaluation
* **Objective:** Fix a layout issue in the navigation panel where the welcome text and user name wrapped improperly onto two lines.
* **Prompt (Verbatim) & Tool:** 
  > "Everything is fine, except in clients it sits on two lines" (accompanied by a screenshot). (Tool: Gemini Chat)
* **Result (Used / Modified / Rejected - Why):** **Modified**. AI's initial response failed to fix the wrapping issue because the block-level structure of the container wasn't handled properly. I critically evaluated the output, recognized the shortfall, and followed up with a precise instruction: *"welcome, on the top line and full name on the bottom"*, which led to using `innerHTML` with split markup and `white-space: nowrap`.
* **What I Learned:** AI cannot always interpret UI layout issues from screenshots perfectly on the first try; clear HTML/CSS structural directives (`<br>` and inline styles) are necessary for exact results.

---

## Entry 4: Security & Session Management (Switching from `localStorage` to `sessionStorage`)
* **Objective:** Automatically clear the active user session when the browser tab/window is closed, preventing persistent unauthorized access upon reopen.
* **Prompt (Verbatim) & Tool:** 
  > "If all pages are closed, should it end the session? Is that possible? I have guard.js to check. Should I change it here?" (Tool: Gemini Chat)
* **Result (Used / Modified / Rejected - Why):** **Used**. Successfully migrated active session handling to `sessionStorage` across `guard.js` and the login script, while keeping persistent client and user databases in `localStorage`.
* **What I Learned:** The structural difference between `localStorage` (persistent storage) and `sessionStorage` (tab-lifetime storage) and how to balance them properly in a secure CRM application.

---

## Entry 5: Enhancing JavaScript Functional Skills (Arrow Functions & Arrays)
* **Objective:** Practice and master Arrow Functions and modern JavaScript array methods.
* **Prompt (Verbatim) & Tool:** 
  > "Let's practice arrow functions a bit, and fetching JSON from an API and parsing it." (Tool: Gemini Chat)
* **Result (Used / Modified / Rejected - Why):** **Used**. We went through practical exercises converting traditional functions into concise Arrow Functions and filtering datasets using `.filter()`.
* **What I Learned:** Arrow functions make code more concise and readable, while `.filter()` streamlines conditional data extraction from arrays without messy `forEach` or `for` loops.