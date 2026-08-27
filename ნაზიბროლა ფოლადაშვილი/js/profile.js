/* PROFILE ELEMENTS */

const profileAvatar = document.querySelector(
    "#profile-avatar"
);

const profileName = document.querySelector(
    "#profile-name"
);

const profileEmail = document.querySelector(
    "#profile-email"
);

const profileCompany = document.querySelector(
    "#profile-company"
);

const memberSince = document.querySelector(
    "#member-since"
);

const profileForm = document.querySelector(
    "#profile-form"
);

const profileFullNameInput = document.querySelector(
    "#profile-full-name"
);

const profileCompanyInput = document.querySelector(
    "#profile-company-input"
);

const profileFullNameError = document.querySelector(
    "#profile-full-name-error"
);

const passwordForm = document.querySelector(
    "#password-form"
);

const currentPasswordInput = document.querySelector(
    "#current-password"
);

const newPasswordInput = document.querySelector(
    "#new-password"
);

const confirmNewPasswordInput = document.querySelector(
    "#confirm-new-password"
);

const currentPasswordError = document.querySelector(
    "#current-password-error"
);

const newPasswordError = document.querySelector(
    "#new-password-error"
);

const confirmNewPasswordError = document.querySelector(
    "#confirm-new-password-error"
);

const resetCRMDataButton = document.querySelector(
    "#reset-crm-data"
);

const USERS_KEY = "crm_users";


/* STORAGE HELPERS */

function getUsers() {
    const storedUsers = localStorage.getItem(
        USERS_KEY
    );

    if (storedUsers === null) {
        return [];
    }

    return JSON.parse(storedUsers);
}

function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}

function getSession() {
    const storedSession = localStorage.getItem(
        SESSION_KEY
    );

    if (storedSession === null) {
        return null;
    }

    return JSON.parse(storedSession);
}


/* CURRENT USER */

function getCurrentUser() {
    const session = getSession();

    if (!session) {
        return null;
    }

    const users = getUsers();

    return users.find((user) => {
        return user.id === session.userId;
    }) || null;
}


/* PROFILE TOAST */

function displayProfileToast(
    message,
    type = "success"
) {
    if (typeof showToast === "function") {
        showToast(message, type);
    }
}


/* CREATE USER INITIALS */

function getUserInitials(fullName) {
    if (!fullName) {
        return "--";
    }

    const nameParts = fullName
        .trim()
        .split(/\s+/);

    const initials = nameParts
        .slice(0, 2)
        .map((namePart) => {
            return namePart.charAt(0);
        })
        .join("");

    return initials.toUpperCase();
}


/* FORMAT MEMBER DATE */

function formatMemberDate(dateValue) {
    if (!dateValue) {
        return "Unknown";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}


/* DISPLAY PROFILE */

function displayProfile() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        displayProfileToast(
            "User account could not be found",
            "error"
        );

        return;
    }

    profileAvatar.textContent = getUserInitials(
        currentUser.fullName
    );

    profileName.textContent = currentUser.fullName;
    profileEmail.textContent = currentUser.email;

    profileCompany.textContent =
        currentUser.company || "No company";

    memberSince.textContent = formatMemberDate(
        currentUser.createdAt
    );

    profileFullNameInput.value =
        currentUser.fullName;

    profileCompanyInput.value =
        currentUser.company || "";
}


/* CLEAR PROFILE ERRORS */

function clearProfileErrors() {
    profileFullNameError.textContent = "";

    profileFullNameInput.classList.remove(
        "input-error"
    );
}


/* VALIDATE PROFILE */

function validateProfile() {
    clearProfileErrors();

    const fullName =
        profileFullNameInput.value.trim();

    if (fullName.length < 3) {
        profileFullNameError.textContent =
            "Full name must be at least 3 characters";

        profileFullNameInput.classList.add(
            "input-error"
        );

        profileFullNameInput.focus();

        return false;
    }

    return true;
}


/* UPDATE PROFILE */

function updateProfile(event) {
    event.preventDefault();

    if (!validateProfile()) {
        return;
    }

    const session = getSession();
    const users = getUsers();

    if (!session) {
        displayProfileToast(
            "Your session could not be found",
            "error"
        );

        return;
    }

    const userIndex = users.findIndex((user) => {
        return user.id === session.userId;
    });

    if (userIndex === -1) {
        displayProfileToast(
            "User account could not be found",
            "error"
        );

        return;
    }

    users[userIndex].fullName =
        profileFullNameInput.value.trim();

    users[userIndex].company =
        profileCompanyInput.value.trim();

    saveUsers(users);

    displayProfile();

    displayProfileToast(
        "Profile updated successfully",
        "success"
    );
}


/* CLEAR PASSWORD ERRORS */

