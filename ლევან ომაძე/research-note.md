# Research Note

Source: [MDN Web Docs - Window: localStorage property](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

Search keywords: `MDN localStorage JavaScript browser storage`

Summary in Georgian:

MDN-ის დოკუმენტაციიდან გავიგე, რომ `localStorage` ინახავს key-value წყვილებს ბრაუზერში. მნიშვნელობები ინახება string ტიპად, ამიტომ ობიექტების და მასივების შესანახად საჭიროა `JSON.stringify`, ხოლო წასაკითხად `JSON.parse`. მონაცემები რჩება გვერდის refresh-ის და ბრაუზერის დახურვის შემდეგაც, რაც ამ CRM პროექტისთვის სასარგებლოა. დოკუმენტაციამ ასევე გამახსენა, რომ `localStorage` იგივე origin-ზეა მიბმული, ანუ კონკრეტულ საიტს თავისი storage აქვს. ამ პროექტში `crm_users`, `crm_session`, `crm_clients` და `crm_theme` სწორედ ამ მექანიზმით ინახება.
