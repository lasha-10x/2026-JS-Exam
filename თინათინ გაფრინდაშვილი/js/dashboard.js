
// Get username from session
const session = JSON.parse(localStorage.getItem("crm_session"));

if (session) {
    const name = session.fullName;
    
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    document.querySelector(".user-name").textContent = formattedName;
}

// Live clock
function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("clock").textContent = time;
}

// update immediately
updateClock();

// update every second
setInterval(updateClock, 1000);


async function updateStatCards() {
  try {
    const clients = await loadClients();

    // Total Clients
    const totalClients = clients.length;

    // Active Deals: status is neither "Won" nor "Lost"
    const activeDeals = clients.filter(
      (client) => client.status !== "Won" && client.status !== "Lost"
    ).length;

    // Won Revenue: sum of dealValue for "Won" clients, formatted as $12,500
    const wonRevenue = clients
      .filter((client) => client.status === "Won")
      .reduce((sum, client) => sum + (client.dealValue || 0), 0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

    // New This Week: clients created in the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = clients.filter(
      (client) => new Date(client.createdAt) >= sevenDaysAgo
    ).length;

    // Update HTML
    document.getElementById("total-clients").textContent = totalClients;
    document.getElementById("active-deals").textContent = activeDeals;
    document.getElementById("won-revenue").textContent = wonRevenue;
    document.getElementById("new-this-week").textContent = newThisWeek;
  } catch (error) {
    console.error("Failed to update stat cards:", error);
  }
}


//pipeline overview 
async function updatePipelineOverview() {
  try {
    // Load clients
    const clients = await loadClients();

    // Calculate counts for each status
    const pipeline = clients.reduce(
      (acc, client) => {
        acc[client.status] = (acc[client.status] || 0) + 1;
        return acc;
      },
      { Lead: 0, Contacted: 0, Won: 0, Lost: 0 }
    );

    // Update the HTML
    document.getElementById("lead-count").textContent = pipeline.Lead || 0;
    document.getElementById("contacted-count").textContent = pipeline.Contacted || 0;
    document.getElementById("won-count").textContent = pipeline.Won || 0;
    document.getElementById("lost-count").textContent = pipeline.Lost || 0;
  } catch (error) {
    console.error("Failed to update pipeline overview:", error);
  }
}


async function updateRecentClients() {
  try {
    const clients = await loadClients();

    // sort by createdAt descending (newest first) and take top 5
    const recentClients = [...clients]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const container = document.getElementById("recent-clients-list");
    container.innerHTML = "";

    recentClients.forEach((client) => {
      const row = document.createElement("div");
      row.classList.add("client-row");

      const formattedDate = new Date(client.createdAt).toLocaleDateString();

      row.innerHTML = `
        <span class="client-name">${client.name}</span>
        <span class="client-company">${client.company}</span>
        <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
        <span class="client-date">${formattedDate}</span>
      `;

      container.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to update recent clients:", error);
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", updatePipelineOverview);
document.addEventListener("DOMContentLoaded", updateStatCards);
document.addEventListener("DOMContentLoaded", updateRecentClients);