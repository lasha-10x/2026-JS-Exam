/* LOGIN FORM ELEMENTS */

const loginForm = document.querySelector("#login-form");

const emailInput = document.querySelector("#login-email");
const passwordInput = document.querySelector("#login-password");

const emailError = document.querySelector("#login-email-error");
const passwordError = document.querySelector("#login-password-error");
const formError = document.querySelector("#login-form-error");

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

function getUsers() {
    const storedUsers = localStorage.getItem(USERS_KEY);

    if (storedUsers === null) {
        return [];
    }

    return JSON.parse(storedUsers);
}


/* LOGIN */

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        clearFieldError(emailInput, emailError);
        clearFieldError(passwordInput, passwordError);

        formError.textContent = "";

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        let isFormValid = true;

        if (email === "") {
            showFieldError(
                emailInput,
                emailError,
                "Email is required"
            );

            isFormValid = false;
        }

        if (password === "") {
            showFieldError(
                passwordInput,
                passwordError,
                "Password is required"
            );

            isFormValid = false;
        }

        if (!isFormValid) {
            return;
        }

        const users = getUsers();

        const user = users.find((user) => {
            return (
                user.email === email &&
                user.password === password
            );
        });

        if (!user) {
            formError.textContent =
                "Invalid email or password";

            return;
        }

        const session = {
            userId: user.id,
            email: user.email,
            loginAt: new Date().toISOString(),
        };

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
        );

        showToast(
            "Login successful!",
            "success"
        );

        setTimeout(() => {
            window.location.href =
                "dashboard.html";
        }, 1500);
    });
}