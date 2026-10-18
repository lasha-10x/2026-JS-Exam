// Loads the current user and handles profile, password, and CRM reset actions.

let profileMessageTimeoutId = null;
// This remembers the current message timer so it can be replaced.

// Finds the user represented by the current login session.
function getCurrentUser() {
  const session = getSession();
  // Use the session to find the matching full user record.
  const users = getUsers();
  const currentUser = getUserForSession(session, users);

  if (!currentUser) {
    return null;
  }

  const completeSession = createSessionForUser(
    currentUser,
    session.loginAt
  );

  if (JSON.stringify(session) !== JSON.stringify(completeSession)) {
    // Refresh a legacy/incomplete session while leaving its original login time intact.
    saveSession(completeSession);
  }

  return currentUser;
}

// Creates one or two uppercase initials from the saved full name.
function getUserInitials(user) {
  const fullName =
    user && typeof user.fullName === "string"
      ? user.fullName.trim()
      : "";
  const nameParts = fullName === "" ? [] : fullName.split(/\s+/);
  // Split names at spaces to create one or two initials.

  if (nameParts.length === 0) {
    // Use U when there is no name to turn into initials.
    return "U";
  }

  const firstInitial = nameParts[0].charAt(0);
  const lastInitial =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1].charAt(0)
      : "";

  return (firstInitial + lastInitial).toUpperCase();
}

// Enables Save Changes only when Full Name or Company really changed.
function updateProfileSubmitButton(user) {
  const profileForm = document.getElementById("profile-form");
  const fullNameInput = document.getElementById("profile-full-name");
  const companyInput = document.getElementById("profile-company");
  const submitButton = profileForm
    ? profileForm.querySelector('button[type="submit"]')
    : null;

  if (!user || !fullNameInput || !companyInput || !submitButton) {
    // Do not try to update a form that is not on this page.
    return;
  }

  const fullNameChanged =
    // Compare clean text so extra spaces do not enable Save Changes.
    fullNameInput.value.trim() !== (user.fullName || "").trim();
  const companyChanged =
    companyInput.value.trim() !== (user.company || "").trim();

  // Do not offer a save action unless it would actually change stored data.
  submitButton.disabled = !fullNameChanged && !companyChanged;
}

// Updates the profile summary and prefills both editable fields.
function renderProfile(user) {
  const profileAvatar = document.getElementById("profile-avatar");
  const displayName = document.getElementById("profile-display-name");
  const displayEmail = document.getElementById("profile-display-email");
  const displayCompany = document.getElementById(
    "profile-display-company"
  );
  const memberSince = document.getElementById("profile-member-since");
  const fullNameInput = document.getElementById("profile-full-name");
  const companyInput = document.getElementById("profile-company");

  if (profileAvatar) {
    profileAvatar.textContent = getUserInitials(user);
  }

  if (displayName) {
    displayName.textContent = user.fullName || "User";
  }

  if (displayEmail) {
    displayEmail.textContent = user.email || "";
  }

  if (displayCompany) {
    displayCompany.textContent = user.company || "No company";
  }

  if (memberSince) {
    // Show a friendly date rather than the raw ISO value.
    const createdTimestamp = Date.parse(user.createdAt);
    const createdDate = Number.isFinite(createdTimestamp)
      ? new Date(createdTimestamp).toLocaleDateString()
      : "Unknown";
    memberSince.textContent = `Member since ${createdDate}`;
  }

  if (fullNameInput) {
    fullNameInput.value = user.fullName || "";
  }

  if (companyInput) {
    companyInput.value = user.company || "";
  }

  updateProfileSubmitButton(user);
}

// Displays temporary success/error feedback without using alert dialogs.
function showProfileMessage(message, type) {
  const profileMessage = document.getElementById("profile-message");

  if (!profileMessage) {
    return;
  }

  if (profileMessageTimeoutId !== null) {
    // Cancel an older timer before showing the newest message.
    clearTimeout(profileMessageTimeoutId);
    profileMessageTimeoutId = null;
  }

  profileMessage.textContent = message;
  profileMessage.classList.remove("success", "error");

  if (message !== "" && type) {
    profileMessage.classList.add(type);
    profileMessageTimeoutId = setTimeout(function () {
      profileMessage.textContent = "";
      profileMessage.classList.remove("success", "error");
      profileMessageTimeoutId = null;
    }, 3000);
  }
}

// Shared field-error helpers used by both Profile forms.
function clearFormErrors(form) {
  // Clear messages and red borders before validating again.
  if (!form) {
    return;
  }

  form.querySelectorAll(".field-error").forEach(function (errorElement) {
    errorElement.textContent = "";
  });

  form
    .querySelectorAll("input, select, textarea")
    .forEach(function (formControl) {
      formControl.classList.remove("input-error");
    });
}

function showFormFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const formGroup = input ? input.closest(".form-group") : null;
  const errorElement = formGroup
    ? formGroup.querySelector(".field-error")
    : null;

  if (input) {
    input.classList.add("input-error");
  }

  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Profile and password validation rules.
