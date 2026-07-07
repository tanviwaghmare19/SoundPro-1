// ======================
// LOGIN
// ======================

function login() {

    const username =
        document.getElementById("username")
        .value.trim();

    const password =
        document.getElementById("password")
        .value.trim();

    if (username === "") {

        alert("Please enter username");
        return;
    }

    if (password === "") {

        alert("Please enter password");
        return;
    }

    if (password === "test1234") {

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );

        window.location.href =
        "dashboard.html";

    } else {

        alert("Incorrect password");
    }
}

// ======================
// LOAD SAVED THEME
// ======================

const themeToggle =
document.getElementById("themeToggle");

if (
    localStorage.getItem("theme")
    === "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.innerHTML =
    '<i class="fas fa-sun"></i>';
}

// ======================
// TOGGLE THEME
// ======================

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        const dark =
        document.body.classList.contains(
            "dark-mode"
        );

        localStorage.setItem(
            "theme",
            dark ? "dark" : "light"
        );

        themeToggle.innerHTML =
        dark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }
);