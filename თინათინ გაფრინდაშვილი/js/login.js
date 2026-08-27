if (auth.isLoggedIn()) {
    window.location.href = "dashboard.html";
}

const form = document.getElementById("login-form");

const email = document.getElementById("email");
const password = document.getElementById("password");


// Error handling functions

function showError(input, message) {
    const error = input.parentElement.querySelector(".error-message");

    error.textContent = message;
    input.classList.add("input-error");
}


function clearError(input) {
    const error = input.parentElement.querySelector(".error-message");

    error.textContent = "";
    input.classList.remove("input-error");
}


// Login password validation
function validateLoginPassword(password) {

    if (password.trim() === "") {
        return "Password is required";
    }

    return "";
}


// Real-time validation

email.addEventListener("input", () => {
    //validates the email and shows or clears error messages accordingly
    const error = auth.validateEmail(email.value);

    error
        ? showError(email, error)
        : clearError(email);

});


password.addEventListener("input", () => {
    //validates the password and shows or clears error messages accordingly
    const error = validateLoginPassword(password.value);

    error
        ? showError(password, error)
        : clearError(password);

});


// Submit login form

form.addEventListener("submit", (e) => {

    e.preventDefault();


    let valid = true;


    // Email validation

    let error = auth.validateEmail(email.value);
    //if there is an error, show the error message and set valid to false
    if (error) {

        showError(email, error);
        valid = false;

    } else {

        clearError(email);

    }



    // Password validation

    error = validateLoginPassword(password.value);

    if (error) {

        showError(password, error);
        valid = false;

    } else {

        clearError(password);

    }


    if (!valid) return;



    // Find user

    const users = auth.getUsers();
    //finds the user in the users array based on the provided email and password
    const user = users.find(
        user =>
            user.email === email.value.trim().toLowerCase() &&
            user.password === password.value
    );



    // If user not found, show error message

    if (!user) {

        showError(
            password,
            "Invalid email or password"
        );

        return;

    }
    //creates a session object with the user's id, full name, email, and login time
    auth.setSession({

        id: user.id,
        fullName: user.fullName,
        email: user.email,
        loginTime: new Date().toISOString() // ISO format for consistency

    });
    //restore user cllient info
    auth.loadUserClients(user.id); 
    // Redirects to dashboard.html after successful login
    window.location.href = "dashboard.html";

});