//function for showing and clearing error messages in validation
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.add("input-error");
    error.textContent = message;
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.remove("input-error");
    error.textContent = "";
}
// end function for showing and clearing error messages in validation

function validateClientForm(client, mode) {

    let isValid = true;

    const ids = mode === "add"
        ? {
            name: "clientName",
            email: "clientEmail",
            phone: "clientPhone",
            company: "clientCompany",
            deal: "clientDeal",

            nameError: "nameError",
            emailError: "emailError",
            phoneError: "phoneError",
            companyError: "companyError",
            dealError: "dealError"
        }
        : {
            name: "editName",
            email: "editEmail",
            phone: "editPhone",
            company: "editCompany",
            deal: "editDeal",

            nameError: "editNameError",
            emailError: "editEmailError",
            phoneError: "editPhoneError",
            companyError: "editCompanyError",
            dealError: "editDealError"
        };

    if (!client.fullName) {
        showError(ids.name, ids.nameError, "Please enter a name.");
        isValid = false;
    } else {
        clearError(ids.name, ids.nameError);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(client.email)) {
        showError(ids.email, ids.emailError, "Please enter a valid email.");
        isValid = false;
    } else {
        clearError(ids.email, ids.emailError);
    }

    if (isNaN(client.phone) || client.phone.length < 6) {
        showError(ids.phone, ids.phoneError, "Please enter a valid phone.");
        isValid = false;
    } else {
        clearError(ids.phone, ids.phoneError);
    }

    if (!client.company) {
        showError(ids.company, ids.companyError, "Please enter company.");
        isValid = false;
    } else {
        clearError(ids.company, ids.companyError);
    }

    if (isNaN(client.dealValue) || client.dealValue <= 0) {
        showError(ids.deal, ids.dealError, "Please enter deal value.");
        isValid = false;
    } else {
        clearError(ids.deal, ids.dealError);
    }

    return isValid;
}

function validateSignupForm(user) {

    let isValid = true;

    if (user.fullName.length < 3) {
        showError("fullName", "fullNameError", "Full name must be at least 3 characters.");
        isValid = false;
    } else {
        clearError("fullName", "fullNameError");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(user.email)) {
        showError("email", "emailError", "Please enter a valid email address.");
        isValid = false;
    } else {
        clearError("email", "emailError");
    }
    const passwordError = validatePassword(user.password);
    if(passwordError !== true){

    showError("password","passwordError",passwordError);

    isValid = false;

    } else {

    clearError("password","passwordError");
}
    if (user.password !== user.confirmPassword) {
        showError("confirmPassword", "confirmPasswordError", "Passwords do not match.");
        isValid = false;
    } else {
        clearError("confirmPassword", "confirmPasswordError");
    }

    return isValid;
}

function validateLoginForm(user) {

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(user.email)) {showError("email", "emailError", "Please enter a valid email.");
        isValid = false;
    } else {
        clearError("email", "emailError");
    }
   const passwordError = validatePassword(user.password);

    if (user.password.trim() === "") {showError("password", "passwordError", "Please enter password.");
        isValid = false;
    } else {
        clearError("password","passwordError");
    }
    return isValid;
}

function validatePassword(password){
    console.log(password);

    if(password.length < 8){
        return "Minimum 8 characters";
    }

    if(!/[A-Z]/.test(password)){
        return "Need uppercase letter";
    }

    if(!/[a-z]/.test(password)){
        return "Need lowercase letter";
    }

    if(!/[0-9]/.test(password)){
        return "Need number";
    }

    if(!/[!@#$%^&*]/.test(password)){
        return "Need special character";
    }

    return true;
}

function validateProfileForm(user){

    let isValid = true;


    if(user.fullName.length < 3){

        showError("fullName","fullNameError","Full name must be at least 3 characters.");

        isValid = false;

    }else{

        clearError("fullName","fullNameError");

    }


    if(user.company.trim() === ""){

        showError("company","companyError","Please enter company.");

        isValid = false;

    }else{

        clearError("company","companyError");

    }

    return isValid;
}



function validateChangePasswordForm(data, currentUserPassword){

    let isValid = true;

    if(data.currentPassword !== currentUserPassword){

        showError("currentPassword","currentPasswordError","Current password is incorrect.");

        isValid = false;

    }else{

        clearError("currentPassword","currentPasswordError");
    }


    const passwordError = validatePassword(data.newPassword);

    if(passwordError !== true){

        showError("newPassword","newPasswordError",passwordError);

        isValid = false;

    }else{

        clearError("newPassword","newPasswordError");
    }


    if(data.newPassword !== data.confirmPassword){

        showError("confirmPassword","confirmPasswordError","Passwords do not match.");

        isValid = false;

    }else{

        clearError("confirmPassword","confirmPasswordError");
    }

    return isValid;

}

function showToast(message){

    const toast=document.getElementById("toast");

    toast.textContent=message;

    toast.classList.add("show");

    setTimeout(()=>{
        toast.classList.remove("show");
    },2500);

}
