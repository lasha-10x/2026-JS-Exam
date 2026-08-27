# 10X CRM — JavaScript გამოცდის სრული მომზადების სახელმძღვანელო

ეს დოკუმენტი აგებულია შემდეგი წყაროების შედარებით:

- `JS exam questions.xlsx`;
- `10X-CRM-Exam-PRD.docx`;
- 10X CRM-ის მიმდინარე HTML, CSS და JavaScript კოდი.

მიზანია იცოდე:

1. რას შეიძლება გკითხოს შემფასებელმა;
2. სად არის შესაბამისი ლოგიკა შენს პროექტში;
3. როგორ უპასუხო შენი კოდის მიხედვით;
4. სად შეასრულო შესაძლო Live Coding ცვლილება;
5. როგორ დატესტო ცვლილება.

> პასუხები სიტყვასიტყვით არ დაიზეპირო. გამოიყენე როგორც ჩარჩო და პასუხისას
> გახსენი შესაბამისი ფუნქცია.

---

# 1. გამოცდისას პასუხის ფორმულა

თითოეულ ტექნიკურ კითხვას უპასუხე ოთხი ნაბიჯით:

1. **განმარტება** — რა არის ეს კონცეფცია;
2. **ჩემი კოდი** — რომელ ფუნქციაში ვიყენებ;
3. **მიზეზი** — რატომ ავირჩიე ეს მიდგომა;
4. **შედეგი/ტესტი** — როგორ ვამოწმებ, რომ მუშაობს.

მაგალითი:

> `filter()` creates a new array containing only matching elements. I use it
> in `activeDeals()` in `data.js` to exclude Won and Lost clients. It does not
> mutate the original clients array. I test it with Lead, Contacted, Won, and
> Lost records and verify the dashboard count.

თუ პასუხი არ გახსოვს, დაიწყე კოდიდან:

> “In my project, this is implemented in…”

შემდეგ აჩვენე ფუნქცია და ნაბიჯებად ახსენი.

---

# 2. Excel-ში მითითებული ფაილების რეალური შესაბამისობა

Excel-ის რამდენიმე ფაილის სახელი გენერიკულია და შენს პროექტში არ არსებობს.

| Excel-ში წერია | შენს პროექტში მოძებნე |
| --- | --- |
| `Validation.js` | `js/ui.js`, `js/signup.js`, `js/profile.js`, `js/clients.js` |
| `Toast.js` | `js/ui.js` → `showToast()` |
| `Themes.js` | `js/storage.js` + `js/guard.js` |
| `Logout.js` | `js/guard.js` → `logout()` |
| Auth module | `js/login.js`, `js/signup.js`, `js/guard.js`, `js/storage.js` |
| Client data/API | `js/data.js` |
| Client UI/CRUD | `js/clients.js` |
| Dashboard | `js/dashboard.js` |
| Profile | `js/profile.js` |
| Reminders | `js/notifications.js` + `js/clients.js` |

Live Coding-ისას ჯერ გამოიყენე:

```text
Ctrl + Shift + F
```

მოძებნე არსებული ტექსტი, რიცხვი, ფუნქციის სახელი ან CSS კლასი. მხოლოდ Excel-ში
მითითებულ არარსებულ ფაილს ნუ მოძებნი.

---

# 3. პროექტის არქიტექტურის რუკა

## `js/storage.js`

პასუხისმგებლობა:

- localStorage key-ები;
- safe JSON save/parse;
- users, session, clients, theme, notifications და reminders;
- მიმდინარე მომხმარებლის მოძებნა;
- საერთო `MIN_PASSWORD_LENGTH`.

მთავარი ფუნქციები:

```text
saveToStorage()
getFromStorage()
getUsers() / saveUsers()
getSession() / saveSession() / clearSession()
getCurrentUser()
getClients() / saveClients() / clearClients()
getTheme() / saveTheme()
```

## `js/ui.js`

პასუხისმგებლობა:

- toast;
- ველის error-ები;
- საერთო email/phone validation;
- phone sanitization;
- თანხის ფორმატირება.

მთავარი ფუნქციები:

```text
showToast()
showError()
clearErrors()
clearErrorOnInput()
isValidEmail()
sanitizePhone()
isValidPhone()
formatMoney()
```

## `js/guard.js`

პასუხისმგებლობა:

- Auth Guard;
- საჯარო/დაცული redirect;
- თემა;
- navigation;
- Logout;
- topbar-ში მომხმარებლის ჩვენება.

## `js/data.js`

პასუხისმგებლობა:

- DummyJSON API;
- Client model mapping;
- client state;
- უნიკალური ID;
- local/API მონაცემების ჩატვირთვა;
- Dashboard-ის გამოთვლები;
- cross-tab client synchronization.

## `js/clients.js`

პასუხისმგებლობა:

- filter/search/sort;
- Client Card-ების შექმნა;
- Add/Delete/Status change;
- details modal;
- notes/reminders;
- import/export;
- event delegation;
- modal accessibility.

## `js/dashboard.js`

პასუხისმგებლობა:

- greeting;
- live clock;
- სტატისტიკური ბარათები;
- pipeline;
- recent clients.

## `js/profile.js`

პასუხისმგებლობა:

- profile render/update;
- password change;
- Reset CRM Data.

## `js/notifications.js`

პასუხისმგებლობა:

- notification center;
- persistent reminders;
- reminder scheduling;
- unread/read state.

---

