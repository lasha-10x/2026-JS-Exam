# Research Note: DummyJSON API Integration

**Source:** [DummyJSON Users API Documentation](https://dummyjson.com/docs/users)

**Search Keywords:** "dummy api fetch mock users array format", "free rest api get users with company"

**Summary (Georgian):**
პროექტის დავალებაში (PRD) უკვე მოცემული იყო `dummyjson.com/users` ლინკი სატესტო მონაცემების წამოსაღებად, თუმცა დამჭირდა მისი ოფიციალური დოკუმენტაციის მოძიება და შესწავლა, რათა გამეგო ზუსტად რა ფორმატით ბრუნდებოდა პასუხი (Response). კვლევის შედეგად გავარკვიე, რომ სერვერი აბრუნებს ობიექტს, რომლის შიგნითაც არის `users` მასივი (array), ასევე `total`, `skip` და `limit` პარამეტრები. დოკუმენტაციის წაკითხვის შემდეგ გავიგე, თუ როგორ უნდა გამომეყენებინა `limit=30` პარამეტრი URL-ში. ამ ინფორმაციაზე დაყრდნობით ავაწყვე `fetch` მოთხოვნა ჩვენს `data.js` ფაილში. საბოლოოდ, გავერკვიე დაბრუნებული ობიექტის სტრუქტურაში და ვისწავლე, თუ როგორ უნდა ამომეღო საჭირო ველები (მაგალითად `user.firstName`, `user.company.name`) ჩვენი CRM-ის ფორმატში მოსარგებად.

---

# Research Note: Implementing Dark Mode with CSS Variables

**Source:** [MDN Web Docs: Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

**Search Keywords:** "mdn css variables toggle dark mode javascript", "best practices for css dark theme"

**Summary (Georgian):**
პროექტის ერთ-ერთი მოთხოვნა იყო Dark Mode-ის (ბნელი რეჟიმის) ინტეგრაცია. დავიწყე კვლევა, თუ რა იყო ამის განხორციელების ყველაზე ოპტიმალური და თანამედროვე გზა. MDN-ის დოკუმენტაციაში წავიკითხე CSS ცვლადების (Custom Properties) შესახებ. გავიგე, რომ ნაცვლად იმისა, რომ ჯავასკრიპტით თითოეულ ელემენტს ფერი ვუცვალო, ბევრად სუფთა მიდგომაა ფერების გაწერა `:root` სელექტორში, ხოლო ალტერნატიული (მუქი) ფერების გაწერა სხვა კლასში (მაგალითად `.dark-theme`). ჯავასკრიპტის როლი კი მხოლოდ ამ კლასის `body` ტეგზე დამატება ან წაშლა იქნება (`classList.toggle`). ამ კვლევამ მომცა იდეა შემექმნა `variables.css` ფაილი, რამაც მთელი საიტის დიზაინის მართვა გაცილებით მარტივი და მოქნილი გახადა.

---

# Research Note: Data Persistence without a Database

**Source:** [MDN Web Docs: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

**Search Keywords:** "javascript save data without database localstorage json", "mdn localstorage array of objects"

**Summary (Georgian):**
ვინაიდან CRM სისტემას არ გააჩნია რეალური ბექენდი (სერვერი), საჭირო იყო მომხმარებლებისა და კლიენტების მონაცემების ბრაუზერში შენახვა, რათა გვერდის დარეფრეშების შემდეგ ინფორმაცია არ დაკარგულიყო. MDN-ზე `localStorage`-ის დოკუმენტაციის შესწავლისას გავარკვიე ერთი კრიტიკული დეტალი: `localStorage`-ს შეუძლია მხოლოდ ტექსტის (String) შენახვა და არა პირდაპირ ჯავასკრიპტის მასივების ან ობიექტების. ამიტომ, დოკუმენტაციის რჩევაზე დაყრდნობით, გამოვიყენე `JSON.stringify()` მონაცემების შესანახად და `JSON.parse()` მათ წამოსაღებად. სწორედ ამ კვლევის ბაზაზე ავაწყვე `storage.js` მოდული, რომელიც მთელი აპლიკაციისთვის მონაცემთა ბაზის (Database) სიმულაციას აკეთებს.
