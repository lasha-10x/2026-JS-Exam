# Glossary

10 technical terms used in this project — English sentence, then a short explanation in Georgian.

1. **Authentication** — The process of verifying that a user is who they claim to be, usually with an email and password.
   ქართულად: ავტორიზაცია/აუთენტიფიკაცია — პროცესი, რომლითაც სისტემა ამოწმებს, რომ მომხმარებელი ნამდვილად არის ის, ვინც ამტკიცებს, რომ არის (ჩვენს პროექტში — email + password-ის შედარებით).

2. **Session** — A temporary record that a user is currently logged in, stored on the client until they log out.
   ქართულად: სესია — დროებითი ჩანაწერი იმის შესახებ, რომ მომხმარებელი ამჟამად შესულია სისტემაში; ჩვენთან ინახება `crm_session`-ში logout-მდე.

3. **Validation** — Checking that user input meets specific rules (length, format, uniqueness) before accepting it.
   ქართულად: ვალიდაცია — შემოწმება, რომ მომხმარებლის შეყვანილი მონაცემი აკმაყოფილებს განსაზღვრულ წესებს (სიგრძე, ფორმატი, უნიკალურობა), სანამ ის მიღებული/შენახული იქნება.

4. **Fetch** — A built-in browser function used to make HTTP requests to a server or API.
   ქართულად: fetch — ბრაუზერის ჩაშენებული ფუნქცია, რომლითაც ვგზავნით HTTP მოთხოვნებს სერვერთან ან API-სთან.

5. **Endpoint** — A specific URL on an API that performs one action, like `/users/add` or `/users/{id}`.
   ქართულად: ენდფოინთი — API-ის კონკრეტული URL მისამართი, რომელიც ერთ კონკრეტულ მოქმედებას ასრულებს, მაგალითად `/users/add`.

6. **Request method** — The type of HTTP action being sent: GET (read), POST (create), PUT (update), DELETE (remove).
   ქართულად: მოთხოვნის მეთოდი — HTTP მოქმედების ტიპი: GET (წაკითხვა), POST (შექმნა), PUT (განახლება), DELETE (წაშლა).

7. **JSON** — A lightweight text format for structuring data, used both to store objects in localStorage and to send/receive API data.
   ქართულად: JSON — მსუბუქი ტექსტური ფორმატი მონაცემების სტრუქტურირებისთვის; ვიყენებთ localStorage-ში შესანახად და API-სთან გასაცვლელად.

8. **State** — The current, in-memory snapshot of the application's data (e.g. the `allClients` array), which drives what gets rendered.
   ქართულად: state — აპლიკაციის მონაცემების მიმდინარე "სურათი" მეხსიერებაში (მაგ. `allClients` მასივი), საიდანაც იზრდება ეკრანზე გამოსახული სია.

9. **Event listener** — A function attached to a DOM element that runs automatically when a specific event (click, submit, change) happens.
   ქართულად: event listener — ფუნქცია, რომელიც მიმაგრებულია DOM ელემენტზე და ავტომატურად ეშვება კონკრეტული მოვლენის დროს (click, submit, change).

10. **Deployment** — The process of publishing a finished web app to a live, public URL (here, via Vercel or Netlify).
    ქართულად: დეპლოი — მზა ვებ-აპლიკაციის გამოქვეყნების პროცესი ცოცხალ, საჯარო ბმულზე (ჩვენს შემთხვევაში — Vercel ან Netlify).
