# 10X CRM

## Demo video
you can view Demo video on Youtube. it.s short 4 minute video with NO AUDIO

https://youtu.be/Sldv1SNEvWA

## Live Demo

[Open the live project]
----------------------------------------------------------------
https://10-x-crm-nutsa-dushmanishvili.vercel.app/index.html
----------------------------------------------------------------
to test the project, you have to register


## About
10X CRM is a small client relationship management application for sales managers. It helps users store clients, follow deal statuses, review sales statistics, and manage their profile. The project runs entirely in the browser.

## Features
- User registration and login
- Protected pages and logout
- Dark and light themes
- Client loading from the DummyJSON API
- Add and delete clients
- Search, filter, and sort clients
- Client notes and (reminder which doesnot work)
- Dashboard statistics and pipeline overview
- Profile editing and password changing(not implemented yet)
- Data persistence with localStorage

after testing, i think my project has every CORE requirement, but i managed to complete some of the FULL ones, too.


## Tech Stack
- HTML5
- CSS3
- JavaScript
- DummyJSON API
- localStorage


## How Data Is Stored
The app initially loads sample users from DummyJSON. 
It converts those users into CRM clients and saves them in localStorage.

DummyJSON is a test API. It simulates adding and deleting data but does not 
permanently store these changes. Therefore, localStorage is the main data storage for this project.


## Known Limitations
- DummyJSON does not permanently save changes.
- Data is stored separately in each browser.
- Password changing is not implemented.
- Reminders are not implemented.



## Credits

- Dummy user data: [DummyJSON](https://dummyjson.com/)
- JavaScript reference: [MDN Web Docs](https://developer.mozilla.org/)
- AI assistance: OpenAI Codex was used for requirement review and beginner-level implementation guidance.

## Author
Nutsa Dushmanishvili