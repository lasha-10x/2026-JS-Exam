if (auth.isLoggedIn()) {
    window.location.href = "dashboard.html";
}

const form = document.getElementById("signup-form");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const company = document.getElementById("company");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");


//error handling functions

function showError(input, message) {
    //finds the error message span
    const error = input.parentElement.querySelector(".error-message");
    //sets the error message
    error.textContent = message;
    //adds the error class to the input for styling
    input.classList.add("input-error");
}

function clearError(input) {
    const error = input.parentElement.querySelector(".error-message");

    error.textContent = "";
    input.classList.remove("input-error");
}

//success handling function

function showSuccess(message) {
    //checks if the banner already exists
    let banner = document.getElementById("success-banner");
    //if not, creates a new banner and prepends it to the body  
    if (!banner) {
        banner = document.createElement("div");
        banner.id = "success-banner";
        document.body.prepend(banner);
    }
    //sets the message and class for styling
    banner.textContent = message;
    banner.className = "success-banner";
}


// event listeners for real-time validation
fullName.addEventListener("input", () => {
    //validates the full name and shows or clears error messages accordingly
    const error = auth.validateFullName(fullName.value);

    error ? showError(fullName, error) : clearError(fullName);
});

email.addEventListener("input", () => {
    //validates the email and shows or clears error messages accordingly
    let error = auth.validateEmail(email.value);

    if (!error && auth.emailExists(email.value.trim().toLowerCase())) {
        error = "An account with this email already exists";
    }

    error ? showError(email, error) : clearError(email);
});

password.addEventListener("input", () => {
    //validates the password and shows or clears error messages accordingly
    const error = auth.validatePassword(password.value);

    error ? showError(password, error) : clearError(password);
});

confirmPassword.addEventListener("input", () => {
    //validates the confirm password and shows or clears error messages accordingly
    const error = auth.validateConfirmPassword(
        password.value,
        confirmPassword.value
    );

    error
        ? showError(confirmPassword, error)
        : clearError(confirmPassword);
});

// form submission event listener

form.addEventListener("submit", async (e) => {
    //prevents the default form submission behavior
    e.preventDefault();
    //validates all fields and shows error messages if any validation fails
    let valid = true;
    let error = auth.validateFullName(fullName.value);

    if (error) {
        showError(fullName, error);
        valid = false;
    } else {
        clearError(fullName);
    }

    error = auth.validateEmail(email.value);

    if (error) {
        showError(email, error);
        valid = false;
    } else if (auth.emailExists(email.value.trim().toLowerCase())) {
        showError(email, "An account with this email already exists");
        valid = false;
    } else {
        clearError(email);
    }

    error = auth.validatePassword(password.value);

    if (error) {
        showError(password, error);
        valid = false;
    } else {
        clearError(password);
    }

    error = auth.validateConfirmPassword(
        password.value,
        confirmPassword.value
    );

    if (error) {
        showError(confirmPassword, error);
        valid = false;
    } else {
        clearError(confirmPassword);
    }

    if (!valid) return;
    //if all validations pass, creates a user object and attempts to register the user
    const user ={
        id: Date.now(),
        fullName: fullName.value.trim(),
        email: email.value.trim().toLowerCase(),
        company: company.value.trim(),
        password: password.value,
        createdAt: new Date().toISOString()
    };
    //waits for the registerUser function to complete and checks if the registration was successful
    const success = await auth.registerUser(user);

    if (success) {
        showSuccess("Account created successfully! Please log in.");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } else {
        showError(form, "Failed to create account. Please try again.");
    }
});