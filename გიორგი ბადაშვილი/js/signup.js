const form = document.getElementById("signupForm");

form.addEventListener("submit", registerUser);

function registerUser(event) {

    event.preventDefault();

    const user = {

        fullName: document.getElementById("fullName").value.trim(),

        email: document.getElementById("email").value.trim().toLowerCase(),

        password: document.getElementById("password").value,

        confirmPassword: document.getElementById("confirmPassword").value,

        company: document.getElementById("company").value.trim()

    };

    if (!validateSignupForm(user)) {  // validate all data
        return;
    }

    const users = Storage.getUsers();

    const exists = users.some(existingUser => existingUser.email === user.email);

    if (exists) {
        showError("email", "emailError", "An account with this email already exists.");
        return;
    }

    clearError("email", "emailError");

    users.push({

        id: Date.now(),

        fullName: user.fullName,

        email: user.email,

        password: user.password,

        company: user.company,

        createdAt: new Date().toISOString()

    });

    Storage.saveUsers(users);

    showToast("Registration successful!");

    setTimeout(() => {
        location.href = "index.html";
    }, 2000);

}
