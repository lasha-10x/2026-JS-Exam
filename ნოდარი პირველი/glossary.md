# Glossary — 10X CRM

10 technical terms used throughout this project, each with an English sentence and a Georgian explanation in my own words.

---

### 1. Authentication

**English:** Authentication is the process of confirming a user's identity, usually by checking a submitted email and password against stored credentials.

**ქართულად:** ავტორიზაცია (ავთენტიფიკაცია) არის პროცესი, როცა სისტემა ამოწმებს, მართლა ხარ თუ არა ის, ვინც ამტკიცებ რომ ხარ — ჩვენს პროექტში ეს ხდება `js/auth.js`-ში, email-ისა და პაროლის შედარებით `crm_users`-ში შენახულ მონაცემებთან.

### 2. Session

**English:** A session is a temporary record that keeps a user logged in across page loads, until they log out or the session is cleared.

**ქართულად:** სესია არის დროებითი "ჩანაწერი" იმისა, ვინ არის ამჟამად შესული — ჩვენთან ეს არის ობიექტი (`userId`, `email`, `loginAt`), რომელიც localStorage-ში ინახება `crm_session` გასაღების ქვეშ და logout-ზე იშლება.

### 3. Validation

**English:** Validation is the process of checking that user input meets a set of rules before it's accepted or saved.

**ქართულად:** ვალიდაცია არის შემოწმება, სანამ მომხმარებლის შეყვანილ მონაცემს "დავუჯერებთ" — მაგ. `validateSignupForm()` ამოწმებს, არის თუ არა email სწორი ფორმატის, პაროლი საკმარისად ძლიერი და ა.შ., სანამ ახალ user-ს შევქმნით.

### 4. Fetch

**English:** `fetch()` is a browser API used to send HTTP requests to a server and receive a response, usually handled asynchronously with `async`/`await`.

**ქართულად:** `fetch()` არის ბრაუზერის ჩაშენებული ფუნქცია, რომლითაც ვგზავნით მოთხოვნას სერვერზე (მაგ. DummyJSON API-ზე) და ველოდებით პასუხს — ჩვენთან ეს გამოიყენება კლიენტების ჩატვირთვის, დამატებისა და წაშლისთვის.

### 5. Endpoint

**English:** An endpoint is a specific URL that a server exposes for a particular operation, such as `GET /users` or `POST /users/add`.

**ქართულად:** endpoint არის კონკრეტული URL მისამართი სერვერზე, რომელიც ერთ კონკრეტულ მოქმედებას შეესაბამება — მაგ. `https://dummyjson.com/users/add` არის endpoint ახალი კლიენტის დასამატებლად, `https://dummyjson.com/users/{id}` კი — წასაშლელად.

### 6. Request method

**English:** The request method (GET, POST, DELETE, etc.) tells the server what kind of operation the client wants to perform on a resource.

**ქართულად:** request method (GET, POST, DELETE) აზუსტებს, **რას** ვცდილობთ სერვერზე — GET კითხულობს მონაცემს, POST ქმნის ახალს, DELETE შლის. ჩვენ სამივეს ვიყენებთ Clients გვერდზე.

### 7. JSON

**English:** JSON (JavaScript Object Notation) is a text-based format for representing structured data, used both for API responses and for storing data in `localStorage`.

**ქართულად:** JSON არის ტექსტური ფორმატი, რომლითაც ობიექტებსა და მასივებს "ვწერთ" სტრიქონად — გამოიყენება ორივეგან: API-ს პასუხებში (DummyJSON გვიბრუნებს JSON-ს) და localStorage-ში შენახვისას (`JSON.stringify`/`JSON.parse`-ით).

### 8. State

**English:** State refers to the current data an application is working with at a given moment, kept in memory (in a variable) rather than re-read from storage every time.

**ქართულად:** state არის აპლიკაციის "მიმდინარე მდგომარეობა" მეხსიერებაში — ჩვენთან ეს არის `clientsState` მასივი `clients.js`-ში, რომელსაც ყველა ფუნქცია კითხულობს/ცვლის, და მხოლოდ საჭიროებისამებრ ვინახავთ localStorage-ში.

### 9. Event listener

**English:** An event listener is a function registered to run automatically when a specific event (a click, a form submit, an input change) happens on an element.

**ქართულად:** event listener არის ფუნქცია, რომელიც "ელოდება" კონკრეტულ მოქმედებას ელემენტზე (დაწკაპუნება, ფორმის გაგზავნა, ცვლილება) და ავტომატურად გაეშვება, როცა ეს მოხდება — მაგ. `addEventListener('click', ...)` Delete ღილაკზე.

### 10. Deployment

**English:** Deployment is the process of publishing an application to a live, publicly accessible server so others can use it without running it locally.

**ქართულად:** deployment არის პროცესი, რომლითაც პროექტი "საჯარო" ხდება — ლოკალურად საკუთარ კომპიუტერზე გაშვების მაგივრად, ვინმეს შეუძლია პირდაპირ ბმულით გახსნას. ჩვენს შემთხვევაში ეს Vercel-ით ხდება, GitHub repo-სთან დაკავშირებით.
