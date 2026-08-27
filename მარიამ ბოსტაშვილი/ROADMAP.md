# 10X CRM — გამოცდისთვის მომზადების Roadmap

ეს გეგმა შედგენილია `10X-CRM-Exam-PRD.docx`-ის მოთხოვნების, პროექტის
მიმდინარე კოდის და საგამოცდო დემოს ფორმატის მიხედვით.

მთავარი პრინციპი:

> ჯერ სრულად მუშა CORE, შემდეგ სრულად შემოწმებული FULL და მხოლოდ ამის შემდეგ
> BONUS ფუნქციები.

## სტატუსების განმარტება

- ✅ შესრულებულია — ფუნქცია კოდში არსებობს.
- 🧪 შესამოწმებელია — ფუნქცია არსებობს, მაგრამ საჭიროა სრული ხელით ტესტირება.
- 🔧 გასასწორებელია — არსებობს ცნობილი პრობლემა ან PRD-თან აცდენა.
- ❌ აკლია — PRD-ის მოთხოვნა ჯერ შესრულებული არ არის.
- ⭐ BONUS — მაღალი შეფასებისთვის სასარგებლოა, მაგრამ CORE/FULL-ის ნაწილი არ არის.

---

# ეტაპი 1 — CORE

CORE არის მოდულის ჩათვლის მინიმალური დონე. BONUS სამუშაოს დაწყებამდე ქვემოთ
ჩამოთვლილი ყველა პუნქტი უნდა იყოს დასრულებული და ხელით შემოწმებული.

## C1. P0 — გლობალური წესები

### Auth Guard

- ✅ დაცული გვერდები ამოწმებს `crm_session`-სა და მიმდინარე მომხმარებელს.
- ✅ არაავტორიზებული მომხმარებელი ბრუნდება `index.html`-ზე.
- ✅ ავტორიზებული მომხმარებელი Login/Sign Up გვერდებიდან გადადის Dashboard-ზე.
- ✅ საერთო ლოგიკა თავმოყრილია `guard.js`-ში.
- 🧪 პირდაპირ URL-ით შემოწმდეს `dashboard.html`, `clients.html` და
  `profile.html`.

**Done when:** არცერთი დაცული გვერდი არ იხსნება აქტიური სესიის გარეშე.

### ნავიგაცია და Logout

- ✅ Dashboard, Clients და Profile ბმულები არსებობს.
- ✅ მიმდინარე გვერდი მონიშნულია `active` კლასით.
- ✅ Logout შლის მხოლოდ `crm_session`-ს.
- ✅ Logout არ შლის მომხმარებლებსა და კლიენტებს.
- 🔧 მომხმარებლის dropdown ვიზუალურად არსებობს, მაგრამ მისი გახსნა/დახურვის
  ლოგიკა დასამატებელია.

**Done when:** Logout-ისა და ხელახალი Login-ის შემდეგ ყველა CRM მონაცემი
ადგილზე რჩება.

### თემა

- ✅ Light/Dark რეჟიმი მუშაობს.
- ✅ არჩევანი ინახება `crm_theme` გასაღებში.
- 🧪 ყველა დაცულ და საჯარო გვერდზე შემოწმდეს არჩეული თემის აღდგენა.

**Done when:** გვერდის refresh-ისა და გვერდებს შორის გადასვლის შემდეგ თემა არ
იცვლება.

### შეცდომები და Toast შეტყობინებები

- ✅ ველის შეცდომა ჩანს შესაბამის ველთან.
- ✅ Success და Error toast-ები არსებობს.
- ✅ toast ავტომატურად იხურება დაახლოებით 3 წამში.
- ✅ toast-ს აქვს ხელით დახურვის ღილაკი.
- 🧪 შემოწმდეს, რომ ჩვეულებრივი შეტყობინებებისთვის `alert()` არ გამოიყენება.

## C2. P1 — Sign Up

