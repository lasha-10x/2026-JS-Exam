# 10X CRM Technical Glossary

This glossary explains the principal web-development terms used in the 10X CRM
project. The selection follows the concepts emphasized in the course study
guides and the ones an evaluator is most likely to ask about. Each entry
includes an English usage sentence and a Georgian explanation in the author's
own words.

---

## Product and Access

## 1. CRM — Customer Relationship Management

**English:** A CRM helps a business organize client information and track
customer relationships.

**ქართული:** მომხმარებელთან ურთიერთობის მართვის სისტემა, რომელიც ერთ ადგილას
აერთიანებს კლიენტების ბაზას, გაყიდვის ეტაპებს (Lead → Contacted → Won/Lost),
შენიშვნებსა და სტატისტიკას.

## 2. Authentication

**English:** Authentication verifies a user's identity before granting access
to protected pages.

**ქართული:** ავთენტიფიკაცია ამოწმებს მომხმარებლის ვინაობას ელფოსტითა და
პაროლით და მხოლოდ წარმატებული შესვლის შემდეგ აძლევს მას დაცულ გვერდებზე
წვდომას.

## 3. Session

**English:** The active session keeps the user signed in while navigating
between application pages.

**ქართული:** სესია (`crm_session`) ინახავს ინფორმაციას იმის შესახებ, ვინ არის
ამჟამად შესული, და გვერდიდან გვერდზე გადასვლისას ხელახლა შესვლას საჭიროდ აღარ
ხდის. Logout მხოლოდ ამ გასაღებს შლის (`removeItem`).

## 4. Auth Guard

**English:** The auth guard redirects unauthorized visitors away from protected
pages and signed-in users away from the login page.

**ქართული:** Auth Guard არის საერთო ფუნქცია (`guard.js`), რომელიც ყოველი
გვერდის ჩატვირთვისას ამოწმებს სესიას: თუ დაცულ გვერდზე სესია არ არსებობს,
გადაამისამართებს `index.html`-ზე; თუ საჯარო გვერდზე სესია უკვე არსებობს —
`dashboard.html`-ზე.

---

## JavaScript Core

## 5. State

**English:** Application state is the data currently held in memory and shown by
the interface.

**ქართული:** მდგომარეობა (state) არის პროგრამის მიმდინარე მონაცემები — მთავარია
`clients` მასივი. ყველა ოპერაცია (დამატება, წაშლა, ფილტრი, სორტი, სტატისტიკა) ამ
ერთ მასივს ეყრდნობა, DOM კი მხოლოდ მის გამოსახულებას აჩვენებს.

## 6. DOM — Document Object Model

**English:** JavaScript reads and updates the page by working with the DOM.

**ქართული:** DOM არის HTML გვერდის ხის სტრუქტურა ბრაუზერის მეხსიერებაში.
JavaScript სწორედ DOM-ის მეშვეობით ქმნის, ცვლის და შლის ელემენტებს — ამით ხდება
სტატიკური გვერდი ინტერაქტიული.

## 7. Event Listener and Callback

**English:** An event listener runs a callback function when the user clicks a
button or submits a form.

**ქართული:** მოვლენის მსმენელი (`addEventListener`) აკვირდება მოქმედებას
(`click`, `submit`, `input`…) და მის დადგომაზე ასრულებს callback-ს — ფუნქციას,
რომელსაც ჩვენ პირდაპირ არ ვიძახებთ, არამედ ბრაუზერი იძახებს საჭირო მომენტში.

## 8. preventDefault

**English:** Calling `preventDefault()` on a submit event stops the browser from
reloading the page.

**ქართული:** `event.preventDefault()` აჩერებს ფორმის ნაგულისხმევ ქცევას (გვერდის
გადატვირთვას), რათა ჯერ ვალიდაცია და JavaScript ლოგიკა შესრულდეს.

## 9. Render

**English:** A single render function rebuilds the visible client list from
state whenever the data changes.

**ქართული:** რენდერი ნიშნავს state-ის ეკრანზე დახატვას. ერთი ფუნქცია
(`renderClients`) ასუფთავებს კონტეინერს და ხელახლა ქმნის ბარათებს — ყველა
ცვლილება ბოლოს სწორედ ამ ფუნქციას იძახებს.

## 10. Closure

**English:** A closure lets an inner function remember variables from the scope
where it was created.

