// Route Guard: Checks user authentication before rendering the page.
// Prevents unauthorized users from accessing protected dashboard routes.
console.log("GUARD JS WORKING");


const storedSession =
localStorage.getItem("crm_session");

const session =
storedSession
    ? JSON.parse(storedSession)
    : null;


// დაცული გვერდები
const protectedPages = [
    "dashboard.html",
    "clients.html",
    "profile.html"
];


// საჯარო გვერდები
const publicPages = [
    "index.html",
    "signup.html",
];


// მიმდინარე ფაილის სახელი
const currentPage =
window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();


// ===============================
// PROTECTED PAGE CHECK
// ===============================

if(protectedPages.includes(currentPage)){

    if(!session){

        window.location.href = "index.html";

    }

}



// ===============================
// PUBLIC PAGE CHECK
// ===============================

if(publicPages.includes(currentPage)){

    if(session){

        window.location.href = "dashboard.html";

    }

}