// Save "signUp" objects to variables
const signForm = document.getElementById('reg_form');
const loginForm = document.getElementById('login_form');

const nameInput = document.querySelector('#reg_form input:nth-of-type(1)');
const emailInput = document.querySelector('#reg_form input:nth-of-type(2)');
const companyInput = document.querySelector('#reg_form input:nth-of-type(3)');
const passwordInput = document.querySelector('#reg_form input:nth-of-type(4)'); 
const confirmPasswordInput = document.querySelector('#reg_form input:nth-of-type(5)');

// When we work on signUp form
if (signForm) {
    signForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Stop page refresh

        // Take entered values 
        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const company = companyInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

          if (fullName.length < 3) {
            alert("fullName must be at least 3 characters long!"); 
            return; // Stop function working
        }
        // Form validation: check email format
        if(!email.includes('@')||!email.split('@')[1].includes('.')){
            alert("Please enter a valid email address!");
            return;
        }
        // Form validation: Check password length and mismatch.
        if (password.length < 8) {
            alert("Password must be at least 8 characters long!"); 
            return; // Stop function working
        }
        // Form validation: password confirmation
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return; // Stop function working
        }

        // take db from JSON
        let crmUsers = JSON.parse(localStorage.getItem('crm_users'))||[];

        //validate N5 check dublicate email
        const emailExist = crmUsers.some(user=>user.email === email);
        if(emailExist){
            alert("An account with this email already exist!");
            return;
        }
        //save entered values
        const userObj = {
            fullName: fullName,
            email: email,
            company: company,
            password: password
        };
        crmUsers.push(userObj); 
        localStorage.setItem('crm_users',JSON.stringify(crmUsers));
        alert("Registration successful!");
        window.location.href = "index.html";

    });
};

//log In block
if (loginForm){
    loginForm.addEventListener('submit', function(event){
        event.preventDefault();

        const loginEmail = document.getElementById('log_mail').value.trim().toLowerCase();
        const loginPassword = document.getElementById('log_pass').value.trim();

        const crmUsers = JSON.parse(localStorage.getItem('crm_users'))||[];

        //find mail in db
        const matchedUser = crmUsers.find(user=>user.email === loginEmail);
        if(!matchedUser){
            alert("User not found!");
            return;
        }



        //check password
        //when doesnot match:
        if(matchedUser.password !== loginPassword){
            alert("Incorrect password!");
            return;
        }
        

        //when password match
        alert("Login successful!!");
        //take information about open session from localStorage 
        localStorage.setItem('crm_session', JSON.stringify(matchedUser));

        //take information about open session from sessionStorage
        // sessionStorage.setItem('crm_session', JSON.stringify(matchedUser));
        window.location.href = 'dashboard.html';

    });
};