**ქართული:** Closure (ჩაკეტვა) არის ფუნქცია, რომელიც „იმახსოვრებს" თავისი
შექმნის გარემოს ცვლადებს. მაგალითად, ტაიმერის ან event listener-ის callback-ს
შეუძლია გამოიყენოს ის ცვლადი, რომელიც გარეთ იყო განსაზღვრული.

---

## Forms and Validation

## 11. Validation

**English:** Validation rejects incomplete or incorrectly formatted form data
before it is saved.

**ქართული:** ვალიდაცია ამოწმებს შეყვანილი მონაცემების სისწორეს (ელფოსტის
ფორმატი, პაროლის სიგრძე, სავალდებულო ველები) და შეცდომის შემთხვევაში ფორმას არ
გზავნის.

## 12. Regular Expression (RegExp)

**English:** A regular expression checks whether the password contains at least
one letter and one number.

**ქართული:** რეგულარული გამოსახულება არის ტექსტში ნიმუშის საძებნი ინსტრუმენტი.
`/[a-zA-Z]/.test(password)` ამოწმებს ასოს არსებობას, `/[0-9]/.test(password)` კი
ციფრისას; `test()` აბრუნებს `true`/`false`-ს.

## 13. trim()

**English:** `trim()` removes leading and trailing whitespace so blank input is
not accepted.

**ქართული:** `trim()` აშორებს ტექსტის დასაწყისსა და ბოლოში არსებულ ცარიელ
სივრცეებს. ვალიდაციაში ვიყენებთ, რომ მომხმარებელმა მხოლოდ space-ებით შევსებული
ველი ვერ გაატაროს.

---

## Data and Storage

## 14. Local Storage

**English:** Local storage preserves CRM data after the browser page is
refreshed.

**ქართული:** `localStorage` არის ბრაუზერის მუდმივი key/value საცავი, სადაც
სტრიქონის სახით შენახული მონაცემები გვერდის განახლების შემდეგაც რჩება. ვიყენებთ
გასაღებებს: `crm_users`, `crm_session`, `crm_clients`, `crm_theme`.

## 15. Serialization (JSON.stringify / JSON.parse)

**English:** Objects are serialized with `JSON.stringify` before storage and
parsed back with `JSON.parse` when read.

**ქართული:** `localStorage` მხოლოდ სტრიქონს ინახავს, ამიტომ ობიექტს `JSON.stringify`-ით
ტექსტად ვაქცევთ (serialization), წაკითხვისას კი `JSON.parse`-ით ისევ ობიექტად
(deserialization). დაზიანებული ტექსტი `parse`-ზე შეცდომას ისვრის, ამიტომ
`try/catch` სჭირდება.

## 16. Persistence

**English:** Data persistence ensures that local client changes survive a page
reload.

**ქართული:** მონაცემთა მდგრადობა ნიშნავს, რომ შენახული ცვლილებები არ ქრება და
გვერდის ხელახლა გახსნისას კვლავ ხელმისაწვდომია.

## 17. Unique Identifier

**English:** Every local client receives a unique identifier so that actions
target exactly one record.

**ქართული:** უნიკალური იდენტიფიკატორი (`id`) აძლევს პროგრამას საშუალებას სწორად
იპოვოს, შეცვალოს ან წაშალოს კონკრეტული ჩანაწერი. API-დან მიღებული id ცალკე
(`apiId`) ინახება, რომ ლოკალურ და სერვერულ ჩანაწერებს შორის აღრევა არ მოხდეს.

---

## Arrays and Objects

## 18. Array Methods (map / filter / reduce / find / some)

**English:** Array methods transform and query the client list without manual
loops.

**ქართული:** მასივის მეთოდები: `map` გარდაქმნის (API → Client მოდელი),
`filter` ტოვებს პირობის დამაკმაყოფილებელ ელემენტებს, `reduce` კრებს ერთ
მნიშვნელობად (მაგ. Won Revenue), `find` პოულობს პირველ დამთხვევას, `some`
ამოწმებს არსებობს თუ არა დამთხვევა (დუბლი email).

## 19. Spread Operator (`...`)

**English:** The spread operator creates a copy of an array or object instead of
mutating the original.

**ქართული:** Spread ოპერატორი (`...`) ქმნის მასივის ან ობიექტის ასლს:
`[...clients]` ან `{...client}`. ვიყენებთ, რომ სორტი/ფილტრი საწყის მასივს არ
დააზიანოს, და ახალი კლიენტის თავში დასამატებლად: `[newClient, ...clients]`.

## 20. CRUD

**English:** The clients page supports the complete CRUD lifecycle for customer
records.

