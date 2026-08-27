console.log("SIGNUP JS WORKING");


const signupForm = document.getElementById("signupForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const companyInput = document.getElementById("company");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");


// Form submit event
signupForm.addEventListener("submit", (e) => {

  // prevents page refresh
  e.preventDefault();


  // clear previous errors
  fullNameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";


  // get values
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const company = companyInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();


  let isValid = true;



  // Full name validation
  if(fullName.length < 3){

    fullNameError.textContent =
    "Full name must be at least 3 characters";

    isValid = false;
  }



  // Email validation
  if(
    email === "" ||
    !email.includes("@") ||
    !email.split("@")[1]?.includes(".")
  ){

    emailError.textContent =
    "Please enter a valid email address";

    isValid = false;
  }



  // Get existing users
  let users =
  JSON.parse(localStorage.getItem("crm_users")) || [];



  // Check duplicate email
  const emailExists =
  users.some(user => user.email === email);



  if(emailExists){

    emailError.textContent =
    "An account with this email already exists";

    isValid = false;
  }



  // Password validation
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);



  if(
    password.length < 8 ||
    !hasLetter ||
    !hasNumber
  ){

    passwordError.textContent =
    "Password must be at least 8 characters and contain a letter and a number";

    isValid = false;
  }



  // Confirm password validation
  if(password !== confirmPassword){

    confirmPasswordError.textContent =
    "Passwords do not match";

    isValid = false;
  }




  // Stop if validation failed
  if(!isValid){

    return;

  }




  // Create new user object
  const newUser = {

    id: Date.now(),

    fullName,

    email,

    password,

    company,

    createdAt: new Date().toISOString()

  };



  // Save user
  users.push(newUser);


  localStorage.setItem(
    "crm_users",
    JSON.stringify(users)
  );



  // Success message
  showToast(
    "Account created successfully! Please log in.",
    "success"
  );



  // Redirect after 1.5 seconds
  setTimeout(() => {

    window.location.href = "index.html";

  },1500);



});