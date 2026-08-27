# 10X CRM Research 🔎

## Topic 🧭

Using browser storage, Fetch API, frontend state management, and backend API persistence in a vanilla JavaScript CRM.

## Sources 📚

- **MDN Web Docs** - Window: localStorage property: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **MDN Web Docs** - Using the Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- **MDN Web Docs** - Response: ok property: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
- **MDN Web Docs** - EventTarget: addEventListener(): https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- **Express documentation:** https://expressjs.com/
- **Mongoose documentation:** https://mongoosejs.com/
- **MongoDB Atlas:** https://www.mongodb.com/products/platform/atlas
- **Render:** https://render.com/
- **Vercel:** https://vercel.com/
- **Twilio:** https://www.twilio.com/

---

## What I Learned 🧠

**`localStorage`** is browser-based persistent storage. It keeps string data for the current origin even after page refresh or browser restart. In the first frontend stage of this CRM, localStorage was used as the temporary data layer for users, sessions, clients, tasks, notifications, theme preferences, settings, communication history, and profile information.

The project was later upgraded with a Node.js, Express, and MongoDB backend. After that upgrade, secure account data, clients, tasks, notifications, activity records, messenger records, and phone settings are handled through protected backend API endpoints. The frontend still uses localStorage for UI preferences, cached display state, and the active session token.

**`fetch()`** is the browser API for making HTTP requests. It returns a Promise, so it works well with `async` and `await`. One important detail is that `fetch()` only rejects for network-level problems. HTTP errors such as 404 or 500 still return a response object, so the project checks `response.ok` and manually throws an error when the request failed.

**Event listeners** connect user actions to JavaScript behavior. This project uses submit, click, change, input, drag, and storage events. For dynamic lists such as clients, tasks, notifications, and files, event delegation is useful because the buttons are created by JavaScript after the page loads.

---

## How This Applies To The CRM 🧩

The CRM keeps the PRD localStorage keys for frontend state and learning visibility:

- **`crm_users`** stores a safe frontend copy of user profile details, not passwords.
- **`crm_session`** stores the active logged-in user and JWT token.
- **`crm_clients`** stores cached client data for fast rendering.
- **`crm_theme`** stores the selected visual theme.

The CRM uses `js/core/storage.js` to keep JSON parsing and writing reusable. This prevents repeated `JSON.parse`, `JSON.stringify`, and try/catch code across every page.

The CRM uses `js/data/data.js` as the main API layer. It sends authenticated requests to the Express backend for real CRM records. It also keeps a DummyJSON import helper so the project can still demonstrate the PRD's external API requirement by importing starter client data and saving it into the CRM backend.

## Implemented External Tools And Services

### MongoDB Atlas

MongoDB Atlas is used as the cloud database for the backend. It stores persistent CRM data such as registered users, clients, tasks, notifications, activity records, messenger records, and phone settings.

- **Official site:** https://www.mongodb.com/products/platform/atlas
- **Used in:** `backend/src/config/db.js`, backend models, backend controllers.
- **Why it was used:** It gives the project real database persistence instead of only browser localStorage.

### Render

Render is used to host the Node.js and Express backend API. The deployed frontend sends production API requests to the Render backend URL.

- **Official site:** https://render.com/
- **Used in:** `backend/render.yaml`, backend environment variables, `js/core/constants.js`.
- **Why it was used:** The frontend is static, but the backend needs a server environment where Express can run.

### Vercel

Vercel is used to deploy the static frontend website. It serves the HTML, CSS, JavaScript, images, icons, and public CRM pages.

- **Official site:** https://vercel.com/
- **Used in:** frontend deployment, production domain, `CLIENT_URL` backend CORS configuration.
- **Why it was used:** It is simple and reliable for hosting static frontend projects.

### Twilio

Twilio is prepared as the phone-call provider for the CRM phone feature. Browser JavaScript cannot directly create real carrier calls by itself, so a backend provider is needed for production calling.

- **Official site:** https://www.twilio.com/
- **Used in:** backend phone routes and phone service configuration.
- **Why it was used:** It provides a real API path for future CRM calling features.

## Backend Upgrade ⚙️

The backend uses Express for routing, Mongoose for MongoDB models, bcrypt for password hashing, JWT for authenticated requests, and CORS configuration so the deployed Vercel frontend can safely call the Render backend.

The backend currently supports:

- **Auth:** signup, login, current user, account deletion.
- **Clients:** create, read, update, delete, filter, and sort.
- **Tasks:** board data, task creation, updates, archive/recycle logic, and permanent deletion.
- **Notifications and activity:** user-specific CRM updates.
- **Messenger:** saved internal conversation history.
- **Settings:** company phone settings.
- **Phone:** Twilio-based call start endpoint when provider credentials are configured.
