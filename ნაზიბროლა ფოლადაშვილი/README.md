# 10X CRM

## About

10X CRM is a web application built with HTML, CSS, and Vanilla JavaScript.

The application allows users to manage clients, track customer information, organize deals, and update their profile. Client data is initially loaded from the DummyJSON API and then stored locally using Local Storage.

---

## Features

### Authentication
- User registration
- User login
- Session persistence using Local Storage
- Protected pages for authenticated users
- Logout functionality

### Dashboard
- Statistics cards
- Recent clients section
- Quick action buttons
- Export data functionality

### Client Management
- Load initial client data from DummyJSON API
- Store client data in Local Storage
- Add new clients
- Delete clients
- Search clients by name, company, or email
- Filter clients by status
- Sort clients by name, deal value, and creation date
- Update client status
- View client details
- Add client notes

### Profile
- Update profile information
- Change password
- Reset CRM data

### User Experience
- Toast notifications
- Light and dark theme toggle
- Responsive design
- Client reminders

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Fetch API
- Local Storage
- DummyJSON API

---

## Data Storage

The application loads the initial client data from the DummyJSON API. After the first load, all client information is stored in Local Storage, allowing users to continue working with the data without requiring a backend database.

---

## Project Structure

```text
exam/
│
├── css/
│   └── style.css
│
├── js/
│   ├── common.js
│   ├── data.js
│   ├── dashboard.js
│   ├── clients.js
│   ├── login.js
│   ├── signup.js
│   ├── profile.js
│   └── guard.js
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

## How to Run

1. Clone or download the repository.
2. Open the project in Visual Studio Code.
3. Start the project using the Live Server extension.
4. Open the application in your browser.

---

## Live Demo

https://10x-crm-nazi-pholadashvili.vercel.app

---

## Test Account

Test account: test@example.com / password: Test1234@@
 

---

## Validation

The project includes:

- Required field validation
- Email validation
- Duplicate email prevention
- Positive deal value validation
- Password strength validation

---

## Accessibility

- Semantic HTML
- Form labels
- ARIA attributes

---

## Credits

Developed by **Nazi Pholadashvili**.

AI-assisted development and code review provided with **ChatGPT (OpenAI)**.