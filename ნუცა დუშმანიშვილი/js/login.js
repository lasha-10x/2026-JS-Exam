/* Login page */

// Removes previous login errors
function clearLoginErrors() {
    const errorElements = document.querySelectorAll(
        "#loginForm .form-error"
    );

    const inputElements = document.querySelectorAll(
        "#loginForm input"
    );

    errorElements.forEach(function (errorElement) {
        errorElement.textContent = "";
    });

    inputElements.forEach(function (inputElement) {
        inputElement.classList.remove("input-error");
    });
}

// Displays an error underneath a login field
function showLoginError(input, errorId, message) {
    input.classList.add("input-error");
    document.getElementById(errorId).textContent = message;
}

// Checks whether the required login fields contain values
function validateLoginForm(emailInput, passwordInput) {
    let formIsValid = true;

    if (emailInput.value.trim() === "") {
        showLoginError(
            emailInput,
            "loginEmailError",
            "Email is required"
        );

        formIsValid = false;
    }

    if (passwordInput.value === "") {
        showLoginError(
            passwordInput,
            "loginPasswordError",
            "Password is required"
        );

        formIsValid = false;
    }

    return formIsValid;
}

// Starts the login page after the HTML has loaded
document.addEventListener(
    "DOMContentLoaded",
    initializeLoginPage
);

// Connects the login form to its submit handler
function initializeLoginPage() {
    const existingSession = getSession();

    if (existingSession !== null) {
        window.location.replace("dashboard.html");
        return;
    }
    const loginForm = document.getElementById("loginForm");

    if (loginForm === null) {
        return;
    }

    loginForm.addEventListener(
        "submit",
        handleLoginSubmit
    );
}

// Validates the credentials and logs in the matching user
function handleLoginSubmit(event) {
    event.preventDefault();

    clearLoginErrors();

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const formIsValid = validateLoginForm(
        emailInput,
        passwordInput
    );

    if (!formIsValid) {
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const user = findUserByCredentials(
        email,
        password
    );

    if (user === null) {
        showLoginError(
            passwordInput,
            "loginPasswordError",
            "Invalid email or password"
        );

        return;
    }

    createUserSession(user);

    window.location.href = "dashboard.html";
}