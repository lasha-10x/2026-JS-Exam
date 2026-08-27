// profile.js — fills the profile page and handles account operations

function initProfile() {
    const session = getSession();
    if (!session) return;

    // Retrieving users and the current user from localStorage
    let users = JSON.parse(localStorage.getItem("crm_users") || "[]");
    let currentUser = users.find((u) => u.email === session.email) || {
        ...session,
        password: session.password || "",
    };

    // 1. Displaying profile data in the UI
    function renderProfileData() {
        const initials = (session.name || "User")
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        const avatarEl = document.getElementById("topbar-avatar");
        const pAvatarEl = document.getElementById("p-avatar");
        const pNameEl = document.getElementById("p-name");
        const pEmailEl = document.getElementById("p-email");
        const pCompanyEl = document.getElementById("p-company");
        const pJoinedEl = document.getElementById("p-joined");

        // New informative header elements
        const pMetaEmailEl = document.getElementById("p-meta-email");
        const pMetaDivisionEl = document.getElementById("p-meta-division");
        const pMetaDateEl = document.getElementById("p-meta-date");

        if (avatarEl) avatarEl.textContent = initials;
        if (pAvatarEl) pAvatarEl.textContent = initials;
        if (pNameEl) pNameEl.textContent = session.name || "User";
        if (pEmailEl) pEmailEl.textContent = session.email || "—";

        // Fill new header meta fields
        if (pMetaEmailEl)
            pMetaEmailEl.textContent = session.email || "demo@test.com";
        if (pMetaDivisionEl)
            pMetaDivisionEl.textContent = session.division || "10x";

        const formattedDate = session.loggedInAt
            ? new Date(session.loggedInAt).toLocaleDateString("en-US")
            : "7/20/2026";
        if (pMetaDateEl) pMetaDateEl.textContent = formattedDate;

        // Company name appearance (from session or crm_users)
        if (pCompanyEl) {
            pCompanyEl.textContent =
                session.company || currentUser.company || "Not specified";
        }

        if (pJoinedEl) {
            pJoinedEl.textContent = session.loggedInAt
                ? new Date(session.loggedInAt).toLocaleDateString()
                : new Date().toLocaleDateString();
        }
    }

    renderProfileData();

    // 1.1 EDIT PROFILE LOGIC
    const editProfileBtn = document.getElementById("editProfileBtn");
    const profileViewMode = document.getElementById("profileViewMode");
    const profileEditForm = document.getElementById("profileEditForm");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    const editNameInput = document.getElementById("editNameInput");
    const editEmailInput = document.getElementById("editEmailInput");
    const editCompanyInput = document.getElementById("editCompanyInput");

    if (editProfileBtn && profileViewMode && profileEditForm) {
        editProfileBtn.addEventListener("click", () => {
            // Entering existing data into inputs
            if (editNameInput) editNameInput.value = session.name || "";
            if (editEmailInput) editEmailInput.value = session.email || "";
            if (editCompanyInput)
                editCompanyInput.value =
                    session.company || currentUser.company || "";

            // Switching modes
            profileViewMode.style.display = "none";
            profileEditForm.style.display = "block";
            editProfileBtn.style.display = "none";
        });

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener("click", () => {
                profileEditForm.style.display = "none";
                profileViewMode.style.display = "block";
                editProfileBtn.style.display = "inline-block";
            });
        }

        profileEditForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const newName = editNameInput
                ? editNameInput.value.trim()
                : session.name;
            const newEmail = editEmailInput
                ? editEmailInput.value.trim()
                : session.email;
            const newCompany = editCompanyInput
                ? editCompanyInput.value.trim()
                : "";

            // Updating data in the current object
            currentUser.name = newName;
            currentUser.email = newEmail;
            currentUser.company = newCompany;

            session.name = newName;
            session.email = newEmail;
            session.company = newCompany;

            // Update the crm_users array
            users = users.map((u) =>
                u.email === session.email || u.id === currentUser.id
                    ? currentUser
                    : u,
            );
            localStorage.setItem("crm_users", JSON.stringify(users));

            // Update in session
            localStorage.setItem("crm_session", JSON.stringify(session));

            // Visual update
            renderProfileData();

            // Close the form and return to view mode
            profileEditForm.style.display = "none";
            profileViewMode.style.display = "block";
            editProfileBtn.style.display = "inline-block";

            if (typeof showToast === "function") {
                showToast("Profile updated successfully ✓", "success");
            }
        });
    }

    // 2. CHANGE PASSWORD VALIDATION BLOCK
    const changePasswordForm = document.getElementById("changePasswordForm");
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Clearing previous errors
            document
                .querySelectorAll(".field-error")
                .forEach((el) => (el.textContent = ""));

            const currPassEl = document.getElementById("currPass");
            const newPassEl = document.getElementById("newPass");
            const confNewPassEl = document.getElementById("confNewPass");

            const currPass = currPassEl ? currPassEl.value : "";
            const newPass = newPassEl ? newPassEl.value : "";
            const confNewPass = confNewPassEl ? confNewPassEl.value : "";

            let valid = true;

            if (currPass !== currentUser.password) {
                const err = document.getElementById("currPassError");
                if (err) err.textContent = "Current password is incorrect";
                valid = false;
            }

            const hasLetter = /[a-zA-Z]/.test(newPass);
            const hasNumber = /[0-9]/.test(newPass);

            if (newPass.length < 8 || !hasLetter || !hasNumber) {
                const err = document.getElementById("newPassError");
                if (err) {
                    err.textContent =
                        "Password must be at least 8 characters and contain a letter and a number";
                }
                valid = false;
            } else if (newPass === currentUser.password) {
                const err = document.getElementById("newPassError");
                if (err) {
                    err.textContent =
                        "New password must be different from current one";
                }
                valid = false;
            }

            if (newPass !== confNewPass) {
                const err = document.getElementById("confNewPassError");
                if (err) err.textContent = "Passwords do not match";
                valid = false;
            }

            if (!valid) return;

            // Password update
            currentUser.password = newPass;
            users = users.map((u) =>
                u.email === currentUser.email ? currentUser : u,
            );
            localStorage.setItem("crm_users", JSON.stringify(users));

            // Refresh session data
            session.password = newPass;
            localStorage.setItem("crm_session", JSON.stringify(session));

            changePasswordForm.reset();

            if (typeof showToast === "function") {
                showToast("Password changed successfully ✓", "success");
            }
        });
    }

    // 3. RESET DATA BLOCK
    const resetDataBtn = document.getElementById("resetDataBtn");
    if (resetDataBtn) {
        resetDataBtn.addEventListener("click", () => {
            if (
                confirm(
                    "Are you sure you want to clear active client data? Profile settings will remain intact.",
                )
            ) {
                localStorage.removeItem("crm_clients");
                if (typeof apiGetClients === "function") {
                    apiGetClients();
                }
                if (typeof showToast === "function") {
                    showToast("Client data wiped. Reloading...", "success");
                }
                setTimeout(() => {
                    window.location.href = "clients.html";
                }, 800);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", initProfile);
