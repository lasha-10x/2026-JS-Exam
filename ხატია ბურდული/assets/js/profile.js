//  Populate profile display fields with current user's data 
document.getElementById("profileName").textContent = currentUser.fullName;

document.getElementById("profileEmail").textContent = currentUser.email;

document.getElementById("profileCompany").textContent =
    currentUser.company || "No company";

    // Format the account creation date for display
document.getElementById("memberDate").textContent =
    new Date(currentUser.createdAt).toLocaleDateString();

    // Build avatar initials from the user's full name (first letter of each word)
const initials = currentUser.fullName
    .split(" ")
    .map(function (word) {
        return word[0];
    })
    .join("")
    .toUpperCase();

document.getElementById("avatar").textContent = initials;


// Pre-fill the edit form inputs with current values
document.getElementById("fullName").value = currentUser.fullName;

document.getElementById("company").value = currentUser.company || "";


// --- Handle profile update form submission ---
const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const company = document.getElementById("company").value.trim();

    // Clear any previous validation errors before re-validating
    clearFieldError("fullName");
    clearFieldError("company");

    // Validate full name length
    if (fullName.length < 3) {
        showFieldError(
            "fullName",
            "Full Name must contain at least 3 characters."
        );
        return;
    }

    // Validate that company field is not empty
    if (company === "") {
        showFieldError(
            "company",
            "Company is required."
        );
        return;
    }

    // Load all users and find the one matching the current session
    const users = JSON.parse(localStorage.getItem("crm_users")) || [];

    const user = users.find(function (item) {
        return item.email === currentUser.email;
    });

    // Update the user's data in the users array
    user.fullName = fullName;
    user.company = company;

    localStorage.setItem("crm_users", JSON.stringify(users));

    // Update the current session object as well
    currentUser.fullName = fullName;
    currentUser.company = company;

    localStorage.setItem("crm_session", JSON.stringify(currentUser));

    // Reflect the updated info in the profile display
    document.getElementById("profileName").textContent = fullName;
    document.getElementById("profileCompany").textContent = company;

    // Recalculate avatar initials based on the new full name
    const initials = fullName
        .split(" ")
        .map(function (word) {
            return word[0];
        })
        .join("")
        .toUpperCase();

    document.getElementById("avatar").textContent = initials;

    showToast("Profile updated successfully!");

});


//  Handle password change form submission 
const passwordForm = document.getElementById("passwordForm");

passwordForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Clear any previous validation errors before re-validating
    clearFieldError("currentPassword");
    clearFieldError("newPassword");
    clearFieldError("confirmPassword");


     // Current password must not be empty
    if (currentPassword === "") {
        showFieldError("currentPassword", "Current password is required.");
        return;
    }

    // Current password must match the stored password
    if (currentPassword !== currentUser.password) {
        showFieldError("currentPassword", "Current password is incorrect.");
        return;
    }

    // New password must be at least 8 characters, with at least one letter and one number
    if (
    newPassword.length < 8 ||
    !/[A-Za-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword)
) {
    showFieldError(
        "newPassword",
        "Password must be at least 8 characters and contain a letter and a number."
    );
    return;
}



      // New password must differ from the current one
    if (newPassword === currentPassword) {
        showFieldError(
            "newPassword",
            "New password must be different from current password."
        );
        return;
    }

    // Confirmation must match the new password
    if (confirmPassword !== newPassword) {
        showFieldError(
            "confirmPassword",
            "Passwords do not match."
        );
        return;
    }

    // Load all users and find the one matching the current session
    const users = JSON.parse(localStorage.getItem("crm_users")) || [];

    const user = users.find(function (item) {
        return item.email === currentUser.email;
    });


     // Update the password in the users array
    user.password = newPassword;

    localStorage.setItem("crm_users", JSON.stringify(users));


     // Update the current session object as well
    currentUser.password = newPassword;

    localStorage.setItem("crm_session", JSON.stringify(currentUser));

    // Clear the password form fields after a successful change
    passwordForm.reset();

    showToast("Password changed successfully!");

});





// Handle "reset all data" button 
const resetDataBtn = document.getElementById("resetDataBtn");

resetDataBtn.addEventListener("click", function () {

      // Ask user to confirm before deleting all client data
    const isConfirmed = confirm(
        "Are you sure you want to delete all clients?"
    );

    if (!isConfirmed) {
        return;
    }


      // Remove all stored clients from localStorage
    localStorage.removeItem("crm_clients");

    showToast("CRM data has been reset successfully!");

});