# Research Note

**Source:** MDN Web Docs — "Using the Fetch API"
**Link:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

**Search keywords used:** `fetch api async await error handling MDN`

## Summary (in Georgian)

MDN-ის ეს გვერდი განმარტავს, თუ როგორ ვგზავნით ქსელურ მოთხოვნებს ბრაუზერიდან fetch()-ის დახმარებით, async/await სინტაქსით. მთავარი აღმოჩენა ჩემთვის იყო ის, რომ fetch() ავტომატურად არ agdeba შეცდომად, თუ სერვერი აბრუნებს 404-ის ან 500-ის მსგავს სტატუსს — ეს მხოლოდ ქსელური კავშირის ჩავარდნისას xdeba (მაგ. ინტერნეტის გათიშვისას). ამიტომ საჭიროა ცალკე response.ok-ის შემოწმება, რომ სერვერის შეცდომაც სწორად დავიჭიროთ try/catch-ში. ეს ზუსტად ის ლოგიკაა, რაც clients.js-ში დამჭირდა API-დან კლიენტების ჩატვირთვისას (loading/error მდგომარეობებისთვის) და POST/DELETE მოთხოვნების დროს.
