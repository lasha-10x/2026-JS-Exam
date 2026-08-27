console.log("LOGIN JS WORKING");


const loginForm = document.getElementById("loginForm");


if (loginForm) {


  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");


  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");



  loginForm.addEventListener("submit", function (e) {

    e.preventDefault();



    // Clear errors
    emailError.textContent = "";
    passwordError.textContent = "";



    const email =
      emailInput.value.trim().toLowerCase();


    const password =
      passwordInput.value.trim();



    const users =
      JSON.parse(localStorage.getItem("crm_users")) || [];



    // Email validation
    if (email === "") {

      emailError.textContent =
        "Email is required";

      return;

    }



    // Password validation
    if (password === "") {

      passwordError.textContent =
        "Password is required";

      return;

    }



    // Find user
    const user = users.find(
      user =>
        user.email === email &&
        user.password === password
    );



    // Wrong credentials
    if (!user) {

      passwordError.textContent =
        "Invalid email or password";

      return;

    }



    // Create session
    const session = {

      userId: user.id,

      email: user.email,

      loginAt: new Date().toISOString()

    };



    localStorage.setItem(
      "crm_session",
      JSON.stringify(session)
    );



    window.location.href =
      "dashboard.html";


  });


}