# 4. CORE კითხვები — პასუხები შენი კოდის მიხედვით

## 4.1 პროექტის დანიშნულება

**კითხვა:** რა არის შენი პროექტის მთავარი დანიშნულება?

**პასუხი:**

> 10X CRM is a browser-based customer relationship management application for
> sales managers. It supports registration, login, protected pages, client
> management, sales statuses, dashboard statistics, notes, reminders, and
> profile management.

## 4.2 გვერდების რუკა

| გვერდი | დანიშნულება | წვდომა |
| --- | --- | --- |
| `index.html` | Login | საჯარო |
| `signup.html` | Registration | საჯარო |
| `dashboard.html` | სტატისტიკა და Pipeline | დაცული |
| `clients.html` | კლიენტების მართვა | დაცული |
| `profile.html` | პროფილი/პაროლი/Reset | დაცული |

## 4.3 რატომ JavaScript?

> I use JavaScript for form validation, DOM rendering, event handling,
> authentication state, localStorage persistence, API requests, filtering,
> sorting, timers, reminders, and interactive modals.

## 4.4 `const` და `let`

- `const` — binding-ს ხელახლა არ ვანიჭებთ მნიშვნელობას;
- `let` — მნიშვნელობა იცვლება.

შენს კოდში:

```js
const API_BASE = 'https://dummyjson.com';
let clients = [];
let statusFilter = 'All';
```

`const` მასივის/ობიექტის შიგთავსის ცვლილებას არ კრძალავს; მხოლოდ ცვლადის
ხელახლა მინიჭებას კრძალავს.

## 4.5 რატომ არის კოდი ფუნქციებად დაყოფილი?

> Functions separate responsibilities, reduce duplication, improve
> readability, and make individual behaviors easier to test and change.

მაგალითები:

- `validateClient()` მხოლოდ ვალიდაციას აკეთებს;
- `addClient()` მონაცემის დამატებას;
- `renderClients()` ეკრანის დახატვას;
- `persistClients()` შენახვას.

## 4.6 რა არის `clients`?

`clients` არის მიმდინარე in-memory state:

```js
let clients = [];
```

მასში Client ობიექტები ინახება. localStorage persistence-ია, DOM კი state-ის
ვიზუალური გამოსახულება.

## 4.7 Client ობიექტის ველები

```text
id
apiId
name
email
phone
company
image
status
dealValue
notes
createdAt
```

`id` არის აპლიკაციის უნიკალური ID; `apiId` — DummyJSON ჩანაწერის ID.

## 4.8 localStorage

> localStorage is a persistent browser key/value storage. It stores strings,
> so objects and arrays are serialized with JSON.stringify and restored with
> JSON.parse.

შენს პროექტში ძირითადი key-ებია:

```text
crm_users
crm_session
crm_clients
crm_theme
```

დამატებით:

```text
crm_notifications
crm_reminders
```

## 4.9 `JSON.stringify()` და `JSON.parse()`

- `JSON.stringify(value)` — ობიექტს/მასივს JSON string-ად გარდაქმნის;
- `JSON.parse(text)` — JSON string-ს JavaScript მნიშვნელობად აღადგენს.

შენს `getFromStorage()`-ში parse `try/catch`-შია, ამიტომ დაზიანებულ JSON-ზე
აპლიკაცია fallback მნიშვნელობას იღებს.

## 4.10 `trim()`

> `trim()` removes whitespace from the beginning and end of a string. I use it
> so input containing only spaces is not accepted as valid data.

გამოიყენება name, email, phone, company, search და note ველებზე.

## 4.11 Password validation

საერთო მინიმუმი:

```js
const MIN_PASSWORD_LENGTH = 10;
```

Sign Up:

```js
password.length >= MIN_PASSWORD_LENGTH
/[a-zA-Z]/.test(password)
/[0-9]/.test(password)
```

Profile-ში დამატებით:

- Current Password უნდა ემთხვეოდეს;
- New Password ძველისგან განსხვავებული უნდა იყოს;
- Confirm უნდა დაემთხვეოდეს New Password-ს.

## 4.12 Logout

`guard.js`-ის `logout()`:

1. იძახებს `clearSession()`;
2. შლის მხოლოდ `crm_session`-ს;
3. გადადის `index.html`-ზე.

მომხმარებლები და კლიენტები არ იშლება.

## 4.13 Theme

`getTheme()` კითხულობს `crm_theme`-ს. `applyTheme()` body-ზე ცვლის
`theme-dark`/`theme-light` კლასებს. `toggleTheme()` ახალ მნიშვნელობას ინახავს.

## 4.14 Auth Guard

`requireAuth()` ამოწმებს:

```text
session არსებობს?
current user არსებობს?
```

თუ არა:

```js
window.location.href = 'index.html';
```

`redirectIfAuthenticated()` საჯარო გვერდიდან ავტორიზებულ მომხმარებელს
Dashboard-ზე აგზავნის.

## 4.15 Duplicate email

Sign Up და Add Client ორივე მხარეს email:

1. `trim()`-დება;
2. `toLowerCase()`-დება;
3. `some()`-ით შედარდება არსებულ email-ებს.

ამიტომ `A@X.COM` და `a@x.com` ერთ email-ად ითვლება.

## 4.16 Login-ში `find()`

> `find()` returns the first matching element. Login needs one user whose
> normalized email and password match the submitted values.

თუ ვერ იპოვა, აბრუნებს `undefined`.