- ✅ `signup.html` საჯარო გვერდია.
- ✅ Full Name, Email, Password, Confirm Password და Company ველები არსებობს.
- ✅ Full Name მოწმდება `trim()`-ის შემდეგ.
- ✅ Email ინახება lowercase ფორმით.
- ✅ ქართული ასოების შემცველი ან სხვა არასწორი email უარყოფილია.
- ✅ დუბლირებული email-ით მეორე ანგარიში არ იქმნება.
- ✅ პაროლზე მოწმდება მინიმალური სიგრძე, ასო და ციფრი.
- ✅ Confirm Password უნდა ემთხვეოდეს Password-ს.
- ✅ წარმატებისას მომხმარებელი ინახება `crm_users`-ში.
- 🧪 ყველა ვალიდაციის ზუსტი error text შედარდეს PRD-ის ტექსტს.
- 🧪 refresh-ის შემდეგ ახლად შექმნილი ანგარიშით Login უნდა მუშაობდეს.

**Done when:** Sign Up-ის ყველა ვალიდაციის დადებითი და უარყოფითი სცენარი
გავლილია და მონაცემი `crm_users`-ში სწორ ფორმატში ინახება.

## C3. P2 — Login

- ✅ email და password ველები არსებობს.
- ✅ მომხმარებელი იძებნება `crm_users` მასივში.
- ✅ არასწორ წყვილზე ნაჩვენებია `Invalid email or password`.
- ✅ წარმატებისას იქმნება `crm_session`.
- ✅ წარმატებული Login გადადის `dashboard.html`-ზე.
- ✅ პროექტში არსებობს ტესტური მომხმარებელი:
  `demo@crm.com` / `Demo123!`.
- 🔧 README-ში Test Account სექცია რეალურ demo account-ს უნდა დაემთხვეს.

**Done when:** სწორი მონაცემებით Login მუშაობს, არასწორი მონაცემებით სესია არ
იქმნება და refresh-ის შემდეგ ავტორიზაცია შენარჩუნებულია.

## C4. P4 — Clients-ის ბირთვი

### API ჩატვირთვა და რენდერი

- ✅ საწყისი კლიენტები იტვირთება DummyJSON API-დან.
- ✅ გამოიყენება `fetch` და `async/await`.
- ✅ მოწმდება `response.ok`.
- ✅ API მონაცემი გარდაიქმნება CRM Client ობიექტად.
- ✅ კლიენტები JavaScript-ით რენდერდება.
- ✅ მონაცემები ინახება `crm_clients`-ში.
- ✅ განმეორებით გახსნაზე ჯერ localStorage გამოიყენება.
- 🧪 სუფთა storage-ზე Network ტაბში უნდა გამოჩნდეს GET მოთხოვნა.
- 🧪 Offline/error სცენარში უნდა გამოჩნდეს გასაგები error state და Retry.

### კლიენტის დამატება

- ✅ Add Client modal არსებობს.
- ✅ Name, Email, Phone, Company, Status და Deal Value მუშავდება.
- ✅ ქართული ან არასწორი email უარყოფილია.
- ✅ ტელეფონში ასოები იფილტრება და არავალიდური ნომერი არ ინახება.
- ✅ დუბლირებული email არ ემატება.
- ✅ ლოკალურ კლიენტს ენიჭება უნიკალური ID.
- ✅ POST მოთხოვნა იგზავნება API-ზე.
- ✅ API ID და ლოკალური ID ერთმანეთისგან განსხვავდება.
- 🧪 Network ტაბში POST მოთხოვნა და localStorage-ში შედეგი უნდა შემოწმდეს.

### კლიენტის წაშლა

- ✅ წაშლამდე მომხმარებელი ადასტურებს მოქმედებას.
- ✅ API კლიენტზე იგზავნება DELETE მოთხოვნა.
- ✅ ლოკალური კლიენტი სწორად იშლება 404 პასუხის შემთხვევაშიც.
- ✅ ერთნაირი API ID-ის მქონე ჩანაწერები ერთმანეთის წაშლას აღარ იწვევს.
- 🧪 წაშლის შემდეგ refresh-ზე ჩანაწერი არ უნდა დაბრუნდეს.

