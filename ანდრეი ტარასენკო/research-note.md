# Technical Research Notes — 10X CRM

Documentation of technical research conducted during the 9-day development cycle (July 16 – July 24, 2026) for the **10X CRM** project by student **Andrey Tarasenko**.

---

## 1. Fetch API & DummyJSON Integration (Days 5 & 8)

### Research Source & Keywords
* **URL:** [MDN Web Docs — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* **Search Keywords:** `fetch API async await POST JSON`, `fetch response.ok javascript handling errors`, `dummyjson users api post delete`

### Summary (English & Georgian)
**EN:** The Fetch API provides a modern JavaScript interface for making asynchronous HTTP requests to remote servers. `fetch()` returns a `Promise` that resolves to a `Response` object. Key finding: `fetch()` does NOT reject on HTTP error statuses (such as 404 or 500); it only rejects on network failures. Therefore, developers must explicitly check `response.ok`. When sending data via POST, we must set `headers: { 'Content-Type': 'application/json' }` and pass serialized JSON strings in `body: JSON.stringify(data)`. In DummyJSON (`https://dummyjson.com/users`), POST and DELETE operations are simulated — the server returns a successful response (or HTTP 404 for POST-created IDs on DELETE), but does not mutate the remote database. Thus, local state in `localStorage` must serve as the primary source of truth.

**KA:** MDN-ის Fetch API დოკუმენტაციის მიხედვით, `fetch()` აბრუნებს Promise-ს, რის გამოც `async/await` სინტაქსის გამოყენება უზრუნველყოფს ასინქრონული კოდის წაკითხვადობას. მნიშვნელოვანია `response.ok`-ს შემოწმება, რადგან 404 ან 500 შეცდომის დროს `fetch()` Promise არ უარყოფს (reject). DummyJSON API-ზე POST (`/users/add`) და DELETE (`/users/:id`) მოთხოვნები არის სიმულირებული — სერვერი აბრუნებს პასუხს, მაგრამ რეალურად ბაზაში არ ინახავს. ამიტომ რეალური მონაცემების შენახვა ხდება local storage-ში `crm_clients` გასაღებით.

### Implementation in Codebase
* Implemented in [js/data.js](./js/data.js): `fetchClientsFromApi()`, `postClientToApi()`, and `deleteClientFromApi()`.
* Network retry & error boundaries added in [js/clients.js](./js/clients.js): `loadAndRenderClients()` displays retry option `#clients-error` if connection fails.

---

## 2. LocalStorage Persistence & Data Layer (Days 4 & 5)

### Research Source & Keywords
* **URL:** [MDN Web Docs — Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* **Search Keywords:** `localStorage JSON parse try catch javascript`, `vanilla js storage wrapper singleton`

### Summary (English & Georgian)
**EN:** `localStorage` provides persistent client-side key-value storage surviving browser reloads. However, `localStorage` can only store DOMString values. To store structured objects or arrays (like users or client pipelines), `JSON.stringify()` and `JSON.parse()` are required. Because `JSON.parse()` throws a syntax error on invalid or corrupted strings, all storage operations should be encapsulated inside a wrapper module with `try...catch` blocks returning default fallback values when keys are missing or invalid.

**KA:** `localStorage`-ში მონაცემები ინახება ბრაუზერის დახურვის შემდეგაც. ვინაიდან ინახება მხოლოდ ტექსტური ფორმატი, ობიექტების შესანახად ვიყენებთ `JSON.stringify()`-ს, ხოლო წასაკითხად `JSON.parse()`-ს. `storage.js`-ში შევქმენით უსაფრთხო wrapper ფუნქციები (`getItem`, `setItem`), რომლებიც `try...catch` ბლოკით იცავენ აპლიკაციას კოდის გაფუჭებისგან.

### Implementation in Codebase
* Centralized storage management in [js/storage.js](./js/storage.js):
  * `STORAGE_KEYS`: `crm_users`, `crm_session`, `crm_clients`, `crm_theme`
  * Safe getter/setter functions: `getUsers()`, `saveUsers()`, `getSession()`, `saveSession()`, `getClients()`, `saveClients()`, `getTheme()`, `saveTheme()`.

---

## 3. SCSS Modular Architecture & Theme Switching (Days 2 & 4)

### Research Source & Keywords
* **URL:** [Sass Documentation — @use Rule](https://sass-lang.com/documentation/at-rules/use/)
* **Search Keywords:** `sass @use vs @import`, `css custom properties dark light theme data-theme`

### Summary (English & Georgian)
**EN:** Modern Sass (Dart Sass) deprecated `@import` in favor of `@use` and `@forward` to avoid global namespace pollution and unintended CSS duplication. Variables defined in `_variables.scss` must be explicitly loaded in each partial using `@use 'variables' as *;`. Combined with CSS Custom Properties (`var(--bg-primary)`), this allows dynamic, runtime theme toggling without recompiling stylesheets. Changing the root `[data-theme="light"]` attribute immediately re-themes the entire application.

**KA:** თანამედროვე SCSS-ში `@import`-ის ნაცვლად გამოიყენება `@use`. `_variables.scss` ფაილში განსაზღვრული ცვლადების მისაღებად ყოველ partial ფაილში იწერება `@use 'variables' as *;`. CSS ცვლადების (`--bg-primary`) და `[data-theme]` ატრიბუტის საშუალებით ხდება მუქი და განათებული თემის მყისიერი გადართვა CSS-ის ხელახალი კომპილაციის გარეშე.

### Implementation in Codebase
* Color tokens & CSS custom properties in [scss/_variables.scss](./scss/_variables.scss).
* Main build entrypoint in [scss/main.scss](./scss/main.scss).
* Theme switching logic in [js/navigation.js](./js/navigation.js) (`setupTheme()`).

---

## 4. DOM Security & XSS Prevention (Day 6)

### Research Source & Keywords
* **URL:** [OWASP — Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
* **Search Keywords:** `javascript innerHTML escape html string xss prevention`

### Summary (English & Georgian)
**EN:** Dynamically constructing HTML strings with template literals (`${client.name}`) and injecting them into `element.innerHTML` introduces Cross-Site Scripting (XSS) vulnerabilities if user input contains unescaped characters like `<`, `>`, `&`, `"`, or `'`. To prevent malicious script execution, all dynamic text content rendered into template literals must pass through an HTML entity escaping helper (`escapeHtml`).

**KA:** შაბლონურ სტრიქონებში (`template literals`) მომხმარებლის მიერ შეყვანილი ტექსტის პირდაპირი ჩასმა `innerHTML`-ით ქმნის XSS სარისკო ხვრელებს. უსაფრთხოებისთვის შევქმენით `escapeHtml()` ფუნქცია `utils.js`-ში, რომელიც სპეციალურ სიმბოლოებს (`<`, `>`, `&`) გარდაქმნის უსაფრთხო HTML HTML-entities ტექსტად.

### Implementation in Codebase
* Sanitization utility in [js/utils.js](./js/utils.js) (`escapeHtml()`).
* Applied across card rendering and modal details in [js/clients.js](./js/clients.js) (`renderClients()`).

---

## 5. Dynamic Form State & Dirty Checking (Day 11)

### Research Source & Keywords
* **URL:** [MDN Web Docs — HTMLInputElement: input event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* **Search Keywords:** `vanilla js disable submit button until form change`, `input event listener compare form values`, `css disabled pseudo class cursor not-allowed`

### Summary (English & Georgian)
**EN:** Disabling form submit controls by default when form values match existing backend or session data ("clean state") prevents unnecessary storage writes, reduces redundant network calls, and guides the user visually. By listening to `input` events on target input elements (`fullName`, `company`), we compare current field values against stored user data (`user.fullName`, `user.company`). If values differ, `btn.disabled = false`. Pairing this with dedicated CSS design tokens (`--primary-disabled: #a5b4fc`) and `:disabled` pseudo-classes ensures consistent visual cues (`cursor: not-allowed`).

**KA:** შენახვის ღილაკის გათიშვა (`disabled`), სანამ მომხმარებელი არ შეცვლის მონაცემებს ველებში, თავიდან გვაცილებს ზედმეტ ჩანაწერებსა და მოთხოვნებს. `profile.js`-ში `input` მოვლენის მოსმენით ხდება შეყვანილი ტექსტის შედარება სესიაში არსებულ `user` ობიექტთან. თუ ცვლილება არ არის, ღილაკი ინარჩუნებს `disabled` ატრიბუტს. CSS-ში `:disabled` ფსევდოკლასი და `--primary-disabled` ცვლადი უზრუნველყოფს შესაბამის ვიზუალურ ინდიკაციას (`cursor: not-allowed`).

### Implementation in Codebase
* Form change detection in [js/profile.js](./js/profile.js): `handleProfileFormChanges()` and initial button setup in `renderProfileInfo()`.
* Form markup target in [profile.html](./profile.html): `#profile-form-btn`.
* Disabled state design tokens in [scss/_variables.scss](./scss/_variables.scss) and selector in [scss/_components.scss](./scss/_components.scss).

---

## 6. Favicon Integration & Web Branding Standards (Day 11)

### Research Source & Keywords
* **URL:** [MDN Web Docs — How to add a favicon to your site](https://developer.mozilla.org/en-US/docs/Learn_web_development/howto/solve_html_problems/add_a_favicon)
* **Search Keywords:** `favicon.ico html link tag rel icon`, `web site tab icon best practices`

### Summary (English & Georgian)
**EN:** Integrating a standard web icon (`favicon.ico`) in the `<head>` of every application document ensures consistent visual identity across browser tabs, history lists, and bookmarks. Placing standard `<link rel="icon" href="favicon.ico" type="image/x-icon">` tags across all route HTML pages ([index.html](./index.html), [signup.html](./signup.html), [dashboard.html](./dashboard.html), [clients.html](./clients.html), [profile.html](./profile.html)) secures branding consistency across authenticated and unauthenticated views.

**KA:** Favicon-ის (`favicon.ico`) ინტეგრაცია ყველა HTML გვერდის `<head>` სექციაში `<link rel="icon">` თეგის საშუალებით უზრუნველყოფს აპლიკაციის ლოგოს/ხატულას გამოჩენას ბრაუზერის ჩანართებში, სანიშნეებსა და ისტორიაში.

### Implementation in Codebase
* Icon asset: [favicon.ico](./favicon.ico).
* Included in: [index.html](./index.html), [signup.html](./signup.html), [dashboard.html](./dashboard.html), [clients.html](./clients.html), and [profile.html](./profile.html).

---

## Key Takeaways Summary

1. **`fetch()` non-rejection:** Always inspect `response.ok` manually for HTTP error status codes (404/500).
2. **Mock API vs Local Truth:** Simulated APIs (DummyJSON) require the client-side `localStorage` layer to hold real persistent data state.
3. **Explicit SCSS Imports:** Modern Sass requires `@use 'variables' as *;` in every partial using design tokens.
4. **Sanitize Dynamic HTML:** Always filter user inputs with `escapeHtml()` prior to `innerHTML` injection to safeguard against XSS attacks.
5. **Dirty Checking Form State:** Track form field mutations via `input` events to disable redundant submissions and convey interactive state visually through `:disabled` selectors.
6. **Unified Brand Assets:** Link standard `favicon.ico` icons across all entry HTML pages for consistent web tab visual identification.

