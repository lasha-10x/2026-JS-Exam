document.addEventListener("DOMContentLoaded", () => {
  const SESSION_KEY = "crm_session";
  // The session may be persistent (localStorage) or tab-only (sessionStorage).
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || "null");
  const users = JSON.parse(localStorage.getItem("crm_users") || "[]");
  let userIndex = users.findIndex((user) => user.id === session?.userId);
  const toast = document.getElementById("toast");

  if (userIndex < 0) return;

  const user = users[userIndex];
  document.getElementById("profile-name").value = user.fullName;
  document.getElementById("profile-email").value = user.email;
  document.getElementById("profile-company").value = user.company === "N/A" ? "" : user.company;

  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `${type} show`;
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  document.getElementById("profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    const company = document.getElementById("profile-company").value.trim();
    const error = document.getElementById("profile-name-error");
    error.textContent = "";

    if (name.length < 3) {
      error.textContent = "Full name must be at least 3 characters.";
      return;
    }

    // Spread keeps password, id, and createdAt while changing only profile fields.
    users[userIndex] = { ...users[userIndex], fullName: name, company: company || "N/A" };
    localStorage.setItem("crm_users", JSON.stringify(users));
    showToast("Profile saved");
  });

  document.getElementById("password-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const current = document.getElementById("current-password").value;
    const next = document.getElementById("new-password").value;
    const confirm = document.getElementById("confirm-new-password").value;
    const error = document.getElementById("password-error");
    error.textContent = "";

    if (current !== users[userIndex].password) error.textContent = "Current password is incorrect.";
    else if (next.length < 8 || !/\d/.test(next) || !/[a-zA-Z]/.test(next)) error.textContent = "New password must be 8+ characters with a letter and number.";
    else if (next !== confirm) error.textContent = "New passwords do not match.";
    else {
      users[userIndex].password = next;
      localStorage.setItem("crm_users", JSON.stringify(users));
      event.target.reset();
      showToast("Password updated");
    }
  });

  document.getElementById("reset-clients-btn").addEventListener("click", async () => {
    if (!window.confirm("Reset CRM data? Your clients will be reloaded.")) return;
    try {
      // true skips the saved array and imports a fresh list from DummyJSON.
      await getCrmClients(true);
      showToast("CRM data reset");
    } catch (error) {
      console.error(error);
      showToast("Could not reset CRM data.", "error");
    }
  });
});