**Done when:** GET, POST და DELETE ჩანს Network ტაბში, ხოლო დამატება/წაშლა
refresh-ს უძლებს.

## C5. Storage-ის სავალდებულო რეესტრი

- ✅ `crm_users`
- ✅ `crm_session`
- ✅ `crm_clients`
- ✅ `crm_theme`
- 🧪 DevTools → Application → Local Storage-ში თითოეული გასაღები და მისი
  მონაცემთა ფორმა ხელით უნდა შემოწმდეს.

## C6. CORE დოკუმენტაცია და ჩაბარება

- ✅ `README.md` ინგლისურად არსებობს.
- ✅ README შეიცავს About, Features, Tech Stack, How to Run, Live Demo,
  Test Account და Credits სექციებს.
- 🔧 README-ის Test Account უნდა განახლდეს რეალური demo account-ით.
- ❌ `ai-log.md` აკლია.
- ❌ `ai-log.md`-ში საჭიროა მინიმუმ 5 რეალური ჩანაწერი.
- ❌ მინიმუმ ერთ AI ჩანაწერში უნდა ჩანდეს prompt-ის გაუმჯობესება.
- ❌ მინიმუმ ერთ AI ჩანაწერში უნდა ჩანდეს AI პასუხის კრიტიკული შეფასება.
- ❌ პროექტი ჯერ არ არის deploy-ებული.
- ❌ Live Demo URL README-ში არ არის.
- ✅ Git ისტორიაში 37 commit არის — PRD-ის მინიმუმ 25 commit შესრულებულია.
- 🧪 GitHub repository უნდა იყოს საჯარო და ბოლო commit ატვირთული.

### CORE-ის მთავარი ბლოკერები

1. `ai-log.md`-ის რეალური ჩანაწერებით მომზადება.
2. README-ში სწორი demo account-ის ჩაწერა.
3. Netlify/Vercel/GitHub Pages deployment.
4. Live Demo URL-ის README-ში დამატება.
5. სრული CORE regression test.

**CORE დასრულებულია მხოლოდ მაშინ, როდესაც ყველა ზემოთ ჩამოთვლილი ბლოკერი
დახურულია.**

---

# ეტაპი 2 — FULL

FULL იწყება მხოლოდ CORE-ის დასრულების შემდეგ და მაღალი შეფასების ზონას
ემსახურება.

## F1. P3 — Dashboard

- ✅ მიმდინარე მომხმარებლის სახელით მისალმება.
- ✅ ცოცხალი საათი.
- ✅ ოთხი სტატისტიკური ბარათი.
- ✅ Total Clients.
- ✅ Active Deals.
- ✅ Won Revenue.
- ✅ New This Week.
- ✅ Pipeline სტატუსების განაწილება.
- ✅ ბოლო 5 კლიენტის სია.
- 🧪 სტატისტიკა უნდა განახლდეს client add/delete/status change-ის შემდეგ.
- 🧪 ზუსტი ფორმულები ცარიელ, შერეულ და დიდ მონაცემთა ნაკრებზე შემოწმდეს.

**Done when:** Dashboard-ის ყველა რიცხვი პირდაპირ `crm_clients` მონაცემიდან
სწორად ითვლება და refresh-ის შემდეგ იგივე რჩება.

## F2. P4 — Clients სრული ფუნქციონალი

### სტატუსის შეცვლა

- ✅ სტატუსის select ცვლის Client ობიექტს.
- ✅ განახლებული სტატუსი ინახება localStorage-ში.
- 🧪 სტატუსის ცვლილება Dashboard სტატისტიკაზეც უნდა აისახოს.

### ძებნა, ფილტრი და სორტი

- ✅ ძებნა მუშაობს სახელით და კომპანიით.
- ✅ სტატუსის ჩიპები მუშაობს.
- ✅ `All` აბრუნებს სრულ სიას.
- ✅ Newest, Name A–Z და Deal Value sort არსებობს.
- ✅ ოპერაციები სრულდება მასივის ასლზე.
- ✅ ფილტრი, ძებნა და სორტი კომბინირებადია.
- 🧪 ყველა კომბინაციის regression matrix უნდა შესრულდეს.

