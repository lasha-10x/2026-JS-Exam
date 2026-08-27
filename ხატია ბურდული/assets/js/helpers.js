// Show a validation error on a specific input field
function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "Error");

    // Add error styling to the input
    input.classList.add("input-error");

    // Display the error message text
    error.textContent = message;
}

// Clear the validation error from a specific input field
function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "Error");

    // Remove error styling from the input
    input.classList.remove("input-error");

    // Clear the error message text
    error.textContent = "";
}

// Display a temporary toast notification with the given message
function showToast(message) {
    const toast = document.getElementById("toast");

    // Set the message and make the toast visible
    toast.textContent = message;
    toast.style.visibility = "visible";
    toast.style.opacity = "1";

    // Hide the toast automatically after 3 seconds
    setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.visibility = "hidden";
    }, 3000);
}
