//Sign up.js

// --- Main logic ---

document
  .getElementById("newClientForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = this;
    const fullName = form.elements["fullName"].value.trim();
    const email = form.elements["email"].value.trim();
    const company = form.elements["company"].value.trim();
    const password = form.elements["password"].value;
    const confirmPassword = form.elements["confirmPassword"].value;

    let isValid = true;

    // Full name
    if (fullName.length < 3) {
      setError("fullName", "Full name must be at least 3 characters");
      isValid = false;
    } else {
      setValid("fullName");
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("email", "Please enter a valid email address");
      isValid = false;
    } else {
      setValid("email");
    }

    // Company (optional, always valid — but mark it visually if you want)
    setValid("company");

    // Password
    if (password.length < 6) {
      setError("password", "Password must be at least 6 characters");
      isValid = false;
    } else {
      setValid("password");
    }

    //more requirements for password.
    // if (password.length < 8) {
    //     setError('password', 'Password must be at least 8 characters');
    //     isValid = false;
    // } else if (!/\d/.test(password)) {
    //     setError('password', 'Password must contain at least one number');
    //     isValid = false;
    // } else if (!/[A-Z]/.test(password)) {
    //     setError('password', 'Password must contain at least one uppercase letter');
    //     isValid = false;
    // } else {
    //     setValid('password');
    // }

    // Confirm password
    if (password !== confirmPassword) {
      setError("confirmPassword", "Passwords do not match");
      isValid = false;
    } else {
      setValid("confirmPassword");
    }

    if (!isValid) {
      showToast("Please fix the errors above", "error");
      return;
    }

    // --- Check for duplicate email ---
    const users = loadUsers();
    if (users.some((u) => u.email === email)) {
      setError("email", "An account with this email already exists");
      showToast("Signup failed", "error");
      return;
    }

    // --- Practice DummyJSON call ---
    try {
      await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: fullName, email, company }),
      });
    } catch (err) {
      console.warn("DummyJSON call failed:", err);
    }

    // --- Save locally ---
    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      fullName,
      email,
      company,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);

    // --- Success feedback + reset ---
    showToast("Account created successfully!", "success");
    form.reset();
    clearAllValidation(form);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000); // wait for toast to show before redirecting
  });
