# 📚 Technical Glossary - 10X CRM

This document contains a curated list of **10 key technical terms** used throughout the 10X CRM project codebase, architecture, and documentation. Each term includes a formal 1-sentence English definition and an intuitive Georgian explanation.

---

### 1. Authentication
* **English Definition:** Authentication is the process of verifying the identity of a user attempting to log into the application using credentials such as an email and password.
* **ქართული ახსნა:** აუტენტიფიკაცია არის მომხმარებლის ვინაობის შემოწმების პროცესი სისტემაში შესვლისას (მაგალითად, ელფოსტისა და პაროლის სისწორის დადასტურება).

---

### 2. Session
* **English Definition:** A session represents an active user's authenticated period on the application, stored locally to maintain access across page reloads.
* **ქართული ახსნა:** სესია არის პერიოდი, როდესაც მომხმარებელი სისტემაში ავტორიზებულია — ის ინახავს ინფორმაციას ბრაუზერში, რომ გვერდის გადატვირთვისას ხელახლა შესვლა არ მოგვიწიოს.

---

### 3. Validation
* **English Definition:** Validation is the logic that inspects form inputs to ensure data meets required rules and formats before processing or saving.
* **ქართული ახსნა:** ვალიდაცია არის მომხმარებლის მიერ შეყვანილი მონაცემების შემოწმება (მაგალითად, არის თუ არა ელფოსტაში `@` ნიშანი ან სახელი 3 ასოზე მეტი), სანამ მათ შევინახავთ.

---

### 4. Fetch (Fetch API)
* **English Definition:** Fetch is a built-in browser API used to send asynchronous HTTP requests to retrieve or transmit data over the network without reloading the page.
* **ქართული ახსნა:** Fetch არის ბრაუზერის ინსტრუმენტი, რომლითაც JavaScript ინტერნეტით უკავშირდება სერვერს მონაცემების წამოსაღებად ან გასაგზავნად ისე, რომ გვერდი არ გადაიტვირთოს.

---

### 5. Endpoint
* **English Definition:** An endpoint is a specific URL provided by an API that serves as an entry point to request or modify particular backend data resources.
* **ქართული ახსნა:** ენდპოინტი (Endpoint) არის სერვერის კონკრეტული მისამართი (URL), სადაც მივმართავთ კონკრეტული მონაცემების წამოსაღებად ან ცვლილებისთვის (მაგ. `https://dummyjson.com/users/search`).

---

### 6. Request Method
* **English Definition:** A request method indicates the desired action to be performed on a given resource, such as GET for reading data or POST for submitting data.
* **ქართული ახსნა:** მოთხოვნის მეთოდი (Request Method) განსაზღვრავს, რა ტიპის მოქმედება გვინდა შევასრულოთ სერვერზე: `GET` (წაკითხვა), `POST` (დამატება), `PUT` (განახლება) თუ `DELETE` (წაშლა).

---

### 7. JSON (JavaScript Object Notation)
* **English Definition:** JSON is a lightweight text-based data format used to transmit structured data objects between a server and a web application.
* **ქართული ახსნა:** JSON არის მონაცემთა გაცვლის მარტივი ტექსტური ფორმატი, რომლითაც სერვერი და ბრაუზერი ერთმანეთს ობიექტებსა და მასივებს გადასცემენ.

---

### 8. State
* **English Definition:** State refers to the current memory data holding the application's configuration, such as active status filters or the list of loaded clients.
* **ქართული ახსნა:** State (მდგომარეობა) არის აპლიკაციის მეხსიერებაში (ცვლადებში) არსებული მიმდინარე მონაცემები — მაგალითად, რომელი ფილტრია ჩართული ან კლიენტების რა სიაა ჩატვირთული.

---

### 9. Event Listener
* **English Definition:** An event listener is a DOM function that waits for user interactions, such as button clicks or key presses, and triggers execution of a target handler function.
* **ქართული ახსნა:** Event Listener (მოვლენის მსმენელი) არის კოდის ნაწილი, რომელიც ელოდება მომხმარებლის მოქმედებას (მაგ. ღილაკზე დაჭერას, ტექსტის აკრეფას) და საპასუხოდ აშენებს შესაბამის ფუნქციას.

---

### 10. Deployment
* **English Definition:** Deployment is the process of hosting and publishing a web application's codebase to a public web server so users can access it live on the internet.
* **ქართული ახსნა:** დეპლოიმენტი (Deployment) არის აპლიკაციის კოდის ატვირთვა სერვერზე (მაგ. GitHub Pages, Netlify, Vercel), რათა ის ხელმისაწვდომი გახდეს ინტერნეტში ყველასთვის.
