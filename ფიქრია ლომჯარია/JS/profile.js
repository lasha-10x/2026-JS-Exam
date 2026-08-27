//--------------------Protects Clients page to open without log in----------
const session = requireAuth();

//--------------Handles theme changing-------------
initTheme();

document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);


//---------------In the Header Active page------
highlightActiveNavLink();


// --- Load logged-in user into profile header ---
document.addEventListener("DOMContentLoaded", () => {
  const user = requireAuth(); // already redirects to index.html if nobody's logged in
  if (!user) return;

  document.getElementById("userName").textContent =
    user.fullName  || user.name;

  document.getElementById("userMail").textContent = user.email || "";

  const memberSinceEl = document.getElementById("memberSince");
  const joined = user.createdAt || user.joinDate;
  if (memberSinceEl && joined) {
    memberSinceEl.textContent =
      "Member since " + new Date(joined).toLocaleDateString();
  }
  });

  //------------Change Name, Update crm_users, ----------------

 document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
  const fullName = form.elements["fullName"].value.trim();
  const company = form.elements["company"].value.trim();

  let isValid = true;

  if (fullName.length < 3) {
    setError("fullName", "Full name must be at least 3 characters");
    isValid = false;
  } else {
    setValid("fullName");
  }

  setValid("company");                                                     // optional field, always valid

  if (!isValid) {
    showToast("Please fix the errors above", "error");
    return;
  }

  // --- Find and update this user in crm_users ---
  const session = getSession();
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === session.id);

  if (index === -1) {
    showToast("Could not find your account", "error");
    return;
  }

  users[index].fullName = fullName;
  users[index].company = company;
  saveUsers(users);

  // --- Refresh the session so it matches the updated record ---
  setSession(users[index]);

  // --- Reflect the change immediately on this page ---
  document.getElementById("userName").textContent = users[index].fullName;

  showToast("Profile updated ✓", "success");
});


//-------------------change password logic-------
document.getElementById("passwordForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
  const currentPassword = form.elements["currentPassword"].value;
  const newPassword = form.elements["newPassword"].value;
  const confirmNew = form.elements["confirmNew"].value;

  const session = getSession();
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === session.id);

  if (index === -1) {
    showToast("Could not find your account", "error");
    return;
  }

  const actualCurrentPassword = users[index].password;
  let isValid = true;

  // Current password must match what's stored
  if (currentPassword !== actualCurrentPassword) {
    setError("currentPassword", "Current password is incorrect");
    isValid = false;
  } else {
    setValid("currentPassword");
  }

  // New password: must differ from current, and meet complexity rules
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (newPassword === actualCurrentPassword) {
    setError("newPassword", "New password must be different from the current one");
    isValid = false;
  } else if (!passwordPattern.test(newPassword)) {
    setError("newPassword", "Password must be at least 8 characters and contain a letter and a number");
    isValid = false;
  } else {
    setValid("newPassword");
  }


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



  // Confirm new password
  if (confirmNew !== newPassword) {
    setError("confirmNew", "Passwords do not match");
    isValid = false;
  } else {
    setValid("confirmNew");
  }

  if (!isValid) {
    showToast("Please fix the errors above", "error");
    return;
  }

  // --- Save new password ---
  users[index].password = newPassword;
  saveUsers(users);
  setSession(users[index]); // keep session in sync with crm_users

  form.reset();
  clearAllValidation(form);
  showToast("Password changed ✓", "success");
});


//-------------Reset Client Data------------
document.getElementById("resetData").addEventListener("click", async function () {
  const confirmed = window.confirm(
    "This will delete all client data and reload fresh demo data from the API. Continue?"
  );
  if (!confirmed) return;

  localStorage.removeItem("crm_clients");

  try {
    await getEnrichedClients();
    showToast("CRM data reset ✓", "success");
  } catch (err) {
    console.error("Failed to reload client data:", err);
    showToast("Could not reload client data", "error");
  }
});


//-------------------Log Out--------
document.getElementById('logoutBtn').addEventListener('click', logout);