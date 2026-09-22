// P3.5 / P4.2 - Shared data loading logic.
// Both the Dashboard and the Clients page need the same clients array,
// loaded from localStorage if present, otherwise fetched from the API.
// Keeping this in one place avoids writing the same fetch logic twice.
const Data = {
  /**
   * Resolves with the clients array.
   * Throws if localStorage is empty AND the API call fails, so callers
   * can show their own error UI (e.g. Clients page's Retry button).
   */
  async getOrLoadClients() {
    const cached = Storage.getClients();
    if (cached) return cached;

    const res = await fetch('https://dummyjson.com/users?limit=30');
    if (!res.ok) throw new Error('Network error while loading clients');
    const data = await res.json();

    const clients = data.users.map(u => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      phone: u.phone,
      company: u.company?.name || 'Freelance',
      image: u.image,
      status: 'Lead',
      dealValue: Math.floor(Math.random() * 9500) + 500,
      notes: [],
      createdAt: new Date().toISOString()
    }));

    Storage.saveClients(clients);
    return clients;
  }
};
