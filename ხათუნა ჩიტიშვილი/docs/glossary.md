# Glossary of Technical Terms

**1. Authentication**
- **English:** The process of verifying the identity of a user or system before granting access to protected resources.
- **ქართული:** ეს არის ავტორიზაციის (იდენტიფიკაციის) პროცესი, სადაც ამოწმებ მომხმარებლის ვინაობას (მაგალითად, ემთხვევა თუ არა მეილი და პაროლი ბაზაში არსებულს), სანამ მას საიტის დახურულ ნაწილში შეუშვებ.

**2. Session**
- **English:** A temporary state of continuous information exchange between a user and a system, usually created after a successful login.
- **ქართული:** დროებითი "სესია", რომელიც იქმნება მომხმარებლის ლოგინის შემდეგ, რათა საიტმა დაიმახსოვროს ვინ არის შემოსული სხვადასხვა გვერდებზე გადასვლისას. ჩვენს პროექტში ამ მიზნით ვიყენებთ `localStorage`-ს (ვინახავთ ლოგირებული მომხმარებლის მეილს).

**3. Validation**
- **English:** The process of checking user input data against predefined rules to ensure its accuracy, security, and integrity before processing.
- **ქართული:** მონაცემების შემოწმების პროცესი. მაგალითად, როცა ვამოწმებთ შეიცავს თუ არა პაროლი მინიმუმ 8 სიმბოლოს, ან არის თუ არა იმეილში მხოლოდ ლათინური ასოები, რათა სისტემაში არასწორი ან სახიფათო ინფორმაცია არ მოხვდეს.

**4. Fetch**
- **English:** A modern built-in JavaScript API used to make network requests to retrieve or send data to a server asynchronously.
- **ქართული:** ჯავასკრიპტის ბრძანება, რომლითაც ჩვენი საიტი (Frontend) უკავშირდება სერვერს (Backend) ან გარე წყაროს მონაცემების წამოსაღებად, გვერდის დარესტარტების (Refesh-ის) გარეშე.

**5. Endpoint**
- **English:** A specific URL or URL pattern provided by an API where a client software program can request or submit data.
- **ქართული:** ზუსტი მისამართი (URL ლინკი) ინტერნეტში, სადაც ჩვენი საიტი აკითხავს სერვერს ინფორმაციისთვის. მაგალითად ჩვენს პროექტში ენდფოინთი იყო `https://dummyjson.com/users`.

**6. Request Method**
- **English:** An HTTP verb (such as GET, POST, PUT, DELETE) that indicates the desired action to be performed on a given server resource.
- **ქართული:** მოთხოვნის ტიპი. ის ეუბნება სერვერს, თუ რისი გაკეთება გვინდა მონაცემებზე: წამოღება გვირჩევნია (GET), ახლის დამატება (POST), არსებულის განახლება (PUT) თუ წაშლა (DELETE).

**7. JSON (JavaScript Object Notation)**
- **English:** A lightweight, text-based data interchange format that is easy for humans to read and for machines to parse and generate.
- **ქართული:** ტექსტური ფორმატი, რომელიც მსოფლიო სტანდარტად იქცა ბრაუზერსა და სერვერს შორის ინფორმაციის გასაცვლელად. ის სტრუქტურით ძალიან ჰგავს ჩვეულებრივ ჯავასკრიპტის ობიექტს.

**8. State**
- **English:** The comprehensive condition or current values of variables and data stored within a running application at any given time.
- **ქართული:** აპლიკაციის "მდგომარეობა" მოცემულ მომენტში. მაგალითად, რა მონაცემებია ამჟამად შენახული მეხსიერებაში, არის თუ არა მომხმარებელი სისტემაში შესული, ან ღიაა თუ არა კლიენტის დამატების მოდალი. 

**9. Event Listener**
- **English:** A built-in function in JavaScript that waits for an event to occur, like a mouse click or keypress, and executes specific logic in response.
- **ქართული:** ჯავასკრიპტის ფუნქცია, რომელიც მუდმივად "უსმენს" მომხმარებლის ქმედებებს ეკრანზე (მაგალითად, ღილაკზე დაკლიკებას, ტექსტის აკრეფას ან მაუსის გადატარებას) და საპასუხოდ რთავს რაიმე კონკრეტულ ლოგიკას.

**10. Deployment**
- **English:** The final phase of software development where the application is pushed to a live server or hosting platform, making it accessible to external users.
- **ქართული:** პროექტის გაშვების პროცესი. ანუ როცა ვებ-გვერდი ჩვენი კომპიუტერიდან (ლოკალური სერვერიდან) გადადის ინტერნეტში (მაგ. GitHub Pages-ზე, Vercel-ზე ან Netlify-ზე), სადაც ნებისმიერ ადამიანს მსოფლიოდან შეუძლია მისი ნახვა ლინკით.

**11. LocalStorage**
- **English:** A web storage API that allows JavaScript sites and apps to store key-value pairs in a web browser with no expiration date.
- **ქართული:** ბრაუზერის ჩაშენებული მეხსიერება, რომელიც გვაძლევს საშუალებას შევინახოთ მონაცემები სამუდამოდ, ისე რომ გვერდის დარეფრეშების ან ბრაუზერის დახურვის შემდეგაც არ წაიშალოს (სანამ პირდაპირ არ წავშლით).

**12. DOM (Document Object Model)**
- **English:** A programming interface for web documents that represents the page so that programs can change the document structure, style, and content.
- **ქართული:** ეს არის HTML-ის "ცოცხალი" ხისებრი სტრუქტურა, რომელსაც ბრაუზერი ქმნის. ჯავასკრიპტის დახმარებით ჩვენ შეგვიძლია DOM-ში ჩარევა (ახალი ელემენტების დამატება, დიზაინის შეცვლა), რითაც საიტი დინამიური ხდება.

**13. DRY Principle (Don't Repeat Yourself)**
- **English:** A software development principle aimed at reducing repetition of software patterns, replacing them with shared functions or data normalization.
- **ქართული:** პროგრამირების ოქროს წესი, რომელიც გვეუბნება, რომ ერთი და იგივე კოდი არ უნდა დავწეროთ რამდენჯერმე. მის ნაცვლად, კოდი უნდა გავიტანოთ ერთ საერთო ფუნქციაში (მაგ. `validation.js`-ში) და გამოვიყენოთ ყველგან.

**14. Asynchronous JavaScript (Async/Await)**
- **English:** A programming paradigm that allows tasks (like fetching data) to run in the background without blocking the execution of the main thread.
- **ქართული:** ასინქრონული პროგრამირება უზრუნველყოფს იმას, რომ როცა მაგალითად სერვერიდან ინფორმაცია მოგვაქვს (`fetch`), საიტმა არ გაჭედოს და სხვა ფუნქციებმა (მაგ. ღილაკებზე დაჭერამ) ჩვეულებრივად გააგრძელონ მუშაობა მონაცემების ჩატვირთვის პარალელურად.

**15. Adapter Pattern (Data Mapping)**
- **English:** A structural design pattern that allows objects with incompatible interfaces to collaborate by converting incoming data into an interface expected by the application.
- **ქართული:** დიზაინ-პატერნი (მიდგომა), რომელსაც ვიყენებთ მაშინ, როცა გარე სერვერიდან მოსული ინფორმაცია (მაგ. DummyJSON) სხვა სტრუქტურისაა და პირდაპირ არ ერგება ჩვენს CRM-ს. ამიტომ ვწერთ კოდს (ადაპტერს), რომელიც მოსულ მონაცემებს სასურველ ფორმატში გარდაქმნის.
