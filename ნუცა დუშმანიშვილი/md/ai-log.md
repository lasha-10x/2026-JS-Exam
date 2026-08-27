1. very first prompt was reviewing whole PDR document and giving me brief explanation first
then dividing CORE and FULL requirements and giving me plan. it turned out well because, helped me to understand
25 pages more easily on initial stage.



2. question: Can I write the names of storage.js, auth.js, guard.js, theme.js, data.js and clients.js inside one app.js file and then include only app.js in HTML?
like we did in css

i learned that thats not possible. 



3. prompt: when i try to delete manualy added clients, deletion does not work while deleting dymmyJSON clients work, whats the problem. suggest how to fix.

suggested improvement: manually added clients are only simulated and are not permanently saved on its server. 
When the app tried to delete their temporary ID, the API returned an error before localStorage was updated.

used and worked well



4. question: do I need encodeURIComponent(clientId) when clientId is always a number? How can I simplify this URL?

I learned that `encodeURIComponent()` is not required for a standard numeric ID, like was mine.



5. Question : How can I filter clients by search text and selected status at the same time?
I changed it. Following the AI's advice, I used filter(), some(), and includes(). 
I also added a condition ensuring the status filter is either "All" or matches the client status.

