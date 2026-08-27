# AI Usage Log

## AI Tool

- ChatGPT (OpenAI)

## Project

10X CRM – JavaScript Front-End Project

## Introduction

This document describes how AI was used during the development of my 10X CRM project. AI served as a learning and problem-solving assistant rather than a tool for generating code without review. Every suggestion was tested, evaluated, and compared with the Project Requirements Document (PRD) before being implemented.

Throughout the project, AI helped me debug JavaScript issues, improve the user experience, review security practices, and better understand front-end development concepts. In several situations, I modified or rejected AI-generated suggestions because they did not fully match the project requirements. This log records those decisions and the knowledge I gained during the development process.

---

# Entry 1 – Resolving a JavaScript Constant Conflict

## Goal

Fix a JavaScript error that prevented the login page from working correctly.

## Prompt (verbatim) + Tool

**Tool:** ChatGPT

**Prompt:**

I declared `SESSION_KEY` in both `common.js` and `login.js`. The browser shows the error **"Identifier 'SESSION_KEY' has already been declared."** Help me identify the cause and the correct solution.

## Result

**Modified**

The AI correctly identified that `SESSION_KEY` had been declared in both files, causing a redeclaration error. After reviewing the project structure, I decided to keep the constant only in `common.js` because it is shared across multiple pages. I removed the duplicate declaration from `login.js`, which resolved the error without affecting the application's functionality.

## What I Learned

I learned that shared constants should be declared only once and reused throughout the application. This approach avoids redeclaration errors, improves code organization, and makes future maintenance easier.

---

# Entry 2 – Improving the CSV Export User Experience

## Goal

Improve the CSV export feature by preventing accidental downloads.

## Prompt (verbatim) + Tool

**Tool:** ChatGPT

**Prompt:**

When the user clicks the **Export CSV** button, the file downloads immediately. Would it be better to display a confirmation dialog first and start the download only after the user confirms?

## Result

**Used**

The AI suggested displaying a confirmation dialog before generating and downloading the CSV file. I implemented this improvement so that users must confirm the action before the download begins. This small change makes the feature more user-friendly and helps prevent accidental downloads.

## What I Learned

I learned that good software design is not only about making features work but also about considering how users interact with the application. Small usability improvements can significantly enhance the overall user experience.

---

# Entry 3 – Fixing the Recent Clients Layout

## Goal

Fix the layout of the **Recent Clients** section on the Dashboard page.

## Prompt (verbatim) + Tool

**Tool:** ChatGPT

**Prompt:**

The **Recent Clients** section is displayed as plain text instead of styled cards. The container already has CSS, but the client items still appear unformatted. Help me identify the issue.

## Result

**Used**

The AI identified that while the parent container had the necessary styling, the dynamically generated `.recent-client-card` elements did not have their own CSS rules. After adding the missing styles, each client was displayed as a properly formatted card, resulting in a cleaner and more consistent Dashboard layout.

## What I Learned

I learned that styling only the parent container is not sufficient. Dynamically created elements also require dedicated CSS rules to achieve the intended design and maintain a consistent user interface.

---

# Entry 4 – Debugging Client Data Loading

## Goal

Determine why the application was not loading the initial list of clients from the DummyJSON API.

## Prompt (verbatim) + Tool

**Tool:** ChatGPT

**Initial Prompt:**

My application is not loading clients from the API. Help me find the problem.

The answer was too general and did not explain why the API request was not executed.

**Refined Prompt:**

My application is not loading the initial 30 clients from the DummyJSON API. Instead, it only displays the clients already stored in `localStorage`. Help me identify the cause.

The refined prompt provided a much more accurate explanation because it included additional details about the application's behavior.

## Result

**Used**

The AI explained that the application first checks whether the `crm_clients` key already exists in `localStorage`. Because previously saved client data was already stored there, the application returned those records instead of requesting new data from the API. After removing the stored data and reloading the page, the application successfully fetched the initial client list from the API and stored it again in `localStorage`.

## What I Learned

I learned that debugging is not always about finding coding mistakes. Sometimes an application behaves exactly as it was designed, and the real issue lies in existing data or application state. I also learned that providing more context in a prompt helps AI produce more accurate and useful responses.


---

# Entry 5 – Evaluating AI Suggestions Against the Project Requirements

## Goal

Understand why all clients imported from the API were assigned the **Lead** status and determine whether this behavior should be changed.

## Prompt (verbatim) + Tool

**Tool:** ChatGPT

**Prompt:**

The 30 clients were loaded successfully, but all of them appear under the **Lead** filter. None of them are **Contacted**, **Won**, or **Lost**. Why does this happen?

## Result

**Rejected after critical evaluation**

The AI correctly explained that every imported client was assigned the **Lead** status. It suggested randomly distributing clients across the available statuses. Before applying this suggestion, I reviewed the Project Requirements Document (PRD) and found that every client imported from the API must initially have the **Lead** status.

For this reason, I rejected the proposed solution and kept the original implementation. Clients can later be moved to **Contacted**, **Won**, or **Lost** through the application's interface.

## What I Learned

I learned that an AI-generated solution can be technically correct but still inappropriate for a specific project. Every suggestion should be verified against the project requirements before implementation.

---

# Entry 6 – Improving Security by Preventing DOM XSS

## Goal

Improve the security of the Clients page by rendering user-generated content safely.

## Prompt (verbatim) + Tool

**Tool:** ChatGPT

**Prompt:**

My client cards are rendered using `innerHTML`, but users can enter values such as the client's name and company. Is this a security risk? What is the recommended way to render this data safely?

## Result

**Used**

The AI explained that displaying user-controlled content with `innerHTML` could expose the application to a DOM-based Cross-Site Scripting (XSS) vulnerability. Based on this recommendation, I replaced the rendering logic with dynamically created DOM elements using `document.createElement()` and assigned user-provided values through `textContent`.

This change preserved the existing functionality while making the rendering process more secure by ensuring that user input is treated as plain text instead of executable HTML.

## What I Learned

I learned that security should be considered even in small front-end projects. Although `innerHTML` is convenient, it should not be used to display user-generated content. Using `createElement()` together with `textContent` follows modern JavaScript security best practices and significantly reduces the risk of DOM XSS vulnerabilities.

---

# Entry 7 – Reviewing Password Validation Against the PRD

## Goal

Implement password validation according to the project requirements.

## Prompt (verbatim) + Tool

**Tool:** ChatGPT

**Prompt:**

Implement password validation for the Sign Up form. The password should include uppercase and lowercase letters, a number, and a special character.

## Result

**Modified after critical evaluation**

The AI generated validation that required users to include a special character in their password. Before implementing the solution, I compared it with the Project Requirements Document (PRD).

The PRD required passwords to be at least eight characters long and include a letter and a number, but it did not require a special character. I modified the validation logic to match the specification exactly instead of introducing unnecessary restrictions.

## What I Learned

I learned that following the project specification is more important than adding extra functionality. AI suggestions should always be reviewed carefully to ensure they match the actual requirements.

---

# Overall Reflection

Throughout this project, AI served as a learning and problem-solving assistant rather than a replacement for my own work. It helped me debug JavaScript issues, improve the user experience, strengthen application security, and better understand front-end development concepts.

The most valuable lesson I learned was that AI-generated solutions should never be accepted without review. In several cases, I compared the suggestions with the Project Requirements Document (PRD), tested the proposed solutions, and either modified or rejected them when they did not match the project requirements.

This experience improved not only my technical skills but also my ability to evaluate solutions critically, make informed implementation decisions, and develop a more secure, maintainable, and standards-compliant application.
