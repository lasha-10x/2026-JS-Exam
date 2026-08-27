# Research Note — 10X CRM

**წყარო:** Using the Fetch API — MDN Web Docs
**ბმული:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

**საძიებო სიტყვები, რომლითაც მოვძებნე:** `fetch async await javascript`, `fetch API error handling response.ok`

---

## რეზიუმე

Fetch API არის ბრაუზერის ჩაშენებული ინტერფეისი, რომლითაც JavaScript-იდან ვგზავნით HTTP მოთხოვნებს სერვერზე და ვამუშავებთ პასუხს — ჩვენს პროექტში ეს არის ის მექანიზმი, რომლითაც `clients.js` ურთიერთობს DummyJSON API-სთან (GET კლიენტების ჩასატვირთად, POST ახლის დასამატებლად, DELETE წასაშლელად). წყარომ განსაკუთრებით გამომადგა ერთი დეტალის გასაგებად: `fetch()`-ის დაბრუნებული Promise **არ** "იჭერს" (reject) HTTP შეცდომის სტატუსებზე (მაგ. 404, 500) — ის მხოლოდ ქსელური მარცხის შემთხვევაში (მაგ. ინტერნეტის გათიშვა) იჭერს შეცდომას. ეს აუხსნა, რატომ არ ვამოწმებთ ჩვენს `Delete`-ის ლოგიკაში `response.ok`-ს ცალკე `try/catch`-ით — DummyJSON-ის 404 პასუხი ჩვენი კოდისთვის "წარმატებული" fetch-ია, თუნდაც სერვერმა თქვას "ეს რესურსი ვერ ვიპოვე". წყარო ასევე განმარტავს, რომ `fetch()`-ის მეორე არგუმენტი (`{method, headers, body}`) არის ის ადგილი, სადაც ვაზუსტებთ request-ის ტიპსა და ფორმატს — ჩვენ ეს ვნახეთ პრაქტიკაში, `POST /users/add`-ის `headers: {'Content-Type': 'application/json'}` და `body: JSON.stringify(...)` კონფიგურაციაში. ბოლოს, წყარო ხსნის, რომ `response.json()` **თავად** ასინქრონული ოპერაციაა (არა უბრალო property წაკითხვა) — ეს არის ზუსტად ის მიზეზი, რატომაც ჩვენს კოდში `await response.json()` გვჭირდება ცალკე ხაზზე, `await fetch(...)`-ის შემდეგ.
