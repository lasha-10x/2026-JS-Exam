// Translation dictionary and locale-aware formatting for English and Georgian UI text.
import { STORAGE_KEYS, readStorage, writeStorage } from "./storage.js";

const translations = {
  en: {
    dashboard: "Dashboard", clients: "Clients", profile: "Profile", logout: "Log out", notifications: "Notifications", switchToLight: "Switch to light mode", switchToDark: "Switch to dark mode",
    dashboardIntro: "Your sales activity at a glance.", clientsIntro: "Manage your customer relationships.", profileIntro: "Manage your account and preferences.", notificationsIntro: "Your scheduled follow-ups and reminder history.",
    addClient: "+ Add Client", searchClients: "Search name or company", all: "All", newest: "Newest first", nameAZ: "Name A-Z", dealHigh: "Deal value: high to low",
    profileDetails: "Profile details", fullName: "Full Name", company: "Company", companyOptional: "Company (optional)", optional: "(optional)", saveChanges: "Save Changes", language: "Language", english: "English", georgian: "ქართული",
    changePassword: "Change password", currentPassword: "Current Password", newPassword: "New Password", confirmPassword: "Confirm New Password", resetData: "Reset CRM Data", resetDescription: "Reload the original 30 clients. Your account and active session will stay intact.",
    clearHistory: "Clear history", welcomeBack: "Welcome", pipelineText: "Here is what is happening in your pipeline.", totalClients: "Total Clients", activeDeals: "Active Deals", wonRevenue: "Won Revenue", newThisWeek: "New This Week", pipelineOverview: "Pipeline Overview", recentClients: "Recent Clients", viewAll: "View all clients →",
    view: "View", edit: "Edit", delete: "Delete", notes: "Notes", addNote: "Add", saveNote: "Save", cancel: "Cancel", remind: "Remind me in 1 min", noNotes: "No notes yet.", noClients: "No clients found.",
    pending: "Pending", active: "Active", expired: "Expired", done: "Done", openClient: "Open client", noNotifications: "No notifications yet. Set a reminder from a client card to see it here.",
    lead: "Lead", contacted: "Contacted", won: "Won", lost: "Lost", noCompany: "No company added", independent: "Independent", notSpecified: "Not specified", memberSince: "Member since", created: "Created", due: "Due",
    login: "Log In", signup: "Sign up", welcomeLogin: "Welcome back", loginIntro: "Log in to manage your sales pipeline.", createAccount: "Create your account", signupIntro: "Start managing your client relationships.", alreadyAccount: "Already have an account?", noAccount: "Don't have an account?", email: "Email", password: "Password", phone: "Phone", rememberMe: "Remember me", sessionExpiry: "Session expires after 30 minutes.", sessionExpired: "Your 30-minute session has expired. Please log in again.",
    passwordStrength: "Password strength", passwordStrengthEmpty: "Enter a password", passwordStrengthWeak: "Weak", passwordStrengthMedium: "Medium", passwordStrengthStrong: "Strong", passwordStrengthHint: "Use 8+ characters with uppercase, lowercase, a number, and a symbol.",
    addClientTitle: "Add Client", addClientIntro: "Create a new contact in your pipeline.", clientDetails: "Client details", close: "Close", name: "Name", dealValue: "Deal Value", status: "Status", retry: "Retry", loadingClients: "Loading clients...", loadingDashboard: "Loading dashboard...",
    resetConfirm: "Reset CRM client data?", deleteConfirm: "Delete this client? This cannot be undone.", deleteNoteConfirm: "Delete this note?", clearConfirm: "Clear all notification history?", profileUpdated: "Profile updated ✓", passwordChanged: "Password changed ✓", dataReset: "CRM data reset ✓", noteDeleted: "Note deleted", notificationDeleted: "Notification deleted", historyCleared: "Notification history cleared", reminderScheduled: "Reminder scheduled",
    emailRequired: "Email is required", passwordRequired: "Password is required", invalidCredentials: "Invalid email or password", fullNameRule: "Full name must be at least 3 characters", validEmailRule: "Please enter a valid email address", accountExists: "An account with this email already exists", passwordRule: "Password must be at least 8 characters and contain a letter and a number", passwordsMatch: "Passwords do not match", accountCreated: "Account created successfully! Please log in.", clientDeleted: "Client deleted", clientUpdated: "Client updated ✓", clientAdded: "Client added ✓", clientExists: "A client with this email already exists", phoneShort: "Phone number looks too short", dealPositive: "Deal value must be a positive number", loadClientsError: "Could not load clients. Please try again.", clientActionError: "Could not save client. Please try again.", emailLabel: "Email", phoneLabel: "Phone", clientSince: "Client since",
  },
  ka: {
    dashboard: "მთავარი", clients: "კლიენტები", profile: "პროფილი", logout: "გასვლა", notifications: "შეტყობინებები", switchToLight: "ღია თემაზე გადართვა", switchToDark: "მუქ თემაზე გადართვა",
    dashboardIntro: "ყველა აქტივობა ერთ სივრცეში", clientsIntro: "კლიენტების მართვა.", profileIntro: "მართეთ ანგარიში და პარამეტრები.", notificationsIntro: "დაგეგმილი შეხსენებები და ისტორია.",
    addClient: "+ კლიენტის დამატება", searchClients: "მოძებნეთ სახელი ან კომპანია", all: "ყველა", newest: "ჯერ ახალი", nameAZ: "სახელი A-Z", dealHigh: "გარიგების ღირებულება: კლებადობით",
    profileDetails: "პროფილის მონაცემები", fullName: "სრული სახელი", company: "კომპანია", companyOptional: "კომპანია (არასავალდებულო)", optional: "(არასავალდებულო)", saveChanges: "ცვლილებების შენახვა", language: "ენა", english: "English", georgian: "ქართული",
    changePassword: "პაროლის შეცვლა", currentPassword: "მიმდინარე პაროლი", newPassword: "ახალი პაროლი", confirmPassword: "დაადასტურეთ პაროლი", resetData: "CRM მონაცემების განულება", resetDescription: "თავდაპირველი 30 კლიენტის ჩატვირთვა. ანგარიში და სესია შენარჩუნდება.",
    clearHistory: "ისტორიის გასუფთავება", welcomeBack: "მოგესალმებით", pipelineText: "კლიენტების სამართავი პანელი", totalClients: "კლიენტები სულ", activeDeals: "აქტიური გარიგებები", wonRevenue: "მოგება", newThisWeek: "ახალი ამ კვირაში", pipelineOverview: "პროცესის მიმოხილვა", recentClients: "ბოლო კლიენტები", viewAll: "ყველა კლიენტი →",
    view: "ნახვა", edit: "რედაქტირება", delete: "წაშლა", notes: "შენიშვნები", addNote: "დამატება", saveNote: "შენახვა", cancel: "გაუქმება", remind: "შეხსენება 1 წუთში", noNotes: "შენიშვნები არ არის.", noClients: "კლიენტები ვერ მოიძებნა.",
    pending: "მოლოდინში", active: "აქტიური", expired: "ვადაგასული", done: "დასრულებული", openClient: "კლიენტის გახსნა", noNotifications: "შეტყობინებები ჯერ არ არის. დაამატეთ შეხსენება კლიენტის ბარათიდან.",
    lead: "ლიდი", contacted: "დაკავშირებული", won: "მოგებული", lost: "დაკარგული", noCompany: "კომპანია არ არის მითითებული", independent: "დამოუკიდებელი", notSpecified: "არ არის მითითებული", memberSince: "წევრი", created: "შექმნილია", due: "ვადა",
    login: "შესვლა", signup: "რეგისტრაცია", welcomeLogin: "კეთილი იყოს თქვენი მობრძანება", loginIntro: "შედით გაყიდვების პროცესის სამართავად.", createAccount: "ანგარიშის შექმნა", signupIntro: "კლიენტების მართვის CRM სისტემა", alreadyAccount: "უკვე გაქვთ პროფილი?", noAccount: "არ გაქვთ პროფილი?", email: "ელფოსტა", password: "პაროლი", phone: "ტელეფონი", rememberMe: "დამიმახსოვრე", sessionExpiry: "სესიის ვადა 30 წუთში იწურება.", sessionExpired: "30-წუთიანი სესია დასრულდა. გთხოვთ, ხელახლა შეხვიდეთ.",
    passwordStrength: "პაროლის სიძლიერე", passwordStrengthEmpty: "შეიყვანეთ პაროლი", passwordStrengthWeak: "სუსტი", passwordStrengthMedium: "საშუალო", passwordStrengthStrong: "ძლიერი", passwordStrengthHint: "გამოიყენეთ 8+ სიმბოლო, დიდი და პატარა ასო, ციფრი და სპეციალური სიმბოლო.",
    addClientTitle: "კლიენტის დამატება", addClientIntro: "შექმენით ახალი კლიენტი.", clientDetails: "კლიენტის დეტალები", close: "დახურვა", name: "სახელი", dealValue: "გარიგების ღირებულება", status: "სტატუსი", retry: "ხელახლა ცდა", loadingClients: "კლიენტები იტვირთება...", loadingDashboard: "მთავარი იტვირთება...",
    resetConfirm: "გსურთ CRM მონაცემების განულება?", deleteConfirm: "წავშალოთ ეს კლიენტი? მოქმედება შეუქცევადია.", deleteNoteConfirm: "წავშალოთ ეს შენიშვნა?", clearConfirm: "წავშალოთ შეტყობინებების მთელი ისტორია?", profileUpdated: "პროფილი განახლდა ✓", passwordChanged: "პაროლი შეიცვალა ✓", dataReset: "CRM მონაცემები განულდა ✓", noteDeleted: "შენიშვნა წაიშალა", notificationDeleted: "შეტყობინება წაიშალა", historyCleared: "ისტორია გასუფთავდა", reminderScheduled: "შეხსენება დაიგეგმა",
    emailRequired: "ელფოსტა სავალდებულოა", passwordRequired: "პაროლი სავალდებულოა", invalidCredentials: "ელფოსტა ან პაროლი არასწორია", fullNameRule: "სრული სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს", validEmailRule: "შეიყვანეთ სწორი ელფოსტა", accountExists: "ამ ელფოსტით ანგარიში უკვე არსებობს", passwordRule: "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, ასოს და ციფრს", passwordsMatch: "პაროლები არ ემთხვევა", accountCreated: "ანგარიში შეიქმნა! გთხოვთ, შეხვიდეთ.", clientDeleted: "კლიენტი წაიშალა", clientUpdated: "კლიენტი განახლდა ✓", clientAdded: "კლიენტი დაემატა ✓", clientExists: "ამ ელფოსტით კლიენტი უკვე არსებობს", phoneShort: "ტელეფონის ნომერი ძალიან მოკლეა", dealPositive: "გარიგების ღირებულება დადებითი უნდა იყოს", loadClientsError: "კლიენტების ჩატვირთვა ვერ მოხერხდა. სცადეთ ხელახლა.", clientActionError: "კლიენტის შენახვა ვერ მოხერხდა. სცადეთ ხელახლა.", emailLabel: "ელფოსტა", phoneLabel: "ტელეფონი", clientSince: "კლიენტი სისტემაშია",
  }
};

