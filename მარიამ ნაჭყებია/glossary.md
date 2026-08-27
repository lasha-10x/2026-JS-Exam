# Glossary

authentication- this is the process of verifying the identity of a user trying to access the system by checking their infos.
ეს არის პროცესი, როდესაც მომხმარებლის შეყვანილ მონაცემებს ამოწმებს სისტემა, მაგალითად პაროლის და მეილის ვალიდურობას

session- maintains user login state across different pages and requests by storing identification data in browser storage.
სესიის მეშვეობით სისტემა იმახსოვრებს მომხმარებლის ინფორმაციას და საშუალებას აძლევს, რომ ყოველი გვერდის ცვლილებაზე ცალ-ცალკე არ მოუწიოს მონაცემების შეყვანა

validation-  ensures that user inputs meet specific requirements, such as minimum length or correct format, before they are processed or saved.
ვალიდაცია ამოწმებს მონაცემებს რამდენად სწორად არის ჩაწერილი, არსებობს თუ არა მეილი, პაროლი ემთხვევა თუ არა.

fetch- is used to make asynchronous HTTP requests to retrieve or send data from a server or external API.
fetch არის მექანიზმი, რომლითაც გვერდი უკავშირდება სერვერს იმისთვის რომ აიღოს დაამატოს ან წაშალოს მომხმარებლის მონაცემები.

endpoint- is a specific URL where an API can access the resources or services requested by the application.
endpoint არის url მისამართი, რომლითაც ერთი საიტი უკავშირდება მეორეს და იღებს მონაცემებს მოთხოვნის შესაბამისად

request method- A request method defines the type of operation to be performed
get, post, delete- მეთოდებია, რომლის საშუალებითაც შეგვიძლია მონაცემი დავამატოთ, წავშალოთ, ან მოვითხოვოთ სერვერიდან

JSON- simple text format used to store and send data
json არის ტექსტური ფორმატი, რომლითაც მონაცემები სერვერსა და ჯავასკრიპტს შორის გადაიცემა, გამოიყენება json.parse თუ გვინდა რომ მონაცემები (სტრინგები) გადავიყვანოთ ობჯექთ სტრუქტურაში და json.stringify პირიქით.

async-await- are JavaScript keywords used to write asynchronous code that looks and behaves like synchronous code
ეს არის ასინქრონული ფუნქცია, რომელიც ჯერ ელოდება პასუხს სხვა ლიანებიდან და შემდეგ ასრულებს ფუნქციას.

event listener- is a method that waits for a specific user action, such as a click or form submission, and triggers a function in response.
event-listener უყურებს მომხმარებლის ქცევას საიტზე, მაგალითად დააკლიკა თუ არა რაიმე ღილაკს და ამის შემდეგ მოქმედებს.

deployment- is the process of publishing a web application to a live server so it becomes accessible to users on the internet.
deployment არის ლოკალური ვებ საიტის საჯაროზე გადაყვანა, ჩემს შემთხვევაში vercel-ზე ატვირთვა