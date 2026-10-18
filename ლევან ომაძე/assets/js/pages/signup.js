document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#signup-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    const formData = new FormData(form);
    const fullName = String(formData.get("fullName")).trim();
    const email = normalizeEmail(String(formData.get("email")));
    const company = String(formData.get("company")).trim();
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));
    const users = getUsers();
    let hasError = false;

    if (fullName.length < 3) {
      setFieldError("fullName", "Full name must be at least 3 characters");
      hasError = true;
    }

    if (!isValidEmail(email)) {
      setFieldError("email", "Please enter a valid email address");
      hasError = true;
    } else if (users.some((user) => user.email === email)) {
      setFieldError("email", "An account with this email already exists");
      hasError = true;
    }

    if (!isStrongPassword(password)) {
      setFieldError("password", "Password must be at least 8 characters and contain a letter and a number");
      hasError = true;
    }

    if (confirmPassword !== password) {
      setFieldError("confirmPassword", "Passwords do not match");
      hasError = true;
    }

    if (hasError) {
      focusFirstError(form);
      return;
    }

    const user = {
      id: Date.now(),
      fullName,
      email,
      password,
      company,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, user]);
    showToast("Account created successfully! Please log in.");
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  });
});
