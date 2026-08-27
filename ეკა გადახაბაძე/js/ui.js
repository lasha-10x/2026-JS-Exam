/* ---- Theme ---------------------------------------------------------------
   Dark is the default. Light mode is just a class on <body> — all colors
   are CSS variables, so one class flip re-themes the whole page. */

function applyTheme() {
    const theme = getTheme();
    document.body.classList.toggle('light', theme === 'light');
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = theme === 'light' ? '🌙 Dark' : '☀️ Light';
    }
}

function toggleTheme() {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    saveTheme(next);
    applyTheme();
}

/* ---- Toasts (P0.4) -------------------------------------------------------
   Global messages: success = green, error = red. Each toast disappears
   automatically after 3 seconds (setTimeout) or via its X button.
   Browser alert() is banned by the PRD — this is the replacement. */

function showToast(message, type) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'success');

    const text = document.createElement('span');
    text.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', function () { toast.remove(); });

    toast.appendChild(text);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Auto-dismiss after 3 seconds.
    setTimeout(function () { toast.remove(); }, 3000);
}

/* ---- Navigation (P0.2) ---------------------------------------------------
   Present only on protected pages. The HTML is identical on all three
   pages; the "active" class is set in the markup of each page. */

function initNav() {
    const logo = document.getElementById('nav-logo');
    if (logo) {
        logo.addEventListener('click', function () {
            window.location.href = 'dashboard.html';
        });
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            // Logout only closes the session — users and clients stay intact.
            clearSession();
            window.location.href = 'index.html';
        });
    }
}

/* ---- Field validation helpers (P0.4) ------------------------------------
   Errors are shown under the specific field with a red border, appear on
   submit, and are cleared before the next validation pass. */

/** Show a red error message under an input and mark the input itself. */
function setFieldError(input, message) {
    input.classList.add('input-error');
    const error = document.createElement('span');
    error.className = 'error-text';
    error.textContent = message;
    input.insertAdjacentElement('afterend', error);
}

/** Remove every field error inside a form (called before re-validating). */
function clearFieldErrors(form) {
    form.querySelectorAll('.error-text').forEach(function (el) { el.remove(); });
    form.querySelectorAll('.input-error').forEach(function (el) {
        el.classList.remove('input-error');
    });
}

/* ---- Shared validation rules --------------------------------------------- */

/** Email must contain "@" and a dot somewhere after it. */
function isValidEmail(email) {
    const atIndex = email.indexOf('@');
    const dotIndex = email.indexOf('.', atIndex + 2);
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
}

/** Password: at least 8 characters, at least one letter and one digit. */
function isValidPassword(password) {
    return password.length >= 8 &&
        /[a-zA-Z]/.test(password) &&
        /[0-9]/.test(password);
}

/** Format a number as money, e.g. 12500 -> "$12,500". */
function formatMoney(value) {
    return '$' + Number(value).toLocaleString('en-US');
}

/* Apply the saved theme as soon as this script loads (end of <body>),
   and wire the navigation once the DOM is ready. */
document.addEventListener('DOMContentLoaded', function () {
    applyTheme();
    initNav();
});
