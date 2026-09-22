# Technical English Research Note

* **Source**: DummyJSON Documentation (https://dummyjson.com/docs/users)
* **Search Keywords**: "DummyJSON API users query parameters filter limit mock rest"
* **Summary**: DummyJSON უზრუნველყოფს სატესტო REST API-ს. მომხმარებელთა სიის მისაღებად გამოიყენება GET მოთხოვნა `limit` და `skip` პარამეტრებით. სერვერი იღებს POST და DELETE მოთხოვნებსაც, თუმცა რეალურად მონაცემთა ბაზაში ცვლილებებს არ ინახავს და აბრუნებს იმიტირებულ (mocked) JSON პასუხს. ამის გამო აპლიკაციის მდგრადი state-ის შესანარჩუნებლად საჭიროა LocalStorage-ის გამოყენება.