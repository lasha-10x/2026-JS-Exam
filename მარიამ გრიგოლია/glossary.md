## Glossary 10x - CRM

### 1. Authentication

The process of verifying who a user is, usually with an email and password.
ეს არის მომხმარებლის ვინაობის დადასტურება, როდესაც "ლოგინის" დროს მოწმდება კონკრეტული მომხმარებლის იმეილი და პაროლი. (მოცემულ აპლიკაციაში crm_users-ში)

### 2. Session

Data that remembers that a user is logged in, so they don't log in on every page.
სესია ინახავს ინფორმაციას თითოეულ შესულ მომხმარებელზე, ამ შემთხვევაში crm_session-ში.

### 3. Validation

Checking that the user input follows the rules before acceptance of it.
ვალიდაციის დროს, მოწმდება მომხმარებლის მიერ შეყვანილი მონაცემები, გარკვეული წესების მიხედვით. მოცემულ პროექტში ვამოწმებთ სახელს, ელფოსტასა და პაროლს, submit-ზე კი ყველა შეცდომას ერთდროულად ვაჩვენებთ მომხმარებელს.

### 4. Fetch

A browser's function that sends a request to a server and return Promise with rhe response.
fetch() - ი არის ბრაუზერის ჩაშენებული ფუნქცია, რომელიც სერვეს უგზავნის მოთხოვნას და აბრუნებს Promise-ს. პროექტში, data.js-ში fetch-ით ვიღებთ 30 კლიენტს ყალბი:) DummyJSON-დან `async/await`-ის დახმარებით.

### 5. Endpoint

A specific URL on a server that respods to a request.
endpoint-ი არის კონკრეტული URL სერვერზე, რომელიც პასუხობს მოთხოვნას. პროექტში ეს endpoint-ია https://dummyjson.com/users, საიდანაც ვტვირთავ კლიენტების საწყის ბაზას.

### 6. Request method

This is the type of action a request performs, GET reads, POST creates, DELETE removes.
ის განსაზღვრავს მოქმედების ტიპს, GET - კითხულობს, POST - ქმნის და DELETE - შლის.
clients გვერდზე სამივეს ვიყენებთ: GET (ჩატვირთვა), POST (დამატება), DELETE (წაშლა).

### 7. JSON

A text format for storing and transferring data as key-value pairs.
JSON არის ტექსტური ფორმატი მონაცემების შესანახად. localStorage მხოლოდ ტექსტს ინახავს, ამიტომ storage.js-ში JSON.stringify-ით ვწერთ და JSON.parse-ით ვკითხულობთ ობიექტებს.

### 8. State

The current data that app holds in memory, which the UI is drawn from.
state არის აპლიკაციის მიმდინარე მონაცემები მეხსიერებაში. პროექტში მთავარი state არის
clients მასივი, ის იცვლება, ინახება localStorage-ში და ეკრანი თავიდან იხატება (ოქროს ციკლი).

### 9. Event listener

Code that waits for a user action (click, input, submit, change...) and runs a function in response.
event listener ელოდება მომხმარებლის მოქმედებას (click, input, submit, change...) და ასრულებს ფუნქციას(handle funciton).

### 10. Deployment

Publishing the app to a live server so anyone can open it with a URL.
deployment არის აპლიკაციის გამოქვეყნება ცოცხალ სერვერზე, რომ ნებისმიერმა შეძლოს URL-ით გახსნა.


