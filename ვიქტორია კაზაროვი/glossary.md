# 10X CRM Technical Glossary

1. **Authentication** — Authentication verifies that supplied login credentials belong to a registered user.  
   **ქართული ახსნა:** ავტორიზაციისას აპლიკაცია ამოწმებს, ემთხვევა თუ არა შეყვანილი email და პაროლი შენახულ მომხმარებელს.

2. **Session** — A session stores the identity of the user who is currently logged in.  
   **ქართული ახსნა:** სესია ინახავს შესული მომხმარებლის ID-ს, email-სა და შესვლის დროს, რათა დაცული გვერდები ხელმისაწვდომი დარჩეს.

3. **Validation** — Validation checks whether submitted values follow the application's rules.  
   **ქართული ახსნა:** ვალიდაცია ამოწმებს სავალდებულო ველებს, ტექსტის სიგრძეს, email-ის ფორმატსა და პაროლის სიძლიერეს.

4. **Fetch** — Fetch is the browser API used to send asynchronous HTTP requests.  
   **ქართული ახსნა:** პროექტში `fetch()` DummyJSON-დან კლიენტების ჩასატვირთად, დასამატებლად და წასაშლელად გამოიყენება.

5. **Endpoint** — An endpoint is a specific API URL that accepts a particular request.  
   **ქართული ახსნა:** მაგალითად, `/users?limit=30` არის მისამართი, საიდანაც საწყისი კლიენტების სია იტვირთება.

6. **Request method** — A request method describes the intended HTTP operation, such as GET, POST, or DELETE.  
   **ქართული ახსნა:** GET კითხულობს მონაცემებს, POST აგზავნის ახალ ჩანაწერს, DELETE კი წაშლის მოთხოვნას აგზავნის.

7. **JSON** — JSON is a text format used to exchange structured objects and arrays.  
   **ქართული ახსნა:** localStorage-ში ობიექტები JSON ტექსტად ინახება და წაკითხვისას ისევ JavaScript მონაცემებად გარდაიქმნება.

8. **State** — State is the current application data used to produce the visible interface.  
   **ქართული ახსნა:** Clients გვერდზე `clients` მასივი არის მთავარი state, რომელიც ძებნის, ფილტრისა და რენდერის შედეგს განსაზღვრავს.

9. **Event listener** — An event listener runs a function after a browser event occurs.  
   **ქართული ახსნა:** ღილაკზე დაჭერა, ფორმის გაგზავნა და select-ის შეცვლა შესაბამის ფუნქციებს `addEventListener()`-ით იძახებს.

10. **Deployment** — Deployment publishes an application so it can be opened through a live web address.  
    **ქართული ახსნა:** პროექტის დასრულებისას სტატიკური ფაილები Vercel-ზე ან Netlify-ზე უნდა განთავსდეს და ბმული README-ში დაემატოს.
