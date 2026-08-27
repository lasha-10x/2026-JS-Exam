const themeToggle = document.getElementById("themeToggle");

const savedTheme = Storage.getTheme();

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {

    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    Storage.saveTheme(theme);

});
