# 10X CRM — JavaScript ფუნქციების სასწავლო სახელმძღვანელო

ეს დოკუმენტი აღწერს 10X CRM-ის მიმდინარე JavaScript ფუნქციებს ფაილების
მიხედვით.

თითოეულ ფუნქციაზე ყურადღება მიაქციე ოთხ საკითხს:

1. **Parameters** — რას იღებს;
2. **Return value** — რას აბრუნებს;
3. **Side effects** — ცვლის თუ არა state-ს, storage-ს ან DOM-ს;
4. **Caller** — სად და რატომ იძახება.

---

# 1. ფუნქციის ძირითადი ცნებები

## Function Declaration

```js
function getUsers() {
  return [];
}
```

Declaration hoisted-ია — იმავე script scope-ში გამოძახებამდე ტექსტურად ზემოთ
ყოფნა აუცილებელი არ არის.

## Function Expression / Arrow Function

```js
const hasNumber = (value) => /[0-9]/.test(value);
```

Arrow function-ს საკუთარი `this`, `arguments` და `prototype` არ აქვს.

## Parameter და Argument

```js
function showToast(message, type) {
}

showToast('Saved', 'success');
```

- `message`, `type` — parameters;
- `'Saved'`, `'success'` — arguments.

## Return

```js
function isValidPhone(phone) {
  return true;
}
```

`return`:

- ფუნქციას მნიშვნელობას აბრუნებინებს;
- ფუნქციის შესრულებას მაშინვე აჩერებს.

თუ `return` მნიშვნელობის გარეშეა ან საერთოდ არ არის, შედეგია `undefined`.

## Pure და Impure ფუნქცია

Pure ფუნქცია:

- ერთნაირ input-ზე ერთნაირ output-ს აბრუნებს;
- გარე state-ს/DOM-ს/storage-ს არ ცვლის.

მაგალითად, `isValidEmail()` თითქმის pure ფუნქციაა.

Impure ფუნქცია side effect-ს აკეთებს:

- DOM update;
- localStorage;
- fetch;
- global state update;
- timer.

მაგალითად `showToast()`, `saveUsers()` და `addClient()`.

## Callback

Callback არის სხვა ფუნქციისთვის გადაცემული ფუნქცია:

```js
clients.filter(function (client) {
  return client.status === 'Won';
});
```

აქ `function (client) { ... }` არის `filter()`-ის callback.

## Closure

Closure-ის დროს შიდა ფუნქცია გარე ფუნქციის ცვლადებს იმახსოვრებს:

```js
function showToast() {
  const toast = document.createElement('div');

  function dismissToast() {
    toast.remove();
  }
}
```

`dismissToast()` იმახსოვრებს `toast`-ს.

---

# 2. `js/storage.js` — მონაცემების შენახვის ფუნქციები

## `saveToStorage(key, value)`

**Parameters**

- `key` — localStorage key;
- `value` — შესანახი JavaScript მნიშვნელობა.

**რას აკეთებს**

1. `JSON.stringify(value)`-ით მნიშვნელობას string-ად გარდაქმნის;
2. `localStorage.setItem()`-ით ინახავს;
3. storage/quota error-ს `try/catch`-ით იჭერს.

**Return**

- `true` — შენახვა წარმატებულია;
- `false` — შენახვა ჩავარდა.

**Side effect:** localStorage-ს ცვლის.

**საგამოცდო კითხვა:** რატომ გვჭირდება `JSON.stringify()`?

> localStorage stores strings, so arrays and objects must be serialized.

## `getFromStorage(key, fallbackValue = null)`

**Parameters**

- `key` — წასაკითხი key;
- `fallbackValue` — მნიშვნელობა, თუ key არ არსებობს ან JSON დაზიანებულია.

**რას აკეთებს**

1. `localStorage.getItem()`-ით კითხულობს;
2. `null`-ისას fallback-ს აბრუნებს;
3. JSON-ს `try/catch`-ით parse-ავს;
4. parse error-ისას fallback-ს აბრუნებს.

**Return:** parsed value ან fallback.

**Side effect:** არ ცვლის storage-ს; parse error-ს Console-ში წერს.

## `removeFromStorage(key)`

`localStorage.removeItem(key)`-ით ერთ key-ს შლის.

**Return:** `undefined`.

**Side effect:** localStorage-ს ცვლის.

## `getUsers()`

იძახებს:

```js
getFromStorage(STORAGE_KEYS.users, [])
```

**Return:** User ობიექტების მასივი; key-ის არქონისას `[]`.

## `saveUsers(users)`

იძახებს `saveToStorage()`-ს `crm_users` key-ით.

**Return:** boolean.

**Caller:** Sign Up და Profile update/password change.

## `ensureDemoUser()`

**რას აკეთებს**

