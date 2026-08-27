/* ---- Sign Up (P1) --------------------------------------------------------- */

function initSignupForm() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearFieldErrors(form); // Clear any previous errors before validating again. (from ui.js)

        const fullNameInput = document.getElementById('signup-fullname');
        const emailInput = document.getElementById('signup-email');
        const companyInput = document.getElementById('signup-company');
        const passwordInput = document.getElementById('signup-password');
        const confirmInput = document.getElementById('signup-confirm');

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const company = companyInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        const users = getUsers(); // Read the current users from localStorage (from storage.js).
        let hasErrors = false;

        // Validate each field and show errors if needed with setFieldError() (from ui.js).
        if (fullName.length < 3) {
            setFieldError(fullNameInput, 'Full name must be at least 3 characters');
            hasErrors = true;
        }

        if (!isValidEmail(email)) { // Validate email format with isValidEmail() (from ui.js).
            setFieldError(emailInput, 'Please enter a valid email address');
            hasErrors = true;
        } else if (users.some(function (u) { return u.email === email; })) {
            // Duplicate check is done in lowercase with some().
            setFieldError(emailInput, 'An account with this email already exists');
            hasErrors = true;
        }

        if (!isValidPassword(password)) { // Validate password format with isValidPassword() (from ui.js).
            setFieldError(passwordInput,
                'Password must be at least 8 characters and contain a letter and a number');
            hasErrors = true;
        }

        if (confirm !== password) {
            setFieldError(confirmInput, 'Passwords do not match');
            hasErrors = true;
        }

        if (hasErrors) return; // Nothing is saved when the form is invalid.

        // P1.3 — exact success sequence.
        const newUser = {
            id: Date.now(),
            fullName: fullName,
            email: email,
            password: password,
            company: company,
            createdAt: new Date().toISOString()
        };

        users.push(newUser); // Add the new user to the users array.
        saveUsers(users); // Save the updated users array to localStorage (from storage.js).

        showToast('Account created successfully! Please log in.', 'success'); // Show a success toast (from ui.js).

        // Redirect to the login page after 1.5 seconds.
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1500);
    });
}

/* ---- Login (P2) ------------------------------------------------------------ */

function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearFieldErrors(form);

        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        let hasErrors = false;

        if (email === '') {
            setFieldError(emailInput, 'Email is required');
            hasErrors = true;
        }
        if (password === '') {
            setFieldError(passwordInput, 'Password is required');
            hasErrors = true;
        }
        if (hasErrors) return;

        // Find the user by email (lowercase) and compare the password exactly.
        const user = getUsers().find(function (u) { return u.email === email; });

        if (!user || user.password !== password) {
            // Deliberately generic message — a security practice: an attacker
            // must not learn which emails are registered.
            setFieldError(passwordInput, 'Invalid email or password');
            return;
        }

        // P2.3 — create the session and go straight to the dashboard.
        setSession({
            userId: user.id,
            email: user.email,
            loginAt: new Date().toISOString()
        });

        window.location.href = 'dashboard.html';
    });
}

// Initialize both forms if they exist on the page. 'DOMContentLoaded' ensures the DOM is fully loaded before we try to access elements.
document.addEventListener('DOMContentLoaded', function () {
    initSignupForm();
    initLoginForm();
});