### დეტალები, შენიშვნები და შეხსენებები

- ✅ Client Details modal არსებობს.
- ✅ ჩანს კლიენტის ძირითადი ინფორმაცია და შექმნის თარიღი.
- ✅ ცარიელი შენიშვნა არ ემატება.
- ✅ შენიშვნას ემატება თარიღი.
- ✅ შენიშვნები ინახება `crm_clients`-ში.
- ✅ follow-up reminder ფუნქცია არსებობს.
- ✅ reminder მოდალის დახურვის შემდეგაც მუშავდება.
- 🧪 refresh-ისა და tab-ის დახურვა/გახსნის შემდეგ reminder-ის ქცევა
  შესამოწმებელია.

### Error handling

- ✅ API კოდში გამოიყენება `try/catch`.
- ✅ `response.ok` მოწმდება.
- ✅ Loading state არსებობს.
- ✅ Retry მექანიზმი არსებობს.
- 🧪 GET, POST და DELETE-ის network failure ცალ-ცალკე უნდა გაიტესტოს.

## F3. P5 — Profile

- ✅ მიმდინარე მომხმარებლის initials, სახელი, email და company ჩანს.
- ✅ Member Since თარიღი ჩანს.
- ✅ Full Name და Company რედაქტირდება.
- ✅ ცვლილება ინახება `crm_users`-ში.
- ✅ ზედა ნავიგაციაში სახელი ახლდება.
- ✅ Current Password მოწმდება.
- ✅ New Password-ზე მოწმდება სიგრძე, ასო და ციფრი.
- ✅ ახალი პაროლი არ უნდა ემთხვეოდეს ძველს.
- ✅ Confirm Password უნდა დაემთხვეს ახალ პაროლს.
- ✅ Reset CRM Data თავიდან ტვირთავს 30 API კლიენტს.
- ✅ Reset არ შლის `crm_users`-სა და `crm_session`-ს.
- 🧪 პაროლის შეცვლის შემდეგ ძველი პაროლით Login უნდა ჩავარდეს, ახლით —
  წარმატებით დასრულდეს.
- 🧪 Profile ცვლილება Dashboard-ის მისალმებაში უნდა აისახოს.

## F4. FULL ინგლისური პაკეტი

- ✅ `glossary.md` არსებობს და შეიცავს მინიმუმ 10 ტერმინს.
- ❌ `research-note.md` აკლია.
- ❌ research note-ს სჭირდება ერთი რეალურად გამოყენებული ინგლისურენოვანი წყარო.
- ❌ უნდა ჩაიწეროს საძიებო საკვანძო სიტყვები.
- ❌ საჭიროა 5–6 წინადადებიანი ქართული რეზიუმე საკუთარი სიტყვებით.
- 🧪 README და glossary-ში აღწერილი ყველა feature რეალურ აპს უნდა ემთხვეოდეს.

## F5. FULL regression

ერთ სუფთა browser profile-ში შესრულდეს:

1. Sign Up.
2. Logout.
3. Login.
4. Dashboard მონაცემების შემოწმება.
5. Client search/filter/sort.
6. Client add.
7. Client status change.
8. Client note.
9. Follow-up reminder.
10. Client delete.
11. Profile edit.
12. Password change.
13. Logout და ახალი პაროლით Login.
14. Reset CRM Data.
15. Page refresh და მონაცემთა persistence.

**Done when:** Console-ში uncaught error არ არის, ყველა success/error state
გასაგებია და სრული flow თავიდან ბოლომდე მეორდება.

---

# ეტაპი 3 — BONUS და დამატებითი ხარისხი

ეს სამუშაოები დაიწყოს მხოლოდ CORE და FULL მოთხოვნების დახურვის შემდეგ.

## B1. User dropdown და Settings