1. იღებს ყველა user-ს;
2. `some()`-ით ამოწმებს `demo@crm.com`-ს;
3. თუ არ არსებობს, `DEMO_USER`-ს ამატებს;
4. users-ს ინახავს.

**Return:** `undefined`.

**Side effect:** შეიძლება `crm_users` შეცვალოს.

## `getSession()`

**Return:** `crm_session` ობიექტი ან `null`.

## `saveSession(session)`

ინახავს session ობიექტს.

**Return:** boolean.

## `clearSession()`

შლის მხოლოდ `crm_session` key-ს.

**მნიშვნელოვანი:** users და clients არ იშლება.

## `getCurrentUser()`

**რას აკეთებს**

1. იღებს session-ს;
2. თუ session არ არის, აბრუნებს `null`;
3. `session.userId`-ით users მასივში `find()`-ს იყენებს.

**Return:** შესაბამისი User ან `null`.

**საგამოცდო კითხვა:** რატომ `find()`?

> We need one user whose ID matches the current session.

## `getClients()`

**Return:** `crm_clients` მასივი ან `null`.

`null` მნიშვნელოვანია: ნიშნავს, რომ key საერთოდ არ არსებობს და API პირველად
უნდა ჩაიტვირთოს.

## `saveClients(clients)`

ინახავს Client მასივს.

**Return:** boolean.

## `clearClients()`

შლის `crm_clients` key-ს.

**Caller:** Reset CRM Data.

## `getNotifications()` / `saveNotifications(notifications)`

კითხულობს/ინახავს notification ობიექტების მასივს.

## `getReminders()` / `saveReminders(reminders)`

კითხულობს/ინახავს persistent reminder ობიექტების მასივს.

## `getTheme()`

კითხულობს `crm_theme` string-ს.

**Return:** შენახული theme ან default `'light'`.

## `saveTheme(theme)`

theme string-ს პირდაპირ `localStorage.setItem()`-ით ინახავს.

**Return:** `undefined`.

---

# 3. `js/ui.js` — საერთო UI და validation ფუნქციები

## `showToast(message, type = 'success')`

**Parameters**

- `message` — შეტყობინების ტექსტი;
- `type` — `success` ან `error`.

**რას აკეთებს**

1. ეძებს ან ქმნის `.toast-wrap` კონტეინერს;
2. ქმნის toast ელემენტს;
3. ქმნის dismiss ღილაკს;
4. click listener-ს ამატებს;
5. 3 წამში ავტომატურად ხურავს.

**Return:** `undefined`.

**Side effects:** DOM update და timer.

### შიდა `dismissToast()`

Closure-ით ხედავს `toast` და `toastWrap` ცვლადებს.

1. ამოწმებს toast ჯერ კიდევ DOM-შია თუ არა;
2. ამატებს exit კლასს;
3. 300 ms-ის შემდეგ შლის;
4. ცარიელ wrapper-საც შლის.

## `showError(inputId, message)`

**რას აკეთებს**

1. ID-ით პოულობს input-ს;
2. პოულობს `${inputId}Err` ელემენტს;
3. input-ს `.input-error` კლასს ამატებს;
4. error ტექსტს აჩვენებს.

**Return:** `undefined`.

## `clearErrors()`

ყველა `.input`-ს error კლასს აშორებს და ყველა `.error-text`-ს ასუფთავებს.

**Side effect:** DOM update.

## `clearErrorOnInput(form)`

ფორმაზე ერთ `input` listener-ს ამატებს.

Event delegation-ით:

1. იღებს `event.target` ველს;
2. შესაბამის error კლასსა და ტექსტს ასუფთავებს.

**Return:** `undefined`.

## `isValidEmail(email)`

Latin email format-ს RegExp-ით ამოწმებს.

**Return:** boolean.

**Pure:** input-ს არ ცვლის.

**მნიშვნელოვანი:** ქართული ასოების შემცველი email უარყოფილია.

## `sanitizePhone(phone)`

RegExp-ით შლის ყველა სიმბოლოს, რომელიც არ არის:

- ციფრი;
- `+`;
- ფრჩხილი;
- space;
- `-`.

**Return:** გასუფთავებული string.

## `isValidPhone(phone)`

**ლოგიკა**

- ცარიელი phone დასაშვებია;
- დაშვებული სიმბოლოები მოწმდება;
- ციფრების რაოდენობა 6–15 უნდა იყოს.

**Return:** boolean.

## `formatMoney(value)`

```js
`$${Number(value).toLocaleString('en-US')}`
```

**Return:** თანხის formatted string, მაგალითად `$12,500`.

---

# 4. `js/guard.js` — წვდომა, navigation და theme

## `requireAuth()`

ამოწმებს session-სა და current user-ს.

თუ რომელიმე არ არსებობს:

1. session-ს ასუფთავებს;
2. Login-ზე გადადის;
3. `false`-ს აბრუნებს.

წარმატებისას აბრუნებს `true`.

