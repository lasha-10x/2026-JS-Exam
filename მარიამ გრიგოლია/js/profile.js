import { requireAuth } from "./guard.js";
import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { getSession, getUsers, saveUsers, saveClients } from "./storage.js";
import { isValidName, isStrongPassword } from "./validators.js";
import { showToast, showFieldError, clearErrors, clearErrorOnInput } from "./ui.js";
import { fetchClientsFromApi } from "./data.js";

// Get the currently logged-in user object from crm_users
function getCurrentUser() {
  const session = getSession();
  return getUsers().find((u) => u.id === session.userId);
}

// "Nino Beridze" → "NB"
function getInitials(fullName) {
  return fullName
    .trim()
    .split(/\s+/)          // split on any whitespace
    .map((word) => word[0])
    .slice(0, 2)           // first two words only
    .join("")
    .toUpperCase();
}

// Fill the info block from a user object
function renderInfo(user) {
  document.querySelector("#profile-initials").textContent = getInitials(user.fullName);
  document.querySelector("#profile-name").textContent = user.fullName;
  document.querySelector("#profile-email").textContent = user.email;
  document.querySelector("#profile-company").textContent = user.company || "—";
  document.querySelector("#profile-since").textContent =
    `Member since ${new Date(user.createdAt).toLocaleDateString()}`;
}

// ==== Edit profile (Full Name + Company) =======
function initEditForm() {
  const form = document.querySelector("#profile-form");
  const fields = form.elements;

  // Prefill with current values
  const user = getCurrentUser();
  fields.fullName.value = user.fullName;
  fields.company.value = user.company;

  clearErrorOnInput(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    const fullName = fields.fullName.value.trim();
    const company = fields.company.value.trim();

    if (!isValidName(fullName)) {
      showFieldError("edit-name", "Full name must be at least 3 characters");
      return;
    }

    const users = getUsers();
    const current = users.find((u) => u.id === getSession().userId);
    current.fullName = fullName;   
    current.company = company;
    saveUsers(users);              

    renderInfo(current);           
    showToast("Profile updated ✓", "success");
  });
}

// ====== Change password ========
function initPasswordForm() {
  const form = document.querySelector("#password-form");
  const fields = form.elements;

  clearErrorOnInput(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    const currentPassword = fields.currentPassword.value;
    const newPassword = fields.newPassword.value;
    const confirmNewPassword = fields.confirmNewPassword.value;

    const users = getUsers();
    const user = users.find((u) => u.id === getSession().userId);

    let isValid = true;

    // 1. Current must match
    if (currentPassword !== user.password) {
      showFieldError("current-password", "Current password is incorrect");
      isValid = false;
    }

    // 2. New: strong, AND different from current
    if (!isStrongPassword(newPassword)) {
      showFieldError("new-password", "Password must be at least 8 characters and contain a letter and a number");
      isValid = false;
    } else if (newPassword === user.password) {
      showFieldError("new-password", "New password must be different from the current one");
      isValid = false;
    }

    // 3. Confirm matches new
    if (confirmNewPassword !== newPassword) {
      showFieldError("confirm-new-password", "Passwords do not match");
      isValid = false;
    }

    if (!isValid) return;

    user.password = newPassword;   // update
    saveUsers(users);              // save
    form.reset();                  // clear the form
    showToast("Password changed ✓", "success");
  });
}

// ===== Reset CRM data (clients only; account untouched) =====
function initResetData() {
  const btn = document.querySelector("#reset-data-btn");

  btn.addEventListener("click", async () => {
    if (!confirm("Reset all client data to the original 30? This cannot be undone.")) return;

    try {
      const fresh = await fetchClientsFromApi();   // GET again
      saveClients(fresh);                          // overwrite crm_clients
      showToast("CRM data reset ✓", "success");
    } catch (error) {
      console.error(error);
      showToast("Could not reset data. Please try again.", "error");
    }
  });
}

function initProfilePage() {
  initTheme();
  initNav();
  renderInfo(getCurrentUser());
  initEditForm();
  initPasswordForm();
  initResetData();
}

if (requireAuth()) {
  initProfilePage();
}
