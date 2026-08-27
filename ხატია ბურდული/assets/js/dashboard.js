// Get reference to the "Add Client" button
const addClientBtn = document.getElementById("addClientBtn");

// Attach click handler to navigate to the clients page, if the button exists
if (addClientBtn) {
    addClientBtn.addEventListener("click", function () {
        window.location.href = "clients.html";
    });
}