**ქართული:** CRUD აერთიანებს ოთხ ძირითად ოპერაციას: შექმნა (Create), წაკითხვა
(Read), განახლება (Update) და წაშლა (Delete) — ზუსტად ის, რაც კლიენტების გვერდზე
ხდება.

---

## API and Asynchronous Work

## 21. API — Application Programming Interface

**English:** The application uses an API to retrieve initial client data from an
external service.

**ქართული:** API არის წესებისა და მისამართების ერთობლიობა, რომლის დახმარებითაც
ერთი პროგრამა მეორისგან მონაცემებს იღებს ან უგზავნის. აქ ვიყენებთ DummyJSON-ს.

## 22. REST and Endpoint

**English:** DummyJSON exposes REST endpoints for working with client data over
HTTP.

**ქართული:** REST არის ვებ-სერვისის მიდგომა, სადაც რესურსებზე მოქმედება ხდება
სტანდარტული HTTP მოთხოვნებით. ენდფოინტი კი კონკრეტული URL მისამართია
(მაგ. `/users?limit=30`, `/users/add`, `/users/{id}`).

## 23. HTTP / Request Method

**English:** GET retrieves data, POST adds a record, and DELETE removes one.

**ქართული:** HTTP მეთოდი განსაზღვრავს მოთხოვნის მიზანს: `GET` კითხულობს
მონაცემს, `POST` ამატებს, `PUT`/`PATCH` აახლებს, ხოლო `DELETE` შლის.

## 24. fetch, async/await, and Promise

**English:** An `async` function uses `await fetch(...)` to request data without
freezing the interface.

**ქართული:** `fetch` აგზავნის ქსელურ მოთხოვნას და აბრუნებს Promise-ს —
მომავალში დასრულებული შედეგის დაპირებას. `async/await` საშუალებას გვაძლევს ამ
შედეგს ისე დაველოდოთ, რომ ინტერფეისი არ გაიყინოს (ასინქრონულობა).

## 25. Error Handling (try/catch and response.ok)

**English:** Network calls are wrapped in `try/catch`, and `response.ok` is
checked before using the data.

**ქართული:** შეცდომების დამუშავება იცავს აპლიკაციას მოულოდნელი პრობლემისგან:
`fetch` ვათავსებთ `try/catch`-ში, ხოლო `response.ok` (მხოლოდ 200–299 სტატუსზე
`true`) ვამოწმებთ; წარუმატებლობისას ვაჩვენებთ შეტყობინებას და Retry ღილაკს.

---

## Data Formats and Delivery

## 26. JSON — JavaScript Object Notation

**English:** The API returns client records in JSON format.

**ქართული:** JSON არის ტექსტური მონაცემთა ფორმატი, რომელიც ინფორმაციას
გასაღები-მნიშვნელობის წყვილებად წარმოადგენს და ფართოდ გამოიყენება ბრაუზერსა და
სერვერს შორის მონაცემების გადასაცემად.

## 27. CSV — Comma-Separated Values

**English:** CSV export converts the client list into a spreadsheet-compatible
text file.

**ქართული:** CSV არის ცხრილური მონაცემების ტექსტური ფორმატი, სადაც თითო სტრიქონი
ჩანაწერია, ხოლო სვეტები გამყოფი სიმბოლოთი (მძიმით) არის გამოყოფილი.

## 28. Debounce

**English:** The search input is debounced so the list is re-rendered only after
the user pauses typing, not on every keystroke.

**ქართული:** Debounce აყოვნებს ფუნქციის შესრულებას, სანამ მომხმარებელი ბეჭდვას
არ შეწყვეტს. ძებნის ველზე `clearTimeout` + `setTimeout(…, 250)` ვიყენებთ, რომ სია
ყოველ ასოზე კი არა, დაპაუზების შემდეგ ერთხელ დაიხატოს — ეს ზოგავს ზედმეტ
გამოთვლას.

## 29. Deployment

**English:** Deployment publishes the finished application to a public host such
as Vercel or Netlify.

**ქართული:** დეპლოი არის მზა აპლიკაციის საჯარო ჰოსტინგზე (Vercel ან Netlify)
განთავსება, რის შემდეგაც ის ცოცხალი ბმულით ხელმისაწვდომი ხდება ნებისმიერისთვის.

---

## Interface and User Experience

## 30. Modal Dialog

**English:** A modal dialog temporarily focuses the user on a form or
confirmation task.

