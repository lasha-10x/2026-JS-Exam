import {session} from "./shared.js";
import { getUsers, saveUsers, resetClientData, markClientsInitialized } from "./storage.js";
import { initializeClients } from "./clientsData.js";


console.log(session) //testing
//profile summary elements
const profileAvatarInitialsElement = document.getElementById("profile-avatar-initials");
const profileSummaryNameElement = document.getElementById("profile-summary-name");
const profileSummaryEmailElement = document.getElementById("profile-summary-email");
const profileSummaryCompanyElement = document.getElementById("profile-summary-company");
const profileSummaryMemberSinceElement = document.getElementById("profile-member-since");
//change name elements
const nameInputElement = document.getElementById("profile-full-name");
const emailInputElement = document.getElementById("profile-email");
const companyInputElement = document.getElementById("profile-company");
let users = getUsers();

function getUserInitials(fullName) {
    return fullName.trim().split(" ").map(a => a[0].toUpperCase()).join("");
}


function showProfileMsg(element, message, type) {
    element.textContent = message;
    element.classList.remove("success", "error");
    element.classList.add(type);
}

//get current user from active session and display info
let currentUser = users.find(user => user.id === session.userId);
//change name
if(currentUser) {
    //profile summary section
    profileAvatarInitialsElement.textContent = getUserInitials(currentUser.fullName);
    profileSummaryNameElement.textContent = currentUser.fullName;
    profileSummaryEmailElement.textContent = currentUser.email;
    profileSummaryCompanyElement.textContent = currentUser.company || "No company available.";
    profileSummaryMemberSinceElement.textContent = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {month:"long", year:"numeric"}) : "Unknown";

    //change name section
    nameInputElement.value = currentUser.fullName;
    emailInputElement.value = currentUser.email;
    companyInputElement.value = currentUser.company || "";
}

const profileInfoElement = document.getElementById("profile-info-form");
const profileInforMsgElement = document.getElementById("profile-info-message");

profileInfoElement.addEventListener("submit", event => {
    event.preventDefault();
    profileInforMsgElement.textContent = "";
    nameInputElement.classList.remove("input-error");

    const updatedName = nameInputElement.value.trim();
    const updatedCompany = companyInputElement.value.trim();
    //return if the input field is empty
    if(!updatedName) {
        nameInputElement.classList.add("input-error");
        showProfileMsg(profileInforMsgElement, "Name field is empty.", "error");
        return;
    } else if (updatedName.length < 3) {
        nameInputElement.classList.add("input-error");
        showProfileMsg(profileInforMsgElement, "Full name must be at least 3 characters", "error");
        return;
    }

    currentUser.fullName = updatedName;
    currentUser.company = updatedCompany;
    saveUsers(users);

    nameInputElement.value = updatedName;
    profileSummaryCompanyElement.textContent = updatedCompany || "No company available.";
    profileAvatarInitialsElement.textContent = getUserInitials(updatedName);
    profileSummaryNameElement.textContent = updatedName;
    showProfileMsg(profileInforMsgElement, "Profile updated ✓", "success");
})

//change password
const passwordFormElement = document.getElementById("password-form");
const currentPasswordElement = document.getElementById("current-password");
const newPasswordElement = document.getElementById("new-password");
const conffirmPasswordElement = document.getElementById("confirm-new-password");
const passwordMsgElement = document.getElementById("password-message");



function passwordValidation(password) {
    const minLength = password.length >= 8;
    const includesUpperCase = password !== password.toLowerCase();
    const includesLowerCase = password !== password.toUpperCase();
    const includesNumber = /\d/.test(password);

    return (minLength && includesUpperCase && includesLowerCase && includesNumber);
}

passwordFormElement.addEventListener("submit", event => {
    event.preventDefault();

    const currentPassword = currentPasswordElement.value;
    const newPassword = newPasswordElement.value;
    const confirmedPassword = conffirmPasswordElement.value;

    //cancel if password change is invalid
    passwordMsgElement.textContent = "";
    currentPasswordElement.classList.remove("input-error");
    newPasswordElement.classList.remove("input-error");
    conffirmPasswordElement.classList.remove("input-error");
    console.log(currentUser.password); //testing

    if(currentPassword !== currentUser.password) {
        currentPasswordElement.classList.add("input-error");
        showProfileMsg(passwordMsgElement, "Current password is incorrect", "error");
        return;
    }

    if (newPassword === currentUser.password) {
        newPasswordElement.classList.add("input-error");
        showProfileMsg(passwordMsgElement, "New password must be different from the current one", "error");
        return;
    }

    if(!passwordValidation(newPassword)){
        newPasswordElement.classList.add("input-error");
        showProfileMsg(passwordMsgElement, "Password must be at least 8 characters and contain a letter and a number", "error");
        return;
    }

    if(newPassword !== confirmedPassword) {
        conffirmPasswordElement.classList.add("input-error");
        newPasswordElement.classList.add("input-error");
        showProfileMsg(passwordMsgElement, "Passwords do not match", "error");
        return;
    }

    currentUser.password = newPassword;
    saveUsers(users);

    passwordFormElement.reset();
    showProfileMsg(passwordMsgElement, "Password changed ✓", "success");
})

//reset
const resetCrmDataBtnElement = document.getElementById("reset-crm-btn");
const resetCrmMsgElement = document.getElementById("recet-crm-msg");

resetCrmDataBtnElement.addEventListener("click", async () => {
    const confirmed = window.confirm("Reset all CRM client data?");
    if(!confirmed) {
        return;
    }

    try {
        resetClientData();
        await initializeClients();
        showProfileMsg(resetCrmMsgElement, "CRM client data has been reset.", "success");
    } catch (e) {
        console.error(e);
        showProfileMsg(resetCrmMsgElement, "Could not reset CRM data. Please try again.", "error");
    }

    
})



