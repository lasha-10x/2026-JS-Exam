/* AUTH GUARD */

const currentPage =
    window.location.pathname.split("/").pop() ||
    "index.html";

const publicPages = [
    "index.html",
    "signup.html",
];

const protectedPages = [
    "dashboard.html",
    "clients.html",
    "profile.html",
];

const session =
    localStorage.getItem("crm_session");

if (
    !session &&
    protectedPages.includes(currentPage)
) {
    window.location.href = "index.html";
} else if (
    session &&
    publicPages.includes(currentPage)
) {
    window.location.href = "dashboard.html";
}