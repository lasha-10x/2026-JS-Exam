------Local Storage - a web browser feature that lets websites store data on a user's device. ეს არის ბრაუზერის პატარა საწყობი, რომელშიც ინახება დაახლოებით 5-10 მეგაბაიტის მოცულობის ინფორმაცია, მაგალითად: იუზერის სასურველი ფონის თემა, იუზერის მოთხოვნა - stay logged in, იუზერის პრეფერენციები.
მიღებელია Local Storage-ში მნიშვნელოვანი ინფორმაციის შენახვა, რომელიც რეალურ პროექტებში უნდა ინახებოდეს სერვერზე (როგორიცაა იუზერის პაროლები).


---

-----------GET/POST/DELETE Methods - HTTP methods used in communicatiion with an API. GET მეთოდი - სერვერი აგზავნის ინფორმაციას, რომელიც ბრაუზერში მოდის JSON მასივის ფორმით, პასუხისმგებელია მხოლოდ ინფორმაციის მიღებასა და წაკითხვაზე, მონაცემებში არ იცვლება არაფერი. POST მეთოდი - ინახავს, ქმნის, ამატებს სერვერხე ახალ ინფორმაციას. DELETE მეთოდი - შლის სერვერიდან ინფორმაციას.

-----------JSON.stringify(), JSON.parse() in action - First one converts a JavaScript object into JSON text before sending it, Second one converts received JSON text back into a JavaScript object.

--------------crm_user vs crm_client - Now they are Local Storage keys. If I transformed project into real one and used server-side services too they would become database tables. While front-end don't cooperate to the database directly, there would be mediators - API endpoint: POST /api/users, POST /api/clients.

----------crm_session - Stores information about the currently logged-in user.

--------Auth Guard - Authentication checks the identity of a user, guard checks whether a user can access something.

--------Hashing Passwords - the process of converting a user's password into a fixed-length, unreadable string before storing it. მომხმარებლის პაროლი: mypassword123 => ჰეშირების ცალმხრივი პროცესი => სერვერზე ბაზაში შენახული პაროლი: $2b$12$k7F8s9dKxP.....

-------Modal - A UI element (a window or box) that appears on the current page content and requires the user to interact with it before continuing.

---------Sort Selector Chips - small, compact elements that represent information, a choice, or an action.

------Toast - a small temporary notification message that appears on the screen to inform the user about something and then disappears automatically.
