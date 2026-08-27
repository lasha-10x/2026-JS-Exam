document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const companyInput = document.getElementById("company");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const successBox = document.getElementById("successBox");

  const fullNameValue = fullNameInput.value.trim();
  const emailValue = emailInput.value.trim().toLowerCase();
  const companyValue = companyInput.value.trim();
  const passwordValue = passwordInput.value;
  const confirmPasswordValue = confirmPasswordInput.value;

  clearErrors();

  let hasErrors = false;

  if (fullNameValue === "") {
    showError("fullNameError", "Full Name is required");
    hasErrors = true;
  } else if (fullNameValue.length < 3) {
    showError("fullNameError", "Full name must be at least 3 characters");
    hasErrors = true;
  }

  if (emailValue === "") {
    showError("emailError", "Email is required");
    hasErrors = true;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      showError("emailError", "Please enter a valid email address");
      hasErrors = true;
    } else {
      // Email დუბლიკატის შემოწმება localStorage-ში
      const crmUsers = JSON.parse(localStorage.getItem("crm_users")) || [];
      const emailExists = crmUsers.some(
        (user) => user.email.toLowerCase() === emailValue,
      );

      if (emailExists) {
        showError("emailError", "An account with this email already exists");
        hasErrors = true;
      }
    }
  }

  if (passwordValue === "") {
    showError("passwordError", "Password is required");
    hasErrors = true;
  } else {
    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);

    if (passwordValue.length < 8 || !hasLetter || !hasNumber) {
      showError(
        "passwordError",
        "Password must be at least 8 characters and contain a letter and a number",
      );
      hasErrors = true;
    }
  }

  if (confirmPasswordValue === "") {
    showError("confirmPasswordError", "Please confirm your password");
    hasErrors = true;
  } else if (passwordValue !== confirmPasswordValue) {
    showError("confirmPasswordError", "Passwords do not match");
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  // --- წარმატებული რეგისტრაციის ქცევა ---
  const newUser = {
    id: Date.now(),
    fullName: fullNameValue,
    email: emailValue,
    password: passwordValue,
    company: companyValue || null,
    createdAt: new Date().toISOString(),
  };

  const crmUsers = JSON.parse(localStorage.getItem("crm_users")) || [];
  crmUsers.push(newUser);
  localStorage.setItem("crm_users", JSON.stringify(crmUsers));

  successBox.style.display = "block";
  document.getElementById("signUpForm").reset();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});

function showError(elementId, text) {
  const errDiv = document.getElementById(elementId);
  errDiv.innerText = text;
  errDiv.style.display = "block";
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((err) => {
    err.innerText = "";
    err.style.display = "none";
  });
  document.getElementById("successBox").style.display = "none";
}
