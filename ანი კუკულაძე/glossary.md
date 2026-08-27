# Glossary

## API

API (Application Programming Interface) allows different applications to communicate with each other. In this project, I used the DummyJSON API to fetch sample client data and simulate creating and deleting clients.

---

## Authentication

Authentication is the process of verifying a user's identity. In my project, users log in with their email and password, and the application checks if the information matches the saved data.

---

## Authorization

Authorization determines what a user is allowed to access after logging in. Protected pages check if there is an active session before allowing access.

---

## Local Storage

Local Storage is a browser feature that allows data to be stored even after the browser is closed. I used it to store registered users, clients, sessions, and the selected theme.

---

## Session

A session keeps information about the currently logged-in user. In this project, the session is stored in `crm_session` inside localStorage.

---

## JSON

JSON (JavaScript Object Notation) is a format used to store and exchange data.

`JSON.stringify()` converts JavaScript objects into strings.

`JSON.parse()` converts stored strings back into JavaScript objects.

---

## DOM

DOM stands for Document Object Model. It represents the HTML page as objects that JavaScript can access and modify.

---

## DOM Manipulation

DOM Manipulation means changing the content or structure of a webpage with JavaScript. Examples include updating text, adding new elements, removing elements, and changing styles.

---

## Event

An event is an action that happens in the browser, such as clicking a button, typing in an input field, or submitting a form.

---

## Event Listener

An event listener waits for an event and executes a function when that event happens.

Example:

- click
- submit
- input
- change

---

## preventDefault()

`preventDefault()` stops the browser's default behavior.

In this project, it prevents forms from refreshing the page when they are submitted.

---

## Form Validation

Form validation checks whether the user's input is correct before processing it.

My project validates:

- Required fields
- Email format
- Password length
- Password confirmation
- Duplicate email addresses

---

## Fetch API

The Fetch API is used to send HTTP requests.

In this project, it is used to retrieve users from the DummyJSON API and simulate adding and deleting clients.

---

## Async/Await

`async` and `await` make asynchronous JavaScript easier to read.

They allow the code to wait for a request to finish before continuing.

---

## Promise

A Promise represents the result of an asynchronous operation.

A Promise has three states:

- Pending
- Fulfilled
- Rejected

---

## HTTP Request

An HTTP request is sent from the browser to a server.

Common request methods are:

- GET – retrieve data
- POST – create data
- PUT – update data
- DELETE – remove data

---

## CRUD

CRUD stands for:

- Create
- Read
- Update
- Delete

These are the four basic operations used to manage data.

---

## Array Methods

JavaScript provides built-in methods for working with arrays.

In this project I used:

### find()

Returns the first matching element.

### filter()

Returns all matching elements.

### some()

Checks if at least one element matches a condition.

### sort()

Sorts array elements.

### map()

Creates a new array by transforming each element.

---

## textContent

`textContent` is used to read or change the text inside an HTML element.

Example:

```javascript
welcomeMessage.textContent = "Welcome back!";
```

---

## getElementById()

Returns an HTML element using its id.

Example:

```javascript
const loginForm = document.getElementById("loginForm");
```

---

## querySelector()

Returns the first element that matches a CSS selector.

Example:

```javascript
document.querySelector(".client-card");
```

---

## addEventListener()

`addEventListener()` attaches an event to an HTML element.

Example:

```javascript
button.addEventListener("click", saveClient);
```

---

## Arrow Function

An arrow function is a shorter way to write a JavaScript function.

Example:

```javascript
const sum = (a, b) => a + b;
```

---

## Callback Function

A callback function is passed as an argument to another function and runs later.

Array methods like `find()`, `filter()`, and `some()` use callback functions.

---

## Responsive Design

Responsive Design allows a website to work correctly on different screen sizes such as mobile phones, tablets, and desktops.

---

## Dark Mode

Dark Mode changes the application's color theme.

The selected theme is saved in localStorage so it stays the same after refreshing the page.

---

## Git

Git is a version control system that tracks changes in source code.

I used Git to create commits and manage different branches during development.

---

## GitHub

GitHub is an online platform for hosting Git repositories.

I used GitHub to store my project, push commits, create pull requests, and merge completed features.

---

## Repository

A repository is a project folder managed by Git. It contains the source code, commit history, and project files.

---

## Branch

A branch is a separate version of the project where new features can be developed without affecting the main branch.

---

## Commit

A commit is a saved snapshot of the project.

Each commit records changes with a descriptive message.

---

## Pull Request

A Pull Request is used to review and merge changes from one branch into another.

---

## Merge

Merge combines changes from one branch into another after development is complete.