## 4.17 რატომ არის Login error ზოგადი?

```text
Invalid email or password
```

> A generic message does not reveal whether a particular email is registered,
> which reduces information disclosure.

## 4.18 `crm_session`

შენს session-ში ინახება:

```text
userId
email
loginAt
```

მთელი User ობიექტის დუბლირება საჭირო არ არის; `userId`-ით მომხმარებელი
`crm_users`-ში მოიძებნება.

## 4.19 `Date.now()`

გამოიყენება:

- User ID;
- fallback Client ID;
- notification/reminder ID;
- reminder due time;
- New This Week;
- გასული დროის გამოთვლა.

> `Date.now()` returns the current timestamp in milliseconds.

## 4.20 რატომ ISO თარიღი?

```js
new Date().toISOString()
```

> ISO is a stable, timezone-explicit string format that can be stored,
> reconstructed as a Date, and sorted reliably.

## 4.21 `state → save → render`

აპლიკაციის ძირითადი ციკლი:

1. იცვლება `clients`;
2. ახალი state ინახება `crm_clients`-ში;
3. UI თავიდან რენდერდება.

თუ მხოლოდ DOM-ს შეცვლი, refresh ან შემდეგი render ძველ state-ს დააბრუნებს.

## 4.22 `data-id` და `dataset`

Client Card-ზე:

```js
card.dataset.id = client.id;
```

Event handler ამ მნიშვნელობით პოულობს სწორ Client ობიექტს.

## 4.23 `push()` და `unshift()`

- `push()` ბოლოში ამატებს;
- `unshift()` დასაწყისში ამატებს.

შენს `addClient()`-ში ახალი მასივი იქმნება:

```js
const nextClients = [newClient, ...clients];
```

ეს `unshift()`-ის არამუტაციური ეკვივალენტია — ახალი კლიენტი დასაწყისშია.

## 4.24 `filter()` წაშლისას

`deleteClient()` ქმნის ახალ მასივს წასაშლელი ID-ის გარეშე. `filter()` საწყის
მასივს არ ცვლის.

## 4.25 `fetch`, `async`, `await`

> `fetch()` sends an asynchronous HTTP request and returns a Promise.

> An `async` function always returns a Promise and allows `await`.

> `await` pauses the surrounding async function until the Promise settles; it
> does not block the browser's main thread.

## 4.26 `response.ok`

`fetch()` 404/500 პასუხზე Promise-ს ავტომატურად არ reject-ავს. ამიტომ შენ
ხელით ამოწმებ:

```js
if (!response.ok) {
  throw new Error(...);
}
```

## 4.27 `try/catch`

- `try` — API/storage-ის რისკიანი ოპერაცია;
- `catch` — error UI/toast/rollback;
- `finally` — cleanup, მაგალითად ღილაკის ხელახლა ჩართვა.

## 4.28 რატომ local-first?

`loadClients()`:

- თუ `crm_clients` არსებობს — იყენებს შენახულ მონაცემს;
- თუ არ არსებობს — იძახებს DummyJSON-ს.

ასე refresh-ზე ცვლილებები არ იკარგება და ზედმეტი GET არ იგზავნება.

## 4.29 DummyJSON mapping

DummyJSON user განსხვავდება Client მოდელისგან. `mapApiClient()` ამატებს:

```text
status: Lead
dealValue
notes: []
createdAt
apiId
```

## 4.30 რატომ აბრუნებს DELETE 404-ს?

DummyJSON POST-ს სიმულაციას აკეთებს და ახალ ჩანაწერს მუდმივად არ ინახავს.
შემდგომ DELETE-ზე ეს ID რეალურ mock database-ში არ არსებობს. ამიტომ ლოკალურ
Client-ს 404-ის შემთხვევაშიც state-დან ვშლით.

## 4.31 რატომ ჩანს ყველა validation error?

> Showing all field errors in one submit lets the user fix every problem
> without repeatedly submitting the form.

Field validation error შესაბამის input-თან ჩანს; network error — toast/error
state-ით.

## 4.32 Event Delegation

`clientsArea`-ზე ერთი `click` და ერთი `change` listener მართავს დინამიკურად
შექმნილ Client Card-ებს.

> Event delegation uses event bubbling so one parent listener can handle
> current and future child elements.

## 4.33 `event.target` და `event.currentTarget`

შენს `clientsArea` listener-ში:

- `event.target` — რეალურად დაჭერილი button/select/text/icon;
- `event.currentTarget` — ყოველთვის `clientsArea`.

`closest()` target-იდან უახლოეს `.client-card`-ს პოულობს.

## 4.34 Case-insensitive search

`getVisibleClients()`:

```js
const term = searchTerm.trim().toLowerCase();
```

შემდეგ lowercase-ად ამოწმებს:

- name;
- company;
- email;
- phone.

შენთან email და phone search უკვე დამატებულია — Excel-ის შესაბამისი FULL
ცვლილებები უკვე შესრულებულია.

## 4.35 `getVisibleClients()`

თანმიმდევრობა:

```text
status filter → search → sort → render
```

- All-ისას `[...clients]` იქმნება;
- სხვა სტატუსზე `filter()` გამოიყენება;
- search case-insensitive-ია;
- sort მუშაობს შედეგის ასლზე.

## 4.36 რატომ `[...clients]`?

`sort()` მუტაციურია. ასლი იცავს მთავარ `clients` state-ს შემთხვევითი
გადალაგებისგან.

## 4.37 Active Deals