## `redirectIfAuthenticated()`

თუ valid session/current user არსებობს:

1. Dashboard-ზე გადადის;
2. `true`-ს აბრუნებს.

თუ orphan session არსებობს, შლის.

სხვა შემთხვევაში `false`.

## `applyTheme(theme)`

**Parameter:** optional theme.

თუ argument არ გადავეცით, `getTheme()`-ს იყენებს.

body-ზე:

- dark-ისას `theme-dark`;
- სხვა შემთხვევაში `theme-light`.

**Return:** `undefined`.

## `toggleTheme()`

1. მიმდინარე theme-ის საპირისპიროს ითვლის;
2. ინახავს;
3. body-ზე იყენებს.

## `logout()`

1. `clearSession()`;
2. redirect `index.html`.

## `initNav(currentPage)`

**Parameter:** `'dashboard'`, `'clients'` ან `'profile'`.

**რას აკეთებს**

- სწორ nav link-ს active კლასს აძლევს;
- theme button listener;
- logout listener;
- sidebar logout links;
- current user topbar render.

## `showCurrentUser()`

current user-ის:

- fullName-ს `userName`-ში წერს;
- პირველი ორი სიტყვის ინიციალებს `userInitials`-ში წერს.

## `initProtectedPage(currentPage)`

1. theme-ს იყენებს;
2. Auth Guard-ს ამოწმებს;
3. navigation-ს ამზადებს.

**Return:** boolean — შეიძლება თუ არა page initialization-ის გაგრძელება.

## `initPublicPage()`

theme-ს იყენებს და ამოწმებს უკვე ავტორიზებულია თუ არა.

**Return:** `true`, თუ public page უნდა გაგრძელდეს; `false`, თუ redirect მოხდა.

---

# 5. `js/signup.js` — რეგისტრაცია

## `isValidPassword(password)`

ამოწმებს:

- `MIN_PASSWORD_LENGTH` — ამჟამად 10;
- მინიმუმ ერთ Latin ასოს;
- მინიმუმ ერთ ციფრს.

**Return:** boolean.

## Sign Up `submit` callback

ეს anonymous event callback-ია.

**რას აკეთებს**

1. `preventDefault()`;
2. form values-ს კითხულობს;
3. error-ებს ასუფთავებს;
4. name/email/password/confirm-ს ამოწმებს;
5. duplicate email-ს `some()`-ით ეძებს;
6. User ობიექტს ქმნის;
7. `crm_users`-ში ინახავს;
8. toast-ს აჩვენებს;
9. 1.5 წამში Login-ზე გადადის.

**Return:** პირდაპირი შედეგი არ აქვს; invalid/error branch-ებში early return.

## Sign Up redirect `setTimeout` callback

1.5 წამის შემდეგ:

```js
window.location.href = 'index.html';
```

---

# 6. `js/login.js` — Login

## `validateLogin({ email, password })`

Destructured object parameter-ს იღებს.

ამოწმებს მხოლოდ required ველებს.

**Return:** error ობიექტი:

```js
{
  email?: string,
  password?: string
}
```

## `attemptLogin({ email, password })`

**რას აკეთებს**

1. `validateLogin()`-ს იძახებს;
2. email-ს normalize უკეთებს;
3. user-ს `find()`-ით ეძებს;
4. password-ს ადარებს;
5. generic auth error-ს აბრუნებს;
6. წარმატებისას session-ს ინახავს.

**Return-ის შესაძლო ფორმები**

```js
{ errors }
{ formError: '...' }
{ user }
```

ეს ფუნქცია redirect-ს თვითონ არ აკეთებს.

## Login `DOMContentLoaded` callback

1. public guard;
2. form/error elements;
3. submit listener;
4. error rendering;
5. წარმატებისას Dashboard redirect.

## Login `submit` callback

`attemptLogin()`-ის structured result-ის მიხედვით:

- field error-ებს აჩვენებს;
- generic form error-ს აჩვენებს;
- ან Dashboard-ზე გადადის.

---

# 7. `js/data.js` — Client state, API და სტატისტიკა

## `createLocalClientId()`

თუ ხელმისაწვდომია:

```js
crypto.randomUUID()
```

სხვა შემთხვევაში:

```text
local + Date.now + Math.random
```

**Return:** უნიკალური string ID.

## `ensureUniqueClientIds(list)`

**Parameter:** Client-ების მასივი.

**რას აკეთებს**

1. `Set`-ით ნანახ ID-ებს იმახსოვრებს;
2. missing/duplicate ID-ს ახალ local ID-ს აძლევს;
3. ძველი numeric ID-დან `apiId`-ს აღადგენს;
4. საჭიროებისას ახალ Client object-ს ქმნის.

**Return**

```js
{
  clients: normalizedClients,
  changed: boolean
}
```

**მიზანი:** ორი ჩანაწერის ერთად წაშლის ID ბაგის პრევენცია.

