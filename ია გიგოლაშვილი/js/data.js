async function loadClients() {
  const savedClients = getStorageItem("crm_clients", null);

  if (savedClients) {
    return savedClients;
  }

  const response = await fetch(
    "https://dummyjson.com/users?limit=30"
  );

  if (!response.ok) {
    throw new Error("Could not load clients");
  }

  const data = await response.json();

  const clients = data.users.map((user) => {
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      company: user.company?.name || "",
      image: user.image,
      status: "Lead",
      dealValue: Math.floor(Math.random() * 9501) + 500,
      notes: [],
      createdAt: new Date().toISOString()
    };
  });

  setStorageItem("crm_clients", clients);

  return clients;
}

function saveClients(clients) {
  setStorageItem("crm_clients", clients);
}