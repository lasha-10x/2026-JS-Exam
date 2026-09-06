# Research Note

**Source:** MDN Web Docs — "Using the Fetch API"
**Link:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
**Keywords:** fetch, Promise, async/await, Response, JSON

## Summary (Georgian)

ეს გვერდი განმარტავს, თუ როგორ მუშაობს Fetch API ბრაუზერში - ის აბრუნებს Promise-ს,
რომელიც საბოლოოდ Response ობიექტად იქცევა. Response ობიექტს აქვს `.json()` მეთოდი,
რომელიც ტექსტურ პასუხს JavaScript-ის ობიექტად გარდაქმნის - ზუსტად ეს ვიხმარე
`data.js`-ში, DummyJSON-იდან იუზერების წამოსაღებად. ასევე მნიშვნელოვანია, რომ fetch ავტომატურად არ ისვრის შეცდომას HTTP სტატუსების შემთხვევაში (მაგ. 404) - ის მხოლოდ ქსელური შეცდომისას (მაგ. ინტერნეტის გათიშვის დროს) გადადის catch ბლოკში. სწორედ ეს ხსნის იმას, თუ რატომ გამოვიყენე try/catch clients.js-ში loading-ისა და DELETE მოთხოვნისას. async/await სინტაქსი კი, უბრალოდ, Promise-ების წასაკითხად უფრო სუფთა გზაა, ვიდრე .then() ჯაჭვების წერა.