## `mapApiClient(user, index)`

DummyJSON User-ს internal Client model-ად გარდაქმნის.

**Return:** ახალი Client object.

ამატებს:

- `apiId`;
- default `Lead`;
- random `dealValue`;
- empty `notes`;
- current `createdAt`.

`index` parameter ამჟამად არ გამოიყენება.

## `persistClients(list)`

`saveClients(list)`-ს იძახებს.

თუ `false` დაბრუნდა, Error-ს აგდებს.

**Return:** `undefined` წარმატებისას; throw failure-ზე.

## `loadClients()`

**Async ფუნქცია.**

1. კითხულობს stored clients-ს;
2. თუ არსებობს, ID-ებს normalize უკეთებს;
3. საჭიროებისას normalized list-ს ინახავს;
4. თუ storage არ არის, DummyJSON GET-ს აგზავნის;
5. `response.ok`-ს ამოწმებს;
6. API users-ს `mapApiClient()`-ით გარდაქმნის;
7. ინახავს.

**Return:** Promise, რომელიც Client მასივით fulfilled ხდება.

## `reloadClientsFromApi()`

Reset flow:

1. წინა clients-ს იმახსოვრებს;
2. `crm_clients`-ს შლის;
3. `loadClients()`-ით თავიდან ტვირთავს;
4. failure-ზე ძველ state-ს აბრუნებს და ინახავს;
5. error-ს ხელახლა აგდებს caller-ისთვის.

**Return:** Promise<Client[]>.

## `activeDeals(list)`

`filter()`-ით ტოვებს Client-ებს, რომელთა status არც `Won` არის და არც `Lost`.

**Return:** ახალი Client მასივი.

Dashboard `.length`-ით რაოდენობას ითვლის.

## `wonRevenue(list)`

1. მხოლოდ `Won` Client-ებს filter უკეთებს;
2. `reduce()`-ით `dealValue`-ებს აჯამებს;
3. accumulator `0`-დან იწყება.

**Return:** number.

## `newThisWeek(list)`

Client age-ს დღეებში ითვლის:

```js
(Date.now() - createdAt) / 86400000
```

**Return:** ბოლო 7 დღის Client-ების ახალი მასივი.

## `countByStatus(list)`

1. `CLIENT_STATUSES`-იდან zero-count object-ს ქმნის;
2. `reduce()`-ით თითო Client-ის status count-ს ზრდის.

**Return:** მაგალითად:

```js
{
  Lead: 10,
  Contacted: 5,
  Won: 3,
  Lost: 2
}
```

## `recentClients(list, limit = 5)`

1. spread-ით ასლს ქმნის;
2. `createdAt`-ით newest-first ალაგებს;
3. `slice(0, limit)`-ით ზღუდავს.

**Return:** ახალი Client მასივი.

## `storage` event callback

სხვა browser tab-ში `crm_clients` ცვლილებისას:

1. ახალ JSON-ს parse-ავს;
2. ID-ებს normalize უკეთებს;
3. Clients page-ს refresh უკეთებს;
4. Dashboard stats/pipeline/recent-ს refresh უკეთებს.

**მნიშვნელოვანი:** `storage` event იმავე tab-ში არ იძახება.

---

# 8. `js/clients.js` — Clients გვერდის ფუნქციები

## `getVisibleClients()`

**Parameters:** არ აქვს; global state-ს კითხულობს:

- `clients`;
- `statusFilter`;
- `searchTerm`;
- `sortMode`.

**თანმიმდევრობა**

1. status filter;
2. normalized case-insensitive search;
3. sort.

**Search fields**

- name;
- company;
- email;
- phone.

**Sort**

- name A–Z;
- deal high→low;
- default newest.

**Return:** საბოლოო Client მასივი.

**Side effect:** პირდაპირი არა, მაგრამ pure სრულად არ არის, რადგან globals-ს
კითხულობს.

## `createStatusBadge(status)`

ქმნის `<span>` badge-ს:

- lookup-ით CSS class;
- უცნობ status-ზე `badge-lead` fallback;
- ტექსტად status.

**Return:** DOM Node.

## `createClientCard(client)`

ერთი Client-ის სრულ `<article>` card-ს ქმნის:

- avatar;
- name;
- company;
- email;
- deal value;
- status badge;
- status select;
- delete button;
- accessibility attributes.

**Return:** DOM `<article>`.

**Side effect:** მხოლოდ ახალ detached DOM node-ს ქმნის; ჯერ გვერდზე არ ამატებს.

## `renderClients(list)`

**რას აკეთებს**

1. Clients area-ს ასუფთავებს;
2. empty state-ს აჩვენებს;
3. Client Card-ებს ქმნის;
4. შედეგების summary-ს ამატებს.

**Return:** `undefined`.

**Side effect:** DOM მთლიანად ახლდება.

