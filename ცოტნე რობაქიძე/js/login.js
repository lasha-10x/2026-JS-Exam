redirectIfAuthenticated();

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function (event) {
  //after pressing submit button site will not refresh
  event.preventDefault();

  ////textcontent will be cleared after mistake or succesfull submit
  emailError.textContent = "";
  passwordError.textContent = "";
  loginError.textContent = "";

  //retrieve and save entered data
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  //if any error exists
  let hasError = false;

  //if there is no input in emailInput
  if (email.length === 0) {
    emailError.textContent = "Email is required";
    hasError = true;
  }

  //if there is no input in passwordInput
  if (password.length === 0) {
    passwordError.textContent = "Password is required";
    hasError = true;
  }
  //if any error happends this will return nothing. code will note execute
  if (hasError === true) {
    return;
  }

  //taking info out of localstorage as a string
  const savedUser = localStorage.getItem("crm_users");
  // parsing info we take from localstorage
  //if not any info we return empty array
  const crmUsers = savedUser ? JSON.parse(savedUser) : [];

  //we check array if inputed email and password is same
  // as we have in a crmUser
  const findUser = crmUsers.find(function (user) {
    return user.email.toLowerCase() === email && user.password === password;
  });

  //if its not same we do this
  if (!findUser) {
    loginError.textContent = "Invalid email or password";
    return;
  }

  // created object which takes user that is currently logged in
  const session = {
    userId: findUser.id,
    fullName: findUser.fullName,
    email: findUser.email,
    loggedInAt: new Date().toISOString(),
  };

  //saves user infro which is currently logged in
  localStorage.setItem("crm_session", JSON.stringify(session));

  //if there is no errors we will be forwarded in dashboard.html
  window.location.href = "../html/dashboard.html";
});
