const session = Storage.getSession();

if (!session) {
    window.location.href = "index.html";
}
