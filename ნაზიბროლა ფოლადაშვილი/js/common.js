/* SHARED STORAGE KEYS */

const THEME_KEY = "crm_theme";
const SESSION_KEY = "crm_session";

let toastTimer = null;


/* THEME */

function updateThemeButton(theme) {
    const themeToggleButton =
        document.querySelector("#theme-toggle");

    if (!themeToggleButton) {
        return;
    }

    const isLightTheme = theme === "light";

    themeToggleButton.textContent = isLightTheme
        ? "Dark Theme"
        : "Light Theme";

    themeToggleButton.setAttribute(
        "aria-label",
        isLightTheme
            ? "Switch to dark theme"
            : "Switch to light theme"
    );
}

function applySavedTheme() {
    const savedTheme =
        localStorage.getItem(THEME_KEY) || "dark";

    document.body.classList.toggle(
        "light-theme",
        savedTheme === "light"
    );

    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const isLightTheme =
        document.body.classList.toggle("light-theme");

    const selectedTheme = isLightTheme
        ? "light"
        : "dark";

    localStorage.setItem(
        THEME_KEY,
        selectedTheme
    );

    updateThemeButton(selectedTheme);
}


/* TOAST NOTIFICATION */

function showToast(message, type = "success") {
    const toast = document.querySelector("#toast");

    if (!toast) {
        return;
    }

    const allowedTypes = [
        "success",
        "error",
        "info"
    ];

    const toastType = allowedTypes.includes(type)
        ? type
        : "success";

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.remove(
        "success",
        "error",
        "info",
        "show"
    );

    toast.classList.add(
        toastType,
        "show"
    );

    toastTimer = setTimeout(() => {
        toast.classList.remove(
            "show",
            "success",
            "error",
            "info"
        );
    }, 3000);
}


/* LOGOUT */

function logout() {
    localStorage.removeItem(SESSION_KEY);

    window.location.href = "index.html";
}


/* PASSWORD VISIBILITY */

function togglePasswordVisibility(event) {
    const toggleButton = event.currentTarget;
    const targetInputId =
        toggleButton.dataset.target;

    if (!targetInputId) {
        return;
    }

    const passwordInput =
        document.getElementById(targetInputId);

    if (!passwordInput) {
        return;
    }

    const isPasswordHidden =
        passwordInput.type === "password";

    if (isPasswordHidden) {
        passwordInput.type = "text";
        toggleButton.textContent = "🙈";

        toggleButton.setAttribute(
            "aria-label",
            "Hide password"
        );

        toggleButton.setAttribute(
            "aria-pressed",
            "true"
        );
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "👁";

        toggleButton.setAttribute(
            "aria-label",
            "Show password"
        );

        toggleButton.setAttribute(
            "aria-pressed",
            "false"
        );
    }
}


/* EMAIL INPUT */

function allowOnlyLatinEmailCharacters() {
    const emailInputs =
        document.querySelectorAll(
            'input[type="email"]'
        );

    emailInputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(
                /[^a-zA-Z0-9@._+-]/g,
                ""
            );
        });
    });
}


/* PHONE INPUT */

function allowOnlyPhoneNumbers() {
    const phoneInputs =
        document.querySelectorAll(
            'input[type="tel"]'
        );

    phoneInputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.value =
                input.value.replace(/\D/g, "");
        });
    });
}


/* CLIENT NAME INPUT */

function allowOnlyLatinClientName() {
    const clientNameInput =
        document.querySelector("#client-name");

    if (!clientNameInput) {
        return;
    }

    clientNameInput.addEventListener(
        "input",
        () => {
            clientNameInput.value =
                clientNameInput.value.replace(
                    /[^a-zA-Z\s'-]/g,
                    ""
                );
        }
    );
}


/* CLIENT COMPANY INPUT */

function allowOnlyLatinClientCompany() {
    const clientCompanyInput =
        document.querySelector("#client-company");

    if (!clientCompanyInput) {
        return;
    }

    clientCompanyInput.addEventListener(
        "input",
        () => {
            clientCompanyInput.value =
                clientCompanyInput.value.replace(
                    /[^a-zA-Z0-9\s&.,'-]/g,
                    ""
                );
        }
    );
}


/* PAGE INITIALIZATION */

function initializeCommon() {
    applySavedTheme();

    allowOnlyLatinEmailCharacters();
    allowOnlyPhoneNumbers();
    allowOnlyLatinClientName();
    allowOnlyLatinClientCompany();

    const themeToggleButton =
        document.querySelector("#theme-toggle");

    const logoutButton =
        document.querySelector("#logout-button");

    const passwordToggleButtons =
        document.querySelectorAll(
            ".password-toggle"
        );

    if (themeToggleButton) {
        themeToggleButton.addEventListener(
            "click",
            toggleTheme
        );
    }

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            logout
        );
    }

    passwordToggleButtons.forEach((button) => {
        button.addEventListener(
            "click",
            togglePasswordVisibility
        );
    });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeCommon,
        { once: true }
    );
} else {
    initializeCommon();
}