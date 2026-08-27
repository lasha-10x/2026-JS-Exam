console.log("DASHBOARD JS WORKING");


(() => {

  // ================= DATA =================

  function getDashboardClients() {
    return JSON.parse(localStorage.getItem("crm_clients")) || [];
  }


  function getDashboardUsers() {
    return JSON.parse(localStorage.getItem("crm_users")) || [];
  }


  let dashboardClients = getDashboardClients();

  console.log(
    "DASHBOARD CLIENTS:",
    dashboardClients.length
  );


  const dashboardUsers = getDashboardUsers();

  const dashboardSession =
    JSON.parse(localStorage.getItem("crm_session"));



  // ================= USER NAME =================

  const userNameElement =
    document.getElementById("userName");


  if (dashboardSession) {

    const currentUser =
      dashboardUsers.find(
        user =>
          user.id === dashboardSession.userId
      );


    if (currentUser && userNameElement) {

      const firstName =
        currentUser.fullName.split(" ")[0];

      userNameElement.textContent =
        firstName;
    }
  }



  // ================= CLOCK =================

  function updateDashboardClock() {

    const clockElement =
      document.getElementById("clock");


    if (!clockElement) return;


    const now = new Date();


    clockElement.textContent =
      `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }


  updateDashboardClock();

  setInterval(updateDashboardClock, 1000);




  // ================= UPDATE DASHBOARD =================

  function updateDashboard() {


    dashboardClients =
      getDashboardClients();


    console.log(
      "UPDATED CLIENTS:",
      dashboardClients.length
    );



    // TOTAL CLIENTS

    const totalClientsElement =
      document.getElementById("totalClients");


    if (totalClientsElement) {

      totalClientsElement.textContent =
        dashboardClients.length;
    }



    // ACTIVE DEALS

    const activeDealsElement =
      document.getElementById("activeDeals");


    if (activeDealsElement) {


      const activeDealsCount =
        dashboardClients.filter(
          client =>
            client.status === "Lead" ||
            client.status === "Contacted"
        ).length;


      activeDealsElement.textContent =
        activeDealsCount;
    }




    // WON REVENUE

    const wonRevenueElement =
      document.getElementById("wonRevenue");


    if (wonRevenueElement) {


      const revenue =
        dashboardClients
          .filter(
            client =>
              client.status === "Won"
          )
          .reduce(
            (sum, client) =>
              sum + (client.dealValue || 0),
            0
          );


      wonRevenueElement.textContent =
        "$" + revenue.toLocaleString();

    }




    // NEW THIS WEEK

    const newThisWeekElement =
      document.getElementById("newThisWeek");


    if (newThisWeekElement) {


      const weekAgo =
        new Date();


      weekAgo.setDate(
        weekAgo.getDate() - 7
      );


      const recentClients =
        dashboardClients.filter(
          client =>
            client.createdAt &&
            new Date(client.createdAt) > weekAgo
        );


      newThisWeekElement.textContent =
        recentClients.length;

    }





    // PIPELINE

    const pipelineElement =
      document.getElementById(
        "pipelineOverview"
      );


    if (pipelineElement) {


      const leads =
        dashboardClients.filter(
          client =>
            client.status === "Lead"
        ).length;


      const contacted =
        dashboardClients.filter(
          client =>
            client.status === "Contacted"
        ).length;


      const won =
        dashboardClients.filter(
          client =>
            client.status === "Won"
        ).length;


      const lost =
        dashboardClients.filter(
          client =>
            client.status === "Lost"
        ).length;



      pipelineElement.innerHTML = `

        <p>Leads: ${leads}</p>

        <p>Contacted: ${contacted}</p>

        <p>Won: ${won}</p>

        <p>Lost: ${lost}</p>

        <p>Total: ${dashboardClients.length}</p>

      `;
    }





    // RECENT CLIENTS

    const recentClientsElement =
      document.getElementById(
        "recentClients"
      );


    if (recentClientsElement) {


      const latestClients =
        [...dashboardClients]
          .sort(
            (a,b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          )
          .slice(0,5);



      if (latestClients.length === 0) {


        recentClientsElement.innerHTML =
          "<p>No clients yet.</p>";


      } else {


        recentClientsElement.innerHTML =
          latestClients
            .map(
              client => `
                <p>
                  ${client.name}
                  (${client.company})
                </p>
              `
            )
            .join("");

      }
    }

  }



  window.addEventListener(
    "load",
    updateDashboard
  );


})();