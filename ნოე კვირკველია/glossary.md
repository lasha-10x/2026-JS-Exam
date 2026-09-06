# Glossary

Ten technical terms from this project, in English, each with a short definition and a one-line explanation in Georgian.

1. **Authentication** — The process of confirming a user is who they claim to be, usually by checking a submitted email/password pair against stored account data.
   ქართულად: მომხმარებლის ვინაობის დადასტურება — ჩვენს პროექტში, ლოგინის ფორმაში შეყვანილი email/password-ის შედარება `crm_users`-ში შენახულ ჩანაწერებთან.

2. **Session** — A record of who is currently logged in, kept alive across page loads until the user logs out or the record is cleared.
   ქართულად: მიმდინარე ავტორიზებული მომხმარებლის მდგომარეობა, რომელიც ინახება `crm_session`-ში და გვერდის გადატვირთვის შემდეგაც რჩება ცოცხალი, სანამ Logout არ მოხდება.

3. **Validation** — Checking that user-submitted data (a form field, for example) meets a set of rules before it's accepted and saved.
   ქართულად: ფორმაში შეყვანილი მონაცემის წესებთან შესაბამისობის შემოწმება submit-ის დროს, სანამ ის საერთოდ შეინახება.

4. **Fetch** — The browser's built-in function for making an HTTP request (GET, POST, DELETE, etc.) to a server and getting a `Promise` back that resolves with the response.
   ქართულად: ბრაუზერის ჩაშენებული ფუნქცია, რომლითაც ვგზავნით HTTP მოთხოვნას სერვერზე (DummyJSON-ზე) და ვღებულობთ პასუხს Promise-ის სახით.

5. **Endpoint** — A specific URL a server exposes for one kind of operation, e.g. `https://dummyjson.com/users/add` for creating a user.
   ქართულად: სერვერის კონკრეტული URL მისამართი, რომელიც ერთი კონკრეტული ოპერაციისთვისაა განკუთვნილი — მაგალითად, კლიენტის დამატებისთვის.

6. **Request method** — The verb that tells the server what kind of operation is being requested: `GET` to read, `POST` to create, `DELETE` to remove.
   ქართულად: HTTP მოთხოვნის ტიპი, რომელიც განსაზღვრავს რა ოპერაციას ვითხოვთ სერვერისგან — წაკითხვას, შექმნას თუ წაშლას.

7. **JSON** (JavaScript Object Notation) — A text format for representing structured data (objects and arrays) that both JavaScript and most servers can read and write.
   ქართულად: მონაცემთა სტრუქტურირებული ტექსტური ფორმატი, რომელსაც იყენებენ როგორც JavaScript, ისე უმეტესი სერვერები — ჩვენთან, `localStorage`-ში ინახება JSON.stringify-ით გარდაქმნილი ობიექტები.

8. **State** — The current data a piece of the app is working with, kept in memory (a plain object or array) and re-rendered to the screen whenever it changes.
   ქართულად: აპლიკაციის მიმდინარე მონაცემები, რომლებიც ინახება მეხსიერებაში (მაგ. `state.clients`) და ყოველი ცვლილების შემდეგ ხელახლა იხატება ეკრანზე.

9. **Event listener** — A function registered to run automatically when something happens on the page — a click, a form submit, typing in a field.
   ქართულად: ფუნქცია, რომელიც ავტომატურად გაეშვება კონკრეტულ მოვლენაზე — დაწკაპუნებაზე, ფორმის გაგზავნაზე ან ინფუთში აკრეფაზე.

10. **Deployment** — Publishing a finished web app to a public host (Vercel or Netlify, here) so it's reachable by anyone with the URL, not just on the developer's own machine.
    ქართულად: დასრულებული აპლიკაციის საჯარო სერვერზე (Vercel/Netlify) გამოქვეყნება, რომ ის ხელმისაწვდომი გახდეს ნებისმიერისთვის ბმულით, არა მხოლოდ დეველოპერის კომპიუტერზე.
