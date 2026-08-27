export function showToast(message, type) {
  const toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.className = `toast ${type}`;

  setTimeout(function () {
    toast.className = "toast";
  }, 3000);
}