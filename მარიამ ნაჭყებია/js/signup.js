const signupForm = document.querySelector(".login");
const nameInput = document.querySelector("input[name='fullname']");
const emailInput = document.querySelector("input[name='email']");
const companyInput = document.querySelector("input[name='company']");
const passwordInput = document.querySelector("input[name='password']");
const confirmPasswordInput = document.querySelector("input[name='confirm-password']");

const nameError = document.querySelector("#nameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const confirmError = document.querySelector("#confirmError");
const successMessage = document.querySelector("#successMessage");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    nameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
    confirmError.style.display = "none";
    successMessage.style.display = "none";

    let isValid = true;

    const users = JSON.parse(localStorage.getItem("crm_users")) || [];

    const nameVal = nameInput.value.trim();
    if (nameVal.length < 3) {
        nameError.textContent = "Full name must be at least 3 characters";
        nameError.style.display = "block";
        isValid = false;
    }

    const emailVal = emailInput.value.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailVal || !emailPattern.test(emailVal)) {
        emailError.textContent = "Please enter a valid email address";
        emailError.style.display = "block";
        isValid = false;
    } else {
        const emailExists = users.some(user => user.email === emailVal);
        if (emailExists) {
            emailError.textContent = "An account with this email already exists";
            emailError.style.display = "block";
            isValid = false;
        }
    }

    const passVal = passwordInput.value;
    const hasLetter = /[a-zA-Z]/.test(passVal);
    const hasNumber = /[0-9]/.test(passVal);

    if (passVal.length < 8 || !hasLetter || !hasNumber) {
        passwordError.textContent = "Password must be at least 8 characters and contain a letter and a number";
        passwordError.style.display = "block";
        isValid = false;
    }

    const confirmVal = confirmPasswordInput.value;
    if (confirmVal !== passVal) {
        confirmError.textContent = "Passwords do not match";
        confirmError.style.display = "block";
        isValid = false;
    }

    if (!isValid) return;

    const newUser = {
        id: Date.now(),
        fullName: nameVal,
        email: emailVal,
        company: companyInput.value.trim(),
        password: passVal,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("crm_users", JSON.stringify(users));

    successMessage.textContent = "Account created successfully! Please log in.";
    successMessage.style.display = "block";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
});