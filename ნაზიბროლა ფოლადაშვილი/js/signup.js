/* SIGN UP FORM ELEMENTS */

const signupForm = document.querySelector("#signup-form");

const fullNameInput = document.querySelector("#full-name");
const emailInput = document.querySelector("#email");
const companyInput = document.querySelector("#company");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");

const fullNameError = document.querySelector("#full-name-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confirmPasswordError = document.querySelector(
    "#confirm-password-error"
);

const USERS_KEY = "crm_users";


/* VALIDATION HELPERS */

function showFieldError(input, errorElement, message) {
    input.classList.add("input-error");
    errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
    input.classList.remove("input-error");
    errorElement.textContent = "";
}

function isEmailValid(email) {
    const atIndex = email.indexOf("@");
    const dotIndex = email.indexOf(".", atIndex);

    return atIndex > 0 && dotIndex > atIndex + 1;
}

function isPasswordValid(password) {
    const hasUppercaseLetter = /[A-Z]/.test(password);
    const hasLowercaseLetter = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password);

    return (
        password.length >= 8 &&
        hasUppercaseLetter &&
        hasLowercaseLetter &&
        hasNumber &&
        hasSpecialCharacter
    );
}


/* LOCAL STORAGE */

function getUsers() {
    const storedUsers = localStorage.getItem(USERS_KEY);

    if (storedUsers === null) {
        return [];
    }

    return JSON.parse(storedUsers);
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


/* SIGN UP VALIDATION */

function validateSignupForm() {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const users = getUsers();

    let isFormValid = true;

    clearFieldError(fullNameInput, fullNameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    clearFieldError(confirmPasswordInput, confirmPasswordError);

    if (fullName.length < 3) {
        showFieldError(
            fullNameInput,
            fullNameError,
            "Full name must be at least 3 characters"
        );

        isFormValid = false;
    }

    if (!isEmailValid(email)) {
        showFieldError(
            emailInput,
            emailError,
            "Please enter a valid email address"
        );

        isFormValid = false;
    } else {
        const emailAlreadyExists = users.some((user) => {
            return user.email.toLowerCase() === email;
        });

        if (emailAlreadyExists) {
            showFieldError(
                emailInput,
                emailError,
                "An account with this email already exists"
            );

            isFormValid = false;
        }
    }

    if (!isPasswordValid(password)) {
        showFieldError(
            passwordInput,
            passwordError,
            "Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character"
        );

        isFormValid = false;
    }

    if (confirmPassword !== password) {
        showFieldError(
            confirmPasswordInput,
            confirmPasswordError,
            "Passwords do not match"
        );

        isFormValid = false;
    }

    return isFormValid;
}


/* CREATE ACCOUNT */

if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const isFormValid = validateSignupForm();

        if (!isFormValid) {
            return;
        }

        const users = getUsers();

        const newUser = {
            id: Date.now(),
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            password: passwordInput.value,
            company: companyInput.value.trim(),
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);

        saveUsers(users);

        signupForm.reset();

        showToast(
            "Account created successfully! Please log in.",
            "success"
        );

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
}