const welcomeName = document.getElementById("welcomeName");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

const totalClients = document.getElementById("totalClients");
const activeDeals = document.getElementById("activeDeals");
const wonRevenue = document.getElementById("wonRevenue");
const newThisWeek = document.getElementById("newThisWeek");

const leadCount = document.getElementById("leadCount");
const contactedCount = document.getElementById("contactedCount");
const wonCount = document.getElementById("wonCount");
const lostCount = document.getElementById("lostCount");

const leadProgress = document.getElementById("leadProgress");
const contactedProgress = document.getElementById("contactedProgress");
const wonProgress = document.getElementById("wonProgress");
const lostProgress = document.getElementById("lostProgress");

const recentClients = document.getElementById("recentClients");

//if noone is logged in when oppening site it will open index.html/login  page
const savedSession = localStorage.getItem("crm_session");

if (!savedSession) {
  window.location.href = "./index.html";
} else {
  const session = JSON.parse(savedSession);
  //welcome code
  const firstName = session.fullName.split(" ")[0];
  welcomeName.textContent = firstName;
  //date code
  function updateClock() {
    let now = new Date();
    currentDate.textContent = now.toLocaleDateString();
    currentTime.textContent = now.toLocaleTimeString();
  }
  updateClock();
  setInterval(updateClock, 1000);

  //name says what it does
  async function renderDashboard() {
    const clients = await loadClients();

    totalClients.textContent = clients.length;

    // we filter avtive deals from all 30 deals
    const activeDealsCount = clients.filter(function (client) {
      return client.status !== "Won" && client.status !== "Lost";
    }).length;

    activeDeals.textContent = activeDealsCount;
    // first we filter clients who won then with reduce we sum there deal Value
    const wonRevenueValue = clients
      .filter(function (client) {
        return client.status === "Won";
      })
      .reduce(function (sum, client) {
        return sum + client.dealValue;
      }, 0);

    wonRevenue.textContent = "$" + wonRevenueValue.toLocaleString();

    //we filter clients who we get this week
    const newThisWeekCount = clients.filter(function (client) {
      return (Date.now() - new Date(client.createdAt)) / 86400000 <= 7; // 86400000 miliseconds in a day
    }).length;

    newThisWeek.textContent = newThisWeekCount;
    // filter clients with status lead
    const leadTotal = clients.filter(function (client) {
      return client.status === "Lead";
    }).length;

    leadCount.textContent = leadTotal;

    let leadPercent = 0;
    //calculate what is the percentage of lead clients
    if (clients.length > 0) {
      leadPercent = (leadTotal / clients.length) * 100;
    }
    if (!clients) {
      leadPercent = 0;
    }

    leadProgress.style.width = leadPercent + "%";
    // filter clients with status Contacted
    const contactedTotal = clients.filter(function (client) {
      return client.status === "Contacted";
    }).length;

    contactedCount.textContent = contactedTotal;

    let contactedPercent = 0;
    //calculate what is the percentage of Contacted clients
    if (clients.length > 0) {
      contactedPercent = (contactedTotal / clients.length) * 100;
    }
    if (!clients) {
      contactedPercent = 0;
    }
    contactedProgress.style.width = contactedPercent + "%";
    // filter clients with status Won
    const wonTotal = clients.filter(function (client) {
      return client.status === "Won";
    }).length;

    wonCount.textContent = wonTotal;

    let wonPercent = 0;
    //calculate what is the percentage of Won clients
    if (clients.length > 0) {
      wonPercent = (wonTotal / clients.length) * 100;
    }
    if (!clients) {
      wonPercent = 0;
    }
    wonProgress.style.width = wonPercent + "%";
    // filter clients with status Lost
    const lostTotal = clients.filter(function (client) {
      return client.status === "Lost";
    }).length;

    lostCount.textContent = lostTotal;

    let lostPercent = 0;
    //calculate what is the percentage of Lost clients
    if (clients.length > 0) {
      lostPercent = (lostTotal / clients.length) * 100;
    }
    if (!clients) {
      lostPercent = 0;
    }
    lostProgress.style.width = lostPercent + "%";
    // copy clients array
    const clientCopy = [...clients];
    // out of copied array we sort them by date and take 5 most recent clients
    const recentFiveClients = clientCopy
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    recentClients.textContent = "";
    // created elements for recent activity part in on dashboard
    recentFiveClients.forEach((client) => {
      const clientRow = document.createElement("div");
      clientRow.classList.add("recent-client-row");

      const clientInfo = document.createElement("div");
      clientInfo.classList.add("client-info");

      const clientName = document.createElement("p");
      clientName.classList.add("client-name");
      clientName.textContent = client.name;

      const clientCompany = document.createElement("p");
      clientCompany.classList.add("client-company");
      clientCompany.textContent = client.company;

      clientInfo.append(clientName, clientCompany);
      clientRow.append(clientInfo);

      const clientMeta = document.createElement("div");
      clientMeta.classList.add("client-meta");
      const statusBadge = document.createElement("span");
      statusBadge.classList.add("status-badge");
      statusBadge.textContent = client.status;
      clientMeta.append(statusBadge);

      const clientDate = document.createElement("p");
      clientDate.classList.add("client-date");
      clientDate.textContent = new Date(client.createdAt).toLocaleDateString();
      clientMeta.append(clientDate);
      clientRow.append(clientMeta);
      recentClients.append(clientRow);
    });
  }
  renderDashboard();
}
