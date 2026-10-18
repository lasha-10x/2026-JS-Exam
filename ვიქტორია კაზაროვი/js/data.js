// Loads, normalizes, caches, and resets the shared CRM client collection.

// API settings and the only status values accepted by the application.
const CLIENT_STATUSES = ["Lead", "Contacted", "Won", "Lost"];
// Every client must use one of these four pipeline stages.
const DUMMYJSON_USERS_URL = "https://dummyjson.com/users?limit=30";
const DUMMYJSON_ADD_USER_URL = "https://dummyjson.com/users/add";
const DUMMYJSON_USERS_BASE_URL = "https://dummyjson.com/users";

// Storage and normalization helpers keep API and locally saved clients uniform.
function hasStoredClients() {
  // Check for the key itself; an empty list is still saved client data.
  return localStorage.getItem(STORAGE_KEYS.CLIENTS) !== null;
}

function normalizeClientText(value) {
  // Keep only clean strings; everything else becomes blank text.
  return typeof value === "string" ? value.trim() : "";
}

function normalizeClientDate(value) {
  // Convert valid dates into one consistent storage format.
  const timestamp = Date.parse(value);

  if (Number.isFinite(timestamp)) {
    // Store valid dates in the same format every time.
    return new Date(timestamp).toISOString();
  }

  return new Date().toISOString();
}

function normalizeClientNote(note) {
  if (!note || typeof note !== "object") {
    // Notes must be objects with usable text.
    return null;
  }

  // Ignore blank or malformed notes instead of rendering empty entries later.
  const text = normalizeClientText(note.text);

  if (text === "") {
    return null;
  }

  return {
    text: text,
    date:
      normalizeClientText(note.date) || new Date().toLocaleString()
  };
}

function normalizeClient(client, index) {
  const sourceClient =
    client && typeof client === "object" ? client : {};
  const numericId = Number(sourceClient.id);
  const numericDealValue = Number(sourceClient.dealValue);
  const status = CLIENT_STATUSES.includes(sourceClient.status)
    // Invalid or missing statuses start as Leads.
    ? sourceClient.status
    : "Lead";
  const notes = Array.isArray(sourceClient.notes)
    ? sourceClient.notes
        .map(normalizeClientNote)
        .filter(function (note) {
          return note !== null;
        })
    : [];

  // Every returned record has the same shape, regardless of whether it came
  // from the API, localStorage, or an older version of the app.
  return {
    id: Number.isFinite(numericId) ? numericId : Date.now() + index,
    name: normalizeClientText(sourceClient.name) || "Unnamed client",
    email: normalizeClientText(sourceClient.email).toLowerCase(),
    phone: normalizeClientText(sourceClient.phone),
    company: normalizeClientText(sourceClient.company),
    image: normalizeClientText(sourceClient.image),
    status: status,
    dealValue:
      Number.isFinite(numericDealValue) && numericDealValue > 0
        ? numericDealValue
        : 0,
    notes: notes,
    createdAt: normalizeClientDate(sourceClient.createdAt)
  };
}

function normalizeClients(clientList) {
  // A bad stored value cannot be rendered as a client list.
  if (!Array.isArray(clientList)) {
    return [];
  }

  return clientList.map(function (client, index) {
    return normalizeClient(client, index);
  });
}

// Converts one DummyJSON user into the client shape used by the CRM.
function transformDummyUser(user) {
  const firstName = normalizeClientText(user.firstName);
  // The API separates names, while the CRM stores one name field.
  const lastName = normalizeClientText(user.lastName);
  const numericId = Number(user.id);

  return {
    id: Number.isFinite(numericId) ? numericId : Date.now(),
    name: [firstName, lastName]
      .filter(function (namePart) {
        return namePart !== "";
      })
      .join(" ") || "Unnamed client",
    email: normalizeClientText(user.email).toLowerCase(),
    phone: normalizeClientText(user.phone),
    company:
      user.company && typeof user.company === "object"
        ? normalizeClientText(user.company.name)
        : "",
    image: normalizeClientText(user.image),
    status: "Lead",
    dealValue:
      Number.isFinite(numericId) && numericId > 0
        ? numericId * 1000
        : 1000,
    notes: [],
    createdAt: new Date().toISOString()
  };
}

// Uses cached clients first so refreshes do not repeat the API request.
async function loadClients() {
  if (hasStoredClients()) {
    // Reuse saved changes instead of replacing them with fresh API data.
    // Saving the normalized result also repairs any older cached client data.
    const storedClients = normalizeClients(getClients());
    saveClients(storedClients);
    return storedClients;
  }

  const loadedClients = await fetchInitialClients();
  saveClients(loadedClients);
  return loadedClients;
}

// Fetches exactly 30 initial clients and stores the transformed result.
async function fetchInitialClients() {
  try {
    const response = await fetch(DUMMYJSON_USERS_URL);

    if (!response.ok) {
      // A non-success HTTP status is treated as a failed request.
      throw new Error("The clients request failed.");
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.users)) {
      throw new Error("The clients response was invalid.");
    }

    // The external API's user model is adapted before it reaches the UI.
    const loadedClients = data.users.map(transformDummyUser);
    return loadedClients;
  } catch (error) {
    throw new Error("Unable to load clients.");
  }
}

// Replaces saved client changes with a fresh copy of the initial 30 clients.
async function resetClientsData() {
  // Remove the cache first so the API result becomes the new saved list.
  removeStorageItem(STORAGE_KEYS.CLIENTS);
  const initialClients = await fetchInitialClients();
  saveClients(initialClients);
  return initialClients;
}
