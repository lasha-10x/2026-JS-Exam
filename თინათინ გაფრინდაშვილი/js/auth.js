//add demo user
const demoUser = {
    id: "demo-1",
    fullName: "Demo",
    email: "demo@test.com",
    password: "demo1234",
};

function addDemoUserIfNotExists() {
    const users = getUsers();
    const demoUserExists = users.some(user => user.email === demoUser.email);
    if (!demoUserExists) {
        users.push(demoUser);
        saveUsers(users);
    }
}

// Call the function when the script loads
addDemoUserIfNotExists();


//validation functions
function validateFullName(name) {
    name = name.trim(); //trim spaces
    if (name === "") {
        return "Full name is required";
    }
    if (name.length < 3) {
        return "Full name must be at least 3 characters";
    }

    return "";
}

function validateEmail(email) {
    email = email.trim().toLowerCase(); //trim spaces and convert to lowercase

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        return "Email is required";
    }
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }

    return "";
}

function validatePassword(password) {
    if (password.trim() === "") {
        return "Password is required";
    }
    if (
        password.length < 8 || // checks password length
        !/[A-Za-z]/.test(password) || //checks for at least one lettet
        !/\d/.test(password) //checks for at least one number
    ) {
        return "Password must be at least 8 characters and contain a letter and a number";
    }

    return "";
}

function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword.trim() === "") {
        return "Please confirm your password";
    }
    //checks if the password and confirm password match
    if (password !== confirmPassword) {
        return "Passwords do not match";
    }

    return "";
}

//local storage functions

function getUsers() {
    //gets the users from local storage and parses them into an array
    const users = localStorage.getItem("crm_users"); 
    //parses json or returns an empty array if no users are found
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    //saves the users array to local storage as a JSON string 
    //wraps in try-catch to handle potential errors when saving to localStorage
     try {
        localStorage.setItem("crm_users", JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save users to localStorage:", e);
    }
}

function emailExists(email) {
    email = email.trim().toLowerCase();
    //checks if any user has the same email and returns boolean value
    return getUsers().some(
        user => user.email === email
    );
}

async function registerUser(user) {
    try {
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API request failed with status ${response.status}`);
        }
        await response.json();

        const users = getUsers();
        users.push(user);
        saveUsers(users);
        return true;
    } catch (error) {
        console.error('Failed to register user:', error);
        return false;
    }
}

function setSession(user) {
    localStorage.setItem("crm_session", JSON.stringify(user));
}

function getSession() {
    const session = localStorage.getItem("crm_session");
    return session ? JSON.parse(session) : null;
}

function clearSession() {
    localStorage.removeItem("crm_session");
}

function isLoggedIn() {
    return getSession() !== null;
}

// Call this right after setSession(user) succeeds on login
function loadUserClients(userId) {
    const archived = localStorage.getItem(`crm_clients_archive_${userId}`);
    if (archived) {
        localStorage.setItem("crm_clients", archived);
    } else {
        localStorage.removeItem("crm_clients"); // new account, nothing archived yet
    }
}

// Call this inside logout(), before clearing the session
function archiveUserClients(userId) {
    const current = localStorage.getItem("crm_clients");
    if (current) {
        localStorage.setItem(`crm_clients_archive_${userId}`, current);
    }
}


function logout() {
    const session = getSession();

    if (session) {
        archiveUserClients(session.id);
    }

    // wipe the active key so no client data sits exposed while logged out
    localStorage.removeItem("crm_clients");

    clearSession();
    window.location.href = "index.html";
}

// Expose the functions to the global scope
window.auth = {
    validateFullName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    emailExists,
    registerUser,
    getUsers,
    setSession,
    getSession,
    clearSession,
    isLoggedIn,
    logout,
    loadUserClients,
};