function isValidProfilePassword(password) {
  return (
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

function validateProfileForm() {
  const profileForm = document.getElementById("profile-form");
  const fullNameInput = document.getElementById("profile-full-name");
  const companyInput = document.getElementById("profile-company");

  clearFormErrors(profileForm);

  const fullName = fullNameInput.value.trim();
  const company = companyInput.value.trim();
  let isValid = true;

  if (fullName.length < 3) {
    showFormFieldError(
      "profile-full-name",
      "Full name must be at least 3 characters"
    );
    isValid = false;
  }

  return isValid
    ? {
        isValid: true,
        values: {
          fullName: fullName,
          company: company
        }
      }
    : {
        isValid: false,
        values: null
      };
}

function validatePasswordForm(currentUser) {
  // Read all three fields before comparing their values.
  const passwordForm = document.getElementById("password-form");
  const currentPassword = document.getElementById(
    "current-password"
  ).value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById(
    "confirm-new-password"
  ).value;
  let isValid = true;

  clearFormErrors(passwordForm);

  if (currentPassword !== currentUser.password) {
    // The old password must match before it can be changed.
    showFormFieldError(
      "current-password",
      "Current password is incorrect"
    );
    isValid = false;
  }

  if (!isValidProfilePassword(newPassword)) {
    showFormFieldError(
      "new-password",
      "Password must be at least 8 characters and contain a letter and a number"
    );
    isValid = false;
  } else if (newPassword === currentUser.password) {
    showFormFieldError(
      "new-password",
      "New password must be different from the current one"
    );
    isValid = false;
  }

  if (confirmPassword !== newPassword) {
    showFormFieldError(
      "confirm-new-password",
      "Passwords do not match"
    );
    isValid = false;
  }

  return isValid
    ? {
        isValid: true,
        newPassword: newPassword
      }
    : {
        isValid: false,
        newPassword: null
      };
}

// Saves only Full Name and Company while preserving every other user property.
function saveProfileChanges(event) {
  event.preventDefault();
  showProfileMessage("", "");

  const currentUser = getCurrentUser();

  if (!currentUser) {
    showProfileMessage("Unable to update your profile.", "error");
    return;
  }

  const validation = validateProfileForm();

  if (!validation.isValid) {
    return;
  }

  const users = getUsers();
  const userIndex = users.findIndex(function (user) {
    return user.id === currentUser.id;
  });

  if (userIndex === -1) {
    showProfileMessage("Unable to update your profile.", "error");
    return;
  }

  users[userIndex].fullName = validation.values.fullName;
  // Change only the editable properties in this form.
  users[userIndex].company = validation.values.company;
  saveUsers(users);

  renderProfile(users[userIndex]);
  showProfileMessage("Profile updated ✓", "success");
}

// Changes only the saved password and leaves the active session unchanged.
function savePasswordChange(event) {
  event.preventDefault();
  showProfileMessage("", "");

  const currentUser = getCurrentUser();

  if (!currentUser) {
    showProfileMessage("Unable to update your password.", "error");
    return;
  }

  const validation = validatePasswordForm(currentUser);

  if (!validation.isValid) {
    return;
  }

  const users = getUsers();
  const userIndex = users.findIndex(function (user) {
    return user.id === currentUser.id;
  });

  if (userIndex === -1) {
    showProfileMessage("Unable to update your password.", "error");
    return;
  }

  users[userIndex].password = validation.newPassword;
  saveUsers(users);

  const passwordForm = document.getElementById("password-form");
  passwordForm.reset();
  // Empty the sensitive password fields after a successful update.
  clearFormErrors(passwordForm);
  showProfileMessage("Password changed ✓", "success");
}

// Status helper and reset workflow for restoring the initial 30 clients.
function setResetDataStatus(message, type) {
  const statusElement = document.getElementById("reset-data-status");

  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.classList.remove("success", "error");

  if (message !== "" && type) {
    statusElement.classList.add(type);
  }
}

async function resetClientData() {
  const shouldReset = window.confirm(
    "Reset all client data to the initial 30 clients? Your client changes will be lost."
  );

  if (!shouldReset) {
    // Cancel stops before any saved client data is removed.
    // Confirmation makes this otherwise destructive reset easy to cancel.
    return;
  }

  const resetButton = document.getElementById("reset-data-button");
  // Save the normal label so it can be restored after the request.
  const originalButtonText = "Reset CRM Data";

  resetButton.disabled = true;
  resetButton.textContent = "Resetting...";
  setResetDataStatus("Restoring initial clients...", "");

  try {
    // resetClientsData clears only client records; accounts and preferences remain.
    const initialClients = await resetClientsData();
    resetButton.textContent = originalButtonText;
    setResetDataStatus(
      `${initialClients.length} initial clients restored.`,
      "success"
    );
    showProfileMessage(
      "Client data reset successfully.",
      "success"
    );
  } catch (error) {
    resetButton.textContent = "Retry Reset CRM Data";
    setResetDataStatus(
      "Unable to reset client data. Please try again.",
      "error"
    );
    showProfileMessage("Unable to reset client data.", "error");
  } finally {
    resetButton.disabled = false;
  }
}

// Connects forms and buttons, then renders the signed-in user.
document.addEventListener("DOMContentLoaded", function () {
  const profileForm = document.getElementById("profile-form");
  const passwordForm = document.getElementById("password-form");
  const resetButton = document.getElementById("reset-data-button");
  const expectedProfileElement = document.getElementById(
    "profile-full-name"
  );

  if (!profileForm || !passwordForm || !expectedProfileElement) {
    return;
  }

  profileForm.addEventListener("submit", saveProfileChanges);
  passwordForm.addEventListener("submit", savePasswordChange);
  profileForm.addEventListener("input", function () {
    updateProfileSubmitButton(getCurrentUser());
  });

  if (resetButton) {
    resetButton.addEventListener("click", resetClientData);
  }

  const currentUser = getCurrentUser();

  if (!currentUser) {
    showProfileMessage("Unable to load your profile.", "error");
    return;
  }

  renderProfile(currentUser);
});