- ⭐ მომხმარებლის dropdown: Profile, Settings და Sign Out.
- ⭐ გარეთ click-ით და `Escape`-ით დახურვა.
- ⭐ keyboard navigation და სწორი ARIA ატრიბუტები.
- ⭐ ცალკე `settings.html`.
- ⭐ Light, Dark და System theme.
- ⭐ წინასწარ შემოწმებული Dashboard accent ფერები.
- ⭐ ენის, ვალუტის, density-ისა და reduced motion-ის პარამეტრები.

## B2. Profile photo

- ⭐ JPG/PNG/WebP ატვირთვა.
- ⭐ file type და size validation.
- ⭐ preview, replace და remove.
- ⭐ 256×256 resize და WebP compression.
- ⭐ ფოტო Profile hero-სა და user dropdown-ში.
- ⭐ მცირე ზომის გამოსახულების persistence.

## B3. Import/Export round-trip

- ⭐ ერთი კანონიკური column schema.
- ⭐ Export Excel (`.xlsx`).
- ⭐ Export CSV.
- ⭐ exported ფაილის უკან import დანაკარგის გარეშე.
- ⭐ ყველა worksheet-ის წაკითხვა.
- ⭐ import preview.
- ⭐ Valid, Invalid და Duplicate ჩანაწერების რაოდენობა.
- ⭐ row number და შეცდომის კონკრეტული მიზეზი.
- ⭐ duplicate strategy: Skip ან Update Existing.
- ⭐ CSV-ის ადგილობრივი parser, რათა CSV import CDN-ზე არ იყოს დამოკიდებული.

## B4. სხვა PRD bonus-ები

- ⭐ Edit Client და PUT მოთხოვნა.
- ✅ Pagination და bulk actions უკვე დამატებულია.
- ⭐ Password strength indicator.
- ⭐ Remember Me და session expiry.
- ⭐ server-side search debounce-ით.
- ⭐ call timer `setInterval`-ით.
- ⭐ Kanban და drag-and-drop.
- ⭐ keyboard shortcuts.

---

# გამოცდისთვის მოსამზადებელი კითხვები

## JavaScript საფუძვლები

1. რა განსხვავებაა `let`, `const` და `var`-ს შორის?
2. რატომ ვიყენებთ `const`-ს მასივისთვის, თუ მასივის ელემენტები მაინც იცვლება?
3. რას აბრუნებს `Array.prototype.find()` და რით განსხვავდება `filter()`-ისგან?
4. რატომ ვიყენებთ `map()`-ს API მონაცემების Client ობიექტებად გადასაკეთებლად?
5. რას აკეთებს spread operator (`...`) ობიექტსა და მასივში?
6. რატომ უნდა შესრულდეს sort მასივის ასლზე?
7. როგორ მუშაობს `trim()`, `toLowerCase()` და `includes()`?

## Storage და სესია

8. სად და რა ფორმატით ინახება `crm_users`?
9. რატომ გვჭირდება ცალკე `crm_session`?
10. რა განსხვავებაა `localStorage`-სა და `sessionStorage`-ს შორის?
11. რატომ გამოიყენება `JSON.stringify()` შენახვისას?
12. რატომ გამოიყენება `JSON.parse()` წაკითხვისას?
13. რა მოხდება, თუ localStorage-ში დაზიანებული JSON აღმოჩნდა?
14. რატომ არ უნდა წაშალოს Logout-მა `crm_clients`?
15. რატომ არის პაროლის localStorage-ში შენახვა მხოლოდ სასწავლო პროექტისთვის
    მისაღები და არა production-ში?

## DOM და Events

16. რას აკეთებს `DOMContentLoaded`?
17. რა განსხვავებაა `click`, `input`, `change` და `submit` event-ებს შორის?
18. რატომ ვიყენებთ `event.preventDefault()`-ს ფორმაზე?
19. როგორ იქმნება client card JavaScript-ით?
20. რა არის event delegation და სად გამოგვადგება?
21. რატომ უნდა ჰქონდეს modal-ს focus management?
22. რას ნიშნავს `aria-expanded` dropdown ღილაკზე?

