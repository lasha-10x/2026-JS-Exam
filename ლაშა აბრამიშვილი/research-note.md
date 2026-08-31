# Research Note: Using the Fetch API

## Source

[MDN Web Docs — Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

## Key Terms

- `fetch()`
- `Promise`
- `Response`
- `response.ok`
- `async` / `await`
- `try...catch`

## ქართული რეზიუმე

MDN-ის მასალიდან გავიგე, რომ `fetch()` აგზავნის HTTP მოთხოვნას და აბრუნებს Promise-ს, რომლის შედეგიც `Response` ობიექტია. `async` და `await` ასინქრონულ ნაბიჯებს თანმიმდევრულად და უფრო გასაგებად გვაწერინებს. HTTP შეცდომა, მაგალითად 404 ან 500, ყოველთვის ავტომატურად არ უარყოფს Promise-ს, ამიტომ საჭიროა `response.ok`-ის ხელით შემოწმება. წარმატებული პასუხის JSON მონაცემებად წასაკითხად გამოიყენება `response.json()`, რომელიც ასევე ასინქრონულია. `try...catch` ქსელის, არასწორი პასუხის ან JSON-ის დამუშავების შეცდომას იჭერს და აპლიკაციას კონტროლირებადი error state-ის ჩვენების საშუალებას აძლევს. ეს ინფორმაცია გამოვიყენე 10X CRM-ში კლიენტების ჩატვირთვის, API შეცდომის დამუშავებისა და Retry ფუნქციის ასაწყობად.