`data.js`:

```js
return client.status !== 'Won' && client.status !== 'Lost';
```

Dashboard იყენებს:

```js
activeDeals(list).length
```

`&&` აუცილებელია; `||` პრაქტიკულად ყველა სტატუსს გაატარებდა.

## 4.38 Won Revenue

1. `filter()` ტოვებს მხოლოდ `Won` Client-ებს;
2. `reduce()` აჯამებს `dealValue`-ებს;
3. accumulator იწყება `0`-ით;
4. `formatMoney()` თანხას `$12,500` ფორმატში აჩვენებს.

## 4.39 New This Week

```js
(Date.now() - new Date(client.createdAt)) / 86400000 <= 7
```

`86400000` არის ერთი დღის მილიწამები.

## 4.40 Recent Clients

`recentClients()`:

1. ქმნის ასლს;
2. `createdAt`-ით კლებადად ალაგებს;
3. `slice(0, limit)`-ით ბოლო ჩანაწერებს აბრუნებს.

Default `limit` არის 5.

## 4.41 `setTimeout()` და `setInterval()`

- `setTimeout()` — ერთხელ;
- `setInterval()` — პერიოდულად.

შენს პროექტში:

- Clock — `setInterval(..., 1000)`;
- toast/reminder/debounce — `setTimeout()`.

## 4.42 Closure

მაგალითები:

- `showToast()`-ის `dismissToast()` იმახსოვრებს `toast`-ს;
- debounce callback იმახსოვრებს input-ის `value`-ს;
- modal handlers იმახსოვრებს შესაბამის `modal`-ს.

## 4.43 Notes

`addNote()`:

1. Client-ს ID-ით პოულობს;
2. `trim()`-ით ცარიელს გამორიცხავს;
3. `notes` მასივში ამატებს `{text, date}`;
4. ინახავს Client state-ს;
5. details UI-ს ახლიდან ხსნის/რენდერს.

## 4.44 Profile

მიმდინარე მომხმარებელი:

```text
crm_session.userId → crm_users.find()
```

Profile update მხოლოდ DOM-ს არ ცვლის — `crm_users`-ში ინახავს, შემდეგ
Profile/topbar-ს თავიდან რენდერს.

## 4.45 Reset CRM Data

1. confirm;
2. `crm_clients` იშლება;
3. API ხელახლა იტვირთება;
4. users/session ხელუხლებელია;
5. failure-ზე წინა clients rollback ხდება.

---

# 5. FULL კითხვები — ძლიერი პასუხები

## 5.1 Single Source of Truth

> During an action, the in-memory `clients` array is the working source of
> truth. localStorage provides persistence and the DOM is a rendered view of
> that state.

## 5.2 DOM/state divergence

თუ პირდაპირ DOM-ს შეცვლი:

- localStorage არ განახლდება;
- refresh ძველ მონაცემს დააბრუნებს;
- Dashboard არასწორ სტატისტიკას აჩვენებს;
- შემდეგი render ცვლილებას გააქრობს.

## 5.3 Double submit

რისკი:

- ორი POST;
- duplicate Client;
- ორი toast.

გადაწყვეტა:

```text
disable submit → await request → finally enable
```

შენს Add Client submit flow-ში ეს კონკრეტულად ხელით გადასამოწმებელია.

## 5.4 Front-end Auth Guard-ის სისუსტე

localStorage მომხმარებელს DevTools-ით შეუძლია შეცვალოს. ამიტომ ეს navigation
guard-ია და არა ნამდვილი უსაფრთხო ავტორიზაცია. Production-ში სესია და
authorization backend-ზე მოწმდება.

## 5.5 Plain-text password

სასწავლო მოთხოვნაა, მაგრამ production-ში მიუღებელია:

- localStorage JavaScript/XSS-ით იკითხება;
- პაროლი backend-ზე salt+hash ფორმით უნდა ინახებოდეს;
- client-ს plain password database არ უნდა ჰქონდეს.

## 5.6 Event Delegation-ის performance

30+ card-ზე თითო listener-ის ნაცვლად ერთი parent listener:

- ნაკლებ მეხსიერებას იყენებს;
- დინამიკურ card-ებს ავტომატურად მოიცავს;
- listener setup-ს ამარტივებს.

## 5.7 Debounce

შენს search input-ზე უკვე არის 250 ms debounce:

```text
clearTimeout(old timer)
setTimeout(new search/render, 250)
```

Excel-ში მოთხოვნილი 300 ms ცვლილებისთვის მხოლოდ `250` გახდება `300`.

## 5.8 Loading, Empty და Error

- Loading — მოთხოვნა ჯერ მიმდინარეობს;
- Empty — მოთხოვნა წარმატებულია, შედეგი არ არის;
- Error — მოთხოვნა ჩავარდა და Retry საჭიროა.

სამივეს ერთი ტექსტით ჩვენება მომხმარებელს მდგომარეობას უმალავს.

## 5.9 დაზიანებული JSON

`getFromStorage()` parse-ს `try/catch`-ით იცავს. თუმცა `crm_clients`-ის
დაზიანებისას სრული API fallback სცენარი ხელით უნდა გაიტესტოს, რადგან fallback
მნიშვნელობის არჩევა გავლენას ახდენს `loadClients()` branch-ზე.

## 5.10 API concurrency

თუ Retry რამდენჯერმე გაეშვა:

- ძველი response შეიძლება გვიან მოვიდეს;
- შეიძლება ახალი state გადაფაროს.

