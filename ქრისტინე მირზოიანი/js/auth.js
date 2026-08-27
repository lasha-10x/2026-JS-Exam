// P1 Sign Up + P2 Login + Logout
class Auth {
    constructor() {
        this.initSignup();
        this.initLogin();
    }

    initSignup() {
        const form = document.getElementById('signupForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            FormErrors.clear();

            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const company = document.getElementById('regCompany').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (!this.validateSignup({ name, email, password, confirmPassword })) return;

            const users = Storage.getUsers();
            users.push({
                id: Date.now(),
                fullName: name,
                email,
                password,
                company: company || '',
                createdAt: new Date().toISOString()
            });

            Storage.saveUsers(users);
            Toast.show('Account created successfully! Please log in.', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    validateSignup({ name, email, password, confirmPassword }) {
        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

        if (name.length < 3) {
            FormErrors.show('regName', 'nameError', 'Full name must be at least 3 characters');
            valid = false;
        }

        if (!emailRegex.test(email)) {
            FormErrors.show('regEmail', 'emailError', 'Please enter a valid email address');
            valid = false;
        }

        if (Storage.getUsers().some(u => u.email === email)) {
            FormErrors.show('regEmail', 'emailError', 'An account with this email already exists');
            valid = false;
        }

        if (!passwordRegex.test(password)) {
            FormErrors.show('regPassword', 'passwordError', 'Password must be at least 8 characters and contain a letter and a number');
            valid = false;
        }
        // 'regPassword', 'passwordError', 'Password must be at least 10 characters and contain a letter and a number'

        if (password !== confirmPassword) {
            FormErrors.show('regConfirmPassword', 'confirmPasswordError', 'Passwords do not match');
            valid = false;
        }

        return valid;
    }

    initLogin() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            FormErrors.clear();

            const email = document.getElementById('emailInput').value.trim().toLowerCase();
            const password = document.getElementById('passwordInput').value;
            let valid = true;

            if (!email) {
                FormErrors.show('emailInput', 'loginEmailError', 'Email is required');
                valid = false;
            }

            if (!password) {
                FormErrors.show('passwordInput', 'loginPasswordError', 'Password is required');
                valid = false;
            }

            if (!valid) return;

            const user = Storage.getUsers().find(u => u.email === email && u.password === password);

            if (user) {
                Storage.saveSession({
                    userId: user.id,
                    email: user.email,
                    loginAt: new Date().toISOString()
                });
                window.location.href = 'dashboard.html';
            } else {
                document.getElementById('loginGlobalError').innerText = 'Invalid email or password';
            }
        });
    }

    static logout() {
        Storage.remove(Storage.KEYS.SESSION);
        window.location.href = 'index.html';
    }
}

window.logout = Auth.logout;
