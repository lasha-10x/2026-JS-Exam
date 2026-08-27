// ui.js — small shared helpers used on every page (toasts + theme)

function showToast(message, type) {
    let holder = document.getElementById("toast-holder");
    if (!holder) {
        holder = document.createElement("div");
        holder.id = "toast-holder";
        document.body.appendChild(holder);
    }
    const el = document.createElement("div");
    el.className = "toast" + (type ? " " + type : "");
    el.textContent = message;
    holder.appendChild(el);
    // trigger the fade-in on the next frame
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 200);
    }, 2600);
}

//
function setupTopbarAvatar() {
    const topbarAvatar = document.getElementById("topbar-avatar");
    if (!topbarAvatar) return;

    topbarAvatar.onclick = () => {
        window.location.href = "profile.html";
    };
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupTopbarAvatar);
} else {
    setupTopbarAvatar();
}
