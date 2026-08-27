// Check if a user session already exists
const currentUser = JSON.parse(localStorage.getItem("crm_session"));

// If the user is already logged in and is on the login or signup page,
// redirect them straight to the dashboard
if (
    currentUser &&
    (
        window.location.pathname.includes("index.html") ||
        window.location.pathname.includes("signup.html")
    )
) {
    window.location.href = "dashboard.html";
}

// Get reference to the signup form
const signupForm = document.getElementById("signupForm");

// Only attach the submit handler if the signup form exists on this page
if (signupForm) {

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Grab and sanitize form field values
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const company = document.getElementById("company").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Regex pattern used to validate basic email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Clear previous errors
        clearFieldError("fullName");
        clearFieldError("email");
        clearFieldError("password");
        clearFieldError("confirmPassword");

        let hasError = false;

        // Full Name Validation
        if (fullName.length < 3) {
            showFieldError("fullName", "Full name must be at least 3 characters");
            hasError = true;
        }

        // Email Validation
        if (email === "") {
            showFieldError("email", "Email is required");
            hasError = true;
        }

        if (!emailPattern.test(email)) {
    showFieldError(
        "email",
        "Please enter a valid email address"
    );

    hasError = true;
}

        // Password Validation
        if (password.length < 8) {
            showFieldError("password", "Password must be at least 8 characters");
            hasError = true;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password)) {
    showFieldError(
        "password",
        "Password must be at least 8 characters and contain a letter and a number"
    );
    hasError = true;  
}

        // Confirm Password Validation
        if (password !== confirmPassword) {
            showFieldError("confirmPassword", "Passwords do not match");
            hasError = true;
        }

         // Create a new user object from the signup form data
        const user = {
            // Generate a unique ID based on the current timestamp
            id: Date.now(),
            fullName: fullName,
            email: email,
            company: company,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Get all registered users from localStorage
        // If no users exist yet, use an empty array
        const users = JSON.parse(localStorage.getItem("crm_users")) || [];

        // Check if an account with the same email already exists
        const existingUser = users.find(function (item) {
    return item.email === email;
});

// If the email is already registered, show an error
if (existingUser) {
    showFieldError(
        "email",
        "An account with this email already exists."
    );
    hasError = true;
}

// Stop the signup process if there are validation errors
if (hasError) {
    return;
}

        // Add the new user to the users array
        users.push(user);

        // Save the updated users array back to localStorage
        localStorage.setItem("crm_users", JSON.stringify(users));

        showToast("Account created successfully! Please log in");

        // Redirect the user to the login page after 1.5 seconds
        setTimeout(function () {
            window.location.href = "index.html";
        }, 1500);

       
    });

}

// Get the login form element
const loginForm = document.getElementById("loginForm");

// Run the login logic only if the form exists
if (loginForm) {


      // Listen for the login form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
    

        // Get the entered email, remove extra spaces,
        // and convert it to lowercase
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

           // Clear any previous validation errors
        clearFieldError("loginEmail");
        clearFieldError("loginPassword");

         // Load registered users from localStorage
        // Use an empty array if there are no users
        const users = JSON.parse(localStorage.getItem("crm_users")) || [];
        let hasError = false;
// Check if the email field is empty
if (email === "") {
    showFieldError("loginEmail", "Email is required");
    hasError = true;
}
// Check if the password field is empty
if (password === "") {
    showFieldError("loginPassword", "Password is required");
    hasError = true;
}
// Stop the login process if validation fails
if (hasError) {
    return;
}

        // Find a user with the entered email
        const user = users.find(function (item) {
            return item.email === email;
        });

       // Check if the user exists and the password matches
        if (!user || user.password !== password) {
    showFieldError("loginPassword", "Invalid email or password");
    return;

}
// Create a session object for the logged-in user
const sessionUser = {

    fullName: user.fullName,

    email: user.email,
    
     
    company: user.company,

    createdAt: user.createdAt,

    password: user.password
     
};
// Save the logged-in user's session in localStorage
localStorage.setItem(
    "crm_session",
    JSON.stringify(sessionUser)
);


// Show a successful login message
showToast("Login successful!");

    // Redirect the user to the dashboard page
    window.location.href = "dashboard.html";


        
    });

}
