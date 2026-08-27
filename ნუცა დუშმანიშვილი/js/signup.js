/* Sign up page */

// Runs the signup page setup after the HTML has fully loaded
document.addEventListener("DOMContentLoaded", initializeSignupPage);

// Finds the signup form and connects its submit event
function initializeSignupPage() {
    const existingSession = getSession();

    if (existingSession !== null) {
        window.location.replace("dashboard.html");
        return;
    }
    
    const signupForm = document.getElementById("signupForm");

    if (signupForm === null) {
        return;
    }

    signupForm.addEventListener("submit", handleSignupSubmit);
}

// Validates the form and creates a new user when the form is submitted
function handleSignupSubmit(event) {
    event.preventDefault();

    clearSignupErrors();

    const nameInput = document.getElementById("signupName");
    const emailInput = document.getElementById("signupEmail");
    const companyInput = document.getElementById("signupCompany");
    const passwordInput = document.getElementById("signupPassword");
    const confirmPasswordInput = document.getElementById("signupConfirmPassword");

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const company = companyInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let formIsInvalid = false;

    if (fullName === "") {
        showSignupError(nameInput, "signupNameError", "Full name is required!");
        formIsInvalid = true;
    } else if (fullName.length < 3) {
        showSignupError(nameInput, "signupNameError", "Full name must be at least 3 characters");
        formIsInvalid = true;
    }

    if (email === "") {
        showSignupError(emailInput, "signupEmailError", "Email is required!");
        formIsInvalid = true;
    } else if (!emailIsValid(email)) {
        showSignupError(emailInput, "signupEmailError", "Please enter a valid email address");
        formIsInvalid = true;
    } else if (emailAlreadyExists(email)) {
        showSignupError(emailInput, "signupEmailError", "An account with this email already exists");
        formIsInvalid = true;
    }

    if (!passwordIsValid(password)) {
        const passwordMessage = "Password must be at least 8 characters and contain a letter and a number";
        showSignupError(passwordInput, "signupPasswordError", passwordMessage);
        formIsInvalid = true;
    }

    if (password !== confirmPassword) {
        showSignupError(confirmPasswordInput, "signupConfirmPasswordError", "Passwords do not match");
        formIsInvalid = true;
    }

    if (formIsInvalid) {
        return;
    }

    createNewUser(fullName, email, company, password);
    showSignupToast("Account created successfully! Please log in.", "success");

    setTimeout(redirectToLogin, 1500);
}

// Checks whether the email has a valid format
function emailIsValid(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Checks whether another user already has the same email
function emailAlreadyExists(email) {
    const users = getUsers();

    return users.some(function (user) {
        const savedEmail = String(user.email).toLowerCase();
        return savedEmail === email;
    });
}

// Checks whether the password meets the required rules
function passwordIsValid(password) {
    const hasEnoughCharacters = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasEnoughCharacters && hasLetter && hasNumber;
}

// Creates a new user object and saves it to localStorage
function createNewUser(fullName, email, company, password) {
    const users = getUsers();

    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        company: company,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
}

// Displays an error message and adds an error style to an input
function showSignupError(input, errorId, message) {
    input.classList.add("input-error");
    document.getElementById(errorId).textContent = message;
}

// Removes all previous signup error messages and error styles
function clearSignupErrors() {
    const errorElements = document.querySelectorAll("#signupForm .form-error");
    const inputElements = document.querySelectorAll("#signupForm input");

    errorElements.forEach(function (errorElement) {
        errorElement.textContent = "";
    });

    inputElements.forEach(function (inputElement) {
        inputElement.classList.remove("input-error");
    });
}

// Creates and displays a temporary notification message
function showSignupToast(message, type) {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");

    toast.className = "toast toast-" + type;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 3000);
}

// Redirects the user to the login page
function redirectToLogin() {
    window.location.href = "index.html";
}