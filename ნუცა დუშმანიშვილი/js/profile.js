document.addEventListener("DOMContentLoaded", initializeProfilePage);

function initializeProfilePage() {
    const user = getCurrentUser();

    if (!user) {
        return;
    }

    document.getElementById("profileName").textContent = user.fullName;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileCompany").textContent =
        user.company || "No company";
    document.getElementById("profileAvatar").textContent =
        user.fullName.trim().charAt(0).toUpperCase();

    document.getElementById("profileFullName").value = user.fullName;
    document.getElementById("profileCompanyInput").value =
        user.company || "";

    document.getElementById("profileForm")
        .addEventListener("submit", handleProfileSubmit);
}

function handleProfileSubmit(event) {
    event.preventDefault();

    const user = getCurrentUser();
    const fullName =
        document.getElementById("profileFullName").value.trim();
    const company =
        document.getElementById("profileCompanyInput").value.trim();

    if (!fullName) {
        document.getElementById("profileFullNameError").textContent =
            "Full name is required";
        return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(item => item.id === user.id);

    users[userIndex] = {
        ...users[userIndex],
        fullName,
        company
    };

    saveUsers(users);
    window.location.reload();
}