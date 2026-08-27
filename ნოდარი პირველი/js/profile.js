document.addEventListener("DOMContentLoaded", function () {
  const session = getSession();
  const users = getUsers();
  const currentUser = users.find(function (u) {
    return u.id === session.userId;
  });

  function renderProfileInfo(user) {
    const initials = user.fullName
      .split(" ")
      .map(function (p) {
        return p[0] || "";
      })
      .slice(0, 2)
      .join("")
      .toUpperCase();

    document.getElementById("profile-avatar").textContent = initials;
    document.getElementById("profile-name").textContent = user.fullName;
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-company").textContent =
      user.company || "\u2014";
    document.getElementById("profile-member-since").textContent =
      "Member since " + new Date(user.createdAt).toLocaleDateString();

    document.getElementById("editFullName").value = user.fullName;
    document.getElementById("editCompany").value = user.company || "";
  }

  renderProfileInfo(currentUser);

  // === A. Save Changes (P5.2) ===
  document
    .getElementById("edit-profile-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = document.getElementById("editFullName").value;
      const company = document.getElementById("editCompany").value;

      clearFieldErrors(["editFullName"]);

      const trimmedName = fullName.trim();
      if (trimmedName.length < 3) {
        showFieldError(
          "editFullName",
          "Full name must be at least 3 characters",
        );
        return;
      }

      const allUsers = getUsers();
      const userToUpdate = allUsers.find(function (u) {
        return u.id === session.userId;
      });
      userToUpdate.fullName = trimmedName;
      userToUpdate.company = company.trim();
      saveUsers(allUsers);

      renderProfileInfo(userToUpdate);
      showToast("Profile updated \u2713", "success");
    });

  // === B. Change Password (P5.3) ===
  document
    .getElementById("change-password-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      clearFieldErrors([
        "currentPassword",
        "newPassword",
        "confirmNewPassword",
      ]);

      const allUsers = getUsers();
      const userToUpdate = allUsers.find(function (u) {
        return u.id === session.userId;
      });

      let hasError = false;

      if (currentPassword !== userToUpdate.password) {
        showFieldError("currentPassword", "Current password is incorrect");
        hasError = true;
      }

      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const hasDigit = /[0-9]/.test(newPassword);
      if (newPassword.length < 8 || !hasLetter || !hasDigit) {
        showFieldError(
          "newPassword",
          "Password must be at least 8 characters and contain a letter and a number",
        );
        hasError = true;
      } else if (newPassword === currentPassword) {
        showFieldError(
          "newPassword",
          "New password must be different from the current one",
        );
        hasError = true;
      }

      if (confirmNewPassword !== newPassword) {
        showFieldError("confirmNewPassword", "Passwords do not match");
        hasError = true;
      }

      if (hasError) return;

      userToUpdate.password = newPassword;
      saveUsers(allUsers);

      document.getElementById("change-password-form").reset();
      showToast("Password changed \u2713", "success");
    });

  // === C. Reset CRM Data (P5.4) ===
  document
    .getElementById("reset-data-btn")
    .addEventListener("click", async function () {
      const confirmed = confirm(
        "Reset all client data? This will reload clients from the API. Your account stays untouched.",
      );
      if (!confirmed) return;

      localStorage.removeItem("crm_clients");
      clientsState = [];
      await ensureClientsLoaded();

      showToast("Client data has been reset", "success");
    });
});
