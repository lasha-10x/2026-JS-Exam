# AI Usage Log

**AI tool used:** ChatGPT

---

## CRM Data Reset Architecture

**Goal:** Add a reset feature that restores the original client data without affecting account information.

**Initial prompt:**  
>"whats a simple way to let users reset CRM client data without deleting their account settings and maintaining current session?"

**Improved prompt:**  
>"reset only the client data and initialization flag, preserve users, session and theme choice and immediately fetch a fresh client list with existing getUsers()"

**Result:** Adapted and used. I created a storage function that removes only `crm_clients` and flags `crm_clients_initialized` as false. The Profile page then calls the existing `initializeClients()` function to retrieve and save new data and marks initialization flag as true

**What I learned:** Reusing one initialization function prevents duplicated API logic. 

---

## Profile Form Validation

**Goal:** Show visual validation feedback on the correct password fields.

**Initial prompt:**  
>"Can you point out what is causing the issue? red borders do not appear for invalid iput fields in profile forms."

**Result:** Used. Incorrect element was selected when dynamically adding class with red boarder styles in js. Also, previous errors were not being cleared properly which caused unexpected behaviour. 

**What I learned:** Always clear old error classes before validating a new submission to avoid conflicting styles.

---

## Event Delegation and Delete Flow

**Goal:** Prevent the client-details modal from opening after deleting a client.

**Initial prompt:**  
>"The Delete action works, but clicking Delete also triggers the client-card element."

**Improved prompt summary:**  
>"both actions are being handled inside the same event listener, though i made sure to check which action was being performed and delegate accordingly. Can you help me find the issue that is causing this behaviour? "

**Result:** Used. I added a `return` after the Delete logic so the event handler stops before reaching the code that opens client details.

**What I learned:** Completing one branch of an event listener does not automatically stop the rest of the function. Execution must be ended explicitly when no additional logic needs to be run.

---

## Refining the Profile Design

**Goal:** Improve the Profile page without making it visually inconsistent with the rest of the application.

**Initial prompt summary:**  
>"generate scss for profile summary section to match the design of the rest of the page".

**Improved prompt summary:**  
>"create an account-summary section with initials avatar with circular bg, name email, company and membership date display and Keep it consistent with the existing CRM cards and make suggest colors for dark mode as well.

**Result:** Adapted and used. I added a profile-summary card and responsive styling. During final testing, I adjusted some details manually.

**What I learned:**  visual changes should be checked after application and not blindly pasted as some adjustments are usually needed either to meet the exact requirements or to make sure there is consistency.

## Planning Client Data Storage

**Goal:** Understand when client data should be fetched from DummyJSON and when it should be read from localStorage.

**Prompt:**

> “when the first person logs in I fetch the data from JSON dummy server. After that there will always be clients array locally so I will not have to make GET request after I log in for the first time, right? but how should I distinguish between the two states?”

**Result:** Adapted. The response clarified that client initialization should not depend directly on login. I created a separate initialization flow that fetches clients only when they have not already been initialized, then saves them in localStorage. To distinguish between the two states, as suggested by AI, I created 'crm_clients_initialized' key that would be flagged true/false and saved to localStorage.

**What I learned:** I learned how an initialization flag solves the issue of deciding when to make API call versus getting client list from local storage. I also learned why this approach is more reliable than checking whether the clients array is empty - it addresses the issue that would arise if all clients were manually deleted.

---

## Handling Duplicate Client IDs

**Goal:** Fix a bug where multiple clients added through DummyJSON received the same ID and client actions affected the wrong record.

**Prompt:**

> “All newly added clients receive the same ID. would it be ok to assign id locally during add client in this case?”

**Result:** Used after testing. I confirmed that the DummyJSON POST endpoint repeatedly returned ID `209`. I kept the required POST request but generated a unique local ID using the highest existing client ID plus one (as suggested by AI). This would also follow the existing id aassignment convention, as clients fetched from API also were assigned id's 1-30 in order.

**What I learned:** Unique IDs are essential for editing, deleting, status updates, notes, and details. Given we were using mock API, requests required further handling locally so that operations using client id would execute correctly for newly created clients. 

---

## Creating a Test Account

**Goal:** Provide login credentials that would work in a new browser for demo. 

**Initial prompt:**

> “how do I provide testing account credentials when all user data is stored in my browser?"

**Result:** Adapted and used. I added a predefined demo user and an `addDemoUser()` function. It checks whether the demo email already exists and saves the account only when it is missing.

**What I learned:** Sign Up creates a user, while Login creates a session. I also learned that even though localStorage is separate for each browser and website origin, I could create and save user in localStorage when auth.js loads.

---

