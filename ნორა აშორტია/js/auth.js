// auth.js — everything related to accounts and sessions.
// Two localStorage keys are used:
//   crm_users   -> array of {name, email, company, password} created at signup
//   crm_session -> the currently logged-in user, or absent if logged out

function getUsers() {
    return JSON.parse(localStorage.getItem("crm_users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("crm_users", JSON.stringify(users));
}

function getSession() {
    const raw = localStorage.getItem("crm_session");
    return raw ? JSON.parse(raw) : null;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password validation helper (minimum 6 characters, number and uppercase letter)
function isValidPassword(password) {
    return (
        password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)
    );
}

// ---- Sign up ----
function handleSignup(event) {
    event.preventDefault();

    // Get elements inside the function to ensure they exist in DOM
    const nameInput = document.getElementById("su-name");
    const emailInput = document.getElementById("su-email");
    const companyInput = document.getElementById("su-company");
    const passwordInput = document.getElementById("su-password");
    const confirmPasswordInput = document.getElementById("su-confirm-password");
    const errorEl = document.getElementById("su-error");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const company = companyInput ? companyInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmPassword = confirmPasswordInput
        ? confirmPasswordInput.value
        : "";

    if (errorEl) errorEl.classList.remove("show");

    // Reset all input borders and error states
    [
        nameInput,
        emailInput,
        companyInput,
        passwordInput,
        confirmPasswordInput,
    ].forEach((el) => {
        if (el) {
            el.classList.remove("error");
            el.style.borderColor = "";
        }
    });

    let errorMessages = [];

    // Check name length (minimum 3 characters)
    if (name.length < 3) {
        if (nameInput) {
            nameInput.classList.add("error");
            nameInput.style.borderColor = "#ff4d4f";
        }
        errorMessages.push("Name must be at least 3 characters long.");
    }

    // Check valid email format OR if it already exists in users list
    const users = getUsers();
    const emailExists = users.some((u) => u.email === email);

    if (!isValidEmail(email)) {
        if (emailInput) {
            emailInput.classList.add("error");
            emailInput.style.borderColor = "#ff4d4f";
        }
        errorMessages.push("Please enter a valid email address.");
    } else if (emailExists) {
        if (emailInput) {
            emailInput.classList.add("error");
            emailInput.style.borderColor = "#ff4d4f";
        }
        errorMessages.push("An account with this email already exists.");
    }

    if (!company) {
        if (companyInput) {
            companyInput.classList.add("error");
            companyInput.style.borderColor = "#ff4d4f";
        }
        errorMessages.push("Please enter your company or store name.");
    }

    // Check password requirements (minimum 6 characters, uppercase letter and number)
    if (!isValidPassword(password)) {
        if (passwordInput) {
            passwordInput.classList.add("error");
            passwordInput.style.borderColor = "#ff4d4f";
        }
        errorMessages.push(
            "Password needs at least 6 characters, including a number and an uppercase letter.",
        );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        if (confirmPasswordInput) {
            confirmPasswordInput.classList.add("error");
            confirmPasswordInput.style.borderColor = "#ff4d4f";
        }
        errorMessages.push("Passwords do not match.");
    }

    // If there are any validation errors, display them and stop
    if (errorMessages.length > 0) {
        if (errorEl) {
            errorEl.innerHTML = errorMessages.join("<br>");
            errorEl.classList.add("show");
        }
        return;
    }

    // Saving a new user with the company
    users.push({ name, email, company, password });
    saveUsers(users);

    if (typeof showToast === "function") {
        showToast("Account created — please sign in", "success");
    }

    setTimeout(() => {
        window.location.href = "login.html";
    }, 900);
}

// ---- Login ----
function handleLogin(event) {
    event.preventDefault();
    const email = document
        .getElementById("li-email")
        .value.trim()
        .toLowerCase();
    const password = document.getElementById("li-password").value;
    const errorEl = document.getElementById("li-error");

    if (errorEl) errorEl.classList.remove("show");

    const users = getUsers();
    const match = users.find(
        (u) => u.email === email && u.password === password,
    );

    if (!match) {
        if (errorEl) {
            errorEl.textContent = "Invalid email or password";
            errorEl.classList.add("show");
        }
        if (typeof showToast === "function") {
            showToast("Invalid email or password", "error");
        }
        return;
    }

    // Name, email, and company are transferred to the session.
    localStorage.setItem(
        "crm_session",
        JSON.stringify({
            name: match.name,
            email: match.email,
            company: match.company || "",
            loggedInAt: new Date().toISOString(),
        }),
    );
    window.location.href = "dashboard.html";
}

// ---- Auth guard ----
// Call this at the very top of every protected page. If there is no
// session, the user is bounced to the login screen before anything renders.
function requireAuth() {
    if (!getSession()) {
        window.location.href = "login.html";
    }
}

// ---- Logout ----
function handleLogout() {
    localStorage.removeItem("crm_session");
    window.location.href = "login.html";
}