function clearPasswordErrors() {
    currentPasswordError.textContent = "";
    newPasswordError.textContent = "";
    confirmNewPasswordError.textContent = "";

    currentPasswordInput.classList.remove(
        "input-error"
    );

    newPasswordInput.classList.remove(
        "input-error"
    );

    confirmNewPasswordInput.classList.remove(
        "input-error"
    );
}


/* PASSWORD VALIDATION */

function isStrongPassword(password) {
    const hasUppercaseLetter =
        /[A-Z]/.test(password);

    const hasLowercaseLetter =
        /[a-z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    const hasSpecialCharacter =
        /[^A-Za-z0-9]/.test(password);

    return (
        password.length >= 8 &&
        hasUppercaseLetter &&
        hasLowercaseLetter &&
        hasNumber &&
        hasSpecialCharacter
    );
}


/* VALIDATE PASSWORD FORM */

function validatePasswordForm(currentUser) {
    clearPasswordErrors();

    let isFormValid = true;

    const currentPassword =
        currentPasswordInput.value;

    const newPassword =
        newPasswordInput.value;

    const confirmNewPassword =
        confirmNewPasswordInput.value;

    if (currentPassword === "") {
        currentPasswordError.textContent =
            "Current password is required";

        currentPasswordInput.classList.add(
            "input-error"
        );

        isFormValid = false;
    } else if (
        currentPassword !== currentUser.password
    ) {
        currentPasswordError.textContent =
            "Current password is incorrect";

        currentPasswordInput.classList.add(
            "input-error"
        );

        isFormValid = false;
    }

    if (newPassword === "") {
        newPasswordError.textContent =
            "New password is required";

        newPasswordInput.classList.add(
            "input-error"
        );

        isFormValid = false;
    } else if (!isStrongPassword(newPassword)) {
        newPasswordError.textContent =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

        newPasswordInput.classList.add(
            "input-error"
        );

        isFormValid = false;
    } else if (
        newPassword === currentUser.password
    ) {
        newPasswordError.textContent =
            "New password must be different from the current password";

        newPasswordInput.classList.add(
            "input-error"
        );

        isFormValid = false;
    }

    if (confirmNewPassword === "") {
        confirmNewPasswordError.textContent =
            "Confirm new password";

        confirmNewPasswordInput.classList.add(
            "input-error"
        );

        isFormValid = false;
    } else if (
        confirmNewPassword !== newPassword
    ) {
        confirmNewPasswordError.textContent =
            "Passwords do not match";

        confirmNewPasswordInput.classList.add(
            "input-error"
        );

        isFormValid = false;
    }

    return isFormValid;
}


/* CHANGE PASSWORD */

function changePassword(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
        displayProfileToast(
            "User account could not be found",
            "error"
        );

        return;
    }

    if (!validatePasswordForm(currentUser)) {
        return;
    }

    const session = getSession();
    const users = getUsers();

    if (!session) {
        displayProfileToast(
            "Your session could not be found",
            "error"
        );

        return;
    }

    const userIndex = users.findIndex((user) => {
        return user.id === session.userId;
    });

    if (userIndex === -1) {
        displayProfileToast(
            "User account could not be found",
            "error"
        );

        return;
    }

    users[userIndex].password =
        newPasswordInput.value;

    saveUsers(users);

    passwordForm.reset();
    clearPasswordErrors();

    displayProfileToast(
        "Password changed successfully",
        "success"
    );
}


/* RESET CRM DATA */

async function resetCRMData() {
    const shouldReset = window.confirm(
        "Are you sure you want to reset all CRM client data?"
    );

    if (!shouldReset) {
        return;
    }

    resetCRMDataButton.disabled = true;

    try {
        await resetClients();

        displayProfileToast(
            "CRM client data reset successfully",
            "success"
        );
    } catch (error) {
        console.error(error);

        displayProfileToast(
            "CRM client data could not be reset",
            "error"
        );
    } finally {
        resetCRMDataButton.disabled = false;
    }
}


/* EVENT LISTENERS */

function addProfileEventListeners() {
    profileForm.addEventListener(
        "submit",
        updateProfile
    );

    passwordForm.addEventListener(
        "submit",
        changePassword
    );

    resetCRMDataButton.addEventListener(
        "click",
        resetCRMData
    );
}


/* PAGE INITIALIZATION */

function initializeProfilePage() {
    const requiredElements = [
        profileAvatar,
        profileName,
        profileEmail,
        profileCompany,
        memberSince,
        profileForm,
        profileFullNameInput,
        profileCompanyInput,
        profileFullNameError,
        passwordForm,
        currentPasswordInput,
        newPasswordInput,
        confirmNewPasswordInput,
        currentPasswordError,
        newPasswordError,
        confirmNewPasswordError,
        resetCRMDataButton,
    ];

    const hasMissingElement = requiredElements.some(
        (element) => element === null
    );

    if (hasMissingElement) {
        console.error(
            "Profile page could not be initialized because one or more required elements are missing."
        );

        return;
    }

    addProfileEventListeners();
    displayProfile();
}

initializeProfilePage();