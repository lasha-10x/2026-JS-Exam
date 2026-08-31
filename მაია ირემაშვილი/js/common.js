function showToast(message, type = "success") {
    let toastContainer =
        document.getElementById("toastContainer");

    if (!toastContainer) {
        toastContainer =
            document.createElement("div");

        toastContainer.id =
            "toastContainer";

        document.body.appendChild(
            toastContainer
        );
    }

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    toastContainer.appendChild(
        toast
    );

    setTimeout(function () {
        toast.remove();
    }, 3000);
}


function updateThemeButton() {
    const themeButton =
        document.getElementById(
            "themeButton"
        );

    if (!themeButton) {
        return;
    }

    const isDark =
        document.body.classList.contains(
            "dark-theme"
        );

    if (isDark) {
        themeButton.textContent =
            "☀️";

        themeButton.setAttribute(
            "aria-label",
            "Switch to light theme"
        );

        themeButton.setAttribute(
            "title",
            "Switch to light theme"
        );

        return;
    }

    themeButton.textContent =
        "🌙";

    themeButton.setAttribute(
        "aria-label",
        "Switch to dark theme"
    );

    themeButton.setAttribute(
        "title",
        "Switch to dark theme"
    );
}


function applySavedTheme() {
    const savedTheme =
        getStorageItem(
            STORAGE_KEYS.THEME
        ) || "light";

    if (savedTheme === "dark") {
        document.body.classList.add(
            "dark-theme"
        );
    } else {
        document.body.classList.remove(
            "dark-theme"
        );
    }

    updateThemeButton();
}


function toggleTheme() {
    const isDark =
        document.body.classList.toggle(
            "dark-theme"
        );

    const theme =
        isDark
            ? "dark"
            : "light";

    setStorageItem(
        STORAGE_KEYS.THEME,
        theme
    );

    updateThemeButton();
}


function logout() {
    removeStorageItem(
        STORAGE_KEYS.SESSION
    );

    window.location.href =
        "index.html";
}


function setActiveNavigation() {
    const currentPage =
        window.location.pathname
            .split("/")
            .pop();

    const navigationLinks =
        document.querySelectorAll(
            ".top-nav-link"
        );

    navigationLinks.forEach(
        function (link) {
            const linkPage =
                link.getAttribute(
                    "href"
                );

            if (
                linkPage ===
                currentPage
            ) {
                link.classList.add(
                    "active"
                );
            } else {
                link.classList.remove(
                    "active"
                );
            }
        }
    );
}


applySavedTheme();
setActiveNavigation();


const themeButton =
    document.getElementById(
        "themeButton"
    );

if (themeButton) {
    themeButton.addEventListener(
        "click",
        toggleTheme
    );
}


const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {
    logoutButton.addEventListener(
        "click",
        logout
    );
}