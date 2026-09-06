# Glossary

Ten terms used in this project, each with a short English definition and a
plain-language explanation in Georgian (in my own words, for exam prep).

1. **Authentication** — Confirming who a user is, usually with an email and
   password.
   ავთენტიფიკაცია — პროცესი, როდესაც ვამოწმებთ, მართლა ის ადამიანია, ვინც ამბობს,
   რომ არის (email-ისა და პაროლის შედარებით ჩვენს მონაცემებთან).

2. **Session** — A temporary record that says "this browser is currently
   logged in as this user."
   სესია — დროებითი ჩანაწერი localStorage-ში, რომელიც ამბობს "ეს ბრაუზერი ამჟამად
   შესულია ამ იუზერით". როცა logout ხდება, სესია იშლება, მაგრამ იუზერის ანგარიში რჩება.

3. **Validation** — Checking that user input matches the rules we require
   (length, format, etc.) before accepting it.
   ვალიდაცია — შემოწმება, რომ იუზერის მიერ შეყვანილი მონაცემი აკმაყოფილებს ჩვენს
   წესებს (მაგ. პაროლი მინიმუმ 8 სიმბოლო), სანამ მას შევინახავთ.

4. **Fetch** — The browser's built-in JavaScript function for making network
   requests (e.g. to an API).
   Fetch — ბრაუზერის ჩაშენებული ფუნქცია, რომლითაც ვგზავნით მოთხოვნას გარე
   სერვერზე (API-ზე) და ველოდებით პასუხს, პრომისების (Promise) გამოყენებით.

5. **Endpoint** — A specific URL an API exposes for a specific purpose (e.g.
   `dummyjson.com/users` for the list of users).
   Endpoint — კონკრეტული URL მისამართი API-ში, რომელიც კონკრეტულ ფუნქციას
   ემსახურება, მაგალითად იუზერების სიის წამოღება.

6. **Request method (HTTP method)** — The type of action a request is
   performing: GET (read), POST (create), DELETE (remove), etc.
   მოთხოვნის მეთოდი — განსაზღვრავს, რას ვაკეთებთ სერვერთან: GET მონაცემის
   წასაკითხად, POST ახლის შესაქმნელად, DELETE წასაშლელად.

7. **JSON** — A text format for representing data (objects/arrays) that both
   JavaScript and APIs can read/write easily.
   JSON — ტექსტური ფორმატი მონაცემების ჩასაწერად, რომელსაც JavaScript-იც და
   API-ც ერთნაირად ესმის; localStorage-შიც ამიტომ ვინახავთ JSON.stringify-ით.

8. **State** — The current values an app is "remembering" while it runs
   (e.g. which filter is active, which clients are loaded).
   State — მონაცემები, რომლებსაც აპლიკაცია დროებით ინახავს მეხსიერებაში, სანამ
   გვერდი ღიაა (მაგ. რომელი ფილტრია არჩეული ახლა).

9. **Event listener** — A function attached to an element that runs
   automatically when something happens (a click, a form submit, etc.).
   Event listener — ფუნქცია, რომელსაც ვამაგრებთ ელემენტს და ავტომატურად ეშვება,
   როცა კონკრეტული მოვლენა (Event-ი) ხდება (მაგ. ღილაკზე დაჭერა).

10. **Deployment** — Publishing the finished app somewhere publicly
    accessible on the internet, rather than only on your own computer.
    დეპლოიმენტი — მზა აპლიკაციის გამოქვეყნება ინტერნეტში, საიდანაც ნებისმიერს
    შეუძლია მასთან წვდომა, და არა მხოლოდ local კომპიუტერზე გაშვება.
