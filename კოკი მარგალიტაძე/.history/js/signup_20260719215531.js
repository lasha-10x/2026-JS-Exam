document.getElementById('signup-form').addEventListener('submit', function(e) {
    // Prevent the browser from automatically refreshing the page
    e.preventDefault();

    // 1. Capture and trim form input field data
    const fullName = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const company = document.getElementById('signup-company').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Grab references to your HTML error elements
    const errorBox = document.getElementById('signup-error-box');
    const errorList = document.getElementById('signup-error-list');

    // Clear out any old error items from a previous attempt
    errorList.innerHTML = '';
    errorBox.style.display = 'none';

    // Clear any per-field error styling from a previous attempt
    const fieldIds = ['signup-name', 'signup-email', 'signup-password', 'signup-confirm-password'];
    fieldIds.forEach(id => document.getElementById(id).classList.remove('input-error'));

    // Core array to track any rules that fail
    const errors = [];

    // 2. Validate All 6 Rules Simultaneously (Step 7)
    if (!fullName || fullName.length < 3) {
        errors.push("Full name must be at least 3 characters");
        document.getElementById('signup-name').classList.add('input-error');
    }
    if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
        errors.push("Please enter a valid email address");
        document.getElementById('signup-email').classList.add('input-error');
    }
    if (!password || password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        errors.push("Password must be at least 8 characters and contain a letter and a number");
        document.getElementById('signup-password').classList.add('input-error');
    }
    if (password !== confirmPassword) {
        errors.push("Passwords do not match");
        document.getElementById('signup-confirm-password').classList.add('input-error');
    }

    // Check if user already exists in storage to avoid duplicate signups
    const existingUsers = window.CRMStorage.getUsers();
    const emailExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    const emailExists = existingUsers.includes(user => user.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        errors.push("An account with this email already exists");
        document.getElementById('signup-email').classList.add('input-error');
    }

    // 3. Render Errors if Any Rules Fail
    if (errors.length > 0) {
        errors.forEach(err => {
            const li = document.createElement('li');
            li.innerText = err;
            errorList.appendChild(li);
        });
        // Override your CSS "display: none" to show the alert block
        errorBox.style.display = 'block';
        return;
    }

    // 4. Registration Success Flow (Step 8)
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        company: company,
        password: password, // Saved as plain text in localStorage per your PRD constraint
        createdAt: new Date().toISOString()
    };

    // Push new user to storage array using your storage wrapper functions
    existingUsers.push(newUser);
    window.CRMStorage.setUsers(existingUsers);

    // Call your shared custom toast notification system
    window.showToast("Account created successfully! Please log in.", "success");

    // Enforce the strict 1.5-second delay before redirecting to the login page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});