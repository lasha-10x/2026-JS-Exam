# Research Note

**Source:** [MDN — `<dialog>`: The Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

**Keywords used to search:** `html dialog element modal javascript showModal close backdrop`

**Summary (in Georgian):**

Clients გვერდზე ორი მოდალი მჭირდებოდა — Add Client ფორმა და კლიენტის დეტალების ფანჯარა — და თავიდან ვაპირებდი მათი აწყობა `.modal-backdrop` div-ით და `hidden` ატრიბუტით, ისე როგორც ტრადიციულად აკეთებენ ბევრ ძველ ტუტორიალში. MDN-ის დოკუმენტაციაში ვნახე, რომ HTML-ს აქვს ჩაშენებული `<dialog>` ელემენტი, რომელსაც პირდაპირ აქვს `.showModal()` და `.close()` მეთოდები JavaScript-იდან და ავტომატურად ამატებს `::backdrop` ფსევდო-ელემენტს ბნელი ფონისთვის — არც `position: fixed` div და არც ხელით `z-index`-ის მართვა არ მჭირდება. ასევე აღმოვაჩინე, რომ `<dialog>` თავისით კეტავს Escape ღილაკზე და ფოკუსსაც სწორად მართავს (focus trap), რასაც ხელით რომ გავაკეთებინე, დამატებითი კოდი დამჭირდებოდა. ერთადერთი რაც თვითონ დამჭირდა დამეწერა იყო "click outside to close" ქცევა — ეს `<dialog>`-ს ავტომატურად არ აქვს, უნდა შევამოწმო `event.target === dialogElement`-ით dialog-ის click ივენთში (რადგან თვითონ dialog ელემენტიც იკავებს მთელ ეკრანს ბექდროფის ჩათვლით). საბოლოოდ ახლა ორივე მოდალი (`#add-client-modal`, `#details-modal`) `<dialog class="modal">`-ითაა აწყობილი `js/clients.js`-ში, `showModal()`/`close()` გამოძახებით.
