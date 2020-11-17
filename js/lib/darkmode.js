const btn = document.querySelector(".icon");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
    document.body.classList.toggle("dark-theme");
    btn.innerHTML = `<i class="bx bxs-sun"></i> Light Mode`
} else if (currentTheme === "light") {
    document.body.classList.toggle("light-theme");
    btn.innerHTML = `<i class="bx bx-moon"></i> Dark Mode`
}

btn.addEventListener("click", function() {
    if (prefersDarkScheme.matches) {
        document.body.classList.toggle("light-theme");
        var theme = document.body.classList.contains("light-theme") ?
            "light" :
            "dark";
        btn.innerHTML = theme === "light" ?
            `<i class="bx bx-moon"></i> Dark Mode` :
            `<i class="bx bxs-sun"></i> Light Mode`
    } else {
        document.body.classList.toggle("dark-theme");
        var theme = document.body.classList.contains("dark-theme") ?
            "dark" :
            "light";
        btn.innerHTML = theme === "dark" ?
            `<i class="bx bxs-sun"></i> Light Mode` :
            `<i class="bx bx-moon"></i> Dark Mode`

    }
    localStorage.setItem("theme", theme);
});