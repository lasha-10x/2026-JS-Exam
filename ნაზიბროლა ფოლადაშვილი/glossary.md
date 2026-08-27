1. Asynchronous Programming

English:
Asynchronous Programming is a programming approach that allows tasks to run without blocking the execution of the rest of the program. In JavaScript, it is commonly implemented using Promises, async/await, and the Fetch API.

Used in my project:
I used asynchronous programming to load client data from the API using fetch(), async/await, and Promise.

ქართული:
Asynchronous Programming არის პროგრამირების მიდგომა, რომელიც საშუალებას იძლევა ოპერაციები შესრულდეს ისე, რომ პროგრამის დანარჩენი ნაწილი არ გაჩერდეს.

სად გამოვიყენე პროექტში:
კლიენტების მონაცემების API-დან ჩასატვირთად fetch(), async/await და Promise-ის გამოყენებისას.

2. Callback

English:
A callback is a function that is passed as an argument to another function and is executed later.

Used in my project:
I used callback functions with event listeners and array methods such as filter(), find(), sort(), and forEach().

ქართული:
Callback არის ფუნქცია, რომელიც სხვა ფუნქციას არგუმენტად გადაეცემა და საჭირო დროს სრულდება.

სად გამოვიყენე პროექტში:
addEventListener()-ში და მასივის მეთოდებში (filter(), find(), sort(), forEach()).

3. Closure

English:
A closure is a JavaScript feature where an inner function remembers variables from its outer function even after the outer function has finished executing.

Used in my project:
Closures are created automatically in JavaScript when callback functions access variables from their outer scope.

ქართული:
Closure არის JavaScript-ის შესაძლებლობა, რომლის დროსაც შიდა ფუნქცია იმახსოვრებს გარე ფუნქციის ცვლადებს მისი დასრულების შემდეგაც.

სად გამოვიყენე პროექტში:
Callback ფუნქციებში, რომლებიც გარე ფუნქციის ცვლადებზე წვდომას ინარჩუნებენ.
შენიშვნა: Closure სპეციალურად არ დაგიწერია, მაგრამ JavaScript-ში callback-ების გამოყენებისას ავტომატურად იქმნება.

4. CRUD

English: 
CRUD stands for Create, Read, Update, and Delete, which are the main operations used to manage client data in the application.

Used in my project:  
Create – Add Client
Read – Display Client List
Update – Change Client Status and Notes
Delete – Remove Client

ქართული: 
CRUD ნიშნავს მონაცემებზე ოთხ ძირითად მოქმედებას: შექმნას, წაკითხვას, განახლებას და წაშლას.

სად გამოვიყენე პროექტში:
კლიენტის დამატების, კლიენტების სიის ჩვენების, სტატუსისა და ჩანაწერების განახლებისა და კლიენტის წაშლის დროს.

5. Error Handling

English:
Error handling is the process of detecting and managing errors so a program can continue running safely.

Used in my project:
I used error handling to validate forms, display validation messages, and handle failed API requests.

ქართული:
Error Handling არის შეცდომების აღმოჩენისა და დამუშავების პროცესი, რათა პროგრამამ სწორად გააგრძელოს მუშაობა.

სად გამოვიყენე პროექტში:
ფორმების ვალიდაციაში, შეცდომის შეტყობინებების ჩვენებასა და API-ის შეცდომების დამუშავებისას.

6. Event Bubbling

English:
Event Bubbling is the process where an event starts from the target element and propagates upward through its parent elements in the DOM.

Used in my project:
I used event.stopPropagation() to prevent click events from bubbling to parent elements.

ქართული:
Event Bubbling არის პროცესი, რომლის დროსაც მოვლენა (მაგალითად click) ჯერ სამიზნე ელემენტზე ხდება, შემდეგ კი მშობელ ელემენტებზე ვრცელდება.

სად გამოვიყენე პროექტში:
event.stopPropagation()-ის გამოყენებისას, რათა parent ელემენტზე click არ გავრცელებულიყო.

7. Higher-Order Function (HOF)

English:
A Higher-Order Function is a function that takes another function as an argument, returns a function, or both.

Used in my project:
I used higher-order functions such as filter(), find(), sort(), map(), reduce(), and forEach().

ქართული:
Higher-Order Function (HOF) არის ფუნქცია, რომელიც სხვა ფუნქციას იღებს არგუმენტად, აბრუნებს ფუნქციას ან ორივეს აკეთებს.

სად გამოვიყენე პროექტში:
კლიენტების ფილტრაციის, ძებნის, დალაგების, სტატისტიკის გამოთვლისა და სიის რენდერის დროს.

8. Parsing

English:
Parsing is the process of analyzing code or data and converting it into a format that a computer can understand and process.

Used in my project:
I used parsing when converting API responses with response.json() and when working with JSON.parse().

ქართული:
Parsing არის კოდის ან მონაცემების ანალიზისა და დამუშავების პროცესი, რომლის შედეგადაც ისინი კომპიუტერისთვის გასაგებ ფორმატში გადაიქცევა.

სად გამოვიყენე პროექტში:
response.json()-ისა და JSON.parse()-ის გამოყენებისას.

9. Promise

English:
A Promise is an object that represents the eventual completion or failure of an asynchronous operation.

Used in my project:
I used Promises together with the Fetch API and async/await while loading client data.

ქართული:
Promise არის ობიექტი, რომელიც წარმოადგენს ასინქრონული ოპერაციის მომავალ შედეგს — წარმატებას ან შეცდომას.

სად გამოვიყენე პროექტში:
fetch()-ისა და async/await-ის გამოყენებისას API-დან მონაცემების მიღების დროს.

10. Spread Operator

English:
The Spread Operator (...) is a JavaScript syntax that expands the elements of an array or the properties of an object when creating a new array or object.

Used in my project:
I used the spread operator to create copies of arrays without modifying the original data, for example:
const visibleClients = [...clientsState];

ქართული:
Spread Operator (...) გამოიყენება მასივის ან ობიექტის ელემენტების გასაშლელად და მათი კოპიის შესაქმნელად.

სად გამოვიყენე პროექტში:
მასივის კოპიის შესაქმნელად ისე, რომ საწყისი მონაცემები არ შეცვლილიყო, მაგალითად:
const visibleClients = [...clientsState];