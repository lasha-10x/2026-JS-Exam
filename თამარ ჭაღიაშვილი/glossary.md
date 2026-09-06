# Glossary — Technical English

10 terms used in this project, each with an English sentence and a Georgian explanation in my own words.

**1. Authentication**
*"Authentication confirms that a user is who they claim to be before granting access."*
ავთენტიფიკაცია — პროცესი, რომლითაც სისტემა ამოწმებს, ნამდვილად ხარ თუ არა ის, ვინც ამტკიცებ რომ ხარ (ამ პროექტში: email + password-ის შედარება).

**2. Session**
*"A session stores who is currently logged in, so the app doesn't ask for a password on every page."*
სესია — ინფორმაცია იმის შესახებ, თუ ვინ არის ამჟამად შესული სისტემაში; ინახება `crm_session`-ში და იშლება logout-ზე.

**3. Validation**
*"Validation checks that user input meets the required rules before it's saved."*
ვალიდაცია — შემოწმება, აკმაყოფილებს თუ არა მომხმარებლის შეყვანილი მონაცემი წესებს (მაგ: პაროლის სიგრძე), მანამდე სანამ შეინახება.

**4. Fetch**
*"Fetch is the browser API used to send a request to a server and receive a response."*
Fetch — ბრაუზერის ფუნქცია, რომლითაც JavaScript-იდან ვაგზავნით მოთხოვნას სერვერზე და ვღებულობთ პასუხს.

**5. Endpoint**
*"An endpoint is a specific URL that a server exposes for a particular action, like adding or deleting data."*
Endpoint — კონკრეტული URL მისამართი სერვერზე, რომელიც კონკრეტულ მოქმედებას ემსახურება (მაგ: `/users/add`).

**6. Request method**
*"The request method (GET, POST, DELETE) tells the server what kind of action to perform."*
Request method — მიუთითებს სერვერს, რა ტიპის მოქმედება გვინდა შესრულდეს (წაკითხვა, დამატება, წაშლა).

**7. JSON**
*"JSON is a lightweight text format used to exchange structured data between a browser and a server."*
JSON — მარტივი ტექსტური ფორმატი, რომლითაც ვცვლით სტრუქტურირებულ მონაცემებს ბრაუზერსა და სერვერს შორის.

**8. State**
*"State is the data an application is currently holding in memory, like the list of loaded clients."*
State — მონაცემები, რომლებსაც აპლიკაცია ამჟამად ინახავს მეხსიერებაში (მაგ: ამჟამად ჩატვირთული კლიენტების მასივი).

**9. Event listener**
*"An event listener is a function that runs automatically when a specific user action, like a click, happens."*
Event listener — ფუნქცია, რომელიც ავტომატურად ეშვება კონკრეტული მოქმედების დროს (მაგ: ღილაკზე დაჭერისას).

**10. Deployment**
*"Deployment is the process of publishing an application so it's reachable on a live URL."*
Deployment — პროცესი, რომლის დროსაც აპლიკაცია ქვეყნდება ინტერნეტში, ცოცხალ URL-ზე ხელმისაწვდომი რომ გახდეს.

11. **Local Storage**: Browser database for standard client persistence.

12. **DOM**: Document Object Model for interactive UI manipulation.