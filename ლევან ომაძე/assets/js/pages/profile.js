let currentUser = null;

function renderProfileSummary(user) {
  const summary = document.querySelector("#profile-summary");
  summary.innerHTML = `
    <div class="profile-identity">
      <span class="avatar profile-avatar" aria-hidden="true">${initials(user.fullName)}</span>
      <div>
        <h2>${user.fullName}</h2>
        <p class="muted">${user.email}</p>
      </div>
    </div>
    <div class="details-grid">
      <div class="details-row"><span>Company</span><strong>${user.company || "Not set"}</strong></div>
      <div class="details-row"><span>Member since</span><strong>${formatDate(user.createdAt)}</strong></div>
    </div>
  `;
}

function fillProfileForm(user) {
  document.querySelector("#profile-name").value = user.fullName;
  document.querySelector("#profile-company").value = user.company || "";
}

document.addEventListener("DOMContentLoaded", () => {
  currentUser = requireAuth();
  if (!currentUser) return;

  renderProfileSummary(currentUser);
  fillProfileForm(currentUser);

  const profileForm = document.querySelector("#profile-form");
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(profileForm);

    const formData = new FormData(profileForm);
    const fullName = String(formData.get("fullName")).trim();
    const company = String(formData.get("company")).trim();

    if (fullName.length < 3) {
      setFieldError("profile-name", "Full name must be at least 3 characters");
      focusFirstError(profileForm);
      return;
    }

    currentUser = updateCurrentUser({ fullName, company });
    renderProfileSummary(currentUser);
    showToast("Profile updated ✓");
  });

  const passwordForm = document.querySelector("#password-form");
  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(passwordForm);

    const formData = new FormData(passwordForm);
    const currentPassword = String(formData.get("currentPassword"));
    const newPassword = String(formData.get("newPassword"));
    const confirmNewPassword = String(formData.get("confirmNewPassword"));
    let hasError = false;

    if (currentPassword !== currentUser.password) {
      setFieldError("current-password", "Current password is incorrect");
      hasError = true;
    }

    if (!isStrongPassword(newPassword)) {
      setFieldError("new-password", "Password must be at least 8 characters and contain a letter and a number");
      hasError = true;
    } else if (newPassword === currentPassword) {
      setFieldError("new-password", "New password must be different from the current one");
      hasError = true;
    }

    if (confirmNewPassword !== newPassword) {
      setFieldError("confirm-new-password", "Passwords do not match");
      hasError = true;
    }

    if (hasError) {
      focusFirstError(passwordForm);
      return;
    }

    currentUser = updateCurrentUser({ password: newPassword });
    passwordForm.reset();
    showToast("Password changed ✓");
  });

  document.querySelector("#reset-data").addEventListener("click", async () => {
    if (!window.confirm("Reset CRM client data?")) return;
    const button = document.querySelector("#reset-data");
    button.disabled = true;
    button.textContent = "Resetting...";
    try {
      clearClients();
      const clients = await fetchInitialClients();
      saveClients(clients);
      showToast("CRM data reset ✓");
    } catch (error) {
      showToast(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Reset CRM Data";
    }
  });
});
