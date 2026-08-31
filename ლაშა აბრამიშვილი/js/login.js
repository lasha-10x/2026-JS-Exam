const loginForm = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailErrorElement =
  emailInput.parentElement.querySelector(".error-message");
const passwordErrorElement =
  passwordInput.parentElement.querySelector(".error-message");
const demoUser = {
  id: 1000000000000,
  fullName: "Demo User",
  email: "demo@test.com",
  password: "demo1234",
  company: "10X CRM",
  createdAt: "2026-07-25T00:00:00.000Z"
};

// The page uses JavaScript validation instead of browser validation.
loginForm.noValidate = true;

// The documented demo account is added without replacing registered users.
function getUsersWithDemoAccount() {
  const users = getUsers();
  const demoUserExists = users.some(function (user) {
    return (user.email || "").toLowerCase() === demoUser.email;
  });

  if (!demoUserExists) {
    users.push(demoUser);
    saveUsers(users);
  }

  return users;
}

function clearErrors() {
  emailErrorElement.textContent = "";
  passwordErrorElement.textContent = "";
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
}

function showError(input, errorElement, message) {
  errorElement.textContent = message;
  input.classList.add("input-error");
}

function validateLoginForm() {
  let isValid = true;
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (email === "") {
    showError(emailInput, emailErrorElement, "Email is required");
    isValid = false;
  }

  if (password === "") {
    showError(passwordInput, passwordErrorElement, "Password is required");
    isValid = false;
  }

  return isValid;
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  if (!validateLoginForm()) {
    return;
  }

  const users = getUsersWithDemoAccount();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const matchedUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  if (!matchedUser) {
    showError(passwordInput, passwordErrorElement, "Invalid email or password");
    emailInput.classList.add("input-error");
    return;
  }

  // The session stores identity data only and never includes the password.
  const session = {
    userId: matchedUser.id,
    fullName: matchedUser.fullName,
    email: matchedUser.email,
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem("crm_session", JSON.stringify(session));
  window.location.href = "dashboard.html";
});
