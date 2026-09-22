document.addEventListener("DOMContentLoaded", async () => {
  // 1. ჩავტვირთოთ ან წამოვიღოთ მონაცემები
  const clients = await initClientsData();

  // 2. ჩავრთოთ ცოცხალი საათი და მომხმარებლის მისალმება
  initWelcomeHeader();

  // 3. გამოვთვალოთ და დავხატოთ სტატისტიკა
  calculateStats(clients);

  // 4. დავხატოთ Pipeline Overview
  renderPipeline(clients);

  // 5. გამოვაჩინოთ ბოლო 5 კლიენტი
  renderRecentClients(clients);
});

// P3.1 - მისალმების ზოლი და ცოცხალი საათი
function initWelcomeHeader() {
  const session = JSON.parse(localStorage.getItem("crm_session"));
  if (!session) return;

  const users = JSON.parse(localStorage.getItem("crm_users")) || [];
  const loggedInUser = users.find(
    (u) => u.email.toLowerCase() === session.email.toLowerCase(),
  );

  let firstName = "User";

  // თუ ბაზაში იპოვა მომხმარებელი, ამოიღებს მის სახელს
  if (loggedInUser) {
    const rawName = loggedInUser.fullName || loggedInUser.name;
    if (rawName) {
      firstName = rawName.split(" ")[0]; // იღებს მხოლოდ პირველ სახელს
    }
  }

  // თუ ბაზაში ვერ იპოვა, იმეილის @-მდე ნაწილს აიღებს
  if (firstName === "User" && session.email) {
    firstName = session.email.split("@")[0];
  }

  // პირველ ასოს ყოველთვის ადიდებს სილამაზისთვის
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const welcomeEl = document.getElementById("welcomeMessage");
  const clockEl = document.getElementById("liveClock");

  if (welcomeEl) welcomeEl.innerText = `Welcome back, ${firstName}!`;

  if (clockEl) {
    const updateTime = () => {
      const now = new Date();
      clockEl.innerText = `Live Time: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
}

// P3.2 - სტატისტიკის ბარათების გამოთვლა
function calculateStats(clients) {
  // 1. Total Clients
  document.getElementById("totalClients").innerText = clients.length;

  // 2. Active Deals (არც Won და არც Lost)
  const activeDeals = clients.filter(
    (c) => c.status !== "Won" && c.status !== "Lost",
  ).length;
  document.getElementById("activeDeals").innerText = activeDeals;

  // 3. Won Revenue
  const wonRevenue = clients
    .filter((c) => c.status === "Won")
    .reduce((sum, c) => sum + (Number(c.dealValue) || 0), 0);

  document.getElementById("wonRevenue").innerText =
    `$${wonRevenue.toLocaleString()}`;

  // 4. New This Week (createdAt ბოლო 7 დღეში)
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = clients.filter((c) => {
    const createdTime = new Date(c.createdAt).getTime();
    return Date.now() - createdTime <= sevenDaysInMs;
  }).length;

  document.getElementById("newThisWeek").innerText = newThisWeek;
}

// P3.3 - Pipeline Overview დათვლა
function renderPipeline(clients) {
  const counts = { Lead: 0, Contacted: 0, Won: 0, Lost: 0 };

  clients.forEach((c) => {
    if (counts[c.status] !== undefined) {
      counts[c.status]++;
    }
  });

  document.getElementById("pipeLead").innerText = counts.Lead;
  document.getElementById("pipeContacted").innerText = counts.Contacted;
  document.getElementById("pipeWon").innerText = counts.Won;
  document.getElementById("pipeLost").innerText = counts.Lost;
}

// P3.4 - Recent Clients (ბოლო 5 კლიენტი კლებადობით)
function renderRecentClients(clients) {
  const recentClientsList = document.getElementById("recentClientsList");
  if (!recentClientsList) return;

  const recent = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) {
    recentClientsList.innerHTML =
      '<p style="color:#666;font-style:italic;">No clients found.</p>';
    return;
  }

  recentClientsList.innerHTML = recent
    .map(
      (c) => `
        <div class="client-row">
            <span class="client-name">${c.name}</span>
            <span class="client-company">${c.company || "N/A"}</span>
            <span class="status-badge badge-${c.status.toLowerCase()}">${c.status}</span>
            <span class="client-date">${new Date(c.createdAt).toLocaleDateString()}</span>
        </div>
    `,
    )
    .join("");
}