/** Returns a supported language code and safely falls back to English. */
export function getLanguage() {
  const language = readStorage(STORAGE_KEYS.language, "en");
  return language === "ka" ? "ka" : "en";
}
/** Stores only supported language codes to avoid invalid translation state. */
export function setLanguage(language) { writeStorage(STORAGE_KEYS.language, language === "ka" ? "ka" : "en"); }
/** Returns the translated display string for the active language. */
export function t(key) { return translations[getLanguage()]?.[key] ?? translations.en[key] ?? key; }
/** Formats a date using the current interface locale. */
export function formatDate(value) { return new Intl.DateTimeFormat(getLanguage() === "ka" ? "ka-GE" : "en-US").format(new Date(value)); }
/** Formats a date and time using the current interface locale. */
export function formatDateTime(value) { return new Intl.DateTimeFormat(getLanguage() === "ka" ? "ka-GE" : "en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
/** Formats CRM deal values in a locale-aware USD representation. */
export function formatCurrency(value) { return new Intl.NumberFormat(getLanguage() === "ka" ? "ka-GE" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }

/** Updates static page text and reveals the document after the saved language is applied. */
export function applyTranslations() {
  document.documentElement.lang = getLanguage() === "ka" ? "ka" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  const staticText = {
    "Welcome back": "welcomeLogin", "Log in to manage your sales pipeline.": "loginIntro", "Create your account": "createAccount", "Start managing your client relationships.": "signupIntro", "Log In": "login", "Log in": "login", "Sign up": "signup", "Full Name": "fullName", "Email": "email", "Password": "password", "Confirm Password": "confirmPassword", "Company": "company", "(optional)": "optional", "Create Account": "createAccount", "Already have an account?": "alreadyAccount", "Don't have an account?": "noAccount",
    "Add Client": "addClientTitle", "Create a new contact in your pipeline.": "addClientIntro", "Client details": "clientDetails", "Close": "close", "Name": "name", "Phone": "phone", "Deal Value": "dealValue", "Status": "status", "Lead": "lead", "Contacted": "contacted", "Won": "won", "Lost": "lost", "All": "all", "Newest first": "newest", "Name A-Z": "nameAZ", "Deal value: high to low": "dealHigh", "Loading clients...": "loadingClients", "Loading dashboard...": "loadingDashboard", "Change password": "changePassword", "Change Password": "changePassword", "Current Password": "currentPassword", "New Password": "newPassword", "Confirm New Password": "confirmPassword", "Reset CRM Data": "resetData", "Company (optional)": "companyOptional"
  };
  document.querySelectorAll("body *").forEach((element) => {
    if (element.children.length || !element.textContent.trim()) return;
    const key = staticText[element.textContent.trim()];
    if (key) element.textContent = t(key);
  });
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode = textWalker.nextNode();
  while (textNode) {
    const original = textNode.nodeValue;
    const key = staticText[original.trim()];
    if (key) textNode.nodeValue = original.replace(original.trim(), t(key));
    textNode = textWalker.nextNode();
  }
  document.querySelectorAll("[placeholder]").forEach((element) => {
    const key = staticText[element.placeholder];
    if (key) element.placeholder = t(key);
  });
  document.documentElement.style.visibility = "visible";
}
