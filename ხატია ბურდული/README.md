# 10X CRM

## Project Overview

10X CRM is a Customer Relationship Management (CRM) web application built with HTML, CSS, and Vanilla JavaScript.

The application allows users to register, authenticate, and manage client information using LocalStorage and the DummyJSON API.

---

## Features

### Authentication

- User Registration (Sign Up)
- User Login
- Logout
- Authentication Guard
- Session Management

### Client Management

- Load clients from DummyJSON API
- Add a new client
- Edit client information
- Delete a client
- Client form validation

### User Experience

- Toast notifications
- Responsive layout
- Modal form for client management
- Form validation with error messages

---

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- LocalStorage
- Fetch API
- DummyJSON API
- Git
- GitHub

---

## API

This project uses the DummyJSON REST API.

Endpoints used:

- GET /users
- POST /users/add
- PUT /users/{id}
- DELETE /users/{id}

---

## LocalStorage

The application stores data using the following keys:

- crm_users
- crm_session
- crm_clients

---

## Project Structure

```
10X-CRM/
│
├── assets/
│   ├── css/
│   ├── js/
│   │   ├── auth.js
│   │   ├── clients.js
│   │   ├── dashboard.js
│   │   ├── profile.js
│   │   ├── guard.js
│   │   ├── helpers.js
│   │   └── storage.js
│   └── images/
│
├── index.html
├── signup.html
├── dashboard.html
├── clients.html
├── profile.html
│
├── README.md
├── ai-log.md
├── glossary.md
└── research-note.md
```

---

## Installation

1. Clone the repository

```bash
git clone https://github.com/khatiaEburduli/10x-crm-_khatia_.git
```

2. Open the project in Visual Studio Code.

3. Run the project using Live Server.

---

## Validation

### Sign Up

- Full Name is required
- Minimum 3 characters
- Valid email required
- Password must contain at least 8 characters
- Password must contain letters and numbers
- Confirm Password must match

### Login

- Required field validation
- Invalid email or password message

### Clients

- Client name validation
- Email validation
- Company validation

---

## Live Demo

https://10x-crm-khatia.vercel.app/

---

## Repository

https://github.com/khatiaEburduli/10x-crm-_khatia_/tree/master

---

## Test Account

Email:
burdulikat@gmail.com

Password:
mandarini11


## Credits

Developed by Khatia Burduli.

AI assistance: ChatGPT (used for explanations and debugging).