const profileAvatar = document.querySelector("#profileAvatar");
const profileDisplayName = document.querySelector(
  "#profileDisplayName"
);
const profileDisplayEmail = document.querySelector(
  "#profileDisplayEmail"
);
const profileDisplayCompany = document.querySelector(
  "#profileDisplayCompany"
);
const profileMemberSince = document.querySelector(
  "#profileMemberSince"
);

const profileForm = document.querySelector("#profileForm");
const profileFullNameInput = document.querySelector(
  "#profileFullName"
);
const profileCompanyInput = document.querySelector(
  "#profileCompany"
);

const passwordForm = document.querySelector("#passwordForm");
const currentPasswordInput = document.querySelector(
  "#currentPassword"
);
const newPasswordInput = document.querySelector("#newPassword");
const confirmNewPasswordInput = document.querySelector(
  "#confirmNewPassword"
);

const resetClientsButton = document.querySelector(
  "#resetClientsButton"
);

let users = getStorageItem("crm_users", []);
const session = getStorageItem("crm_session", null);

let currentUser = users.find((user) => {
  return user.id === session.userId;
});

initializeProfilePage();

profileForm.addEventListener("submit", handleProfileUpdate);
passwordForm.addEventListener("submit", handlePasswordChange);
resetClientsButton.addEventListener("click", handleResetClients);

function initializeProfilePage() {
  if (!currentUser) {
    return;
  }

  renderProfile();
  fillProfileForm();
}

function renderProfile() {
  profileDisplayName.textContent = currentUser.fullName;
  profileDisplayEmail.textContent = currentUser.email;

  profileDisplayCompany.textContent =
    currentUser.company || "No company";

  profileMemberSince.textContent =
    `Member since ${new Date(
      currentUser.createdAt
    ).toLocaleDateString()}`;

  profileAvatar.textContent = getInitials(
    currentUser.fullName
  );
}

function fillProfileForm() {
  profileFullNameInput.value = currentUser.fullName;
  profileCompanyInput.value = currentUser.company || "";
}

function getInitials(fullName) {
  return fullName
    .trim()
    .split(" ")
    .filter((part) => part !== "")
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function handleProfileUpdate(event) {
  event.preventDefault();

  clearProfileErrors();

  const fullName = profileFullNameInput.value.trim();
  const company = profileCompanyInput.value.trim();

  if (fullName.length < 3) {
    showProfileError(
      "profileFullName",
      "profileFullNameError",
      "Full name must be at least 3 characters"
    );

    return;
  }

  currentUser.fullName = fullName;
  currentUser.company = company;

  setStorageItem("crm_users", users);

  renderProfile();

  showToast("Profile updated ✓", "success");
}

function handlePasswordChange(event) {
  event.preventDefault();

  clearPasswordErrors();

  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmNewPassword = confirmNewPasswordInput.value;

  let isValid = true;

  if (currentPassword !== currentUser.password) {
    showProfileError(
      "currentPassword",
      "currentPasswordError",
      "Current password is incorrect"
    );

    isValid = false;
  }

  if (!isValidPassword(newPassword)) {
    showProfileError(
      "newPassword",
      "newPasswordError",
      "Password must be at least 8 characters and contain a letter and a number"
    );

    isValid = false;
  } else if (newPassword === currentUser.password) {
    showProfileError(
      "newPassword",
      "newPasswordError",
      "New password must be different from the current one"
    );

    isValid = false;
  }

  if (confirmNewPassword !== newPassword) {
    showProfileError(
      "confirmNewPassword",
      "confirmNewPasswordError",
      "Passwords do not match"
    );

    isValid = false;
  }

  if (!isValid) {
    return;
  }

  currentUser.password = newPassword;

  setStorageItem("crm_users", users);

  passwordForm.reset();

  showToast("Password changed ✓", "success");
}

async function handleResetClients() {
  const shouldReset = confirm(
    "Reset CRM data? All saved clients will be removed."
  );

  if (!shouldReset) {
    return;
  }

  try {
    removeStorageItem("crm_clients");

    await loadClients();

    showToast("CRM data reset ✓", "success");
  } catch (error) {
    console.error(error);

    showToast("Could not reset CRM data", "error");
  }
}

function isValidPassword(password) {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    password.length >= 8 &&
    hasLetter &&
    hasNumber
  );
}

function showProfileError(inputId, errorId, message) {
  const input = document.querySelector(`#${inputId}`);
  const errorElement = document.querySelector(`#${errorId}`);

  input.classList.add("input-error");
  errorElement.textContent = message;
}

function clearProfileErrors() {
  profileFullNameInput.classList.remove("input-error");

  document.querySelector(
    "#profileFullNameError"
  ).textContent = "";
}

function clearPasswordErrors() {
  const inputs = document.querySelectorAll(
    "#passwordForm input"
  );

  const errors = document.querySelectorAll(
    "#passwordForm .field-error"
  );

  inputs.forEach((input) => {
    input.classList.remove("input-error");
  });

  errors.forEach((error) => {
    error.textContent = "";
  });
}