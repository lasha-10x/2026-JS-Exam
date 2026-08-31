const signupForm =
    document.getElementById("signupForm");

const passwordInput =
    document.getElementById("password");

const passwordStrengthFill =
    document.getElementById(
        "passwordStrengthFill"
    );

const passwordStrengthText =
    document.getElementById(
        "passwordStrengthText"
    );

const passwordStrengthScore =
    document.getElementById(
        "passwordStrengthScore"
    );

const lengthRequirement =
    document.getElementById(
        "lengthRequirement"
    );

const uppercaseRequirement =
    document.getElementById(
        "uppercaseRequirement"
    );

const numberRequirement =
    document.getElementById(
        "numberRequirement"
    );

const specialRequirement =
    document.getElementById(
        "specialRequirement"
    );


function isValidEmail(email) {
    const atIndex =
        email.indexOf("@");

    const dotIndex =
        email.lastIndexOf(".");

    return (
        atIndex > 0 &&
        dotIndex > atIndex + 1 &&
        dotIndex < email.length - 1
    );
}


function isValidPassword(password) {
    const hasLetter =
        /[A-Za-z]/.test(password);

    const hasNumber =
        /\d/.test(password);

    return (
        password.length >= 8 &&
        hasLetter &&
        hasNumber
    );
}


function setRequirementState(
    element,
    isComplete
) {
    if (!element) {
        return;
    }

    element.classList.toggle(
        "complete",
        isComplete
    );
}


function updatePasswordStrength() {
    if (!passwordInput) {
        return;
    }

    const password =
        passwordInput.value;

    const hasLength =
        password.length >= 8;

    const hasUppercase =
        /[A-Z]/.test(password);

    const hasNumber =
        /\d/.test(password);

    const hasSpecial =
        /[^A-Za-z0-9]/.test(password);

    setRequirementState(
        lengthRequirement,
        hasLength
    );

    setRequirementState(
        uppercaseRequirement,
        hasUppercase
    );

    setRequirementState(
        numberRequirement,
        hasNumber
    );

    setRequirementState(
        specialRequirement,
        hasSpecial
    );

    let score = 0;

    if (hasLength) {
        score++;
    }

    if (hasUppercase) {
        score++;
    }

    if (hasNumber) {
        score++;
    }

    if (hasSpecial) {
        score++;
    }

    passwordStrengthFill.className =
        "password-strength-fill";

    if (password.length === 0) {
        passwordStrengthFill.style.width =
            "0%";

        passwordStrengthText.textContent =
            "Password strength";

        passwordStrengthScore.textContent =
            "";

        return;
    }

    if (score <= 1) {
        passwordStrengthFill.style.width =
            "33%";

        passwordStrengthFill.classList.add(
            "weak"
        );

        passwordStrengthText.textContent =
            "Weak password";

        passwordStrengthScore.textContent =
            "Weak";

        return;
    }

    if (score <= 3) {
        passwordStrengthFill.style.width =
            "66%";

        passwordStrengthFill.classList.add(
            "medium"
        );

        passwordStrengthText.textContent =
            "Medium password";

        passwordStrengthScore.textContent =
            "Medium";

        return;
    }

    passwordStrengthFill.style.width =
        "100%";

    passwordStrengthFill.classList.add(
        "strong"
    );

    passwordStrengthText.textContent =
        "Strong password";

    passwordStrengthScore.textContent =
        "Strong";
}


if (passwordInput) {
    passwordInput.addEventListener(
        "input",
        updatePasswordStrength
    );
}


if (signupForm) {
    signupForm.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const fullNameInput =
                document.getElementById(
                    "fullName"
                );

            const emailInput =
                document.getElementById(
                    "email"
                );

            const companyInput =
                document.getElementById(
                    "company"
                );

            const confirmPasswordInput =
                document.getElementById(
                    "confirmPassword"
                );

            const fullName =
                fullNameInput.value.trim();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const company =
                companyInput.value.trim();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;

            const fullNameError =
                document.getElementById(
                    "fullNameError"
                );

            const emailError =
                document.getElementById(
                    "emailError"
                );

            const passwordError =
                document.getElementById(
                    "passwordError"
                );

            const confirmPasswordError =
                document.getElementById(
                    "confirmPasswordError"
                );

            fullNameError.textContent =
                "";

            emailError.textContent =
                "";

            passwordError.textContent =
                "";

            confirmPasswordError.textContent =
                "";

            let isValid =
                true;

            if (
                fullName.length < 3
            ) {
                fullNameError.textContent =
                    "Full name must be at least 3 characters";

                isValid =
                    false;
            }

            if (
                !isValidEmail(
                    email
                )
            ) {
                emailError.textContent =
                    "Please enter a valid email address";

                isValid =
                    false;
            }

            if (
                !isValidPassword(
                    password
                )
            ) {
                passwordError.textContent =
                    "Password must be at least 8 characters and contain a letter and a number";

                isValid =
                    false;
            }

            if (
                password !==
                confirmPassword
            ) {
                confirmPasswordError.textContent =
                    "Passwords do not match";

                isValid =
                    false;
            }

            const users =
                getStorageItem(
                    STORAGE_KEYS.USERS
                ) || [];

            const emailExists =
                users.some(
                    function (user) {
                        return (
                            user.email ===
                            email
                        );
                    }
                );

            if (emailExists) {
                emailError.textContent =
                    "An account with this email already exists";

                isValid =
                    false;
            }

            if (!isValid) {
                return;
            }

            const newUser = {
                id:
                    Date.now(),

                fullName:
                    fullName,

                email:
                    email,

                password:
                    password,

                company:
                    company,

                createdAt:
                    new Date().toISOString()
            };

            users.push(
                newUser
            );

            setStorageItem(
                STORAGE_KEYS.USERS,
                users
            );

            showToast(
                "Account created successfully! Please log in.",
                "success"
            );

            signupForm.reset();

            updatePasswordStrength();

            setTimeout(
                function () {
                    window.location.href =
                        "index.html";
                },
                1500
            );
        }
    );
}