გადაწყვეტილებები:

- Retry button disable;
- request ID/token;
- `AbortController`;
- მხოლოდ ბოლო response-ის მიღება.

## 5.11 ყველაზე კრიტიკული ფუნქცია

ძლიერი არჩევანი:

> `loadClients()` is critical because it decides between persistent local data
> and the external API, normalizes IDs, initializes the central client state,
> and affects both Clients and Dashboard pages.

ასევე დასაშვებია `getVisibleClients()`, თუ ახსნი მის გავლენას filter/search/sort
და state integrity-ზე.

---

# 6. HTTP მეთოდები — სწორი პასუხები

Excel-ის `Request Methods` ფურცელში რამდენიმე მნიშვნელობა არასწორია. სწორი
საბაზისო ცხრილი:

| Method | Safe | Idempotent | დანიშნულება |
| --- | --- | --- | --- |
| GET | Yes | Yes | რესურსის წაკითხვა |
| HEAD | Yes | Yes | GET-ის headers-only ვარიანტი |
| OPTIONS | Yes | Yes | მხარდაჭერილი მეთოდები/CORS |
| POST | No | No | ახალი რესურსი/processing |
| PUT | No | Yes | რესურსის სრული ჩანაცვლება |
| PATCH | No | ყოველთვის არა | ნაწილობრივი ცვლილება; idempotency implementation-ზეა დამოკიდებული |
| DELETE | No | Yes | რესურსის წაშლა |

**Safe** ნიშნავს, რომ მეთოდი server state-ის შეცვლისთვის არ არის განკუთვნილი.

**Idempotent** ნიშნავს, რომ ერთი და იგივე მოთხოვნის რამდენჯერმე შესრულებას
იგივე საბოლოო ეფექტი აქვს.

შენს პროექტში:

- GET — initial clients;
- POST — Add Client;
- DELETE — Delete Client;
- PUT/PATCH — ამ ეტაპზე არაა, Edit Client-ის bonus იქნებოდა.

---

# 7. HTTP status codes — რა უნდა იცოდე რეალურად

ყველა იშვიათი code-ის დაზეპირება საჭირო არ არის. პირველ რიგში:

| Code | მნიშვნელობა | შენს პროექტთან კავშირი |
| --- | --- | --- |
| 200 | OK | წარმატებული GET/სხვა response |
| 201 | Created | წარმატებული POST |
| 204 | No Content | წარმატებული response body-ის გარეშე |
| 400 | Bad Request | არასწორი request |
| 401 | Unauthorized | authentication საჭიროა |
| 403 | Forbidden | ავტორიზებულია, მაგრამ უფლება არ აქვს |
| 404 | Not Found | DummyJSON-ში local ID ვერ მოიძებნა |
| 409 | Conflict | duplicate/resource conflict |
| 422 | Unprocessable Content | request syntax სწორია, data invalid |
| 429 | Too Many Requests | rate limit |
| 500 | Internal Server Error | server failure |
| 502 | Bad Gateway | upstream-ის ცუდი response |
| 503 | Service Unavailable | სერვერი დროებით მიუწვდომელია |
| 504 | Gateway Timeout | upstream timeout |

მნიშვნელოვანი განსხვავება:

- `401` — ვინ ხარ, ჯერ ვერ დაგადასტურეთ;
- `403` — ვიცით ვინ ხარ, მაგრამ მოქმედება აკრძალულია.

---

# 8. Array methods — შენს კოდში სად გამოიყენება

| Method | რას აკეთებს | შენი მაგალითი |
| --- | --- | --- |
| `map()` | გარდაქმნის ყველა ელემენტს | API users → Clients; stat cards |
| `filter()` | ტოვებს შესაბამის ელემენტებს | search, status, active deals, delete |
| `reduce()` | მასივს ერთ მნიშვნელობად კრავს | Won Revenue |
| `find()` | პირველ შესაბამის ელემენტს აბრუნებს | login, client by ID, current user |
| `some()` | მინიმუმ ერთი ემთხვევა? | duplicate email |
| `forEach()` | თითოეულზე მოქმედება | listeners/reminders |
| `includes()` | შეიცავს მნიშვნელობას/ტექსტს? | search/validation |
| `flatMap()` | map + ერთი დონით flat | Excel-ის ყველა worksheet row |
| `sort()` | ალაგებს და საწყის მასივს ცვლის | derived copy sorting |
| `slice()` | ნაწილს აბრუნებს, არ ცვლის | recent/pagination-like limits |

აუცილებლად იცოდე:

- `sort()` — mutating;
- `filter/map/slice` — ახალ მასივს აბრუნებს;
- `find()` — ელემენტი ან `undefined`;
- `findIndex()` — ინდექსი ან `-1`;
- `some()` — boolean;
- `forEach()` — ახალ მასივს არ აბრუნებს.

---

# 9. Object methods — პრიორიტეტი

შენს კოდთან ყველაზე ახლოს:

## `Object.entries()`

Import row normalization და error iteration:

```js
for (const [key, value] of Object.entries(row)) {
}
```

## `Object.keys()`

ვალიდაციის error-ების არსებობის შემოწმება:

```js
Object.keys(errors).length
```

## `Object.fromEntries()`

Dashboard status count-ის საწყისი ობიექტი:

```js
Object.fromEntries(CLIENT_STATUSES.map(...))
```

## `Object.assign()`

Profile user update:

