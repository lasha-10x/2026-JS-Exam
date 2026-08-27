requireAuth();

const profileForm = document.getElementById("profileForm");
const profileAvatar = document.getElementById("profileAvatar");
const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profileCompany = document.getElementById("profileCompany");
const profileCreatedAt = document.getElementById("profileCreatedAt");
const profileFullNameError = document.getElementById("profileFullNameError");
const profileSuccess = document.getElementById("profileSuccess");

const changePasswordForm = document.getElementById("changePasswordForm");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmNewPasswordInput = document.getElementById("confirmNewPassword");

const currentPasswordError = document.getElementById("currentPasswordError");
const newPasswordError = document.getElementById("newPasswordError");
const confirmNewPasswordError = document.getElementById(
  "confirmNewPasswordError",
);
const passwordSuccess = document.getElementById("passwordSuccess");

const resetDataButton = document.getElementById("resetDataButton");

const savedSession = localStorage.getItem("crm_session");
const session = JSON.parse(savedSession);

const savedUsers = localStorage.getItem("crm_users");
const users = savedUsers ? JSON.parse(savedUsers) : [];

const currentUser = users.find(function (user) {
  return user.id === session.userId;
});

if (!currentUser) {
  localStorage.removeItem("crm_session");
  window.location.href = "../index.html";
} else {
  profileAvatar.textContent = currentUser.fullName.charAt(0).toUpperCase();
  profileFullName.value = currentUser.fullName;
  profileEmail.value = currentUser.email;
  profileCompany.value = currentUser.company;
  profileCreatedAt.value = new Date(currentUser.createdAt).toLocaleDateString();

  // Profile information update
  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    profileFullNameError.textContent = "";
    profileSuccess.textContent = "";
    profileSuccess.classList.remove("no-changes");

    const updatedFullName = profileFullName.value.trim();
    const updatedCompany = profileCompany.value.trim();

    if (updatedFullName.length < 3) {
      profileFullNameError.textContent =
        "Full name must be at least 3 characters";
      return;
    }

    if (
      updatedFullName === currentUser.fullName &&
      updatedCompany === currentUser.company
    ) {
      profileSuccess.textContent = "No changes were made";
      profileSuccess.classList.add("no-changes");
      return;
    }

    currentUser.fullName = updatedFullName;
    currentUser.company = updatedCompany;

    localStorage.setItem("crm_users", JSON.stringify(users));

    session.fullName = updatedFullName;
    localStorage.setItem("crm_session", JSON.stringify(session));

    profileAvatar.textContent = updatedFullName.charAt(0).toUpperCase();
    profileSuccess.textContent = "Profile updated successfully";
  });

  // Password change
  changePasswordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    currentPasswordError.textContent = "";
    newPasswordError.textContent = "";
    confirmNewPasswordError.textContent = "";
    passwordSuccess.textContent = "";

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmNewPassword = confirmNewPasswordInput.value;

    let hasError = false;

    if (currentPassword !== currentUser.password) {
      currentPasswordError.textContent = "Current password is incorrect";
      hasError = true;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (newPassword.length < 8 || !hasLetter || !hasNumber) {
      newPasswordError.textContent =
        "Password must be at least 8 characters and contain a letter and a number";
      hasError = true;
    } else if (newPassword === currentUser.password) {
      newPasswordError.textContent =
        "New password must be different from the current one";
      hasError = true;
    }

    if (confirmNewPassword !== newPassword) {
      confirmNewPasswordError.textContent = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      return;
    }

    currentUser.password = newPassword;
    localStorage.setItem("crm_users", JSON.stringify(users));

    changePasswordForm.reset();
    passwordSuccess.textContent = "Password changed ✓";
  });

  // Reset only CRM client data
  resetDataButton.addEventListener("click", function () {
    const isConfirmed = confirm(
      "Are you sure you want to reset all CRM client data?",
    );

    if (!isConfirmed) {
      return;
    }

    localStorage.removeItem("crm_clients");
    window.location.href = "../html/dashboard.html";
  });
}
