# Research Note

## Source

MDN Web Storage API
https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

## Keywords Used to Search

localStorage JavaScript, browser storage API, localStorage vs sessionStorage

## Summary (ქართულად)

localStorage არის ბრაუზერის ჩაშენებული საცავი, რომელიც საშუალებას აძლევს ვებ-გვერდებს შეინახონ მონაცემები key-value წყვილების სახით, პირდაპირ მომხმარებლის ბრაუზერში. ეს მონაცემები რჩება შენახული გვერდის დახურვის ან გადატვირთვის შემდეგაც კი, სანამ მომხმარებელი თავად არ წაშლის მათ. განსხვავებით sessionStorage-ისგან, localStorage არ იშლება ტაბის დახურვისას. ამ პროექტში localStorage გამოვიყენე მომხმარებლების, სესიის, კლიენტების ბაზისა და თემის პარამეტრების შესანახად, backend-ის გარეშე. მონაცემები ინახება როგორც string-ები, ამიტომ საჭირო იყო JSON.stringify() და JSON.parse()-ის გამოყენება ობიექტების კონვერტაციისთვის.