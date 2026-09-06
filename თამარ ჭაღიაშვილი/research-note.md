# Research Note

**Source:** MDN Web Docs — "Using the Fetch API"
**Link:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

**Search keywords used:** `fetch api async await error handling response.ok mdn`

**Summary (Georgian):**

MDN-ის ეს გვერდი განმარტავს, თუ როგორ მუშაობს Fetch API ბრაუზერში ქსელური მოთხოვნების გასაგზავნად. მთავარი პუნქტი, რაც პროექტში გამოვიყენე: `fetch()` თავისით არ agდება შეცდომად, თუნდაც სერვერმა 404 ან 500 დააბრუნოს — ეს მხოლოდ ქსელური დონის შეცდომებზე (მაგ: კავშირის გაწყვეტა) მუშაობს. ამიტომ საჭიროა ცალკე შემოწმდეს `response.ok`, რომ HTTP-სტატუსის შეცდომებიც დავიჭიროთ. დოკუმენტი ასევე ურჩევს `try/catch`-ის გამოყენებას `async/await`-თან ერთად, რომ ორივე ტიპის შეცდომა (ქსელური და HTTP) ერთნაირად დამუშავდეს. ეს ზუსტად ის ლოგიკაა, რაც P4.2-ის (loading/error handling) და `data.js`-ის იმპლემენტაციაში გამოვიყენე — `fetch` → `response.ok` შემოწმება → `throw` შეცდომაზე → `try/catch` გამოძახების მხარეს.
