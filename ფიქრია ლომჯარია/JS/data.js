// --- Theme handling ---
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  updateThemeButtonLabel(theme);
}

function updateThemeButtonLabel(theme) {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  btn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function initTheme() {
  const saved = localStorage.getItem("crm_theme") || "light";
  applyTheme(saved);
}

function toggleTheme() {
  const current = localStorage.getItem("crm_theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("crm_theme", next);
  applyTheme(next);
}

//--------------Active Class for Current Page-------------
function highlightActiveNavLink() {
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

  document.querySelectorAll("header nav a, header ul li a").forEach((link) => {
    const linkPage = link
      .getAttribute("href")
      .replace(".html", "")
      .replace(/^\//, "");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Load clients from localStorage, or fetch initial data from DummyJSON if first visit ---------------------old version without error handling

// --- crm_clients: fetched from DummyJSON, first-time only ---    1st version, without error handling
// async function loadClients() {
//   const saved = localStorage.getItem('crm_clients');
//   if (saved) {
//     return JSON.parse(saved);
//   }
//   const res = await fetch('https://dummyjson.com/users');

//   if (!res.ok) {
//     throw new Error(`Failed to fetch clients: ${res.status}`);
//   }

//   const data = await res.json();
//   localStorage.setItem('crm_clients', JSON.stringify(data.users));
//   return data.users;
// }

//Loading Client data, includes Error Handling:
async function loadClients() {
  try {
    const saved = localStorage.getItem("crm_clients");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Bad client cache, refetching:", err);
    try {
      localStorage.removeItem("crm_clients");
    } catch {}
  }

  let res;
  try {
    res = await fetch("https://dummyjson.com/users");
  } catch (err) {
    throw new Error("Network error while loading clients", { cause: err });
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch clients: ${res.status}`);
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Invalid response format from clients API", { cause: err });
  }

  if (!Array.isArray(data?.users)) {
    throw new Error(
      "Unexpected response shape: expected data.users to be an array",
    );
  }

  try {
    localStorage.setItem("crm_clients", JSON.stringify(data.users));
  } catch (err) {
    console.warn("Could not cache clients:", err);
  }

  return data.users;
}

// --- crm_users: accounts created via signup ---
function loadUsers() {
  const saved = localStorage.getItem("crm_users");
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem("crm_users", JSON.stringify(users));
}

// --- crm_session: who is currently logged in ---
function setSession(user) {
  localStorage.setItem("crm_session", JSON.stringify(user));
}

function getSession() {
  const saved = localStorage.getItem("crm_session");
  return saved ? JSON.parse(saved) : null;
}

function clearSession() {
  localStorage.removeItem("crm_session");
}

//-------Protects Clients, Dashboard, Profile  pages: redirects to login if nobody is logged in ---
function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

//-------------Adding data in the DummyJson API------------------
// DummyJson loads objects which have not ---status---, ----value---, ---createdAt--- keys. So these part is adding required data

// --- Enriches raw DummyJSON clients with CRM-specific fields, once ---
async function getEnrichedClients() {
  const clients = await loadClients();

  // If already enriched (first client already has a status field), just return as-is
  if (clients.length > 0 && clients[0].status !== undefined) {
    return clients;
  }

  const statuses = ["Lead", "Contacted", "Won", "Lost"];

  const enriched = clients.map((c) => ({
    ...c,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    dealValue: Math.floor(Math.random() * 20000) + 500,
    createdAt: randomRecentDate(),
  }));

  localStorage.setItem("crm_clients", JSON.stringify(enriched));
  return enriched;
}

function formatCurrency(amount) {
  return "$" + amount.toLocaleString("en-US");
}

function randomRecentDate() {
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

//-------------Logout button logic--------------
function logout() {
  clearSession(); // decleared here in data.js
  window.location.href = "index.html";
}
