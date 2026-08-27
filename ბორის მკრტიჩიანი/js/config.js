// Global configuration constants for the CRM application

export const API = {
  list: "https://dummyjson.com/users?limit=30",
  add: "https://dummyjson.com/users/add",
  user: "https://dummyjson.com/users",
  search: "https://dummyjson.com/users/search",
};

export const STORAGE_KEY = "crm_clients";
export const STATUSES = ["Lead", "Contacted", "Won", "Lost"];
export const PAGE_SIZE = 8;

export const MIN_DEAL_VALUE = 500;
export const MAX_DEAL_VALUE = 10000;
export const SEARCH_DEBOUNCE_MS = 400;
export const REMINDER_DELAY_MS = 60000;
export const TOAST_DURATION_MS = 2500;
