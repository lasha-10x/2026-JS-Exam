# Glossary — 10 Technical Terms from 10X CRM

1. **Authentication** — Authentication is the process of verifying who a user is before granting access.
   -> ნიშნავს იმის დადასტურებას, თუ ვინ არის მომხმარებელი — ჩვენს პროექტში ეს არის ლოგინი: email და პაროლი მოწმდება crm_users-ში შენახულ მონაცემებთან.

2. **Session** — A session represents the period during which a logged-in user stays authenticated.
   -> სესია არის პერიოდუ რა დროსაც „შესული“ მომხმარებელი არის ავტორიზირებული. ჩვენთან crm_session ობიექტი ინახავს userId-ს და loginAt-ს; ლოგაუთი უბრალოდ ამ ჩანაწერს შლის.

3. **Validation** — Validation checks that user input follows the required rules before it is saved.
   –> ვალიდაცია ამოწმებს, აკმაყოფილებს თუ არა შეყვანილი მონაცემი წესებს (მაგ: პაროლი მინიმუმ 8 სიმბოლო, ასო + ციფრი) სანამ შეინახება.

4. **Fetch** — The fetch API sends HTTP requests from the browser and returns a Promise with the response.
   –> fetch არის ბრაუზერის ფუნქცია, რომლითაც სერვერს ვუგზავნით მოთხოვნას (მაგ: GET dummyjson.com/users) და პასუხს Promise-ის სახით ვიღებთ.

5. **Endpoint** — An endpoint is a specific URL where an API accepts requests.
   –> ენდფოინთი არის API-ს კონკრეტული მისამართი — მაგალითად /users/add არის ის ენდფოინთი, სადაც ახალი კლიენტის POST იგზავნება.

6. **Request method** — A request method (GET, POST, DELETE, PUT) tells the server what kind of action the client wants.
   –> მოთხოვნის მეთოდი სერვერს ეუბნება რა გვინდა: GET — წამოღება, POST — დამატება, DELETE — წაშლა.

7. **JSON** — JSON is a text format for exchanging structured data between a client and a server.
   –> JSON არის ტექსტური ფორმატი მონაცემების გასაცვლელად. localStorage-ში ობიექტებს JSON.stringify-ით ვწერთ და JSON.parse-ით ვკითხულობთ.

8. **State** — State is the data an application currently holds in memory that drives what the UI shows.
   –> state არის აპლიკაციის მიმდინარე მონაცემები მეხსიერებაში — ჩვენთან clientsState მასივი; ყოველი ცვლილება გადის ციკლს: state იცვლება → ინახება → ეკრანი თავიდან იხატება.

9. **Event listener** — An event listener is a function that runs when a specific event (click, submit, input) happens on an element.
   –> ივენთ-ლისენერი არის ფუნქცია, რომელიც ელემენტზე მოვლენის დადგომისას ეშვება — მაგ: ფორმის submit-ზე ვალიდაცია, ძებნის ველის input-ზე სიის გაფილტვრა.

10. **Deployment** — Deployment is publishing an application so it is accessible on the internet.
    –> დეპლოიმენტი ნიშნავს აპლიკაციის ინტერნეტში გამოქვეყნებას, რომ იყოს ხელმისაწვდომი ყველასთვის. მაგ.: Vercel-ზე ან Netlify-ზე ატვირთვას.