```js
Object.assign(user, changes);
```

ასევე იცოდე:

- `Object.values()` — value-ების მასივი;
- `Object.hasOwn()` — საკუთარი key არსებობს?;
- `Object.freeze()` — დამატება/წაშლა/ცვლილება იბლოკება;
- `Object.seal()` — დამატება/წაშლა იბლოკება, არსებული value იცვლება;
- `structuredClone()` — deep copy supported data-ზე.

---

# 10. String methods — შენს კოდში

| Method/property | გამოყენება |
| --- | --- |
| `length` | name/password/phone validation |
| `trim()` | ფორმები, search, notes |
| `toLowerCase()` | email normalization და case-insensitive search |
| `toUpperCase()` | initials |
| `includes()` | search |
| `startsWith()` | CSV/phone protection |
| `split()` | initials/name/avatar |
| `slice()` | random ID/date filename |
| `replace()` | phone sanitization, CSV, import normalization |

`length` property-ია და არა მეთოდი:

```js
password.length
```

არა:

```js
password.length()
```

---

# 11. Async JavaScript

## Promise states

```text
Pending
Fulfilled
Rejected
```

## `.then()`, `.catch()`, `.finally()`

- `.then()` — fulfilled result;
- `.catch()` — rejection;
- `.finally()` — cleanup ორივე შემთხვევაში.

## `async/await`

`async/await` Promise-ის syntax-ია, არა ცალკე threading სისტემა.

სწორი ფორმულირება:

> `await` pauses only the surrounding async function. The browser can continue
> processing other events; the main thread is not blocked while waiting for
> the network.

## Promise combinators

- `Promise.all()` — ყველა უნდა შესრულდეს; fail-fast;
- `Promise.allSettled()` — ყველას ელოდება და თითოეულის status-ს აბრუნებს;
- `Promise.race()` — პირველი settled;
- `Promise.any()` — პირველი fulfilled.

შენს ძირითად CRM flow-ში ისინი აუცილებელი არ არის; fetch-ები უმეტესად
ერთჯერადია.

---

# 12. Live Coding-ის მუშაობის მეთოდი

ყოველი დავალებისას:

1. მოთხოვნა ერთი წინადადებით გაიმეორე;
2. `Ctrl + Shift + F`-ით მოძებნე არსებული ლოგიკა;
3. ჩამოთვალე ყველა დაკავშირებული ადგილი;
4. შეცვალე მინიმალური scope;
5. განაახლე condition და UI text ერთად;
6. გაუშვი positive, negative და boundary test;
7. Console/Network/Application tabs გადაამოწმე;
8. მოკლედ ახსენი ცვლილება.

არ გააკეთო:

- unrelated refactor;
- ახალი dependency;
- მთლიანი ფაილის გადაწერა;
- მხოლოდ error text-ის შეცვლა condition-ის გარეშე;
- მხოლოდ DOM-ის შეცვლა state/storage-ის გარეშე.

---

# 13. CORE Live Coding — სად შეცვალო

## მარტივი და ძალიან სავარაუდო

| დავალება | შენი რეალური ადგილი | ტესტი |
| --- | --- | --- |
| Password 8→10 | უკვე გაკეთდა: `storage.js` `MIN_PASSWORD_LENGTH` | 9 error, 10 + letter/number success |
| Full Name 3→4 | `signup.js` validation/message | 3 error, 4 success |
| Login empty email text | `login.js` → `validateLogin()` | empty email |
| Toast 3→5 sec | `ui.js` → `showToast()` | stopwatch ~5 sec |
| Default theme | `storage.js` → `getTheme()` fallback | clear `crm_theme` |
| Logout redirect | `guard.js` → `logout()` | session removed, data remains |
| API limit 30→20 | `data.js` → `loadClients()` URL | clear `crm_clients`, Network GET |
| API default status | `data.js` → `mapApiClient()` | clear storage, reload |
| Empty list text | `clients.js` → `renderClients()` | unmatched search |
| Client Card phone | `clients.js` → `createClientCard()` | value/fallback |
| Currency symbol | `ui.js` → `formatMoney()` | all money UI |
| Phone required/min digits | `ui.js` + `clients.js` validation | empty/boundary |
| Deal Value >=100 | `clients.js` → `validateClient()` | 99/100 |
| Add at list end | `clients.js` → `addClient()` next array | sort mode გაითვალისწინე |
| Add/Delete toast text | `clients.js` შესაბამის flow-ში | action |

## საშუალო

| დავალება | ადგილი | მთავარი რისკი |
| --- | --- | --- |
| Cancel delete info toast | `clients.js` → `deleteClient()` | request არ გაუშვა |
| Local-only delete | `clients.js` → `deleteClient()` | save/render დატოვე |
| Duplicate email case-insensitive | უკვე არის `validateClient()` | ორივე მხარე normalize |
| Retry loading/disable | `setClientsAreaMessage()`/`initialLoad()` | `finally` |
| Storage key rename | `storage.js` `STORAGE_KEYS` | hardcoded ნარჩენი არ დატოვო |
| Empty array → API | `data.js` → `loadClients()` | `null` vs `[]` semantics |
| Submit disable | Add Form handler + `finally` | error-ზე აღდგენა |
| Form reset | successful Add flow | validation-მდე არა |
| POST company object | `addClient()` request body | internal model string დარჩეს |
| One auto retry | `initialLoad()`/`loadClients()` | infinite loop guard |
| Session expiry | `login.js` + `guard.js` | `Date.now()` numeric compare |

