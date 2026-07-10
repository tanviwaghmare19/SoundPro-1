// ======================
// LOGIN API
// ======================

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {

        alert("Please enter email and password");
        return;

    }

    try {

        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", data.name);

            window.location.href = "pages/dashboard.html";

        } else {

            alert(data.message);

        }

    } catch (err) {

        alert("Could not connect to server. Please run: npm start");

    }

}

// ======================
// DARK MODE TOGGLE
// ======================

var themeToggle =
document.getElementById("themeToggle");

if (themeToggle) {

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

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );

            var dark =
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

}

// ======================
// LOGOUT
// ======================

function logout() {

    var confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");

        window.location.href = "LoginPage.html";
    }

}
