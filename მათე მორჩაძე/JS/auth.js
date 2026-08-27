//  =====  SIGN UP  (P1)  =====
function resetFieldErrors(user) {
    for (let key in user)
        user[key].classList.remove('input-error');

    document.querySelectorAll('.form-group').forEach(group => {
        group.querySelectorAll('small').forEach(small => small.remove());
    });
}

// Error red border and warning text
function showFieldError(input, text) {
    const formGroup = input.closest('.form-group');

    const oldWarning = formGroup.querySelector('small');
    if (oldWarning) oldWarning.remove();

    input.classList.add('input-error');

    const small = document.createElement('small');
    small.textContent = text;
    small.className = 'field-error-message';

    formGroup.appendChild(small);
}


//  =====  SIGN UP Main function  =====
function setSignUpForm() {
    // add guard if we are in Sing Up page
    const form = document.getElementById('signup-form');
    if (!form) return;
    
    form.addEventListener('submit', e => {
        e.preventDefault();

        const user = {
            fullName:   document.getElementById('fullName'),
            email   :   document.getElementById('email'),
            company :   document.getElementById('company'),
            password:   document.getElementById('password'),
            confPass:   document.getElementById('confirmPassword')
        }

        resetFieldErrors(user);
        
        // get data from key 'crm_users' in localStorage and parse to make it clear
        const users = JSON.parse(localStorage.getItem('crm_users')) || [];
        let hasError = false;

        // CHECK FULL name
        if (user.fullName.value.trim().length < 3) {
            showFieldError(user.fullName, "Full name must be at least 3 characters");
            hasError = true;
        }
        
        // CHECK Email
        const email = user.email.value.trim().toLowerCase();
        const atIndex = email.indexOf('@');

        if (atIndex === -1 || !email.slice(atIndex + 1).includes('.')) {
            showFieldError(user.email, "Please enter a valid email address");
            hasError = true;
        } else if (users.some(u => u.email === email)) {
            showFieldError(user.email, "An account with this email already exists");
            hasError = true;
        }

        // CHECK password
        let pass = user.password.value;
        let isNum = /[0-9]/.test(pass);
        let isChar = /[a-zA-Z]/.test(pass);
        let isPass = pass.length >= 8;

        if (!isNum || !isChar || !isPass) {
            showFieldError(user.password, "Password must be at least 8 characters and contain a letter and a number");
            hasError = true;
        }

        // CHECK confirm password
        if (pass !== user.confPass.value.trim()) {
            showFieldError(user.confPass, "Passwords do not match");
            hasError = true;
        }

        if (hasError) return;

        const newUser = {
            id: Date.now(),
            fullName: user.fullName.value.trim(),
            email: email,
            password: pass,
            company: user.company.value.trim(),
            createdAt: new Date().toISOString()
        }

        users.push(newUser);
        // Save users array key: 'crm_users'  in localStorage
        localStorage.setItem('crm_users', JSON.stringify(users));

        showToast("Account created successfully! Please log in.", "success");

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

//  =====  LOG IN  (P2)  =====
function setLogInForm() {
    // add guard if we are in Log In page
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        resetFieldErrors({email, password});
        let hasError = false;

        
        if (email.value.trim() === "") {
            showFieldError(email, "Email is required");
            hasError = true;
        }
        if (password.value === "") {
            showFieldError(password, "Password is required");
            hasError = true;
        }

        if (hasError) return;

        const users = JSON.parse(localStorage.getItem('crm_users')) || [];
        const emailValue = email.value.trim().toLowerCase();
        const passwordValue = password.value;
        const matchedUser = users.find(u => u.email === emailValue && u.password === passwordValue);

        if (!matchedUser) {
            showFieldError(password, "Invalid email or password");
            return;
        }

        const session = {
            userId: matchedUser.id,
            email: matchedUser.email,
            loginAt: new Date().toISOString()
        };

        localStorage.setItem('crm_session', JSON.stringify(session));
        window.location.href = 'dashboard.html';
    });
}


// CALLs functions
document.addEventListener('DOMContentLoaded', () => {
    setSignUpForm();
    setLogInForm();
});