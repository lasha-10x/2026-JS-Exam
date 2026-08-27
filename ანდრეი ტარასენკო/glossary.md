# Technical Glossary — 10X CRM

Technical terms and architectural concepts used throughout the 9-day development cycle of the **10X CRM** project, with English technical definitions, Georgian explanations, and direct references to project implementation.

---

### 1. Authentication
* **EN:** The process of verifying a user's identity credentials (email + password) before granting access to application resources.
* **KA:** მომხმარებლის ვინაობის დადასტურება — სისტემა ამოწმებს, რომ შეყვანილი email და პაროლი ნამდვილად ემთხვევა რეგისტრირებულ ანგარიშს.
* **Code Location:** [js/auth.js](./js/auth.js) (`handleLoginSubmit()`, `handleSignupSubmit()`).

---

### 2. Session Persistence
* **EN:** The mechanism of storing active session metadata in browser storage (`crm_session` in `localStorage`) so logged-in users remain authenticated across page reloads and navigation.
* **KA:** სესია ინახავს შესული მომხმარებლის მონაცემებს `localStorage`-ში. გვერდის გადატვირთვისას მომხმარებელი რჩება სისტემაში logout-ზე დაჭერამდე.
* **Code Location:** [js/storage.js](./js/storage.js) (`saveSession()`, `getSession()`, `clearSession()`).

---

### 3. Route Guard
* **EN:** An access control check executed on page load that redirects unauthenticated users away from protected pages (`dashboard.html`, `clients.html`, `profile.html`) to `index.html`, and authenticated users away from guest pages (`index.html`, `signup.html`) to `dashboard.html`.
* **KA:** გვერდის დაცვის სისტემა (Guard) — ამოწმებს სესიის არსებობას და არაავტორიზებულ მომხმარებელს გადაამისამართებს შესვლის გვერდზე.
* **Code Location:** [js/guard.js](./js/guard.js) (`requireAuth()`, `requireGuest()`).

---

### 4. Fetch API & Asynchronous JavaScript
* **EN:** A modern browser API providing an `async/await` Promise-based interface to execute HTTP requests (GET, POST, DELETE) to external services.
* **KA:** `fetch()` ფუნქციით ვაგზავნით ასინქრონულ მოთხოვნებს სერვერზე (DummyJSON) და ვიღებთ მონაცემებს JSON ფორმატში.
* **Code Location:** [js/data.js](./js/data.js) (`fetchClientsFromApi()`, `postClientToApi()`, `deleteClientFromApi()`).

---

### 5. Mock API / Simulated Persistence
* **EN:** A test backend endpoint (e.g. DummyJSON) that responds with realistic HTTP success statuses without persistently mutating data in a real backend database.
* **KA:** იმიტირებული სერვერი (DummyJSON) — აბრუნებს წარმატებულ პასუხს POST/DELETE მოთხოვნებზე, თუმცა რეალურად მონაცემებს არ ინახავს ბაზაში.
* **Code Location:** [js/data.js](./js/data.js) (`postClientToApi()`, `deleteClientFromApi()`).

---

### 6. In-Memory State & Single Source of Truth
* **EN:** The live runtime JavaScript data array (`clientsState`) kept in memory to drive reactive UI updates, synchronized continuously with `localStorage` (`crm_clients`).
* **KA:** აპლიკაციის ცოცხალი მონაცემები მეხსიერებაში (`clientsState`), რომელიც ყოველთვის სინქრონიზებულია `localStorage`-თან და მართავს ეკრანის გამოსახულებას.
* **Code Location:** [js/clients.js](./js/clients.js) (`clientsState`, `getVisibleClients()`).

---

### 7. Form Validation
* **EN:** The evaluation of user input against PRD rules (e.g. name length >= 3, email syntax & uniqueness, password complexity, positive deal values) before submitting or persisting state.
* **KA:** ვალიდაცია ამოწმებს, რამდენად სწორად არის შევსებული ფორმის ველები (სახელის სიგრძე, ელფოსტის უნიკალურობა, პაროლის სირთულე) მონაცემების შენახვამდე.
* **Code Location:** [js/auth.js](./js/auth.js) and [js/clients.js](./js/clients.js) (`validateAddClientForm()`).

---

### 8. XSS (Cross-Site Scripting) Prevention
* **EN:** Sanitizing dynamic string variables before embedding them into `innerHTML` strings by converting unsafe HTML characters (`<`, `>`, `&`, `"`, `'`) into harmless HTML entities.
* **KA:** XSS შეტევებისგან დაცვა — მომხმარებლის მიერ შეყვანილი ტექსტის გაწმენდა (`escapeHtml`), რათა ბრაუზერმა არ გააშვას მავნე სკრიპტები.
* **Code Location:** [js/utils.js](./js/utils.js) (`escapeHtml()`).