**ქართული:** მოდალური ფანჯარა არის ძირითადი გვერდის ზემოთ გახსნილი დროებითი
ინტერფეისი, რომელიც ყურადღებას კონკრეტულ მოქმედებაზე (ფორმა, დადასტურება)
ამახვილებს.

## 31. Responsive Design

**English:** Responsive design adapts the CRM layout to mobile, tablet, and
desktop screen sizes.

**ქართული:** რესპონსიული დიზაინი ეკრანის ზომის მიხედვით ცვლის განლაგებას, ზომებსა
და ნავიგაციას, რათა ინტერფეისი ყველა მოწყობილობაზე გამოსაყენებელი დარჩეს.

## 32. Accessibility

**English:** Accessibility features help keyboard and assistive-technology users
operate the application.

**ქართული:** ხელმისაწვდომობა მოიცავს მიდგომებს, რომლებიც პროდუქტს სხვადასხვა
შესაძლებლობის მქონე ადამიანისთვის გამოსაყენებელს ხდის — კლავიატურით მართვას,
ფოკუსის სწორ ქცევასა და ეკრანის წამკითხველის მხარდაჭერას.

---

## Architecture and Design Principles

## 33. Single Source of Truth

**English:** The `clients` array is the single source of truth, and the
interface only reflects it.

**ქართული:** ერთი ჭეშმარიტების წყარო ნიშნავს, რომ მონაცემი მხოლოდ ერთ ადგილას
ცხოვრობს — `clients` მასივში. DOM მას მხოლოდ აჩვენებს; ცვლილება ჯერ ამ მასივში
ხდება, მერე ინახება და მერე იხატება. ასე ორ ადგილას ერთი და იგივე მონაცემი ვერ
დაშორდება ერთმანეთს.

## 34. Separation of Concerns

**English:** Each JavaScript module has one concern, so storage, auth, data, and
UI logic stay independent.

**ქართული:** პასუხისმგებლობების გამიჯვნა ნიშნავს, რომ თითო ფაილი ერთ საქმეს
აკეთებს: `storage.js` — შენახვა, `guard.js` — წვდომა, `data.js` — მონაცემები,
`ui.js` — შეტყობინებები. ეს ამარტივებს კითხვადობას, ტესტირებასა და შეცდომის
მოძებნას.

## 35. DRY / Single Responsibility

**English:** Shared logic is written once and reused, and each function has a
single responsibility.

