const resetForm = document.querySelector(".login");
const resetEmail = document.querySelector ("#resetEmail");
const successMessage = document.querySelector("#successMessage");

if (resetForm) {
    resetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const emailValue = resetEmail.value.trim();

        if (emailValue) {
            successMessage.textContent = "Reset link sent successfully!";
            successMessage.style.color = "#10B981";
            successMessage.style.display = "block";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }
    });
}