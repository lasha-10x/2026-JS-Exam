# Research Note

**Source:** MDN Web Docs — "Using the Fetch API"
**Link:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

**Search keywords used:** `fetch api error handling`, `fetch response.ok 404`, `javascript fetch not rejecting on http error`

## Summary (in Georgian)

`data.js`-ში `fetch()`-ის გამოყენებისას გამიჩნდა კითხვა: რატომ არ ჩავარდება ჩემი `try/catch` ავტომატურად, როცა სერვერი 404-ს აბრუნებს? საძიებო სიტყვებით მივედი MDN-ის "Using the Fetch API" გვერდამდე, სადაც ავხსენი ორი ცალკეული სცენარის განსხვავება: `fetch()`-ის დაბრუნებული Promise მხოლოდ მაშინ "იჭერს" შეცდომას (`reject`), როცა მოთხოვნა საერთოდ ვერ სრულდება — მაგალითად, ინტერნეტი გაწყდა, ან URL არასწორია. თუმცა, თუ სერვერი საერთოდ უპასუხა — თუნდაც 404 ან 500 სტატუსით — Promise მაინც წარმატებით სრულდება (`resolve`), უბრალოდ პასუხის `response.ok`-ი იქნება `false`. ეს ნიშნავს, რომ HTTP-შეცდომების დასაჭერად ხელით უნდა შევამოწმო `response.ok`, და საჭიროების შემთხვევაში თვითონ "ვისროლო" (`throw`) შეცდომა — ავტომატურად ეს არ ხდება. სწორედ ეს გავითვალისწინე `data.js`-ში: `fetchClientsFromAPI()`-ში ხელით ვამოწმებ `response.ok`-ს და ვისვრი შეცდომას, თუ ის `false`-ია, მაშინ როცა `deleteClientFromAPI()`-ში განზრახ ამას არ ვაკეთებ (რადგან იქ 404 მოსალოდნელი და მისაღებია). ამ განსხვავების გაცნობიერებამ პირდაპირ ახსნა, რატომ იქცევა ჩემი Delete ლოგიკა ისე, როგორც იქცევა.
