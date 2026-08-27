const loginForm = document.querySelector(".login");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const errorMessage = document.querySelector("#errorMessage");
const rmCheck = document.querySelector("#rememberMe");

const testUser = {
    id: 999999,
    fullName: "Examiner",
    email: "michael.williams@x.dummyjson.com",
    company: "Test Company",
    password: "testforexaminers1"
};

(function preloadUser() {
    let users = JSON.parse(localStorage.getItem("crm_users")) || [];

    if (!users.some(u => u.email === testUser.email)) {
        users.push(testUser);
        localStorage.setItem("crm_users", JSON.stringify(users));
    }
})();

const savedEmail = localStorage.getItem("crm_remembered_email");

if (savedEmail) {
    rmCheck.checked = true;
    emailInput.value = savedEmail;
} else {
    rmCheck.checked = false;
    emailInput.value = "";
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValue = emailInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value;

    if (!emailValue) {
        errorMessage.textContent = "Email is required";
        errorMessage.style.display = "block";
        return;
    }

    if (!passwordValue) {
        errorMessage.textContent = "Password is required";
        errorMessage.style.display = "block";
        return;
    }

    const users = JSON.parse(localStorage.getItem("crm_users")) || [];

    const validUser = users.find(
        (user) => user.email.toLowerCase() === emailValue && user.password === passwordValue
    );

    if (validUser) {
        errorMessage.style.display = "none";

        if (rmCheck.checked) {
            localStorage.setItem("crm_remembered_email", emailInput.value);
        } else {
            localStorage.removeItem("crm_remembered_email");
        }

        const session = {
            userId: validUser.id,
            email: validUser.email,
            loggedIn: true
        };

        if (rmCheck.checked) {
            localStorage.setItem("crm_session", JSON.stringify(session));
            sessionStorage.removeItem("crm_session");
        } else {
            sessionStorage.setItem("crm_session", JSON.stringify(session));
            localStorage.removeItem("crm_session");
        }

        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = "Invalid email or password";
        errorMessage.style.display = "block";
    }
});