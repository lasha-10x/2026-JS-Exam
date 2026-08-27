document.addEventListener("DOMContentLoaded", () => {
  initProfilePage();
});

let currentUser = null;
let usersState = [];

function initProfilePage() {
  // 1. წამოვიღოთ სესია
  const sessionRaw = localStorage.getItem("crm_session");
  usersState = JSON.parse(localStorage.getItem("crm_users")) || [];

  if (!sessionRaw) {
    window.location.href = "index.html";
    return;
  }

  let sessionEmail = "";

  // დაზღვევა: ვამოწმებთ სესია უბრალო ტექსტია (ელფოსტა) თუ JSON ობიექტი
  try {
    const parsedSession = JSON.parse(sessionRaw);
    sessionEmail = parsedSession.email || sessionRaw;
  } catch (e) {
    sessionEmail = sessionRaw; // თუ JSON არ არის, პირდაპირ ტექსტია
  }

  // 2. ვეძებთ მომხმარებელს რეალურ ბაზაში ელფოსტით
  currentUser = usersState.find(
    (u) => u.email.trim().toLowerCase() === sessionEmail.trim().toLowerCase(),
  );

  // 3. თუ მომხმარებელი მაინც ვერ მოიძებნა, წამოვიღოთ მონაცემები სესიის ობიექტიდანვე, რომ ნინო აღარ გამოხტეს
  if (!currentUser) {
    try {
      const parsedSession = JSON.parse(sessionRaw);
      currentUser = {
        fullName: parsedSession.fullName || "User Name",
        email: parsedSession.email || "user@example.com",
        company: parsedSession.company || "10X Sales",
        password: parsedSession.password || "Password123",
        createdAt: parsedSession.loggedInAt || new Date().toISOString(),
      };
    } catch (e) {
      currentUser = {
        fullName: "User Name",
        email: sessionEmail,
        company: "10X Sales",
        password: "Password123",
        createdAt: new Date().toISOString(),
      };
    }
    // შევინახოთ ბაზაში, რომ შემდეგზე ჩვეულებრივად იპოვოს
    usersState.push(currentUser);
    localStorage.setItem("crm_users", JSON.stringify(usersState));
  }

  // 4. გავუშვათ რენდერი
  renderProfileInfo();
  setupEventListeners();
}

// P5.1: ინფორმაციის ბლოკის და ველების პირველადი რენდერი
function renderProfileInfo() {
  const name = currentUser.fullName || "User";
  const email = currentUser.email;
  const company = currentUser.company || "Independent LLC";
  const date = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  // ავატარი ინიციალებით (სახელისა და გვარის პირველი ასოები)
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  document.getElementById("userAvatar").innerText = initials;

  // ტექსტების გამოტანა
  document.getElementById("displayFullName").innerText = name;
  document.getElementById("displayMeta").innerText = `${email} · ${company}`;
  document.getElementById("displayMemberSince").innerText =
    `Member since ${date}`;

  // ინპუტების წინასწარ შევსება
  document.getElementById("profileFullName").value = name;
  document.getElementById("profileCompany").value = currentUser.company || "";
}

function setupEventListeners() {
  // A. Save Changes - პროფილის რედაქტირება
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      const newName = document.getElementById("profileFullName").value.trim();
      const newCompany = document.getElementById("profileCompany").value.trim();

      if (newName.length < 3) {
        showError(
          "profileNameError",
          "Full name must be at least 3 characters",
        );
        return;
      }

      // განახლება მასივში და ობიექტში
      currentUser.fullName = newName;
      currentUser.company = newCompany;

      localStorage.setItem("crm_users", JSON.stringify(usersState));
      renderProfileInfo(); // ვიზუალის განახლება
      showToast("Profile updated ✓");
    });

  // B. Change Password - პაროლის შეცვლა
  document
    .getElementById("changePasswordForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      const currentPass = document.getElementById("currentPassword").value;
      const newPass = document.getElementById("newPassword").value;
      const confirmPass = document.getElementById("confirmPassword").value;

      // ვალიდაცია 1: მიმდინარე პაროლის შემოწმება
      if (currentPass !== currentUser.password) {
        showError("currentPasswordError", "Current password is incorrect");
        return;
      }

      // ვალიდაცია 2: ახალი პაროლის სიგრძე და სირთულე (მინ 8 სიმბოლო, 1 ასო + 1 ციფრი)
      const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passRegex.test(newPass)) {
        showError(
          "newPasswordError",
          "Password must be at least 8 characters and contain a letter and a number",
        );
        return;
      }

      // ვალიდაცია 3: ახალი არ უნდა უდრიდეს ძველს
      if (newPass === currentPass) {
        showError(
          "newPasswordError",
          "New password must be different from the current one",
        );
        return;
      }

      // ვალიდაცია 4: დადასტურების შედარება
      if (newPass !== confirmPass) {
        showError("confirmPasswordError", "Passwords do not match");
        return;
      }

      // პაროლის განახლება
      currentUser.password = newPass;
      localStorage.setItem("crm_users", JSON.stringify(usersState));

      this.reset(); // ფორმის გასუფთავება
      showToast("Password changed ✓");
    });

  // C. Reset CRM Data - კლიენტების ბაზის განულება
  document
    .getElementById("resetDataBtn")
    .addEventListener("click", async function () {
      if (
        !confirm(
          "Are you sure you want to reset all CRM data? This will overwrite your current client database.",
        )
      )
        return;

      try {
        // წავშალოთ ადგილობრივი კლიენტები
        localStorage.removeItem("crm_clients");

        // გამოვიძახოთ app.js-ში არსებული საწყისი ჩატვირთვის ფუნქცია ხელახლა,
        // რომელიც წამოიღებს ბაზისურ 30 კლიენტს API-დან
        if (typeof initClientsData === "function") {
          await initClientsData();
        } else {
          // ალტერნატიული პირდაპირი წამოღება, თუ ფუნქციაზე წვდომა არ არის
          const res = await fetch("https://dummyjson.com/users?limit=30");
          const data = await res.json();
          const mapped = data.users.map((u) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            phone: u.phone,
            company: u.company ? u.company.name : "Independent LLC",
            dealValue: Math.floor(Math.random() * 10000) + 1000,
            status: ["Lead", "Contacted", "Won", "Lost"][
              Math.floor(Math.random() * 4)
            ],
            notes: [],
            image: u.image,
            createdAt: new Date().toISOString(),
          }));
          localStorage.setItem("crm_clients", JSON.stringify(mapped));
        }

        showToast("CRM Data reset successfully! ✓");
      } catch (err) {
        showToast("Failed to reset data from server.");
      }
    });
}

// დამხმარე ვიზუალური ფუნქციები
function showError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = message;
    el.style.display = "block";
  }
}

function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.style.display = "none"));
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
