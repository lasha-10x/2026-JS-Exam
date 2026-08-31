const profileDetails = document.querySelector("#profile-details");
const profileNameElement = document.querySelector("#profile-name");
const profileEmailElement = document.querySelector("#profile-email");
const profileCompanyElement = document.querySelector("#profile-company");
const profileCreatedAtElement = document.querySelector("#profile-created-at");
const profileAvatarElement = document.querySelector("#profile-avatar");
const editProfileButton = document.querySelector("#edit-profile-button");
const editProfileForm = document.querySelector("#edit-profile-form");
const editProfileNameInput = document.querySelector("#edit-profile-name");
const editProfileCompanyInput = document.querySelector(
  "#edit-profile-company"
);
const saveProfileButton = document.querySelector("#save-profile-button");
const profileNameError = document.querySelector("#profile-name-error");
const cancelProfileEditButton = document.querySelector(
  "#cancel-profile-edit-button"
);
const changePasswordForm = document.querySelector("#change-password-form");
const currentPasswordInput = document.querySelector("#current-password");
const newPasswordInput = document.querySelector("#new-password");
const confirmNewPasswordInput = document.querySelector(
  "#confirm-new-password"
);
const currentPasswordError = document.querySelector(
  "#current-password-error"
);
const newPasswordError = document.querySelector("#new-password-error");
const confirmNewPasswordError = document.querySelector(
  "#confirm-new-password-error"
);
const exportClientsButton = document.querySelector(
  "#export-clients-button"
);
const importClientsButton = document.querySelector(
  "#import-clients-button"
);
const importClientsFileInput = document.querySelector(
  "#import-clients-file"
);
const resetCrmDataButton = document.querySelector("#reset-crm-data-button");

// The session id identifies the matching registered user.
function getCurrentUser() {
  const session = getSession();

  if (!session) {
    return null;
  }

  const users = getUsers();
  const currentUser = users.find(function (user) {
    return Number(user.id) === Number(session.userId);
  });

  return currentUser || null;
}

function getProfileInitials(fullName) {
  const nameParts = (fullName || "").trim().split(" ").filter(function (part) {
    return part !== "";
  });
  const initials = nameParts.slice(0, 2).map(function (part) {
    return part.charAt(0);
  }).join("");

  return initials.toUpperCase() || "?";
}

function displayProfile() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
    return;
  }

  profileAvatarElement.textContent = getProfileInitials(currentUser.fullName);
  profileNameElement.textContent = currentUser.fullName || "User";
  profileEmailElement.textContent = currentUser.email || "—";
  profileCompanyElement.textContent = currentUser.company || "—";

  const createdDate = new Date(currentUser.createdAt);

  profileCreatedAtElement.textContent = Number.isNaN(createdDate.getTime())
    ? "—"
    : createdDate.toLocaleDateString();
}

// Edit mode starts with the user's current values and saves only changed fields.
function populateProfileForm(user) {
  editProfileNameInput.value = user.fullName;
  editProfileCompanyInput.value = user.company || "";
  saveProfileButton.disabled = true;
}

// Save is enabled only when the form differs from the stored profile.
function updateProfileSaveButtonState() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    saveProfileButton.disabled = true;
    return;
  }

  const nameChanged =
    editProfileNameInput.value.trim() !== (currentUser.fullName || "").trim();
  const companyChanged =
    editProfileCompanyInput.value.trim() !== (currentUser.company || "").trim();

  saveProfileButton.disabled = !nameChanged && !companyChanged;
}

function clearProfileErrors() {
  profileNameError.textContent = "";
  editProfileNameInput.classList.remove("input-error");
}

function showProfileError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function validateProfileForm() {
  let isValid = true;
  const fullName = editProfileNameInput.value.trim();

  if (fullName.length < 3) {
    showProfileError(
      editProfileNameInput,
      profileNameError,
      "Full name must be at least 3 characters"
    );
    isValid = false;
  }

  return isValid;
}

function clearPasswordErrors() {
  currentPasswordError.textContent = "";
  newPasswordError.textContent = "";
  confirmNewPasswordError.textContent = "";
  currentPasswordInput.classList.remove("input-error");
  newPasswordInput.classList.remove("input-error");
  confirmNewPasswordInput.classList.remove("input-error");
}

function showPasswordError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