---

### 9. SCSS `@use` Modules & Design Tokens
* **EN:** A modular CSS architecture using Sass `@use` rules to encapsulate style tokens (`$transition-fast`, `$radius-md`) and compile stylesheets cleanly into a single production CSS output (`css/main.css`).
* **KA:** SCSS-ის მოდულური სტრუქტურა — `@use` წესით ფაილების განცალკევება და დიზაინის ცვლადების ეფექტური მართვა.
* **Code Location:** [scss/main.scss](./scss/main.scss), [scss/_variables.scss](./scss/_variables.scss).

---

### 10. CSS Custom Properties & Dynamic Theme Switching
* **EN:** CSS variables (`var(--bg-primary)`, `var(--text-main)`) configured on root selectors (`[data-theme="light"]`) enabling real-time Dark/Light theme switching stored in `crm_theme`.
* **KA:** CSS ცვლადები და `[data-theme]` ატრიბუტი მუქი და განათებული დიზაინის მყისიერი შეცვლისთვის.
* **Code Location:** [scss/_variables.scss](./scss/_variables.scss), [js/navigation.js](./js/navigation.js) (`setupTheme()`).

---

### 11. Event Delegation
* **EN:** A performance technique attaching a single event listener to a parent element (e.g. `#clients-list`) to handle actions on multiple dynamically rendered child elements using `data-*` attributes.
* **KA:** მოვლენების დელეგირება — მშობელ ელემენტზე ერთი listener-ის მიბმა, რომელიც მართავს დინამიურად შექმნილი შვილი ბარათების ღილაკებს (`data-action`).
* **Code Location:** [js/clients.js](./js/clients.js) (`renderClients()`, status dropdown & delete button handlers).

---

### 12. Asynchronous Timers / Reminders
* **EN:** Non-blocking asynchronous timers scheduled via `setTimeout()` (e.g., a 60-second follow-up reminder) to trigger toast alerts without locking the UI thread.
* **KA:** ასინქრონული ტაიმერი (`setTimeout`), რომელიც 60 წამის შემდეგ აჩვენებს შეხსენების შეტყობინებას მომხმარებლის ინტერფეისის დაბლოკვის გარეშე.
* **Code Location:** [js/clients.js](./js/clients.js) (`handleReminder()`).

---

### 13. Dynamic Form State & Dirty Checking
* **EN:** A user interface pattern where form input fields are continuously evaluated against original data state, enabling or disabling the submit button (`disabled`) based on whether uncommitted changes ("dirty state") exist.
* **KA:** ფორმის დინამიური მდგომარეობა (Dirty Checking) — ველებში ტექსტის ცვლილების კონტროლი საწყის მონაცემებთან შედარებით, რათა შენახვის ღილაკი იყოს აქტიური მხოლოდ რეალური ცვლილების დროს.
* **Code Location:** [js/profile.js](./js/profile.js) (`handleProfileFormChanges()`, `renderProfileInfo()`), [profile.html](./profile.html) (`#profile-form-btn`).

---

### 14. Disabled State Design Tokens & Accessibility Styling
* **EN:** Dedicated CSS design tokens (`$color-primary-disabled`, `--primary-disabled`) and `:disabled` CSS selectors configured with `cursor: not-allowed` to provide unambiguous visual feedback for non-interactive button states.
* **KA:** გათიშული ელემენტების დიზაინის ცვლადები და `:disabled` ფსევდოკლასი — უზრუნველყოფს არასამუშაო ღილაკების ვიზუალურ გამოკვეთას და ხელმისაწვდომობას (`cursor: not-allowed`).
* **Code Location:** [scss/_variables.scss](./scss/_variables.scss) (`$color-primary-disabled`), [scss/_components.scss](./scss/_components.scss) (`.btn--primary:disabled`).

---

### 15. Favicon & Web Brand Metadata
* **EN:** A standardized shortcut icon asset (`favicon.ico`) embedded into document HTML headers via `<link rel="icon">` tags to project consistent application identity in browser tabs and bookmark bars.
* **KA:** Favicon — აპლიკაციის ლოგო/ხატულა ბრაუზერის ჩანართში, რომელიც მიბმულია ყველა HTML გვერდზე `<link rel="icon">` თეგით.
* **Code Location:** [favicon.ico](./favicon.ico), [index.html](./index.html), [signup.html](./signup.html), [dashboard.html](./dashboard.html), [clients.html](./clients.html), [profile.html](./profile.html).

