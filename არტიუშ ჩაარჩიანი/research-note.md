# Research Note — Browser localStorage

## Source

- **Used source:** [Window: localStorage property — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **Search keywords:** `MDN localStorage browser sessions getItem setItem removeItem`, `localStorage persistence after browser close`, `localStorage vs sessionStorage differences`

## Georgian Summary

`localStorage` არის ბრაუზერის API, რომელიც საშუალებას აძლევს ვებ-აპლიკაციებს კლავიშ-მნიშვნელობების წყვილების (key-value pairs) მუდმივ შენახვას მომხმარებლის ბრაუზერში. `sessionStorage`-დან განსხვავებით, `localStorage`-ში შენახული მონაცემები **არ იშლება ბრაუზერის დახურვის ან კომპიუტერის გადატვირთვის შემდეგ** — ისინი რჩებიანbrigade-ში არავდრომდე, სანამ ან მომხმარებელმა ხელით არ წაშლს, ან კოდმა წაშლს.

მნიშვნელობები მხოლოდ ტექსტურ ფორმატში ინახება. ამიტომ ობიექტებისა და მასივების შესანახად საჭიროა `JSON.stringify()` დაბეჭდვა შენახვისას და `JSON.parse()` კითხვისას.

მთავარი მეთოდები:
- `localStorage.setItem(key, value)` — ამატებს ან ცვლის მნიშვნელობას
- `localStorage.getItem(key)` — ამოღებს მნიშვნელობას
- `localStorage.removeItem(key)` — შლის კონკრეტულ გასაღებს
- `localStorage.clear()` — ერთჯერად შლის ყველა გასაღებს (დამღვარდებითი, აცდენებს ყველა მონაცემს)

შენახული მონაცემები ახდენს origin-ს (პროტოკოლი + დომენი + პორტი) სპეციფიურად — `http://localhost:8000` და `https://localhost:8000` ცალ-ცალკე საცავებს იყენებენ.

## How This Source Helped the Project

This MDN reference directly informed several implementation decisions in 10X CRM:

1. **Storage key design** — I created namespaced keys (`crm_users`, `crm_session`, `crm_clients`, `crm_theme`) to avoid collisions with other applications on the same origin.

2. **Data serialization** — The project uses JSON serialization/deserialization wrappers (`writeJSON`, `readJSON` in `js/core/storage.js`) because localStorage only stores strings.

3. **Targeted deletion** — When implementing logout and "Reset CRM Data," I rejected `localStorage.clear()` after confirming from MDN that it would wipe **all** keys for the origin. Instead, I use `removeStorageItem` to delete only the intended keys while preserving others (e.g., logout removes only `crm_session`, reset removes only `crm_clients`).

4. **Error handling** — The `readJSON` utility includes a try-catch block because `JSON.parse` throws on corrupted data, which can happen if storage was modified externally.

5. **Capacity awareness** — MDN notes the typical 5MB limit, which is sufficient for this project's small data sets but would require a different approach for larger applications.