// Export and import move only client records between browser storage origins.
function exportClients() {
  const clients = getStoredClients();

  if (clients === null) {
    showMessage("No client data is available to export", "error");
    return;
  }

  const fileContent = JSON.stringify(clients, null, 2);
  const file = new Blob([fileContent], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");
  const currentDate = new Date().toISOString().slice(0, 10);

  downloadLink.href = downloadUrl;
  downloadLink.download = `10x-crm-clients-${currentDate}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
  showMessage("Clients exported successfully!", "success");
}

function importClients(event) {
  const selectedFile = event.target.files[0];

  if (!selectedFile) {
    return;
  }

  const fileReader = new FileReader();

  fileReader.addEventListener("load", function () {
    try {
      const importedClients = JSON.parse(fileReader.result);
      const containsInvalidClient =
        !Array.isArray(importedClients) ||
        importedClients.some(function (client) {
          return !client || typeof client !== "object";
        });

      if (containsInvalidClient) {
        throw new Error("The selected file does not contain a client array");
      }

      const shouldImport = confirm(
        "Importing this file will replace your current clients. Continue?"
      );

      if (!shouldImport) {
        return;
      }

      const normalizedClients = importedClients.map(function (client) {
        return normalizeStoredClient(client, getCurrentClientOwnerId());
      });

      saveClientsForCurrentUser(normalizedClients);
      showMessage("Clients imported successfully!", "success");
    } catch (error) {
      console.error("Could not import clients:", error);
      showMessage("Could not import clients. Choose a valid JSON file.", "error");
    } finally {
      importClientsFileInput.value = "";
    }
  });

  fileReader.addEventListener("error", function () {
    importClientsFileInput.value = "";
    showMessage("Could not read the selected file", "error");
  });

  fileReader.readAsText(selectedFile);
}

// Reset removes only client data, then restores the original API records.
async function resetCrmData() {
  const shouldReset = confirm(
    "Are you sure you want to reset all CRM client data?"
  );

  if (!shouldReset) {
    return;
  }

  resetCrmDataButton.disabled = true;
  resetCrmDataButton.textContent = "Resetting...";

  try {
    saveClientsForCurrentUser([]);
    await fetchClientsFromApi();
    showMessage("CRM data reset successfully!", "success");
  } catch (error) {
    showMessage("Failed to reset CRM data", "error");
    console.error("Failed to reset CRM data:", error);
  } finally {
    resetCrmDataButton.disabled = false;
    resetCrmDataButton.textContent = "Reset CRM Data";
  }
}

editProfileButton.addEventListener("click", function () {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    displayProfile();
    return;
  }

  clearProfileErrors();
  populateProfileForm(currentUser);
  profileDetails.classList.add("hidden");
  editProfileForm.classList.remove("hidden");
});

editProfileNameInput.addEventListener("input", updateProfileSaveButtonState);
editProfileCompanyInput.addEventListener("input", updateProfileSaveButtonState);

cancelProfileEditButton.addEventListener("click", function () {
  clearProfileErrors();
  saveProfileButton.disabled = true;
  editProfileForm.classList.add("hidden");
  profileDetails.classList.remove("hidden");
});

editProfileForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearProfileErrors();

  if (!validateProfileForm()) {
    return;
  }

  const session = getSession();
  const users = getUsers();

  if (!session) {
    displayProfile();
    return;
  }

  const currentUserIndex = users.findIndex(function (user) {
    return Number(user.id) === Number(session.userId);
  });

  if (currentUserIndex === -1) {
    displayProfile();
    return;
  }

  const fullName = editProfileNameInput.value.trim();
  const company = editProfileCompanyInput.value.trim();

  users[currentUserIndex].fullName = fullName;
  users[currentUserIndex].company = company;

  localStorage.setItem("crm_users", JSON.stringify(users));

  session.fullName = fullName;
  localStorage.setItem("crm_session", JSON.stringify(session));

  displayProfile();
  editProfileForm.classList.add("hidden");
  profileDetails.classList.remove("hidden");
  clearProfileErrors();
  saveProfileButton.disabled = true;
  showMessage("Profile updated ✓", "success");
});

// Password validation finishes before the stored user record is updated.
changePasswordForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearPasswordErrors();

  const currentUser = getCurrentUser();

  if (!currentUser) {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
    return;
  }

  let isValid = true;
  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmNewPassword = confirmNewPasswordInput.value;
  const containsLetter = /[a-zA-Z]/.test(newPassword);
  const containsNumber = /[0-9]/.test(newPassword);

  if (currentPassword !== currentUser.password) {
    showPasswordError(
      currentPasswordInput,
      currentPasswordError,
      "Current password is incorrect"
    );
    isValid = false;
  }

  if (
    newPassword.length < 8 ||
    !containsLetter ||
    !containsNumber
  ) {
    showPasswordError(
      newPasswordInput,
      newPasswordError,
      "Password must be at least 8 characters and contain a letter and a number"
    );
    isValid = false;
  } else if (newPassword === currentUser.password) {
    showPasswordError(
      newPasswordInput,
      newPasswordError,
      "New password must be different from the current one"
    );
    isValid = false;
  }

  if (confirmNewPassword !== newPassword) {
    showPasswordError(
      confirmNewPasswordInput,
      confirmNewPasswordError,
      "Passwords do not match"
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const session = getSession();
  const users = getUsers();
  const currentUserIndex = users.findIndex(function (user) {
    return Number(user.id) === Number(session.userId);
  });

  if (currentUserIndex === -1) {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
    return;
  }

  // Real applications must store hashed passwords securely on a server.
  users[currentUserIndex].password = newPassword;
  localStorage.setItem("crm_users", JSON.stringify(users));

  changePasswordForm.reset();
  clearPasswordErrors();
  showMessage("Password changed ✓", "success");
});

exportClientsButton.addEventListener("click", exportClients);
importClientsButton.addEventListener("click", function () {
  importClientsFileInput.click();
});
importClientsFileInput.addEventListener("change", importClients);
resetCrmDataButton.addEventListener("click", resetCrmData);

displayProfile();
