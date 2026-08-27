//shared navigation for protected pages
import { clearSession } from "./storage.js";

//page's purpose is to highlight the current page in the navigation 
// and handle logout functionality

export function initNav(){
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
//window location pathname returns the path of the current page, split by "/" 
// and get the last part (the file name). If it's empty, default to "index.html".
  document.querySelectorAll(".nav__link").forEach(link => {
    if(link.getAttribute("href") ===currentPage){
      link.classList.add("nav__link--active");
    }

  });
  //LOGOUT [remove only the session]
  const logoutBtn = document.querySelector("#logout-btn");
  if(logoutBtn){
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "index.html";
    });
  }

    // ── Mobile drawer ──
  const menuToggle = document.querySelector("#menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector("#sidebar-backdrop");

  function openMenu() {
    sidebar.classList.add("sidebar--open");
    backdrop.classList.add("sidebar-backdrop--visible");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    sidebar.classList.remove("sidebar--open");
    backdrop.classList.remove("sidebar-backdrop--visible");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", openMenu);
  backdrop?.addEventListener("click", closeMenu);

  // Close the drawer after picking a nav link
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

}

//pro chain version
// logoutBtn?.addEventListener("click", () => {
//     clearSession();
//     window.location.href = "index.html";
//   });

