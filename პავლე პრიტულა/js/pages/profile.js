// Profile controller: account details, password change, language preference, and client reset.
import { requireAuthentication } from "../core/guard.js";
import { loadClients } from "../core/data.js";
import { STORAGE_KEYS, readSession, readStorage, writeStorage } from "../core/storage.js";
import { formatDate, getLanguage, setLanguage, t } from "../core/i18n.js";
import { isValidPassword } from "../core/utils.js";
import { initializeProtectedLayout } from "../ui/navigation.js";
import { showToast } from "../ui/toast.js";

requireAuthentication();
initializeProtectedLayout();

const summary = document.querySelector("#profile-summary");
const profileForm = document.querySelector("#profile-form");
const passwordForm = document.querySelector("#password-form");
const profileFields = { fullName: document.querySelector("#profile-full-name"), company: document.querySelector("#profile-company") };
const passwordFields = { current: document.querySelector("#current-password"), new: document.querySelector("#new-password"), confirm: document.querySelector("#confirm-new-password") };
const languageSelect = document.querySelector("#language-select");

/** Looks up the active account from the stored session ID. */
function getCurrentUser() {
  const session = readSession();
  const users = readStorage(STORAGE_KEYS.users, []);
  return users.find((user) => user.id === session?.userId);
}

/** Builds the avatar initials from the first two available name parts. */
function getInitials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

/** Re-renders the profile summary and keeps editable fields in sync with storage. */
function renderProfile() {
  const user = getCurrentUser();
  if (!user) return;

  summary.innerHTML = `<div class="profile-identity"><span class="profile-avatar">${getInitials(user.fullName)}</span><div><h2>${user.fullName}</h2><p>${user.email}</p><p>${user.company || t("noCompany")}</p></div></div><small class="profile-member-since">${t("memberSince")} ${formatDate(user.createdAt)}</small>`;
  profileFields.fullName.value = user.fullName;
  profileFields.company.value = user.company;
}

/** Applies validation state to a profile or password field. */
function setError(field, message = "") {
  const input = field === "fullName" ? profileFields.fullName : passwordFields[field];
  const error = document.querySelector(`#${input.id}-error`);
  input.classList.toggle("input-error", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fullName = profileFields.fullName.value.trim();
  setError("fullName", fullName.length < 3 ? t("fullNameRule") : "");
  if (fullName.length < 3) return;

  const users = readStorage(STORAGE_KEYS.users, []);
  const currentUser = getCurrentUser();
  const updatedUsers = users.map((user) => user.id === currentUser.id ? { ...user, fullName, company: profileFields.company.value.trim() } : user);
  writeStorage(STORAGE_KEYS.users, updatedUsers);
  renderProfile();
  showToast(t("profileUpdated"));
});

languageSelect.value = getLanguage();
languageSelect.addEventListener("change", () => {
  setLanguage(languageSelect.value);
  window.location.reload();
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  const currentPassword = passwordFields.current.value;
  const newPassword = passwordFields.new.value;
  const confirmPassword = passwordFields.confirm.value;
  const errors = {
    current: currentPassword !== user.password ? t("invalidCredentials") : "",
    new: !isValidPassword(newPassword) ? t("passwordRule") : newPassword === currentPassword ? t("passwordRule") : "",
    confirm: confirmPassword !== newPassword ? t("passwordsMatch") : ""
  };

  Object.entries(errors).forEach(([field, message]) => setError(field, message));
  if (Object.values(errors).some(Boolean)) return;

  const users = readStorage(STORAGE_KEYS.users, []).map((item) => item.id === user.id ? { ...item, password: newPassword } : item);
  writeStorage(STORAGE_KEYS.users, users);
  passwordForm.reset();
  showToast(t("passwordChanged"));
});

document.querySelector("#reset-data-button").addEventListener("click", async () => {
  if (!window.confirm(t("resetConfirm"))) return;

  localStorage.removeItem(STORAGE_KEYS.clients);
  try {
    await loadClients();
    showToast(t("dataReset"));
  } catch (error) {
    console.error("Unable to reset CRM data", error);
    showToast(t("loadClientsError"), "error");
  }
});

renderProfile();
