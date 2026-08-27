import { getSession } from "./storage.js";

//protected pages(dashboard,clients,profile)
//no session -> redirect to login page

export function requireAuth(){
  if(!getSession()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}
//if client is not logged in, return false, otherwise return true

//PUblic pages (login,signup)
//session exists -> redirect to dashboard page
export function redirectIfLoggedIn(){
  if(getSession()){
    window.location.href = "dashboard.html";
    return false;
  }
  return true;
}