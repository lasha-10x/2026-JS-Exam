import {clearSession, getUsers, getTheme, saveTheme, getClients} from './storage.js';
import {initializeClients} from "./clientsData.js";
import { session } from './shared.js';

//display current user name
if (session) {
    const users = getUsers();
    const user = users.find(u => u.id === session.userId);
    
    if(user) {
        const firstName = user.fullName.split(' ')[0]; //first name only from current session
        const name = document.getElementById('user-name'); //html span that holds the user name
        name.textContent = firstName;
    }
}

//display time and date
const dateElement = document.getElementById('current-date');
const timeElement = document.getElementById('current-time');

function displayDateTime() {
    const currentDate = new Date();

    dateElement.textContent = currentDate.toLocaleDateString();
    timeElement.textContent = currentDate.toLocaleTimeString();
}

displayDateTime();
setInterval(displayDateTime, 1000); 

//get clients list
const clients = await initializeClients();

//set client number
const totalClientsElement = document.getElementById("total-clients");
totalClientsElement.textContent = clients.length;

//set active deals number
const activeDeals = clients.filter(client => {
    return client.status === "Lead" || client.status === "Contacted";
})
const activeDealsElement = document.getElementById("active-deals");
activeDealsElement.textContent = activeDeals.length;

//set won revenue value
const wonRevenue = clients.filter(client => client.status === "Won").reduce((total, client) => {
    return total + client.value;
}, 0);
const wonRevenueElement = document.getElementById("won-revenue");
wonRevenueElement.textContent = `${wonRevenue.toLocaleString()}`;

//set new this week value
const pastWeek = Date.now() - 7 * 24 * 60 * 6 * 1000;
const clientsThisWeek = clients.filter(client => {
    const clientCreatedAt = new Date(client.createdAt).getTime();
    return clientCreatedAt >= pastWeek;
})
const clientsThisWeekElement = document.getElementById("new-this-week");
clientsThisWeekElement.textContent = clientsThisWeek.length;

//set pipeline overview card values
const leadCount = clients.filter(client => client.status === "Lead");
const contactedCount = clients.filter(client => client.status === "Contacted");
const wonCount = clients.filter(client => client.status === "Won");
const lostCount = clients.filter(client => client.status === "Lost");


const leadElement = document.getElementById("lead-count");
const contactedElement = document.getElementById("contacted-count");
const wonEelement = document.getElementById("won-count");
const lostElement = document.getElementById("lost-count");

leadElement.textContent = leadCount.length;
contactedElement.textContent = contactedCount.length;
wonEelement.textContent = wonCount.length;
lostElement.textContent = lostCount.length;

//set recent client list
const recentClientsElement = document.getElementById("recent-clients-list");
const recentClients = [...clients].sort((firstClient, secondClient) => {
    return new Date(secondClient.createdAt) - new Date(firstClient.createdAt);
}).slice(0, 5);

recentClientsElement.innerHTML = "";
recentClients.forEach(client => {
    const clientItemElement = document.createElement("div");
    clientItemElement.classList.add("recent-client-item");

    const clientName = document.createElement("div");
    clientName.textContent = client.fullName;
    clientName.classList.add("recent-client-name");

    const clientCompany = document.createElement("span");
    clientCompany.textContent = client.company;
    clientCompany.classList.add("recent-client-company");

    const clientStatus = document.createElement("span");
    clientStatus.textContent = client.status;
    clientStatus.classList.add("recent-client-status",  `status-${client.status.toLowerCase()}`);

    clientItemElement.append(clientName, clientCompany, clientStatus);
    recentClientsElement.append(clientItemElement);
})


