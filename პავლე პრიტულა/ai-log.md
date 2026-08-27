# AI Usage Log

This log records where AI-assisted suggestions informed the project. All suggestions were reviewed, adapted where necessary, and verified locally before use.

## 1. Project structure and styling

- Request: "Propose a clear Vanilla JavaScript project structure with SCSS."
- Outcome: Used a small separation of core modules, page scripts, reusable SCSS components, and page styles.
- Review: The structure was kept intentionally simple so it can be explained during the assessment.

## 2. Authentication and validation

- Request: "Help define client-side validation and protected-route behavior for a small CRM."
- Outcome: Implemented sign-up, login, local session storage, field-level validation, and protected pages.
- Review: Route protection was strengthened with an early page check to prevent protected content from flashing before redirect.

## 3. Responsive layout and client workflow

- Request: "Review the mobile layout and improve client-card interactions."
- Outcome: Reworked the layout around mobile-first breakpoints, added a compact navigation pattern, and improved client details, notes, editing, and status controls.
- Review: The layout was checked locally at narrow viewport widths and SCSS was rebuilt after changes.

## 4. Reminder and notification flow

- Request: "Design a persistent reminder history connected to client details."
- Outcome: Added editable notes, saved reminders, a notification history page, statuses, and links to the related client.
- Review: Reminder state is stored separately from temporary UI messages so it remains available between pages.

## 5. Localization and final QA

- Request: "Add English and Georgian interface support with English as the default."
- Outcome: Added a centralized translation module, saved language preference, locale-aware date and currency formatting, and a language selector in Profile.
- Review: The interface is hidden until the saved language is applied, preventing a visible English-to-Georgian flash.
