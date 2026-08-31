// A valid session object is required before protected page code can run.
function getSession() {
  const savedSession = localStorage.getItem("crm_session");

  if (!savedSession) {
    return null;
  }

  try {
    const session = JSON.parse(savedSession);

    if (
      !session ||
      typeof session !== "object" ||
      session.userId === undefined ||
      session.userId === null
    ) {
      localStorage.removeItem("crm_session");
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to read session:", error);
    localStorage.removeItem("crm_session");
    return null;
  }
}

// Protected and public pages redirect in opposite directions.
function requireAuth() {
  const session = getSession();

  if (!session) {
    window.location.href = "index.html";
  }
}

function redirectAuthenticatedUser() {
  const session = getSession();

  if (session) {
    window.location.href = "dashboard.html";
  }
}

const currentPage = window.location.pathname.split("/").pop();
const isPublicPage =
  currentPage === "" ||
  currentPage === "index.html" ||
  currentPage === "signup.html";

if (isPublicPage) {
  redirectAuthenticatedUser();
} else {
  requireAuth();
}