**ქართული:** DRY (Don't Repeat Yourself) ნიშნავს კოდის გამეორების თავიდან
აცილებას — საერთო ლოგიკა (auth guard, storage) ერთხელ იწერება და ყველა გვერდზე
გამოიყენება. Single Responsibility კი ნიშნავს, რომ ერთი ფუნქცია ერთ საქმეს
აკეთებს (მაგ. `renderClients` მხოლოდ ხატავს).

## 36. Immutability

**English:** Client updates build a new array with the spread operator instead
of mutating the original in place.

**ქართული:** უცვლელობა (immutability) ნიშნავს, რომ საწყის მასივს არ ვცვლით,
არამედ ახალ ასლს ვქმნით: `[newClient, ...clients]` დამატებისას, `[...clients]`
სორტისა და ფილტრის წინ. ეს იცავს state-ს შემთხვევითი დაზიანებისგან და პროგნოზირებადს
ხდის ცვლილებებს.

## 37. State-Driven UI

**English:** Every action follows the same cycle — change state, save it, then
re-render the screen.

**ქართული:** State-ზე დაფუძნებული UI არის პროექტის „ოქროს ციკლი": state იცვლება →
ინახება (`localStorage`) → ეკრანი თავიდან იხატება. ინტერფეისს პირდაპირ არ ვცვლით —
ჯერ მონაცემს ვცვლით, გამოსახულება კი ავტომატურად მოსდევს.

## 38. Configuration-Driven Design

**English:** Statuses, storage keys, and badge classes are declared in
configuration objects instead of being hardcoded throughout the code.

**ქართული:** კონფიგურაციაზე დაფუძნებული მიდგომა ნიშნავს, რომ განმეორებადი
მნიშვნელობები ერთ ცხრილში/ობიექტში ვაცხადებთ: `CLIENT_STATUSES` (სტატუსები),
`STORAGE_KEYS` (გასაღებები), `STATUS_BADGES` (ბეჯის კლასები). ცვლილება ერთ ადგილას
კეთდება და `switch`-ის ნაცვლად lookup-ს ვიყენებთ.

---

## Patterns and Techniques

## 39. Event Delegation and Bubbling

**English:** One listener on the clients container handles clicks for every card,
including cards added later.

**ქართული:** ივენთის დელეგირება ნიშნავს, რომ ცალკეულ ბარათზე ლისენერის მიბმის
ნაცვლად ერთ ლისენერს ვამაგრებთ მშობელ კონტეინერზე (`clientsArea`). მოვლენის
„ამოტივტივების" (bubbling — შვილიდან მშობლისკენ) წყალობით მშობელი იჭერს
შვილების კლიკებს, ხოლო `event.target.closest('.client-card')` პოულობს კონკრეტულ
ბარათს. ეს მუშაობს ახლად დამატებულ ბარათებზეც.

## 40. Guard Clause

**English:** An early `return` at the top of a function handles the invalid case
first and avoids deep nesting.

**ქართული:** Guard Clause არის ფუნქციის დასაწყისში ადრეული `return`, თუ პირობა არ
სრულდება (მაგ. `if (!card) return;`). ეს ამცირებს ჩალაგებულ `if`-ებს და კოდს უფრო
წაკითხვადს ხდის.

## 41. Defensive Programming

**English:** The code is written to survive unexpected failures — missing data,
storage errors, or network problems.

**ქართული:** თავდაცვითი პროგრამირება ნიშნავს კოდის ისე დაწერას, რომ გაუძლოს
გაუთვალისწინებელ შეცდომებს: `try/catch`, `response.ok`-ის შემოწმება, fallback-ები
(`client.company || 'No company'`) და `localStorage`-ის უსაფრთხო წაკითხვა.

## 42. Normalization

**English:** External and user data are converted to a consistent internal shape
before they are stored.

**ქართული:** ნორმალიზაცია არის მონაცემის ერთიან შიდა ფორმამდე მოყვანა: API-ს
პასუხს `map`-ით Client მოდელად ვაქცევთ, ელფოსტას კი `trim().toLowerCase()`-ით
ვასწორებთ, რომ დუბლიკატის შემოწმება საიმედო იყოს.

## 43. Optimistic UI and Rollback

**English:** The interface updates immediately and reverts the change if saving
fails.

**ქართული:** Optimistic UI ნიშნავს ინტერფეისის მყისიერ განახლებას სერვერის/საცავის
ლოდინის გარეშე. თუ შენახვა ჩავარდა, ცვლილებას უკან ვაბრუნებთ (rollback) — მაგ.
სტატუსის შეცვლისას წინა მნიშვნელობა ინახება და შეცდომაზე აღდგება.

## 44. Focus Trap

**English:** While a modal is open, keyboard focus stays inside it and returns to
the trigger when it closes.

**ქართული:** Focus Trap არის მოდალში ფოკუსის „დაჭერა" — `Tab`-ით ფოკუსი მოდალის
ელემენტებს არ სცდება, დახურვისას კი უბრუნდება იმ ღილაკს, რომელმაც გახსნა. ეს
ხელმისაწვდომობის (accessibility) მოთხოვნაა.

---

## Security

## 45. User Enumeration

**English:** Login always returns the same generic error so an attacker cannot
learn which emails are registered.

**ქართული:** User Enumeration არის თავდასხმა, სადაც ცალკეული შეცდომებით
(„ასეთი email არ არსებობს" / „პაროლი არასწორია") თავდამსხმელი იგებს, რომელი მეილია
რეგისტრირებული. დაცვა: ყოველთვის ერთი განზოგადებული ტექსტი — `Invalid email or
password`.

## 46. XSS (Cross-Site Scripting)

**English:** User-provided text is inserted with `textContent`, never
`innerHTML`, so it cannot inject and run scripts.

**ქართული:** XSS არის მავნე სკრიპტის ინექცია გვერდში (მაგ. `innerHTML`-ით
შეყვანილი ტექსტიდან). დაცვა: მომხმარებლის მიერ შეყვანილ მონაცემს `textContent`-ით
ვსვამთ, რომელიც ტექსტს ტექსტადვე ტოვებს და თეგებს არ ასრულებს.

## 47. Hashing (Salt + Hash)

**English:** In a real product, passwords are hashed on a server rather than
stored as plain text.

**ქართული:** Hashing არის პაროლის ცალმხრივი დაშიფვრა სერვერზე (მაგ. bcrypt, Salt +
Hash). ამ სასწავლო პროექტში პაროლი `localStorage`-ში ღია ტექსტად ინახება, რაც
რეალურ პროდუქტში დაუშვებელია — სწორი მიდგომა სწორედ დაჰეშვაა.
