// ==========================================
// P0.1 - Auth Guard (წვდომის კონტროლი)
// ==========================================
function checkAuth() {
  const currentSession = localStorage.getItem("crm_session");
  const path = window.location.pathname.toLowerCase();

  // ზუსტად ვადგენთ მიმდინარე გვერდს
  const isLoginPage =
    path.includes("index.html") || path === "/" || path.endsWith("/");
  const isSignUpPage = path.includes("signup.html");
  const isProtectedPage =
    path.includes("dashboard.html") ||
    path.includes("clients.html") ||
    path.includes("profile.html");

  // 1. თუ მომხმარებელი ავტორიზებულია და ცდილობს საჯარო გვერდებზე შესვლას -> გაუშვი დეშბორდზე
  if (currentSession && (isLoginPage || isSignUpPage)) {
    window.location.href = "dashboard.html";
    return;
  }

  // 2. თუ მომხმარებელი არ არის ავტორიზებული და ცდილობს დაცულ გვერდებზე შესვლას -> გააბრუნე ლოგინზე
  if (!currentSession && isProtectedPage) {
    window.location.href = "index.html";
    return;
  }
}

// გაეშვას დაცვის ფუნქცია ავტომატურად გვერდის ჩატვირთვისთანავე
window.addEventListener("DOMContentLoaded", checkAuth);

// ==========================================
// P2.3 - ლოგინის ფორმის გაგზავნის ლოგიკა
// ==========================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    const emailValue = emailInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value;

    clearLoginErrors();
    let hasErrors = false;

    if (emailValue === "") {
      showLoginError("loginEmailError", "Email is required");
      hasErrors = true;
    }

    if (passwordValue === "") {
      showLoginError("loginPasswordError", "Password is required");
      hasErrors = true;
    }

    if (hasErrors) return;

    const crmUsers = JSON.parse(localStorage.getItem("crm_users")) || [];
    const foundUser = crmUsers.find(
      (user) => user.email.toLowerCase() === emailValue,
    );

    if (!foundUser || foundUser.password !== passwordValue) {
      const generalErrorDiv = document.getElementById("generalError");
      generalErrorDiv.innerText = "Invalid email or password";
      generalErrorDiv.style.display = "block";
      return;
    }

    const sessionData = {
      userId: foundUser.id,
      email: foundUser.email,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem("crm_session", JSON.stringify(sessionData));

    window.location.href = "dashboard.html";
  });
}

// დამხმარე ფუნქციები შეცდომებისთვის
function showLoginError(elementId, text) {
  const errDiv = document.getElementById(elementId);
  if (errDiv) {
    errDiv.innerText = text;
    errDiv.style.display = "block";
  }
}

function clearLoginErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((err) => {
    err.innerText = "";
    err.style.display = "none";
  });
  const generalError = document.getElementById("generalError");
  if (generalError) generalError.style.display = "none";
}

// ==========================================
// P3.5 - კლიენტების მონაცემების წყაროს ლოგიკა (DummyJSON API)
// ==========================================
async function initClientsData() {
  let localClients = localStorage.getItem("crm_clients");

  if (localClients) {
    return JSON.parse(localClients);
  }

  try {
    const response = await fetch("https://dummyjson.com/users?limit=30");
    const data = await response.json();

    const mappedClients = data.users.map((user, index) => {
      const statuses = ["Lead", "Contacted", "Won", "Lost"];
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "+995 555 00 00 00",
        company: user.company?.name || "Independent LLC",
        image: user.image,
        status: statuses[index % statuses.length],
        dealValue: Math.floor(Math.random() * 9000) + 1000,
        notes: [
          {
            text: "Initial import from API",
            date: new Date().toLocaleString(),
          },
        ],
        createdAt: new Date(Date.now() - index * 36 * 60000).toISOString(),
      };
    });

    localStorage.setItem("crm_clients", JSON.stringify(mappedClients));
    return mappedClients;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return [];
  }
}

// ==========================================
// P0.3 - Dark/Light თემის გადართვის ლოგიკა
// ==========================================
function initTheme() {
  // 1. ვამოწმებთ, რა თემა ინახება localStorage-ში. დეფოლტად ვიღებთ "light"-ს (ან "dark"-ს, სურვილისამებრ)
  const savedTheme = localStorage.getItem("crm_theme") || "light";

  // 2. ვადებთ შესაბამის კლასს body-ს
  document.body.classList.add(savedTheme + "-theme");

  // 3. ვპოულობთ ნავიგაციაში თემის გადამრთველ ღილაკს (თუ არსებობს)
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      if (document.body.classList.contains("light-theme")) {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        localStorage.setItem("crm_theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        localStorage.setItem("crm_theme", "light");
      }
    });
  }
}

// ჩავამატოთ თემის ინიციალიზაცია DOMContentLoaded ივენთში
window.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  initTheme(); // <--- ეს ხაზი ჩაირთვება გვერდის გახსნისას
});

// ==========================================
// P0.2 - გლობალური ნავიგაციის დინამიური ჩატვირთვა
// ==========================================
function renderGlobalNavbar() {
  const navbarContainer = document.getElementById("global-navbar");
  if (!navbarContainer) return; // თუ გვერდზე ეს კონტეინერი არ არის, კოდი არ გაეშვება (მაგ. ლოგინზე)

  const path = window.location.pathname.toLowerCase();

  // განვსაზღვროთ აქტიური კლასი
  const isDashboard = path.includes("dashboard.html") ? "active" : "";
  const isClients = path.includes("clients.html") ? "active" : "";
  const isProfile = path.includes("profile.html") ? "active" : "";

  // ჩავწეროთ ერთიანი HTML სტრუქტურა
  navbarContainer.innerHTML = `
    <nav class="navbar">
        <a href="dashboard.html" class="nav-logo">10X CRM</a>
        <div class="nav-links">
            <a href="dashboard.html" class="${isDashboard}">Dashboard</a>
            <a href="clients.html" class="${isClients}">Clients</a>
            <a href="profile.html" class="${isProfile}">Profile</a>
            <button id="themeToggle" style="background: none; border: 1px solid #fff; color: white; padding: 4px 10px; border-radius: 6px; cursor: pointer; margin-left: 10px;">Theme 🌓</button>
        </div>
        <button class="btn-logout" id="globalLogoutBtn">Logout</button>
    </nav>
  `;

  // იქვე მივაბათ Logout-ის ფუნქციონალიც
  document.getElementById("globalLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("crm_session");
    window.location.href = "index.html";
  });
}

// ჩავსვათ DOMContentLoaded-ში, რომ სხვა ფუნქციებთან ერთად ეგრევე გაეშვას
window.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  renderGlobalNavbar(); // <--- აი ეს ჩაემატა
  initTheme();
});