## ასინქრონულობა და API

23. რას აბრუნებს `fetch()`?
24. რატომ არის API ფუნქცია `async`?
25. რას აკეთებს `await`?
26. რატომ არ ნიშნავს `fetch()` Promise-ის resolve ყოველთვის წარმატებულ HTTP
    პასუხს?
27. რატომ ვამოწმებთ `response.ok`-ს?
28. რა როლი აქვს `try/catch`-ს?
29. რა განსხვავებაა GET, POST, PUT და DELETE მეთოდებს შორის?
30. რატომ შეიძლება DummyJSON-მა ლოკალური კლიენტის DELETE-ზე 404 დააბრუნოს?
31. რატომ ვშლით ასეთ კლიენტს local state-დან მაინც?

## პროექტის კონკრეტული კითხვები

32. რატომ აქვს კლიენტს ცალკე ლოკალური `id` და `apiId`?
33. როგორ იყო გამოწვეული ერთნაირი ID-ით ორი კლიენტის ერთად წაშლის ბაგი?
34. როგორ იზღუდება email მხოლოდ ვალიდურ Latin მისამართზე?
35. როგორ იფილტრება ტელეფონის ველში ასოები?
36. რა თანმიმდევრობით მუშაობს filter → search → sort?
37. როგორ ითვლება Active Deals?
38. როგორ ითვლება Won Revenue?
39. როგორ ინახება კლიენტის შენიშვნა?
40. როგორ მუშაობს reminder და `setTimeout()`?
41. რატომ არ უნდა იყოს import/export-ის მონაცემთა schema განსხვავებული?
42. რატომ არის CSV formula injection უსაფრთხოების პრობლემა?

---

# მოსალოდნელი Live Change დავალებები

AI-ის გარეშე უნდა შეგეძლოს:

- პაროლის მინიმალური სიგრძის 8-დან 10-მდე შეცვლა;
- ახალი Client status-ის დამატება;
- toast-ის დროის 3-დან 5 წამამდე შეცვლა;
- Recent Clients-ის რაოდენობის 5-დან 10-მდე შეცვლა;
- Deal Value-ის მინიმალური მნიშვნელობის შეცვლა;
- ახალი sort ვარიანტის დამატება;
- email error text-ის შეცვლა;
- reminder-ის 1 წუთიდან სხვა დროზე გადაყვანა;
- ახალი navigation link-ის დამატება;
- theme-ის default მნიშვნელობის შეცვლა.

---

# 1–2 წუთიანი ინგლისური წარდგენის ჩონჩხი

> Hello, this is 10X CRM, a browser-based customer relationship management
> application for sales managers. I built it with HTML, CSS, and vanilla
> JavaScript. Users can register, log in, manage clients, filter and sort their
> pipeline, add notes and reminders, and update their profiles. The application
> loads initial client data from the DummyJSON API and stores persistent data in
> localStorage. One of the hardest parts was keeping local and API client
> identifiers separate, because duplicated identifiers could cause the wrong
> client to be deleted. I also added validation, error handling, responsive
> design, and accessible modal behavior.

ეს ტექსტი სიტყვასიტყვით დაზეპირების ნაცვლად საკუთარი სიტყვებით უნდა
გადმოიცეს.

---

# საბოლოო პრიორიტეტების რიგი

1. შექმენი რეალური `ai-log.md`.
2. გაასწორე README-ის Test Account.
3. გააკეთე deployment და ჩასვი Live Demo URL.
4. სრულად გაიარე CORE regression.
5. შექმენი `research-note.md`.
6. სრულად გაიარე FULL regression.
7. მოამზადე კოდის ახსნა და Live Change სავარჯიშოები.
8. მოამზადე ინგლისური 1–2 წუთიანი წარდგენა.
9. მხოლოდ ამის შემდეგ დაამატე dropdown, Settings, profile photo და
   import/export გაუმჯობესებები.

