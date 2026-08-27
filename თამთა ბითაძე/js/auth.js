console.log("AUTH JS WORKING");
console.log("AUTH JS WORKING");

const demoUser = {
  id: 999999,
  fullName: "Demo User",
  email: "demo@crm.com",
  password: "Demo1234",
  company: "Demo Company",
  createdAt: new Date().toISOString()
};

let users = JSON.parse(localStorage.getItem("crm_users")) || [];

const demoExists = users.some(
  user => user.email === demoUser.email
);

if (!demoExists) {
  users.push(demoUser);

  localStorage.setItem(
    "crm_users",
    JSON.stringify(users)
  );
}
function logout() {

  const sessionExists =
    localStorage.getItem("crm_session");

  if (sessionExists) {
    localStorage.removeItem("crm_session");
  }

  window.location.href = "index.html";
}
const logoutBtn =
  document.getElementById("logoutBtn");

if (!logoutBtn) {
  console.log("Logout button not found");
} else {
  logoutBtn.addEventListener(
    "click",
    logout
  );
}