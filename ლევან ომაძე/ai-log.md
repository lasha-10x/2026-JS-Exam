# AI Usage Log

## 1. Project planning

Goal: Understand the PRD and split the work into small implementation steps.

Prompt and tool: "Review this PRD and help me identify the CORE and FULL requirements for a 10X CRM exam project." Tool: Codex.

Result: Used. The answer helped separate authentication, clients CRUD, dashboard, profile, and documentation.

What I learned: A large PRD is easier to implement when it is converted into page-based tasks and storage keys.

## 2. Authentication validation

Goal: Build signup and login forms with exact error messages.

Prompt and tool: "Create vanilla JavaScript validation for signup and login using localStorage keys crm_users and crm_session." Tool: Codex.

Result: Reworked. I kept the structure but changed the error messages to match the PRD exactly.

What I learned: Validation text matters because the evaluator can check exact strings.

## 3. Prompt refinement

Goal: Improve a vague request into a better implementation prompt.

Prompt and tool: First prompt: "Make clients page." Refined prompt: "Build a clients page that fetches 30 users from DummyJSON, maps them to CRM client objects, supports add/delete, saves to crm_clients, and renders loading, empty, and error states." Tool: Codex.

Result: Used. The refined prompt produced a clearer architecture and fewer missing features.

What I learned: Specific prompts should include data source, storage key, user actions, and expected UI states.

## 4. Critical AI review

Goal: Check whether suggested code is exam-friendly.

Prompt and tool: "Review the CRM JavaScript for parts that may be difficult to explain in an oral exam." Tool: Codex.

Result: Partly rejected. Some suggestions used unnecessary abstractions, so I kept smaller functions that are easier to explain line by line.

What I learned: The best code for this exam is not the most clever code; it is working, readable code I can explain.

## 5. Documentation

Goal: Write English README sections for the project.

Prompt and tool: "Draft an English README for a vanilla JavaScript CRM project with features, tech stack, run instructions, storage keys, and credits." Tool: Codex.

Result: Used and edited. I added the exact project features and local test account instructions.

What I learned: Good technical English is direct: feature, technology, instruction, result.
