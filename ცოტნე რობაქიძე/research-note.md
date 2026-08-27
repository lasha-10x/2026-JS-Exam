found out if indexof() cant find something it returns -1.

# Research Note: Using Local Storage in a CRM Application

## Source

[MDN Web Docs — Window: localStorage property](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Search Keywords

`MDN localStorage getItem setItem JSON.stringify`

## Summary

ამ წყაროს გამოვიყენე CRM პროექტში მონაცემების ბრაუზერში შესანახად. `localStorage` საშუალებას გვაძლევს, რომ მონაცემები გვერდის განახლების ან ბრაუზერის დახურვის შემდეგაც დარჩეს შენახული. რადგან `localStorage` მნიშვნელობებს ტექსტის სახით ინახავს, მომხმარებლებისა და კლიენტების მასივებს `JSON.stringify()`-ით ვინახავთ და `JSON.parse()`-ით ვაბრუნებთ JavaScript მასივებად. პროექტში გამოვიყენე `crm_users` რეგისტრირებული მომხმარებლებისთვის, `crm_session` ავტორიზებული მომხმარებლისთვის, `crm_clients` კლიენტებისთვის და `crm_theme` არჩეული თემისთვის. `getItem()` აბრუნებს `null`-ს, თუ შესაბამისი key ჯერ არ არსებობს, ამიტომ კოდში ცარიელ მასივს ვიყენებ fallback მნიშვნელობად. ეს მიდგომა კარგია სასწავლო CRM პროექტისთვის, თუმცა რეალურ სისტემაში მომხმარებლებისა და პაროლების შესანახად backend და database არის საჭირო.
