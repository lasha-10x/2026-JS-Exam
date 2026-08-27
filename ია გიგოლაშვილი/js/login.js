const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

function handleLogin(event) {
  event.preventDefault();

  clearLoginErrors();

  const email = document
    .querySelector("#loginEmail")
    .value
    .trim()
    .toLowerCase();

  const password = document.querySelector("#loginPassword").value;

  let isValid = true;

  if (email === "") {
    showLoginError(
      "loginEmail",
      "loginEmailError",
      "Email is required"
    );

    isValid = false;
  }

  if (password === "") {
    showLoginError(
      "loginPassword",
      "loginPasswordError",
      "Password is required"
    );

    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const users = getStorageItem("crm_users", []);

  const foundUser = users.find((user) => {
    return user.email === email && user.password === password;
  });

  if (!foundUser) {
    const credentialsError = document.querySelector(
      "#loginCredentialsError"
    );

    credentialsError.textContent = "Invalid email or password";
    return;
  }

  const session = {
    userId: foundUser.id,
    email: foundUser.email,
    loginAt: new Date().toISOString()
  };

  setStorageItem("crm_session", session);

  window.location.href = "dashboard.html";
}

function showLoginError(inputId, errorId, message) {
  const input = document.querySelector(`#${inputId}`);
  const errorElement = document.querySelector(`#${errorId}`);

  input.classList.add("input-error");
  errorElement.textContent = message;
}

function clearLoginErrors() {
  const errorElements = document.querySelectorAll(
    "#loginForm .field-error"
  );

  const inputs = document.querySelectorAll("#loginForm input");

  const credentialsError = document.querySelector(
    "#loginCredentialsError"
  );

  errorElements.forEach((element) => {
    element.textContent = "";
  });

  inputs.forEach((input) => {
    input.classList.remove("input-error");
  });

  credentialsError.textContent = "";
}