# Glossary

10 ტექნიკური ტერმინი, გამოყენებული ამ პროექტში.

### 1. Authentication
**Sentence:** The app checks the user's email and password during authentication before creating a session.
**ქართული ახსნა:** ავტორიზაცია/ავთენტიფიკაცია — პროცესი, რომლითაც სისტემა ამოწმებს, მართლა ხარ ის, ვინც ამბობ რომ ხარ (ამ პროექტში — email + password-ის შედარება `crm_users`-ში შენახულთან).

### 2. Session
**Sentence:** Once login succeeds, the app saves a session object in localStorage so the user stays logged in after a page refresh.
**ქართული ახსნა:** სესია — დროებითი ჩანაწერი იმის შესახებ, ვინ არის ამჟამად შესული სისტემაში. ინახება `crm_session` გასაღების ქვეშ და იშლება მხოლოდ logout-ზე.

### 3. Validation
**Sentence:** Form validation runs on submit and shows every error at once instead of stopping at the first one.
**ქართული ახსნა:** ვალიდაცია — შეყვანილი მონაცემის შემოწმება გარკვეულ წესებზე (მაგ. მინიმალური სიგრძე, ფორმატი) მანამ, სანამ მონაცემი საერთოდ შეინახება.

### 4. Fetch
**Sentence:** The clients page uses fetch to load 30 users from the DummyJSON API the first time it opens.
**ქართული ახსნა:** `fetch` — ბრაუზერის ჩაშენებული ფუნქცია, რომლითაც JavaScript-იდან ვგზავნით request-ს სერვერზე (ან გარე API-ზე) და ველოდებით პასუხს.

### 5. Endpoint
**Sentence:** `https://dummyjson.com/users/add` is the endpoint this app calls whenever a new client is created.
**ქართული ახსნა:** endpoint — კონკრეტული URL მისამართი სერვერზე, რომელიც ერთი კონკრეტული ოპერაციისთვისაა გამიზნული (მაგ. კლიენტის დამატება, წაშლა).

### 6. Request method
**Sentence:** Loading clients uses the GET method, while adding one uses POST and deleting one uses DELETE.
**ქართული ახსნა:** request method — "ეტიკეტი", რომელიც HTTP მოთხოვნას ახლავს და ეუბნება სერვერს, რა სახის ოპერაციაა (წაკითხვა, შექმნა, წაშლა და ა.შ.).

### 7. JSON
**Sentence:** The API response arrives as JSON, so the app has to parse it before it can read `data.users`.
**ქართული ახსნა:** JSON — ტექსტური ფორმატი მონაცემების გადასაცემად, რომელიც წააგავს JavaScript-ის ობიექტებსა და მასივებს და ადვილად გარდაიქმნება ორივე მიმართულებით (`JSON.parse` / `JSON.stringify`).

### 8. State
**Sentence:** The `clients` array is the single source of truth that every render function in clients.js reads from.
**ქართული ახსნა:** state — მიმდინარე მონაცემი, რომელიც აპლიკაციას ახსოვს მეხსიერებაში (ამ შემთხვევაში ერთ ცვლადში) და რომლის ცვლილებაზეც აისახება ეკრანი.

### 9. Event listener
**Sentence:** Every button and form in the app has an event listener attached so JavaScript can react when the user clicks or submits.
**ქართული ახსნა:** event listener — ფუნქცია, რომელსაც ვამაგრებთ კონკრეტულ DOM ელემენტზე, რომ ის "მოუსმინოს" გარკვეულ მოვლენას (click, submit, input) და გაუშვას კოდი, როცა ის მოხდება.

### 10. Deployment
**Sentence:** After finishing local testing, the project is deployed to Vercel so it has a public link anyone can open.
**ქართული ახსნა:** deployment (გამართვა/გამოქვეყნება) — პროცესი, რომლითაც პროექტი ლოკალური ფაილებიდან ხდება ინტერნეტში ხელმისაწვდომი, საჯარო ბმულით.