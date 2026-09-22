# 📖 Technical Glossary - 10X-CRM Project

This glossary defines key technical terms, web development concepts, and architectural patterns utilized throughout the **10X-CRM** codebase.

---

### 🔑 A - C

* **API (Application Programming Interface):** A set of rules and protocols that allows one software application to communicate with another. In this project, `DummyJSON` serves as an external API to fetch initial mock data.
* **Asynchronous JavaScript (async/await):** A syntactical feature in JavaScript that allows asynchronous code to be written and executed in a synchronous-like fashion using Promises.
* **CRUD (Create, Read, Update, Delete):** The four basic functions of persistent storage. `10X-CRM` implements CRUD operations for managing client data.
* **CSS BEM / Modular CSS:** Structuring styles logically using modular CSS files (`navbar.css`, `dashboard.css`, `profile.css`) to prevent style bleeding across pages.

---

### 🔑 D - L

* **DOM (Document Object Model):** A programming interface for web documents that represents the page so programs can change the document structure, style, and content dynamically using JavaScript.
* **Event Delegation:** A technique where a single event listener is attached to a parent element to manage events triggered by its child elements, optimizing memory and performance.
* **Fetch API:** A modern interface in JavaScript used to make asynchronous HTTP requests to servers or external endpoints.
* **JSON (JavaScript Object Notation):** A lightweight format for storing and transporting data. 
  * `JSON.stringify()`: Converts a JavaScript object into a JSON string.
  * `JSON.parse()`: Converts a JSON string back into a JavaScript object.
* **LocalStorage:** A web storage web API that allows JavaScript sites to store key-value pairs in a web browser with no expiration date.

---

### 🔑 M - S

* **Mock Data:** Simulated data used during development to test features before connecting to a live production database.
* **Route Guard / Session Guard:** Code logic executed before rendering a view to ensure the user possesses the necessary authorization/session token.
* **State Management:** The practice of managing and synchronizing application data across different components, pages, and browser refreshes.
* **Vanilla JavaScript:** Plain JavaScript code without any additional libraries or frameworks (e.g., React, Vue, jQuery).

---

### 🔑 V - Z

* **Vercel:** A cloud platform for static sites and serverless functions, utilized for deploying and hosting the live production build of `10X-CRM`.