## `refreshClients()`

იძახებს:

```js
renderClients(getVisibleClients());
```

ეს არის filter/search/sort-ის შემდეგ ერთიანი re-render helper.

## `protectSpreadsheetValue(value, columnIndex)`

CSV formula injection-ს ამცირებს.

თუ მნიშვნელობა იწყება:

```text
=-@
```

წინ apostrophe-ს ამატებს. Phone `+`-ის შემთხვევაც სპეციალურად მუშავდება.

**Return:** დაცული string.

## `escapeCsvValue(value, columnIndex)`

1. value-ს იცავს;
2. შიდა `"` სიმბოლოებს აორმაგებს;
3. მთელ cell-ს quotes-ში სვამს.

**Return:** CSV-safe string.

## `exportClientsCsv()`

1. empty clients-ს ამოწმებს;
2. headers/rows ქმნის;
3. values-ს escape უკეთებს;
4. UTF-8 BOM-ს ამატებს;
5. `Blob`-ს ქმნის;
6. temporary Object URL-ს ქმნის;
7. hidden download link-ს აჭერს;
8. URL-ს მოგვიანებით revoke უკეთებს.

**Return:** `undefined`.

**Side effects:** toast/download/DOM/timer.

## `normalizeImportRow(row)`

Excel/CSV row-ის column names-ს normalize უკეთებს:

- lowercase;
- spaces, `_`, `-` მოცილება;
- aliases;
- firstName + lastName.

**Return:** internal import values object.

## `parseImportedDealValue(value)`

თუ უკვე number-ია, პირდაპირ აბრუნებს.

სხვა შემთხვევაში currency symbols, commas და spaces-ს შლის და `Number()`-ად
გარდაქმნის.

**Return:** number ან `NaN`.

## `importClientRows(rows)`

1. existing email-ების `Set`;
2. ყველა row normalize;
3. email/status/deal/phone/name validation;
4. duplicate/invalid row skip;
5. unique local ID;
6. imported list + current clients;
7. save, state update, render.

**Return:** დამატებული Client-ების რაოდენობა.

## `loadXlsxLibrary()`

**Return:** Promise, რომელიც `XLSX` library-ს აბრუნებს.

ლოგიკა:

- უკვე loaded library → resolved Promise;
- loading Promise არსებობს → იმავეს აბრუნებს;
- სხვა შემთხვევაში CDN script-ს ქმნის;
- failure-ზე cached Promise-ს reset უკეთებს.

## `importClientsFile(file)`

**Async ფუნქცია.**

1. XLSX library;
2. 2 MB limit;
3. ArrayBuffer read;
4. workbook parse;
5. worksheet existence;
6. ყველა sheet → rows (`flatMap`);
7. 5,000 row limit;
8. `importClientRows()`.

**Return:** Promise<number>.

## `setClientsAreaMessage(message, withRetry = false, loading = false)`

Clients area-ში Loading/Error state-ს ქმნის.

Optional:

- spinner;
- Retry button.

Retry button `initialLoad()`-ს იძახებს.

## `initialLoad()`

**Async ფუნქცია.**

1. loading state;
2. `await loadClients()`;
3. `refreshClients()`;
4. error-ზე error state + Retry.

## `validateClient(values, existingClients)`

Destructured values-ს ამოწმებს:

- name;
- email;
- duplicate email;
- phone;
- positive deal.

**Return**

```js
{
  errors,
  cleanName,
  normalizedEmail,
  numericDealValue
}
```

## `addClient(values)`

**Async ფუნქცია.**

1. validation;
2. error-ისას error object;
3. POST `/users/add`;
4. `response.ok`;
5. response JSON;
6. local unique ID + `apiId`;
7. new state;
8. persist;
9. global `clients` update;
10. render/toast.

**Return**

- validation errors object;
- success-ზე `{}`;
- network/storage failure-ზე throw.

## `deleteClient(id)`

**Async ფუნქცია.**

1. confirm;
2. Client find;
3. `apiId` არჩევა;
4. DELETE;
5. 404 დასაშვებია;
6. სხვა error-ზე stop;
7. `filter()`-ით ახალი state;
8. persist;
9. reminders removal;
10. render/toast.

**Return:** Promise<void>.

## `changeStatus(id, status)`

1. Client-ს `find()`-ით პოულობს;
2. ძველ status-ს იმახსოვრებს;
3. ახალს ანიჭებს;
4. persist ცდილობს;
5. storage error-ზე rollback;
6. UI refresh.

**Return:** `undefined`.

## `createDetailRow(label, value)`

Details modal-ის key/value row-ს ქმნის.

თუ `value` DOM Node-ია, append უკეთებს; სხვა შემთხვევაში `textContent`.

**Return:** DOM row.

## `renderNotes(client, host)`

1. Notes title;
2. empty ან notes list;
3. note input/button;
4. reminder button;
5. local click callbacks.

