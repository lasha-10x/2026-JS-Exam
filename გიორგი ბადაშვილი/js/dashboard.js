const users = Storage.getUsers();

const currentUser = users.find(user => user.id === session.userId);

document.getElementById("welcomeTitle").textContent = `Welcome, ${currentUser.fullName}!`;

loadClients();

function updateDashboardStats() {

    const clients = Storage.getClients();

    const totalClients = clients.length;

    const leadClients = clients.filter(client => client.status === "lead").length;

    const wonClients = clients.filter(client => client.status === "won").length;

    const lostClients = clients.filter(client => client.status === "lost").length;

    document.getElementById("totalClients").textContent = totalClients;

    document.getElementById("leadClients").textContent = leadClients;

    document.getElementById("wonClients").textContent = wonClients;

    document.getElementById("lostClients").textContent = lostClients;

}

function renderRecentClients() {

    const clients = Storage.getClients();

    const container = document.getElementById("recentClients");

    container.innerHTML = "";

    const recentClients = clients.slice(-5).reverse();

    for (const client of recentClients) {

        container.innerHTML += `

<div class="recent-client">

    <div class="client-left">
        <h3>${client.fullName}</h3>
    </div>

    <div class="client-company">
        ${client.company}
    </div>

    <div class="client-status">
        <span class="status ${client.status}">
            ${client.status.toUpperCase()}
        </span>
    </div>

    <div class="client-date">
        ${new Date(client.createdAt).toLocaleDateString()}
    </div>

</div>

`;
    }
}


/// live clock
function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("liveClock").textContent =
        `${hours}:${minutes}:${seconds}`;
}

/// end live clock

//// logout function
document.getElementById("logoutBtn").addEventListener("click", logout);

function logout(){
    Storage.clearSession();
    window.location.href="index.html";
}
//// end logout function

///// pipeline 
function updatePipeline() {

    const clients = Storage.getClients();

    const total = clients.length;

    const lead = clients.filter(c => c.status === "lead").length;
    const contacted = clients.filter(c => c.status === "contacted").length;
    const won = clients.filter(c => c.status === "won").length;
    const lost = clients.filter(c => c.status === "lost").length;

    updateBar("lead", lead, total);
    updateBar("contacted", contacted, total);
    updateBar("won", won, total);
    updateBar("lost", lost, total);

}

function updateBar(name, count, total){

    const percent = total === 0 ? 0 : Math.round((count / total) * 100);

    document.getElementById(name + "Bar").style.width = percent + "%";

    document.getElementById(name + "Info").textContent =
        `${count} (${percent}%)`;

}

/////end pipeline 
updateDashboardStats();
renderRecentClients();
updateClock();
setInterval(updateClock, 1000);
updatePipeline();