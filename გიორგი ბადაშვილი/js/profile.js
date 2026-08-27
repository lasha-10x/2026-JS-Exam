function loadProfile() {

    const session = Storage.getSession();

    if (!session) {
        return;
    }

    const users = Storage.getUsers();

    const currentUser = users.find(user => user.id === session.userId);

    if (!currentUser) {
        return;
    }

    document.getElementById("fullName").value = currentUser.fullName;

    document.getElementById("userName").textContent = currentUser.fullName;

    document.getElementById("emailText").textContent = currentUser.email;

    document.getElementById("company").value = currentUser.company;

}

loadProfile();

////////// start pofile editing

const form = document.getElementById("profileForm");

form.addEventListener("submit", saveProfile);

const passwordForm = document.getElementById("passwordForm");

passwordForm.addEventListener("submit", changePassword);


function saveProfile(event) {

    event.preventDefault();

    const session = Storage.getSession();

    const users = Storage.getUsers();

    const currentUser = users.find(user => user.id === session.userId);


    if (!currentUser) {
        return;
    }


    const profileData = {

        fullName: document.getElementById("fullName").value.trim(),

        company: document.getElementById("company").value.trim()

    };


    if (!validateProfileForm(profileData)) {
        return;
    }


    currentUser.fullName = profileData.fullName;

    currentUser.company = profileData.company;


    Storage.saveUsers(users);

    document.getElementById("userName").textContent = currentUser.fullName; // ზედა ინფორმაცია განახლდეს ეგრევე

    showToast("Profile updated successfully.");

}

////////// end pofile editing

////////// password editing
function changePassword(event){

    event.preventDefault();

    const session = Storage.getSession();

    const users = Storage.getUsers();

    const currentUser = users.find(
        user => user.id === session.userId
    );

    if(!currentUser){
        return;
    }

    const passwordData={

        currentPassword:
            document.getElementById("currentPassword").value,

        newPassword:
            document.getElementById("newPassword").value,

        confirmPassword:
            document.getElementById("confirmPassword").value

    };


    if(!validateChangePasswordForm(passwordData,currentUser.password)){
        return;
    }


    currentUser.password=passwordData.newPassword;

    Storage.saveUsers(users);

    showToast("Password changed successfully.");

    passwordForm.reset();

}
////////// end password editing


//// logout function
document.getElementById("logoutBtn").addEventListener("click", logout);

function logout(){
    Storage.clearSession();
    window.location.href="index.html";
}
//// end logout function