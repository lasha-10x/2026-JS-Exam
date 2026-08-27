console.log("PROFILE JS WORKING");

// ==========================
// SESSION & USER CHECK
// ==========================
const session = JSON.parse(localStorage.getItem("crm_session"));

if (!session) {
  window.location.href = "index.html";
}

const users = JSON.parse(localStorage.getItem("crm_users")) || [];
const currentUser = users.find(user => user.id === session.userId);

if (!currentUser) {
  window.location.href = "index.html";
}

// ==========================
// THEME INITIALIZATION (P0.3)
// ==========================
function initTheme() {
  const savedTheme = localStorage.getItem("crm_theme") || "dark";
  document.body.className = savedTheme;
}
initTheme();

// ==========================
// HELPER FUNCTIONS (VALIDATION & TOAST)
// ==========================


function showToast(message, type = "success") {
  const existingToast = document.querySelector(".crm-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `crm-toast toast-${type}`;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "6px";
  toast.style.color = "#fff";
  toast.style.fontWeight = "bold";
  toast.style.zIndex = "10000";
  toast.style.backgroundColor = type === "success" ? "#10b981" : "#ef4444";
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ველის ქვეშ შეცდომის დახატვა (P0.4)
function showError(inputElement, message) {
  inputElement.classList.add("input-error");
  // ვამოწმებთ, ხომ არ არის უკვე შეცდომის შეტყობინება გამოტანილი
  let errorDiv = inputElement.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains("error-msg")) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-msg";
    errorDiv.style.color = "#ef4444";
    errorDiv.style.fontSize = "12px";
    errorDiv.style.marginTop = "4px";
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
  }
  errorDiv.textContent = message;
}

// ფორმიდან ძველი შეცდომების წაშლა
function clearErrors(formElement) {
  formElement.querySelectorAll(".input-error").forEach(input => {
    input.classList.remove("input-error");
  });
  formElement.querySelectorAll(".error-msg").forEach(msg => {
    msg.remove();
  });
}

// ინიციალების გამოთვლა (P5.1)
function getInitials(fullName) {
  if (!fullName) return "??";
  const parts = fullName.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

// ==========================
// DISPLAY PROFILE INFORMATION
// ==========================
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileCompany = document.getElementById("profileCompany");
const profileInitials = document.getElementById("profileInitials");
const profileDate = document.getElementById("profileDate");

function updateProfileUI() {
  profileName.textContent = currentUser.fullName;
  profileEmail.textContent = currentUser.email;
  profileCompany.textContent = currentUser.company || "Not Specified";
  
  if (profileInitials) {
    profileInitials.textContent = getInitials(currentUser.fullName);
  }
  
 if (profileDate && currentUser.createdAt) {
  const creationDate = new Date(currentUser.createdAt);

  profileDate.textContent =
    `Member since ${creationDate.toLocaleDateString("en-US")}`;
}

  // ფორმის ველების შევსება საწყისი მნიშვნელობებით
  document.getElementById("fullName").value = currentUser.fullName;
  document.getElementById("company").value = currentUser.company || "";
}

updateProfileUI();

// ==========================
// A. UPDATE PROFILE (P5.2)
// ==========================
const profileForm = document.getElementById("profileForm");

if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(profileForm);

    const fullNameInput = document.getElementById("fullName");
    const companyInput = document.getElementById("company");

    const newName = fullNameInput.value.trim();
    const newCompany = companyInput.value.trim();

    // ვალიდაცია
    if (newName.length < 3) {
      showError(fullNameInput, "Full name must be at least 3 characters");
      return;
    }

    // შენახვა ობიექტში
    currentUser.fullName = newName;
    currentUser.company = newCompany;

    // შენახვა localStorage-ში
    localStorage.setItem("crm_users", JSON.stringify(users));

    // სესიის განახლება (რათა სხვა გვერდებმაც ახალი სახელი დაინახონ)
    session.fullName = newName;
    localStorage.setItem("crm_session", JSON.stringify(session));

    updateProfileUI();
    showToast("Profile updated ✓", "success");
  });
}

// ==========================
// B. CHANGE PASSWORD (P5.3)
// ==========================
const passwordForm = document.getElementById("passwordForm");

if (passwordForm) {
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(passwordForm);

    const currentPassInput = document.getElementById("currentPassword");
    const newPassInput = document.getElementById("newPassword");
    const confirmPassInput = document.getElementById("confirmPassword");

    const currentPassword = currentPassInput.value;
    const newPassword = newPassInput.value;
    const confirmPassword = confirmPassInput.value;

    let hasError = false;

    // 1. მიმდინარე პაროლის ვალიდაცია
    if (currentPassword !== currentUser.password) {
      showError(currentPassInput, "Current password is incorrect");
      hasError = true;
    }

    // 2. ახალი პაროლის ვალიდაცია (სიგრძე, ასო, ციფრი)
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (newPassword.length < 8 || !hasLetter || !hasNumber) {
      showError(newPassInput, "Password must be at least 8 characters and contain a letter and a number");
      hasError = true;
    } else if (newPassword === currentPassword) {
      showError(newPassInput, "New password must be different from the current one");
      hasError = true;
    }

    // 3. პაროლების დამთხვევა
    if (newPassword !== confirmPassword) {
      showError(confirmPassInput, "Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    // განახლება
    currentUser.password = newPassword;
    localStorage.setItem("crm_users", JSON.stringify(users));

    showToast("Password changed ✓", "success");
    passwordForm.reset();
  });
}

// ==========================
// C. RESET CRM DATA (P5.4)
// ==========================
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", async () => {
    const confirmReset = confirm("Are you sure you want to reset CRM data? This will clear all local client changes and reload initial 30 users.");
    if (!confirmReset) return;

    try {
      showToast("Resetting data...", "success");
      
      // რეალური fetch DummyJSON API-დან
      const response = await fetch("https://dummyjson.com/users?limit=30");
      if (!response.ok) throw new Error("API Connection Error");

      const data = await response.json();

      // მოვარგოთ კლიენტის ობიექტის მოდელს (P4.2 / P5.4)
      const freshClients = data.users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "",
        company: user.company ? user.company.name : "Unknown LLC",
        image: user.image || `https://dummyjson.com/icon/${user.firstName.toLowerCase()}s/128`,
        status: "Lead",
        dealValue: Math.floor(Math.random() * 9500) + 500, // 500-10000 დიაპაზონში
        notes: [],
        createdAt: new Date().toISOString()
      }));

      // ჩაწერა localStorage-ში
      localStorage.setItem("crm_clients", JSON.stringify(freshClients));
      showToast("CRM Data Reset Successfully! ✓", "success");
    } catch (err) {
      showToast("Failed to reset data. Check connection.", "error");
    }
  });
}

// ==========================
// GLOBAL EVENTS (P0.2 & P0.3)
// ==========================

// თემის გადართვა (Theme Toggle)
const themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";
    document.body.className = nextTheme;
    localStorage.setItem("crm_theme", nextTheme);
  });
}

// ლოგაუთი (Logout)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
  });
}

// ლოგოზე კლიკი - გადასვლა დეშბორდზე
const navLogo = document.getElementById("navLogo");
if (navLogo) {
  navLogo.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}