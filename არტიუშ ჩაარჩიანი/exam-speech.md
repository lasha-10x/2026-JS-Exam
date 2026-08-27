# One-Minute Exam Speech

Good morning! My project is called 10X CRM.

It is a small customer management app that runs completely in the browser. A user can create an account, log in, and see a dashboard with statistics. You can add clients, change their status, search and sort them, write notes, and edit your profile. The app also has light and dark themes.

I built it with HTML, Vanilla JavaScript, and Sass. There is no backend or database. Instead, it stores users, sessions, clients, and theme settings in browser localStorage. DummyJSON provides the initial client data and simulates API requests.

The hardest part was keeping one reliable client list across the dashboard, client page, and profile reset. I solved this with a shared data repository and careful storage helpers.

This project helped me understand form validation, the Fetch API, state management, and how to test complete user flows.

The live demo URL will be added after deployment.