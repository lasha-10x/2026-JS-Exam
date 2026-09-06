// profile.js
// Shows the logged-in user's info, lets them edit name/company, change
// their password, and reset the CRM's client data back to a fresh
// API pull.

initProtectedPage("profile");

// The session only stores { userId, email, loginAt } - to get the FULL
// user record (fullName, password, company) we look them up in crm_users
// by that userId. This is the same "session points at a user" pattern
// used in dashboard.js's setGreeting().
const session = getSession();
const users = getUsers();
let currentUser = users.find((u) => u.id === session.userId);

function renderProfileHeader() {
  document.getElementById("p-avatar").textContent = currentUser.fullName.charAt(0).toUpperCase();
  document.getElementById("p-name").textContent = currentUser.fullName;
  document.getElementById("p-email").textContent = currentUser.email;
  document.getElementById("p-since").textContent =
    "Member since " + new Date(currentUser.createdAt).toLocaleDateString();

  // Pre-fill the edit form with the current values so the user can just
  // change what they need instead of retyping everything.
  document.getElementById("fullName").value = currentUser.fullName;
  document.getElementById("company").value = currentUser.company || "";
}

renderProfileHeader();

// --- Edit Info ------------------------------------------------------

document.getElementById("edit-info-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const company = document.getElementById("company").value;

  clearFieldErrors(["fullName"]);

  if (fullName.trim().length < 3) {
    showFieldError("fullName", "Full name must be at least 3 characters");
    return;
  }

  // Update the fields on our local `currentUser` object, then find that
  // SAME user inside the full `users` array and overwrite it there too -
  // otherwise saveUsers() would save the old, un-edited data.
  currentUser.fullName = fullName.trim();
  currentUser.company = company.trim();

  const index = users.findIndex((u) => u.id === currentUser.id);
  users[index] = currentUser;
  saveUsers(users);

  renderProfileHeader();
  showToast("Profile updated", "success");
});

// --- Change Password --------------------------------------------------

document.getElementById("change-password-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;

  clearFieldErrors(["currentPassword", "newPassword", "confirmNewPassword"]);

  const errors = {};
  if (currentPassword !== currentUser.password) {
    errors.currentPassword = "Current password is incorrect";
  }

  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  if (newPassword.length < 8 || !hasLetter || !hasDigit) {
    errors.newPassword = "Password must be at least 8 characters and contain a letter and a number";
  } else if (newPassword === currentPassword) {
    errors.newPassword = "New password must be different from the current one";
  }

  if (confirmNewPassword !== newPassword) {
    errors.confirmNewPassword = "Passwords do not match";
  }

  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    errorKeys.forEach((field) => showFieldError(field, errors[field]));
    return;
  }

  currentUser.password = newPassword;
  const index = users.findIndex((u) => u.id === currentUser.id);
  users[index] = currentUser;
  saveUsers(users);

  e.target.reset();
  showToast("Password updated", "success");
});

// --- Reset CRM Data ---------------------------------------------------

document.getElementById("reset-data-btn").addEventListener("click", async () => {
  const sure = confirm(
    "This will delete all locally saved clients and fetch a fresh list. Continue?"
  );
  if (!sure) return;

  localStorage.removeItem("crm_clients"); // wipe the current client cache
  await loadClientsFromApi(); // from data.js - fetches fresh + saves

  showToast("CRM data has been reset", "success");
});
