# Research Note — MDN Web Docs & DummyJSON API

* **Documentation Source**: [MDN Web Docs — Storage API (Window.localStorage)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) & [DummyJSON Users API Documentation](https://dummyjson.com/docs/users)
* **Keywords Used**: `MDN Window.localStorage`, `JSON.stringify vs JSON.parse`, `DummyJSON fetch users REST API limit offset`, `JS Event Delegation closest dataset`.

---

## რეზიუმე (ქართულად)

1. MDN Web Docs-ის ოფიციალურ დოკუმენტაციაში დეტალურად არის განმარტებული `Window.localStorage` საცავის მუშაობის პრინციპი, რომელიც მონაცემებს ინახავს ბრაუზერის მეხსიერებაში ტექსტურ ფორმატში `key-value` პრინციპით.
2. რადგან `localStorage`-ს მხოლოდ ტექსტის დამახსოვრება შეუძლია, რთული სტრუქტურის ჯავასკრიპტის ობიექტებისა და მასივების შესანახად აუცილებელია `JSON.stringify()` მეთოდის გამოყენება, ხოლო წაკითხვისას `JSON.parse()` მეთოდით მონაცემის უკან ობიექტად გარდაქმნა.
3. DummyJSON API-ს დოკუმენტაცია აღწერს REST API ენდპოინტებს (`/users?limit=30`, `/users/add`, `/users/{id}`), რომლებიც იდეალურია სატესტო CRM პროექტებისთვის, რადგან არ საჭიროებს API გასაღებს და აბრუნებს რეალისტურ მომხმარებელთა მონაცემებს (სახელი, ელფოსტა, ტელეფონი, კომპანია, ავატარი).
4. სერვერი `POST` და `DELETE` მოთხოვნებს პასუხობს წარმატების სტატუსით და იმიტირებულ პასუხს აბრუნებს, რაც საშუალებას გვძლევს ფრონტენდში დავწეროთ სრული ასინქრონული `fetch` + `async/await` ლოგიკა, ხოლო რეალური მონაცემები `localStorage`-ში შევინახოთ.
5. კვლევის შედეგად პროექტში წარმატებით დაინერგა მოვლენების დელეგირება (`Event Delegation`) და `dataset.id` ატრიბუტების წაკითხვა `closest()` მეთოდით, რამაც საგრძნობლად გააუმჯობესა კოდის წარმადობა და სუფთა სტრუქტურა.