**Return:** `undefined`.

## `openDetail(id, trigger)`

1. Client find;
2. `openClientId` update;
3. details body clear;
4. header/rows/notes render;
5. modal open და focus source.

**Return:** `undefined`.

## `addNote(id, rawText)`

1. `trim()`;
2. empty/client missing → `false`;
3. note push;
4. persist;
5. failure-ზე `pop()` rollback;
6. success → `true`.

**Return:** boolean.

## `remindLater(id)`

Client-ს პოულობს, `scheduleReminder()`-ს იძახებს და success/error toast-ს
აჩვენებს.

## `getFocusableElements(modal)`

Modal-ში enabled/focusable ელემენტებს აგროვებს და hidden ელემენტებს გამორიცხავს.

**Return:** Element-ების array.

## `openModal(modal, trigger)`

1. trigger-ს იმახსოვრებს;
2. `.open` კლასს ამატებს;
3. `aria-hidden=false`;
4. შემდეგ animation frame-ზე პირველ focusable ელემენტს focus უკეთებს.

## `closeModal(modal)`

Modal-ს ხურავს, ARIA state-ს აბრუნებს და focus-ს წინა trigger-ზე აღადგენს.

## Clients `DOMContentLoaded` callback

ამზადებს მთელ გვერდს:

- guard;
- initial load;
- search debounce;
- filter chips;
- sort;
- import/export;
- card event delegation;
- modal listeners;
- phone sanitization;
- Add Form submit;
- Escape/focus trap.

## Search `input` callback

250 ms debounce:

1. input value იმახსოვრებს;
2. ძველ timer-ს აუქმებს;
3. ახალ timer-ში search state + refresh.

## `filterChips` click callback

`closest('.chip')`-ით chip-ს პოულობს, active class-ს ცვლის, `statusFilter`-ს
აახლებს და render-ს იძახებს.

## `clientsArea` click callback

Event delegation:

- Delete;
- status click-ის გამოტოვება;
- details open.

## `clientsArea` change callback

Status select-ის ცვლილებას `changeStatus()`-ში გზავნის.

## Add Form submit callback

ფორმის values-ს აგროვებს, `addClient()`-ს ელოდება, field errors-ს აჩვენებს,
success-ზე modal-ს ხურავს, error-ზე toast-ს აჩვენებს.

---

# 9. `js/dashboard.js` — Dashboard

## `renderGreeting()`

current user-ის fullName-დან პირველ სიტყვას იღებს და წერს:

```text
Welcome back, {firstName}!
```

## `startClock()`

Clock element-ს პოულობს, ერთხელ მაშინვე აახლებს და ყოველ 1 წამში interval-ს
ქმნის.

### შიდა `updateClock()`

მიმდინარე date/time-ს locale format-ში წერს.

Closure-ით ხედავს `clock` ელემენტს.

## `createStatCard(label, value, icon)`

ერთი სტატისტიკური card-ის DOM-ს ქმნის.

**Return:** `<article>` Node.

## `renderStats(list)`

ქმნის ოთხ card config-ს:

- Total Clients;
- Active Deals;
- Won Revenue;
- New This Week.

`map()`-ით DOM card-ებს ქმნის და container-ს `replaceChildren()`-ით ანახლებს.

## `renderPipeline(list)`

1. status counts;
2. ყველა `CLIENT_STATUSES` status-ზე row;
3. badge;
4. count;
5. percentage width;
6. zero-length guard.

## `renderRecent(list)`

ბოლო 5 Client-ს აჩვენებს:

- name;
- company;
- status badge;
- date.

Empty state-საც მართავს.

## `showDashboardLoading()`

სამ dashboard ზონაში loading ტექსტს აჩვენებს.

## Dashboard `DOMContentLoaded` callback

1. protected page init;
2. greeting;
3. clock;
4. loading;
5. clients load;
6. stats/pipeline/recent;
7. error UI.

## `beforeunload` callback

`clearInterval(clockTimer)`-ით clock timer-ს ასუფთავებს.

---

# 10. `js/profile.js` — Profile

## `initialsOf(fullName)`

1. space-ით ყოფს;
2. ცარიელებს შლის;
3. პირველ ორ სიტყვას იღებს;
4. პირველ ასოებს აერთიანებს;
5. uppercase.

**Return:** initials string.

## `renderProfile()`

current user-ს UI-ში აჩვენებს:

- initials;
- name;
- email;
- company;
- member since;
- form values.

**Return:** User ან `null`.

## `updateCurrentUser(changes)`

1. session/users;
2. User find;
3. `Object.assign(user, changes)`;
4. save.

**Return:** updated User ან `null`.

**Side effect:** `crm_users` იცვლება.

## `saveProfile({ fullName, company })`

1. name trim;
2. min length validation;
3. `updateCurrentUser()`;
4. Profile/topbar render;
5. toast.

