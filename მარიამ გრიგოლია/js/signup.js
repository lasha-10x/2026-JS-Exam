//==SIGNUP.js (also import here )
import { redirectIfLoggedIn } from "./guard.js";
import { initTheme } from "./theme.js";
import { getUsers, saveUsers } from "./storage.js";
import { showToast, showFieldError, clearErrors, clearErrorOnInput } from "./ui.js";
import { isValidName, isValidEmail, isStrongPassword } from "./validators.js";

function initSignupPage() {
initTheme();

const signupForm = document.querySelector("#signup-form");
clearErrorOnInput(signupForm); //bonus: clear filed errors when user starts fixing it

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //to start clean: clear errors from previous attempt
  clearErrors(signupForm);

  //to read the values from input
  const fullName = signupForm.fullName.value.trim();
  const email = signupForm.email.value.trim().toLowerCase();
  const company = signupForm.company.value.trim();
  const password = signupForm.password.value;
  const confirmPassword = signupForm.confirmPassword.value;

  //get user array (existed in browser)
  const users = getUsers();
  let isValid = true; //changes to false if any rule fails

  //full name
  if (!isValidName(fullName)) {
    showFieldError("full-name", "Full name must be at least 3 characters");
    isValid = false;
  }

  //EMAIL format and in case duplicated email
   if (!isValidEmail(email)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  } else if (users.some((user) => user.email === email)) {
    showFieldError("email", "An account with this email already exists");
    isValid = false;
  }

  //password strength 
   if (!isStrongPassword(password)) {
    showFieldError(
      "password",
      "Password must be at least 8 characters and contain a letter and a number"
    );
    isValid = false;
  }
  //password match 
    if (password !== confirmPassword) {
    showFieldError("confirm-password", "Passwords do not match");
    isValid = false;
  }

  //in case ANY error then evrth should stop 
  if(!isValid) return;

  //SUCCEESS & golder cycle 
  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password,
    company,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users); //saved to localStorage 

  //SCREEN responds 
  showToast("Account created successfully! Please log in.", "success");
  
  // after 1.5sec go to lgin 
  setTimeout(() =>{
    window.location.href = "index.html";
  }, 1500);
});
}

// Public page: only build it if nobody is logged in.
// If a session exists, redirectIfLoggedIn() sends the user to the dashboard and returns false.
if (redirectIfLoggedIn()) {
  initSignupPage();
}