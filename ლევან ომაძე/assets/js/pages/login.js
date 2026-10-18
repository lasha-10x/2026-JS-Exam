document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const formError = document.querySelector("#form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    const formData = new FormData(form);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    let hasError = false;

    if (!email) {
      setFieldError("email", "Email is required");
      hasError = true;
    }

    if (!password) {
      setFieldError("password", "Password is required");
      hasError = true;
    }

    if (hasError) {
      focusFirstError(form);
      return;
    }

    const session = loginUser(email, password);
    if (!session) {
      formError.textContent = "Invalid email or password";
      return;
    }

    showToast("Logged in ✓");
    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 300);
  });
});
