import { showToast } from "./toast.js";

import {
  getStorageData,
  saveStorageData,
  removeStorageData
} from "./storage.js";

import {
  isValidEmail,
  showError,
  clearError
} from "./validation.js";

const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");
const resetCrmButton = document.getElementById("resetCrmButton");

const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profileCompany = document.getElementById("profileCompany");

const profileFullNameError = document.getElementById(
  "profileFullNameError"
);

const profileEmailError = document.getElementById(
  "profileEmailError"
);

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");

const confirmNewPassword = document.getElementById(
  "confirmNewPassword"
);

const currentPasswordError = document.getElementById(
  "currentPasswordError"
);

const newPasswordError = document.getElementById(
  "newPasswordError"
);

const confirmNewPasswordError = document.getElementById(
  "confirmNewPasswordError"
);

const profileInitials = document.getElementById("profileInitials");
const profileDisplayName = document.getElementById(
  "profileDisplayName"
);

const profileDisplayEmail = document.getElementById(
  "profileDisplayEmail"
);

const profileDisplayCompany = document.getElementById(
  "profileDisplayCompany"
);

const session = getStorageData("crm_session", null);
const users = getStorageData("crm_users", []);

const userIndex = users.findIndex(function (user) {
  return session && user.id === session.userId;
});

let currentUser = users[userIndex];

function displayUser() {
  if (!currentUser) {
    return;
  }

  profileFullName.value = currentUser.fullName;
  profileEmail.value = currentUser.email;
  profileCompany.value = currentUser.company || "";

  profileDisplayName.textContent = currentUser.fullName;
  profileDisplayEmail.textContent = currentUser.email;

  profileDisplayCompany.textContent =
    currentUser.company || "Not provided";

  const nameParts = currentUser.fullName
    .trim()
    .split(" ");

  let initials = nameParts[0][0];

  if (nameParts.length > 1) {
    initials += nameParts[nameParts.length - 1][0];
  }

  profileInitials.textContent = initials.toUpperCase();
}

displayUser();

profileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  clearError(
    profileFullName,
    profileFullNameError
  );

  clearError(
    profileEmail,
    profileEmailError
  );

  const fullNameValue = profileFullName.value.trim();

  const emailValue = profileEmail.value
    .trim()
    .toLowerCase();

  const companyValue = profileCompany.value.trim();

  let isValid = true;

  if (fullNameValue.length < 3) {
    showError(
      profileFullName,
      profileFullNameError,
      "Full name must be at least 3 characters."
    );

    isValid = false;
  }

  if (!isValidEmail(emailValue)) {
    showError(
      profileEmail,
      profileEmailError,
      "Please enter a valid email address."
    );

    isValid = false;
  }

  const duplicateEmail = users.some(function (user) {
    return (
      user.email.toLowerCase() === emailValue &&
      user.id !== currentUser.id
    );
  });

  if (duplicateEmail) {
    showError(
      profileEmail,
      profileEmailError,
      "This email is already registered."
    );

    isValid = false;
  }

  if (!isValid) {
    return;
  }

  currentUser.fullName = fullNameValue;
  currentUser.email = emailValue;
  currentUser.company = companyValue;

  users[userIndex] = currentUser;

  saveStorageData("crm_users", users);

  session.email = emailValue;

  saveStorageData("crm_session", session);

  displayUser();

  showToast(
    "Profile updated successfully",
    "success"
  );
});

passwordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  clearError(
    currentPassword,
    currentPasswordError
  );

  clearError(
    newPassword,
    newPasswordError
  );

  clearError(
    confirmNewPassword,
    confirmNewPasswordError
  );

  let isValid = true;

  if (currentPassword.value !== currentUser.password) {
    showError(
      currentPassword,
      currentPasswordError,
      "Current password is incorrect."
    );

    isValid = false;
  }

  if (newPassword.value.length < 8) {
    showError(
      newPassword,
      newPasswordError,
      "Password must be at least 8 characters."
    );

    isValid = false;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    showError(
      confirmNewPassword,
      confirmNewPasswordError,
      "Passwords do not match."
    );

    isValid = false;
  }

  if (!isValid) {
    return;
  }

  currentUser.password = newPassword.value;
  users[userIndex] = currentUser;

  saveStorageData("crm_users", users);

  passwordForm.reset();

  showToast(
    "Password updated successfully",
    "success"
  );
});

resetCrmButton.addEventListener("click", function () {
  const confirmed = confirm(
    "Are you sure you want to reset CRM data?"
  );

  if (!confirmed) {
    return;
  }

  removeStorageData("crm_clients");

  showToast(
    "CRM data was reset",
    "success"
  );

  setTimeout(function () {
    window.location.href = "clients.html";
  }, 1000);
});