**Return:** errors object.

## `validatePasswordChange(values, user)`

ამოწმებს:

- Current Password;
- shared minimum length;
- letter/number;
- New ≠ Current;
- Confirm = New.

**Return:** errors object.

**Side effect:** არა.

## `changePassword(values)`

1. current user;
2. validation;
3. password save;
4. toast.

**Return:** errors object.

## Profile `DOMContentLoaded` callback

1. protected init;
2. Profile render;
3. Profile submit listener;
4. Password submit listener;
5. Reset listener;
6. clear-on-input.

## Profile Form submit callback

`saveProfile()`-ს იძახებს და დაბრუნებულ field errors-ს აჩვენებს.

## Password Form submit callback

`changePassword()`-ს იძახებს; success-ზე form reset.

## Reset button callback

**Async callback.**

1. confirm;
2. button disable;
3. `reloadClientsFromApi()`;
4. current user reminders clear;
5. toast;
6. catch;
7. `finally` button enable.

---

# 11. `js/notifications.js` — Notifications და Reminders

## `currentUserNotifications()`

current user-ის notifications-ს filter უკეთებს და newest-first ალაგებს.

**Return:** ახალი array.

## `notificationTime(createdAt)`

**Return**

- `<1 minute` → `Now`;
- `<60 minutes` → `Xm`;
- უფრო ძველი → locale date.

## `createReminderIcon()`

SVG namespace-ით clock/reminder icon-ს ქმნის.

**Return:** SVG Node.

## `createNotificationRow(notification)`

ერთ accessible notification menu item-ს ქმნის:

- unread class;
- icon;
- title;
- message;
- time;
- dot.

**Return:** DOM Node.

## `renderNotifications()`

1. list/badge guard;
2. current notifications;
3. unread count;
4. badge update;
5. empty state ან rows.

## `addNotification(message, title = 'Reminder')`

1. current user;
2. unique notification object;
3. storage;
4. render;
5. badge animation.

**Return:** created notification ან `null`.

## `markNotificationRead(id)`

current user-ის შესაბამის notification-ს პოულობს, `read=true`, ინახავს და
რენდერს.

## `markAllNotificationsRead()`

current user-ის ყველა notification-ს read-ს ხდის.

## `scheduleReminderProcessing(delay)`

1. safe non-negative delay;
2. timeout ქმნის;
3. timer ID-ს `Set`-ში ინახავს;
4. შესრულებისას Set-იდან შლის;
5. due reminders-ს ამუშავებს.

## `scheduleReminder(client)`

1. user/client guard;
2. reminder object;
3. dueAt = ახლა + 60 წამი;
4. storage;
5. processing timer.

**Return:** boolean.

## `removeClientReminders(clientId)`

Client-ის წაშლისას current user-ის ამ Client-ზე reminder-ებს filter-ით შლის.

## `clearCurrentUserReminders()`

1. current user-ის reminders-ს შლის;
2. ყველა active timeout-ს ასუფთავებს;
3. timer Set-ს ასუფთავებს.

## `processDueReminders()`

1. current user;
2. due reminders filter;
3. თითოეულზე notification/toast;
4. წარმატებული IDs `Set`;
5. completed reminder-ების storage-დან წაშლა.

## `setNotificationMenuOpen(open)`

Dropdown-ის `.is-open` კლასსა და button-ის `aria-expanded`-ს სინქრონულად
ცვლის.

## `initNotifications()`

1. საჭირო DOM guard;
2. render;
3. due reminders processing;
4. pending reminder timers restore;
5. open/clear/read listeners;
6. outside click;
7. Escape close.

## Notifications callbacks

- Row click — ერთი notification read;
- Row Enter/Space — keyboard read;
- document click — outside close;
- Escape — close;
- beforeunload — timers cleanup.

---

# 12. `js/glass-ui.js` — ვიზუალური UX ფუნქციები

ეს ფაილი CRM data-ს არ ცვლის; presentation layer-ია.

## `findScroller()`

ამოწმებს `.content` რეალურად scrollable არის თუ არა.

**Return:** content element ან `null` (window scroll).

## `initStickyTopbar()`

სწორ scroller-ზე listener-ს ამატებს და 8px-ის შემდეგ topbar-ს `.scrolled`
კლასს აძლევს.

### `readTop()`

აბრუნებს content ან window scroll position-ს.

### `onScroll()`

scroll position-ის მიხედვით class-ს toggle უკეთებს.

## `initTilt()`

Desktop pointer-ზე card/stat ელემენტებს pointer position-ის მიხედვით მსუბუქ
3D tilt-ს აძლევს.

Coarse pointer ან reduced motion-ისას არ მუშაობს.

## `initReveal()`

MutationObserver-ით ახალ cards/stats/rows-ს staggered reveal animation-ს
ანიჭებს.

### `stagger(nodes)`