## რთული CORE

| დავალება | მიმდინარე სტატუსი |
| --- | --- |
| საერთო storage helpers | უკვე გაქვს `storage.js`-ში |
| `createElement` rendering | უკვე გაქვს |
| corrupt client JSON → API fallback | ნაწილობრივ დაცულია; სრული flow დასატესტია |
| Retry Delete | არ არის სრულად |
| საერთო email validator | უკვე გაქვს `ui.js`-ში |
| cross-tab Client update | უკვე გაქვს `data.js` storage event-ით |

---

# 14. FULL Live Coding — სტატუსი და ადგილი

## უკვე შესრულებული ან ახლოსაა

| Excel-ის დავალება | შენი მიმდინარე კოდი |
| --- | --- |
| Search email-ზე | უკვე მუშაობს |
| Search phone-ზე | უკვე მუშაობს optional guard-ით |
| Search debounce | უკვე 250 ms-ია; 300 ms-ზე მარტივი ცვლილება |
| CSV Export | უკვე არის formula injection protection-ით |
| Modal focus trap/Escape/restore | უკვე არის `clients.js`-ში |
| Client-side pagination | ამჟამინდელ კოდში არ ჩანს |
| Bulk actions | ამჟამინდელ კოდში არ ჩანს |
| Import Excel/CSV | არსებობს, მაგრამ round-trip და CDN failure გასასწორებელია |
| Cross-tab profile update | არ არის; მხოლოდ clients sync არის |

## Dashboard ცვლილებები

| დავალება | ადგილი |
| --- | --- |
| full name greeting | `dashboard.js` → `renderGreeting()` |
| 12-hour clock | `startClock()` locale options |
| clock 5 sec | `setInterval` 1000→5000 |
| Recent 5→3 | `recentClients(list, 3)` ან limit |
| New 7→14 days | `data.js` → `newThisWeek()` |
| € currency | `formatMoney()` ან ცალკე formatter |
| Active მხოლოდ Lead/Contacted | `activeDeals()` + `includes()` |
| Pipeline percentage | `renderPipeline()`, zero guard უკვე width-შია |
| ახალი status | `CLIENT_STATUSES`, HTML options/chips, badge map/CSS/pipeline color |
| average Won deal | filter Won, sum/count, zero guard |
| top deal client | reduce max ან copy+sort |

## Clients ცვლილებები

| დავალება | ადგილი |
| --- | --- |
| Clear Search | `clients.html` + `clients.js`, search state reset |
| low→high deal sort | option + `getVisibleClients()` comparator |
| company sort | option + `localeCompare(client.company || '')` |
| hide Lost chip only | `clients.html`; data არ შეცვალო |
| status confirm/rollback | change handler + old value |
| special Won toast | `changeStatus()` |
| show Client ID | `openDetail()` |
| full Client Since date | `toLocaleDateString(options)` |
| note error/max 200 | `renderNotes()`/`addNote()` |
| reminder 10 sec | `notifications.js` dueAt + button copy |
| two status filters | `statusFilter` string → selected statuses array/Set |
| minimum deal filter | HTML number input + `getVisibleClients()` |
| company dropdown | unique company `Set` + filter state |
| persistent sort | new storage key + init/select restore |
| Previous/Next modal | visible list index + bounds |
| note delete/edit | nested state update + save + render |

## რთული FULL

- URL state — `URLSearchParams`, load/replaceState;
- pagination — filter/search/sort-ის შემდეგ `slice`;
- Load More — display limit, filter change-ზე reset;
- bulk status — checkbox IDs `Set`, update/save/render;
- robust POST JSON fallback — response parse ცალკე `try/catch`;
- optimistic status + rollback — old state snapshot;
- AbortController — მხოლოდ server-side/API search-ისას აზრიანია;
- config-driven statuses — ერთი config-დან chips/options/badge/pipeline;
- pure `getVisibleClients` — ყველა input parameter-ად, globals-ის გარეშე;
- DocumentFragment — cards ჯერ fragment-ში, ბოლოს ერთი append;
- schema versioning — `{version, data}` + migration;
- profile cross-tab — `crm_users` storage event;
- 8 test cases — იხილე შემდეგი სექცია.

---

# 15. `getVisibleClients()` — 8 სავალდებულო ტესტი

1. `All`, empty search, newest;
2. მხოლოდ `Lead`;
3. name search სხვადასხვა case-ით;
4. company search;
5. email search;
6. phone search optional phone-ის ჩათვლით;
7. status + search + deal-high კომბინაცია;
8. საწყისი `clients` მასივი უცვლელია.

ყოველ ტესტში წინასწარ დაწერე:

```text
Input
Expected IDs/order
Actual IDs/order
Pass/Fail
```

---

# 16. შესაძლო ახალი Status — ყველა ადგილი

მაგალითად `Qualified` ან `Negotiation`:

1. `data.js` → `CLIENT_STATUSES`;
2. `clients.js` → `STATUS_BADGES`;
3. `clients.html` → filter chip (`data-status`);
4. `clients.html` → Add Client `<option>`;
5. `glass.css` → dark badge;
6. `glass.css` → light badge;
7. `glass.css` → pipeline fill class.

Dashboard JavaScript `CLIENT_STATUSES`-ს ავტომატურად გადაუვლის.

ეს არის საუკეთესო მაგალითი, რატომ სჯობს მომავალში config-driven UI:

