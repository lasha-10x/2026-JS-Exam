// profile.js — logic for profile.html.
// main.js calls initProfile() after it has already checked the
// visitor is logged in and set up the sidebar.

import { Storage } from "./storage.js";
import { UI } from "./ui.js";
import { DataStore } from "./data.js";

function getCurrentUser() {
  const session = Storage.getSession();
  const users = Storage.getUsers();
  return users.find((user) => user.id === session.userId);
}

function renderProfileInfo() {
  const user = getCurrentUser();

  document.getElementById("p-avatar").textContent = UI.getInitials(user.fullName);
  document.getElementById("p-fullName").textContent = user.fullName;
  document.getElementById("p-email").textContent = user.email;
  document.getElementById("p-company").textContent = user.company || "No company set";
  document.getElementById("p-memberSince").textContent = "Member since " + new Date(user.createdAt).toLocaleDateString();
}

function fillEditForm() {
  const user = getCurrentUser();
  const form = document.getElementById("edit-profile-form");
  form.fullName.value = user.fullName;
  form.company.value = user.company || "";
}

function handleEditProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  UI.clearFieldErrors(form);

  const fullName = form.fullName.value.trim();
  const company = form.company.value.trim();

  if (fullName.length < 3) {
    UI.showFieldError("ep-fullName", "Full name must be at least 3 characters");
    return;
  }

  const users = Storage.getUsers();
  const session = Storage.getSession();
  const user = users.find((u) => u.id === session.userId);
  user.fullName = fullName;
  user.company = company;
  Storage.saveUsers(users);

  renderProfileInfo();
  UI.showToast("Profile updated ✓", "success");
}

function isValidPasswordFormat(password) {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password.length >= 8 && hasLetter && hasNumber;
}

function handleChangePasswordSubmit(event) {
  event.preventDefault();
  const form = event.target;
  UI.clearFieldErrors(form);

  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;
  const confirmNewPassword = form.confirmNewPassword.value;

  const users = Storage.getUsers();
  const session = Storage.getSession();
  const user = users.find((u) => u.id === session.userId);

  let formIsValid = true;

  if (currentPassword !== user.password) {
    UI.showFieldError("cp-current", "Current password is incorrect");
    formIsValid = false;
  }

  if (!isValidPasswordFormat(newPassword)) {
    UI.showFieldError("cp-new", "Password must be at least 8 characters and contain a letter and a number");
    formIsValid = false;
  } else if (newPassword === currentPassword) {
    UI.showFieldError("cp-new", "New password must be different from the current one");
    formIsValid = false;
  }

  if (confirmNewPassword !== newPassword) {
    UI.showFieldError("cp-confirm", "Passwords do not match");
    formIsValid = false;
  }

  if (!formIsValid) {
    return;
  }

  user.password = newPassword;
  Storage.saveUsers(users);
  form.reset();
  UI.showToast("Password changed ✓", "success");
}

async function handleResetData() {
  const confirmed = confirm("Reset all client data? This will reload the original 30 clients from the API.");
  if (!confirmed) {
    return;
  }

  await DataStore.reloadClientsFromApi();
  UI.showToast("Client data has been reset", "success");
}

function openDeleteAccountModal() {
  document.getElementById("delete-account-modal").showModal();
}

function closeDeleteAccountModal() {
  const form = document.getElementById("delete-account-form");
  document.getElementById("delete-account-modal").close();
  form.reset();
  UI.clearFieldErrors(form);
}

function handleDeleteAccountSubmit(event) {
  event.preventDefault();
  const form = event.target;
  UI.clearFieldErrors(form);

  const password = form.password.value;
  const user = getCurrentUser();

  if (password !== user.password) {
    UI.showFieldError("da-password", "Password is incorrect");
    return;
  }

  // Remove this user from the stored list, then log them out.
  const remainingUsers = Storage.getUsers().filter((u) => u.id !== user.id);
  Storage.saveUsers(remainingUsers);
  Storage.clearSession();

  UI.showToast("Account deleted", "success");

  // Give the user a moment to read the toast before sending them to
  // the login page.
  setTimeout(function () {
    window.location.href = "index.html";
  }, 1500);
}

export function initProfile() {
  renderProfileInfo();
  fillEditForm();

  document.getElementById("edit-profile-form").addEventListener("submit", handleEditProfileSubmit);
  document.getElementById("change-password-form").addEventListener("submit", handleChangePasswordSubmit);
  document.getElementById("reset-data-btn").addEventListener("click", handleResetData);

  document.getElementById("delete-account-btn").addEventListener("click", openDeleteAccountModal);
  document.getElementById("delete-account-close").addEventListener("click", closeDeleteAccountModal);
  document.getElementById("delete-account-form").addEventListener("submit", handleDeleteAccountSubmit);
}
