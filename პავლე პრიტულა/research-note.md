# Research Note: Browser localStorage

- Source: [MDN - Window: localStorage property](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- Search keywords: `MDN localStorage persist data browser sessions`

MDN explains that `localStorage` provides a storage object associated with a document origin. Data saved there remains available after browser sessions, unlike `sessionStorage`, which ends when the page session ends. This behavior is useful for the CRM exam project because registered users, the active session, client state, and theme must survive a refresh. The API stores keys and values as strings, so this project uses `JSON.stringify()` before saving objects and `JSON.parse()` after reading them. The documentation also explains that `file:` URL behavior is not reliable, which is why the app should be opened through a local development server. In a real application, sensitive values such as passwords should not be kept in localStorage.
