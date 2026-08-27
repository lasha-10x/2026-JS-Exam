// Strictly check for session on page load
if (!auth.isLoggedIn()) {
    window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
    fetch("aside.html")
        .then(response => response.text())
        .then(html => {
            const placeholder = document.getElementById("aside-placeholder");
            placeholder.outerHTML = html;

            // Everything that needs the sidebar goes here
            initializeSidebar();
        })
        .catch(error => console.error(error));
});

function initializeSidebar() {
    const session = JSON.parse(localStorage.getItem("crm_session"));

    if (session) {
        document.getElementById("profile-letter").textContent =
            session.fullName.charAt(0).toUpperCase();

        document.getElementById("profile-name").textContent =
            session.fullName;

    }

    // Active link
    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => {
        link.classList.remove("active");
        //checks if href atribute is the same as curent page and gives it active class
        if (link.getAttribute("href") === window.location.pathname.split("/").pop()) {
            link.classList.add("active");
        }
    });

    //logout button
   const logoutBtn = document.querySelector(".logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", auth.logout);
    }
}