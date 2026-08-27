import { redirectIfLoggedIn } from "./guard.js";
import { initTheme } from "./theme.js";
import { getUsers, saveSession } from "./storage.js";
import { clearErrors, clearErrorOnInput, showFieldError, showFormError, animateLetters} from "./ui.js";

function initLoginPage(){
initTheme();
animateLetters(document.querySelector("#auth-title"));
const loginForm = document.querySelector('#login-form');
clearErrorOnInput(loginForm); //bonus: clear filed errors when user starts fixing it

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors(loginForm); //to start clean: clear errors from previous attempt
  
  const email = loginForm.email.value.trim().toLowerCase();
  const password = loginForm.password.value;

  let isValid = true;
  //EMAIL
  if(email === ""){
    showFieldError("email", "Email is required");
    isValid = false;
  }
  //PASSWORD
  if(password === "") {
    showFieldError("password", "Password is required");
    isValid = false;
  }

  if(!isValid) return;

  //email and password are not empty, now check if they match any user in storage
  const users = getUsers();
  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    showFormError(loginForm, "Invalid email or password");
    return; //form is usable, user can try again, so we don't need to stop the script, just return from this function
  }

  //SUCCESS 
  const session = {
    userId: user.id,
    email: user.email,
    loginAt: new Date().toISOString(),
  };
  saveSession(session);
  window.location.href = "dashboard.html";
});
}

if(redirectIfLoggedIn()) {
  initLoginPage();
}

//Only build this page if the user is allowed to be here.