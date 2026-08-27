# Technical Glossary (10X CRM)

This glossary explains 10 core web development and programming terms used in the **10X CRM** project, featuring English technical descriptions and Georgian explanations.

---

### 1. Authentication (ავტორიზაცია/აუტენტიფიკაცია)
* **English**: Authentication is the process of verifying the identity of a user attempting to access an application using credentials such as an email and password.
* **ქართულად**: ავტორიზაცია/აუტენტიფიკაცია არის მომხმარებლის ვინაობის დამოწმების პროცესი (მაგალითად, ელფოსტისა და პაროლის შეყვანით), რათა სისტემამ დარწმუნებით იცოდეს, ვინ შედის საიტზე.

---

### 2. Session (სესია)
* **English**: A session represents a temporary active connection state between a authenticated user and the browser, stored locally to maintain logged-in status.
* **ქართულად**: სესია არის დროებითი ჩანაწერი მეხსიერებაში (ჩვენთან `localStorage`-ში), რომელიც ადასტურებს, რომ მომხმარებელი უკვე შესულია სისტემაში და არ სჭირდება პაროლის ხელახლა შეყვანა ყოველ გვერდზე.

---

### 3. Validation (ვალიდაცია)
* **English**: Validation is the automated verification of user input data against specific security and structural rules before it is processed or saved.
* **ქართულად**: ვალიდაცია არის მომხმარებლის მიერ ფორმაში შეყვანილი მონაცემების ავტომატური შემოწმება წესების მიხედვით (მაგალითად, არის თუ არა ელფოსტა სწორი ფორმატის ან პაროლი მინიმუმ 8 სიმბოლო), სანამ მონაცემები შეინახება.

---

### 4. Fetch API (ფეჩი / ასინქრონული მოთხოვნა)
* **English**: The Fetch API is a modern browser tool that allows JavaScript to make network HTTP requests asynchronously without refreshing the web page.
* **ქართულად**: `fetch` არის ბრაუზერის ჩაშენებული ინსტრუმენტი, რომლითაც ჯავასკრიპტს შეუძლია სერვერს გადასცეს ან გამოითხოვოს მონაცემები ფონურ რეჟიმში, გვერდის გადატვირთვის გარეშე.

---

### 5. Endpoint (ენდპოინტი / API მისამართი)
* **English**: An endpoint is a specific URL location provided by a backend web server or API that accepts HTTP requests to receive or supply data.
* **ქართულად**: ენდპოინტი არის სერვერის კონკრეტული ვებ-მისამართი (მაგ: `https://dummyjson.com/users`), სადაც ვგზავნით მოთხოვნას მონაცემების მისაღებად, დასამატებლად ან წასაშლელად.

---

### 6. Request Method (მოთხოვნის მეთოდი - GET, POST, DELETE)
* **English**: A request method is an HTTP verb indicating the desired action to be performed on a specified server resource.
* **ქართულად**: მოთხოვნის მეთოდი არის სერვერისთვის გაგზავნილი ბრძანების ტიპი: `GET` (მონაცემების წაკითხვა), `POST` (ახლის დამატება), `PUT` (რედაქტირება) და `DELETE` (წაშლა).

---

### 7. JSON (JavaScript Object Notation)
* **English**: JSON is a lightweight text-based data format used to structure, store, and transmit data between client applications and web servers.
* **ქართულად**: JSON არის ტექსტური ფორმატი, რომლითაც მონაცემებს ვინახავთ `localStorage`-ში ან ვცვლით სერვერთან. ტექსტიდან ობიექტში გადასაყვანად ვიყენებთ `JSON.parse()`-ს, ხოლო ობიექტიდან ტექსტში — `JSON.stringify()`-ს.

---

### 8. Application State (აპლიკაციის მდგომარეობა)
* **English**: State refers to the current snapshot of data stored in memory that determines what information and visual controls are displayed on screen.
* **ქართულად**: state არის აპლიკაციის ოპერატიულ მეხსიერებაში არსებული მონაცემების ერთობლიობა (მაგ: კლიენტების მასივი `this.clients`), რომლის მიხედვითაც ეკრანზე იხატება ბარათები, ციფრები და სტატისტიკა.

---

### 9. Event Listener (მოვლენის მსმენელი)
* **English**: An event listener is a JavaScript function attached to an HTML element that waits for specific user interactions like clicks, form submits, or key presses.
* **ქართულად**: მოვლენის მსმენელი (`addEventListener`) არის ჯავასკრიპტის ფუნქცია, რომელიც „უსმენს“ მომხმარებლის მოქმედებას HTML ელემენტზე (მაგალითად ღილაკზე დაჭერას `click`, ფორმის გაგზავნას `submit` ან ტექსტის აკრეფას `input`).

---

### 10. Deployment (დეპლოი / ვებგვერდის განთავსება)
* **English**: Deployment is the process of building and publishing web application code onto cloud servers like Vercel or Netlify so it becomes publicly accessible via a URL.
* **ქართულად**: დეპლოი არის ჩვენი დაწერილი კოდის ინტერნეტ-სერვერზე (მაგ: Vercel-ზე) განთავსება, რათა ნებისმიერმა ადამიანმა შეძლოს აპლიკაციით სარგებლობა მისამართის (URL) საშუალებით.
