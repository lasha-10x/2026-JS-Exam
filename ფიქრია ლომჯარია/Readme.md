Deployed link - https://phenomenal-madeleine-b04889.netlify.app/

demo user - {
email: "user@gmail.com"
password: "User123456"
}

About:
Project "10X-CRM-PikriaLomjaria" contains 4 pages: index, signup.html, clients.html and dashboard.html. It doesn't include profile page. Clients and Dashboard are protected by authenticaion and are avaliable only after log in. Each of them has an identical header bar: logo, protected pages, "theme switcher" button, logout button.
Clients page shows each client features on a card. These data are loaded from /dummyjson.com/ testing API. Objects loaded from the API didn't include all the required features and some of them (for example: status and deal value) are added by hand using js randomizer logics.
Dashboard page contains greating massage line with live date and time, 4 cards based on statistical data of clients, pipeline also statistical data - number of clients based on their status, small bar chart for visualisation of pipeline statistics, recent clients which shows last added 5 cliens.

Tech Stack - for developing this project I used: just Vanilla JavaScript, (even if any additional frameworks and libraries were allowed I have not enought knowledge and experiance to use them). The project's styling is managed by a single global CSS file (style.css) linked across all HTML pages.

As for the JS file structure I have centralized the global logic in the data.js - loading data from API, enrich data with missing information, identifying the active CRM session, theme change and etc. This (data.js) file is linked across all pages. Other page specific logics are given into the JS files according to the page names. Also there is validation.js - file, which determines form validation standards and requirements.

CREDIT - Claude.ai, Open.ai