matching nodes-ს increasing animation delay-ს აძლევს.

## `init()`

სამ ვიზუალურ subsystem-ს იწყებს:

- sticky topbar;
- tilt;
- reveal.

---

# 13. `js/glass-depth-bg.js` — 3D background

ეს bonus visual ფაილია.

## `isDark()`

ამოწმებს body-ს `theme-light` კლასი აქვს თუ არა.

**Return:** boolean.

## `frame()`

Animation loop:

1. theme/state/time-ს კითხულობს;
2. Three.js background ობიექტებს ან shader uniforms-ს აახლებს;
3. scene-ს რენდერს;
4. შემდეგ frame-ს გეგმავს.

**Side effect:** canvas animation.

შესაძლო კითხვა:

> `requestAnimationFrame` synchronizes visual updates with the browser's paint
> cycle and is preferable to `setInterval` for animation.

---

# 14. `js/glass-liquid.js` — Liquid simulation

ესეც bonus visual layer-ია და CRM business state-ს არ ცვლის.

## `isDark()`

Theme class-ის მიხედვით boolean-ს აბრუნებს.

## `drawBackground()`

Theme-aware gradients, lights და background texture-ს canvas-ზე ხატავს.

## `spawn(x, y, r, vx = 0, vy = 0)`

ახალ liquid droplet-ს ქმნის:

- position;
- radius;
- velocity;
- soft-body მონაცემები.

## `resize()`

Canvas/display ზომებს viewport/container-ზე აწყობს და background-ს თავიდან
ხატავს.

## `applyForces()`

Droplet-ებზე physics forces-ს იყენებს:

- gravity/attraction;
- pointer interaction;
- boundaries;
- damping.

## `integrate()`

Velocity-სა და position-ს დროის ნაბიჯით აახლებს.

## `mergeDroplets()`

ახლოს/გადაფარულ droplets-ს აერთიანებს, რათა liquid ეფექტი მიიღოს.

## `splitDroplets()`

დიდ ან დაძაბულ droplets-ს პირობების მიხედვით ყოფს.

## `autoSpawn()`

დროისა და არსებული რაოდენობის მიხედვით ავტომატურად droplets-ს ამატებს.

## `mouseSpawn()`

Pointer/mouse მოძრაობის მიხედვით droplet-ს ქმნის.

## `updateSoftBodies()`

Droplet perimeter/soft-body points-ს აახლებს.

## `fixedUpdate()`

ერთ fixed physics step-ში forces/integration/merge/split/spawn-ს აერთიანებს.

## `sync()`

Physics state-ს visual DOM/canvas representation-ს უსადაგებს.

---

# 15. ყველაზე მნიშვნელოვანი ფუნქციები გამოცდისთვის

პირველ რიგში line-by-line უნდა იცოდე:

1. `getFromStorage()`;
2. `getCurrentUser()`;
3. `requireAuth()`;
4. `attemptLogin()`;
5. Sign Up submit callback;
6. `loadClients()`;
7. `mapApiClient()`;
8. `ensureUniqueClientIds()`;
9. `getVisibleClients()`;
10. `renderClients()`;
11. `validateClient()`;
12. `addClient()`;
13. `deleteClient()`;
14. `changeStatus()`;
15. `activeDeals()`;
16. `wonRevenue()`;
17. `newThisWeek()`;
18. `recentClients()`;
19. `addNote()`;
20. `scheduleReminder()`;
21. `validatePasswordChange()`;
22. `reloadClientsFromApi()`.

Visual `glass-*` ფუნქციების line-by-line ცოდნა ნაკლებად პრიორიტეტულია. უნდა
შეგეძლოს ახსნა, რომ ისინი presentation/animation layer-ია და CRM data flow-ს
არ მართავს.

---

# 16. ფუნქციის ახსნის შაბლონი

ნებისმიერ ფუნქციაზე თქვი:

> This function receives ____. First, it ____. Then it ____. It returns ____.
> Its side effect is ____. It is called when ____.

მაგალითად `deleteClient()`:

> This async function receives a client ID. It asks for confirmation, finds the
> matching client, sends a DELETE request using the API ID, treats a 404 as an
> expected result for locally created mock records, creates a new client array
> without that ID, saves it, updates the global state, removes related
> reminders, rerenders the list, and shows a toast.

---

# 17. თვითშემოწმება

თითოეულ ფუნქციაზე უპასუხე:

1. რა parameter აქვს?
2. რას აბრუნებს?
3. არის async?
4. Promise-ს აბრუნებს?
5. ცვლის global state-ს?
6. წერს localStorage-ში?
7. ცვლის DOM-ს?
8. შეიძლება throw გააკეთოს?
9. სად იძახება?
10. რა edge case აქვს?

თუ ამ ათ კითხვას უპასუხებ, ფუნქცია გამოცდისთვის რეალურად გესმის.

