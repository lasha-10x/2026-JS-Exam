redirectIfAuthenticated();

const form = document.getElementById("signupForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const companyInput = document.getElementById("company");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", function (event) {
  //after pressing submit button site will not refresh
  event.preventDefault();

  //textcontent will be cleared after mistake or succesfull submit
  fullNameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  successMessage.textContent = "";

  //retrieve and save entered data
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const company = companyInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  //if there are any saved info in crm_users we will get it
  const savedUser = localStorage.getItem("crm_users");

  let crmUsers = [];

  if (savedUser) {
    crmUsers = JSON.parse(savedUser);
  } else {
    crmUsers = [];
  }

  //if any error exists
  let hasError = false;

  // full name validation full name should be at least 3 characters or more
  if (fullName.length < 3) {
    fullNameError.textContent = "Full name must be at least 3 characters";
    hasError = true;
  }

  //email validation finding out if it contains @ and dot after @
  const atIndex = email.indexOf("@");
  const dotInder = email.indexOf(".", atIndex + 1);

  // if email input contains @ and "." after @ and if input also exicts
  let isEmailValid = email.length > 0 && atIndex !== -1 && dotInder !== -1;
  //if not
  if (!isEmailValid) {
    emailError.textContent = "Please enter a valid email address";
    hasError = true;
  }

  //if during registration email we use already exists
  if (isEmailValid) {
    let emailAlreadyExists = crmUsers.some(function (user) {
      return user.email.toLowerCase() === email;
    });
    if (emailAlreadyExists) {
      emailError.textContent = "An account with this email already exists";
      hasError = true;
    }
  }

  //password and confirm password validation

  // 1 checkes if password has letters 2 checks if password has numbers
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  //checks if password is invalid

  // we use || becouse if any of this is wrong password is wrong
  if (password.length < 8 || !hasLetter || !hasNumber) {
    passwordError.textContent =
      "Password must be at least 8 characters and contain a letter and a number";
    hasError = true;
  }
  // checks if confirmPassword doenst match with password
  if (confirmPassword !== password) {
    confirmPasswordError.textContent = "Passwords do not match";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  //data which comes from input will come to this object
  //this object will go to crmUser which is array of objects
  //it will contain every user
  //newUser contains only one
  const newUser = {
    id: Date.now(),
    fullName: fullName,
    email: email,
    company: company,
    password: password,
    createdAt: new Date().toISOString(),
  };

  // we push newUser object in crmUser array
  crmUsers.push(newUser);
  localStorage.setItem("crm_users", JSON.stringify(crmUsers));

  successMessage.textContent = "Account created successfully! Please log in.";
  // if everything executes succesfuly login page will open
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
});