```js
const STATUS_CONFIG = [
  { value: 'Lead', className: 'badge-lead' },
  // ...
];
```

---

# 17. Import/Export — გამოცდისთვის პასუხი

შენს პროექტში:

- Export ქმნის UTF-8 CSV-ს;
- value-ებს quotes/commas-ისთვის escape უკეთდება;
- formula injection-ისგან დაცვა არსებობს;
- Import SheetJS-ს მოთხოვნისას CDN-დან ტვირთავს;
- `.xlsx`, `.xls`, `.csv` input მიიღება;
- ყველა worksheet იკითხება;
- duplicate/invalid rows გამოიტოვება.

ცნობილი პრობლემა:

- CSV import-იც SheetJS CDN-ზეა დამოკიდებული;
- invalid row-ის ზუსტი მიზეზი არ ჩანს;
- export/import სრული round-trip ყველა ველისთვის გარანტირებული არაა;
- schema-ში `notes`, `createdAt`, `source/owner` არ არის სრულად შეტანილი.

ძლიერი პასუხი:

> Export serializes client fields into a UTF-8 CSV Blob and protects dangerous
> spreadsheet prefixes. Import normalizes column names, validates each row,
> skips duplicates, assigns new local IDs, saves the resulting state, and
> rerenders. The next improvement is a canonical shared schema and row-level
> error preview so an exported file can be imported without data loss.

---

# 18. ტესტირების ჩეკლისტი

## Sign Up

- empty fields;
- short/space-only name;
- Georgian/invalid email;
- duplicate case-insensitive email;
- password 9/10 boundary;
- missing letter;
- missing number;
- confirm mismatch;
- success + reload/login.

## Login/Auth

- valid;
- wrong email/password;
- direct protected URL without session;
- public URL with session;
- Logout preserves users/clients.

## Clients

- clean storage GET;
- stored data no GET;
- add positive/negative validation;
- double submit;
- API/client delete;
- local client 404 delete;
- duplicate IDs;
- filter/search/sort combinations;
- notes/reminder;
- offline/retry;
- refresh persistence.

## Dashboard

- empty clients;
- one client each status;
- no Won clients;
- Active Deals;
- Won Revenue;
- exact 7-day boundary;
- Recent order.

## Profile

- name boundary;
- optional company clear;
- wrong current password;
- same new password;
- new password validation;
- old login fails/new login succeeds;
- Reset rollback/offline.

---

# 19. სწავლის პრიორიტეტი

## დღე 1 — შენი კოდის რუკა

- storage;
- auth;
- state/save/render;
- Client model;
- თითო ფაილის პასუხისმგებლობა.

## დღე 2 — CORE JavaScript

- arrays/objects;
- DOM/events;
- validation;
- localStorage/JSON;
- Date/timers.

## დღე 3 — API

- fetch/Promise/async/await;
- GET/POST/DELETE;
- response.ok;
- try/catch/finally;
- DummyJSON 404.

## დღე 4 — Dashboard/Clients

- `getVisibleClients`;
- Active Deals/Won Revenue/New This Week;
- event delegation;
- notes/reminders;
- 10 მარტივი live changes.

## დღე 5 — FULL

- error/concurrency/security;
- accessibility;
- import/export;
- config-driven design;
- 5 საშუალო live changes.

## ბოლო რეპეტიცია

1. 5-წუთიანი სრული demo;
2. სამი შემთხვევითი ფუნქციის ახსნა;
3. ერთი CORE live change;
4. ერთი FULL live change;
5. 1–2 წუთიანი ინგლისური აღწერა.

---

# 20. სწრაფი ზეპირი პასუხები

## რატომ `filter()`?

> It returns a new array with matching clients and does not mutate the original
> state.

## რატომ `reduce()`?

> It combines an array into one value; I use it to sum Won deal values with an
> initial accumulator of zero.

## რატომ `find()`?

> I need one matching object, such as the logged-in user or a client by ID.

## რატომ `some()`?

> I only need a boolean indicating whether at least one duplicate email exists.

## რატომ `response.ok`?

> Fetch resolves on HTTP errors such as 404, so I check `response.ok` and throw
> a controlled error.

## რატომ localStorage?

> This is a frontend-only educational application, so localStorage provides
> persistence without a backend. It is not appropriate for real password
> storage.

## რატომ event delegation?

> Client cards are rendered dynamically, so one parent listener handles both
> existing and newly rendered cards.

## რატომ state-ის ასლი?

> `sort()` mutates arrays. Sorting a copy prevents accidental changes to the
> central clients state.

## რატომ `id` და `apiId`?

> `id` uniquely identifies the local application record, while `apiId` tracks
> an optional DummyJSON resource. Separating them prevents duplicate-ID delete
> bugs.

---

# 21. ყველაზე მოსალოდნელი Live Coding ათეული

პირველ რიგში ივარჯიშე:

1. password threshold/message;
2. Full Name threshold/message;
3. toast/reminder milliseconds;
4. API limit/default status;
5. Deal Value validation;
6. ახალი sort option;
7. ახალი status ყველა ადგილზე;
8. Dashboard metric change;
9. note validation;
10. submit disable + `finally`.

თითოეული ცვლილება სამჯერ გაიმეორე:

- პირველად ამ დოკუმენტის დახმარებით;
- მეორედ მხოლოდ გლობალური ძებნით;
- მესამედ 3–5 წუთიანი timer-ით.

