USED AI TOOLS: Claude.AI, ChatGPT, Gemini.

At the very begining of my project understanding the product logic took up most of my time. I was totally confused where is sign up data saved, what is difference between the "crm_clients" and "crm_users", how the localstorage works and etc. So my first AI prompts looked like:

PROMPT EXAMPLE 1: "<form action="/action_page.php" method="get"> </form> Here is the example how to saves form data into the PHP file. WHat other possible ways exist to save this data? Maybe some JS file? or JSON file?"

PROMPT EXAMPLE 2: "Now consider what is localStorage. My API data comes from DummyJSON. How can you explain that DummyJSON imitates POST/DELETE processes, receives request and returns answer but data are not saved into the database, but in the browser localStorage. What does it mean? All the ways we discussed above about saving data in JSON I don't need any more, just simulating post/delete methods?"

So based on my questions and judgments AI suggested file structure:
project/
├── index.html ← Log In page
├── signup.html ← Sign Up page
├── dashboard.html ← page shown after successful login
├── style.css
├── js/
│ ├── data.js ← shared helpers (load/save clients)
│ ├── signup.js
│ └── login.js
└── data/
└── clients.json

With the help of different AI tools and practical examples, I eventually understood how the simulated POST/DELETE requests worked in local storage. I decided to reject that initial project structure and pivoted to the version presented here.

Next logic where I was confused was deleting API data with the delete button on the client cards. If process was imitation why were they really deleted from the crm_clients.

PROMPT EXAMPLE 3: "After deleting I checked DevTools application, crm_clients and there were actually missing exactly these objects I've deleted. But after reloading these clients are still missing. I expected thar after reload the DummyJason API they will appear again, because my POST/DELETE methods don't affect the API itself, aren't they? If delete all the clients one by one, then will the browser fetch() again the DummyJson API?"

Also new issue to discuss - enrich the API data: according to PRD clients' cards required data which was not included in the objects loaded from the DummyJSON API.
So with the help of the AI tools and using the .map() method, which I found the most intuitive. and JSON.stringify().

At the next level I formulated prompts based on the PRD and step by step developed functions presented in the project. Here is the PRD based promt example.

PROMPT EXAMPLE 4: "My next step is statistic cards - 4 in total. They have to show:
Total Clients - clients.length.
Active Deals - clients, clients whose status is neither 'Won' nor 'Lost'. (filter().length).
Won Revenue - "Won" clients' dealValue sum (filter + reduce), format - $12,500.
New This Week - clients created within the last 7 days."

After that I reviewed and understood the generated code. If something was not clear also explained with the help of the AI tools.

The last interesting issue I encountered was after deploying the link the navigation bar items lost their active class.

PROMPT EXAMPLE 5:"I deployed my project on Netlify: https://phenomenal-madeleine-b04889.netlify.app/dashboard

after deployment navigation bar's active class is missing. It still works when running the app locally via VScode."
