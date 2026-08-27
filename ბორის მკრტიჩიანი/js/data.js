// Shared client storage helpers for pages outside clients.html.
const CRM_CLIENTS_KEY = "crm_clients";
const CRM_USERS_API = "https://dummyjson.com/users?limit=30";

function crmNormaliseClient(user) {
  // DummyJSON fields and CRM fields are not identical, so map them into one shape.
  const company = typeof user.company === "object" ? user.company?.name : user.company;
  const name = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return {
    id: String(user.id ?? Date.now()),
    name: name || "Unknown client",
    email: user.email || "No email",
    phone: user.phone || "No phone",
    company: company || "Independent",
    image: user.image || "",
    status: ["Lead", "Contacted", "Won", "Lost"].includes(user.status)
      ? user.status
      : "Lead",
    // The API has no deal value, so give each imported CRM client a realistic value.
    dealValue: Number(user.dealValue) > 0 ? Number(user.dealValue) : crmRandomDealValue(),
    notes: Array.isArray(user.notes) ? user.notes : [],
    createdAt: user.createdAt || new Date().toISOString(),
  };
}

function crmRandomDealValue() {
  return Math.floor(Math.random() * 9501) + 500;
}

async function getCrmClients(forceApi = false) {
  // Dashboard and Profile call this shared function to use the same saved client data.
  const saved = localStorage.getItem(CRM_CLIENTS_KEY);

  if (saved && !forceApi) {
    try {
      return JSON.parse(saved).map(crmNormaliseClient);
    } catch {
      localStorage.removeItem(CRM_CLIENTS_KEY);
    }
  }

  const response = await fetch(CRM_USERS_API);
  if (!response.ok) throw new Error(`Could not load clients: ${response.status}`);

  const data = await response.json();
  const clients = data.users.map(crmNormaliseClient);
  localStorage.setItem(CRM_CLIENTS_KEY, JSON.stringify(clients));
  return clients;
}
