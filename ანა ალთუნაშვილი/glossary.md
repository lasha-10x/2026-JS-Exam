# Glossary — 10X CRM

Ten technical terms used throughout this project, each with a short English definition and my own explanation in Georgian.

---

**1. Authentication**
Authentication is the process of verifying that a user is who they claim to be, usually by checking a submitted password against a stored one.
*ავთენტიფიკაცია არის პროცესი, როცა სისტემა ამოწმებს, მართლა ხარ თუ არა ის, ვინც ამბობ რომ ხარ — ამ პროექტში ეს ხდება Login ფორმაზე, email-ისა და პაროლის შედარებით `crm_users`-ში შენახულთან.*

**2. Session**
A session is a small record that marks a user as "currently logged in," typically stored until the user logs out or it expires.
*სესია არის პატარა ჩანაწერი, რომელიც აღნიშნავს, რომ მომხმარებელი ამჟამად შესულია სისტემაში — ჩვენთან ის `crm_session`-ის სახით ინახება localStorage-ში და იშლება მხოლოდ Logout-ზე.*

**3. localStorage**
localStorage is a browser feature that lets a website store text data on the user's device, persisting even after the browser is closed and reopened.
*localStorage არის ბრაუზერის ჩაშენებული საცავი, სადაც საიტს შეუძლია ტექსტური მონაცემების შენახვა უშუალოდ მომხმარებლის მოწყობილობაზე — ბრაუზერის დახურვის შემდეგაც კი არ იშლება, სანამ მომხმარებელი თავად არ გაასუფთავებს.*

**4. API endpoint**
An endpoint is a specific URL that a server exposes for a client application to request or send data to — e.g. `GET /users` versus `DELETE /users/{id}`.
*Endpoint არის კონკრეტული URL მისამართი, რომელსაც სერვერი „ხსნის" კლიენტისთვის მონაცემების მოსათხოვად ან გასაგზავნად — ამ პროექტში ვიყენებთ სხვადასხვა endpoint-ს კლიენტების წასაკითხად, დასამატებლად და წასაშლელად.*

**5. Fetch (Fetch API)**
`fetch()` is a built-in browser function for making HTTP requests to a server and receiving a response, returning a Promise that resolves once the response arrives.
*`fetch()` არის ბრაუზერის ჩაშენებული ფუნქცია, რომლითაც ჯავასკრიპტიდან ვგზავნით მოთხოვნას სერვერზე და ველოდებით პასუხს — ის Promise-ს აბრუნებს, რომელიც სრულდება, როცა პასუხი მოვა.*

**6. JSON**
JSON (JavaScript Object Notation) is a lightweight text format for representing structured data, used by most web APIs to send and receive information.
*JSON არის მონაცემების ჩაწერის მარტივი ტექსტური ფორმატი (obiექტები და მასივები), რომელსაც თითქმის ყველა API იყენებს ინფორმაციის გასაცვლელად — `localStorage`-შიც ჩვენი მონაცემები სწორედ JSON-ის სახით ინახება (`JSON.stringify`/`JSON.parse`-ით).*

**7. Async/await**
`async`/`await` is JavaScript syntax for writing code that waits for a Promise (like a `fetch()` call) to finish before moving to the next line, without blocking the rest of the page.
*`async`/`await` არის სინტაქსი, რომელიც საშუალებას გვაძლევს დაველოდოთ ისეთი ოპერაციის დასრულებას, როგორიც არის `fetch()`, ისე რომ კოდი წაიკითხოს „ზემოდან ქვემოთ" თანმიმდევრულად, თუმცა გვერდის დანარჩენი ნაწილი ამ დროს არ იბლოკება.*

**8. State**
State is the current data a page or app is working with at any given moment — in this project, the `clients` array in memory is the state, and it's kept in sync with `localStorage`.
*State არის მონაცემები, რომლებთანაც აპლიკაცია ამ კონკრეტულ მომენტში „მუშაობს" — ჩვენთან, მაგალითად, `clients` მასივი მეხსიერებაში სწორედ ეს state-ია, რომელიც ყოველ ცვლილებაზე უნდა შეთანხმდეს localStorage-ში შენახულთან.*

**9. Event delegation**
Event delegation is attaching a single event listener to a parent element instead of one listener per child, so it keeps working even when children are added or removed dynamically.
*Event delegation ნიშნავს, რომ ერთ listener-ს ვდებთ მშობელ ელემენტზე, ცალკეული შვილების მაგივრად — ეს საჭიროა, რადგან კლიენტების ბარათები ყოველ რენდერზე თავიდან იქმნება, და ცალკეული listener-ები „ძველ", უკვე წაშლილ ელემენტებზე დარჩებოდა.*

**10. Deployment**
Deployment is the process of publishing a project to a public server so it's reachable at a real URL, instead of only running on the developer's own machine.
*Deployment არის პროექტის საჯარო სერვერზე გამოქვეყნება, რომ ის ხელმისაწვდომი გახდეს რეალურ ინტერნეტ-მისამართზე — ჩემი შემთხვევაში, ეს ხდება Vercel/Netlify-ზე ატვირთვით.*
