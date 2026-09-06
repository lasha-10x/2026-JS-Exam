// guard.js
//
// This is the ONLY place that decides whether someone is allowed to be
// on a page. Every protected page (dashboard, clients, profile) calls
// Guard.protect() as soon as it loads. Every public page (login,
// signup) calls Guard.redirectIfAuthed() instead.

import { Storage } from "./storage.js";

export const Guard = {
  // Call this on a protected page. If there is no logged-in session,
  // send the visitor to the login page.
  protect() {
    const session = Storage.getSession();
    if (!session) {
      window.location.href = "index.html";
    }
  },

  // Call this on a public page (login/signup). If the visitor is
  // already logged in, there is no reason to show them the login form
  // again, so send them straight to the dashboard.
  redirectIfAuthed() {
    const session = Storage.getSession();
    if (session) {
      window.location.href = "dashboard.html";
    }
  },
};
