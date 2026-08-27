# Research Notes

## DummyJSON API

I researched the DummyJSON API to simulate backend functionality.

Endpoints used:

- GET /users
- POST /users/add
- PUT /users/{id}
- DELETE /users/{id}

---

## localStorage

I researched how to persist application data in the browser.

The project stores:

- crm_users
- crm_clients
- crm_session
- crm_theme

---

## Form Validation

I researched JavaScript form validation techniques.

Implemented:

- Required field validation
- Email validation
- Password validation
- Duplicate email validation
- Inline error messages

---

## Authentication

I researched how to implement a simple authentication system using localStorage.

The application stores the current logged-in user in crm_session and protects private pages using an auth guard.

---

## Dark Mode

I researched different approaches for implementing Dark Mode.

The selected theme is saved in localStorage and automatically restored when the application loads.

---

## Error Handling

I researched Fetch API error handling.

The application uses:

- try...catch
- response.ok
- Retry button when loading clients fails

This improves reliability and user experience.