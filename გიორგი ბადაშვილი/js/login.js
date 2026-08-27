const session = Storage.getSession();

if (session) {
    window.location.href = "dashboard.html";
}

const form = document.getElementById("loginForm");
console.log(form);
form.addEventListener("submit", loginUser);

function loginUser(event) {

    event.preventDefault();

    const loginData = {

        email: document.getElementById("email").value.trim().toLowerCase(),

        password: document.getElementById("password").value

    };

    if (!validateLoginForm(loginData)) {
        return;
    }

    const users = Storage.getUsers();
    
    if (users.length === 0) {
        showToast("No registered users found.");
        return;
    }
    const user = users.find(user =>
        user.email === loginData.email &&
        user.password === loginData.password
    );

    if (!user) {

        showError("email", "emailError", "Invalid email or password.");

        showError("password", "passwordError", "");

        return;
    }

    clearError("email", "emailError");
    clearError("password", "passwordError");

    const session = {

        userId: user.id,

        email: user.email,

        loginAt: new Date().toISOString()

    };

    Storage.saveSession(session);

    showToast("Login successful!");

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1500);

}
