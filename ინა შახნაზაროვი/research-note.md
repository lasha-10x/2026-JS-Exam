# Research Note

**Source:** MDN Web Docs — `localStorage`
**URL:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
**Search terms:** "MDN localStorage API", "localStorage getItem setItem"

**Summary (ქართულად):**
`localStorage` არის ბრაუზერის Web Storage API-ის ნაწილი, რომელიც საშუალებას გვაძლევს შევინახოთ მონაცემები კლიენტის მხარეს, გასაღებ-მნიშვნელობის (key-value) ფორმატში. მონაცემები რჩება ბრაუზერის დახურვის შემდეგაც, განსხვავებით `sessionStorage`-ისგან.

ძირითადი მეთოდებია: `setItem(key, value)`, `getItem(key)`, `removeItem(key)`, `clear()`. ყველა მნიშვნელობა ინახება სტრინგად, ამიტომ ობიექტების შესანახად ვიყენებთ `JSON.stringify()`-ს, წასაკითხად კი `JSON.parse()`-ს.

ჩვენს პროექტში `localStorage`-ს ვიყენებთ 4 რამის შესანახად: მომხმარებლები (`crm_users`), აქტიური სესია (`crm_session`), კლიენტების ბაზა (`crm_clients`) და თემის არჩევანი (`crm_theme`). ეს გვაძლევს საშუალებას აპლიკაცია იმუშაოს backend-ის გარეშე, რაც სასწავლო პროექტისთვის იდეალურია.

მნიშვნელოვანი შეზღუდვა: storage-ის ზომა დაახლოებით 5-10MB-ია თითო დომენზე, და მონაცემები ხელმისაწვდომია იმავე origin-ის ნებისმიერი სკრიპტისთვის — ამიტომ რეალურ პროდუქტში პაროლების შენახვა აქ დაუშვებელია.