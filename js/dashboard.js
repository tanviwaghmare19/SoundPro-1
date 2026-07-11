// ======================
// LOGIN PROTECTION
// ======================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../LoginPage.html";
}

// ======================
// SIDEBAR TOGGLE
// ======================

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (!sidebar) return;

    sidebar.classList.toggle("active");

    if (overlay) {
        overlay.classList.toggle("active");
    }
}

// ======================
// CLOSE SIDEBAR ON OUTSIDE CLICK
// ======================

document.addEventListener("click", function (event) {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuButton = document.querySelector(".menu-title i");

    if (
        sidebar &&
        menuButton &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
    ) {
        sidebar.classList.remove("active");

        if (overlay) {
            overlay.classList.remove("active");
        }
    }

});

// ======================
// CLOSE SIDEBAR ON ESC
// ======================

document.addEventListener("keydown", function (event) {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (
        event.key === "Escape" &&
        sidebar &&
        sidebar.classList.contains("active")
    ) {
        sidebar.classList.remove("active");

        if (overlay) {
            overlay.classList.remove("active");
        }
    }

});

// ======================
// LOGOUT
// ======================

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        localStorage.removeItem("isLoggedIn");

        window.location.href = "../LoginPage.html";
    }
}

// ======================
// CARD ANIMATION
// ======================

window.addEventListener("load", () => {

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = "all 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, index * 120);

    });

});

// ======================
// AUTO CLOSE SIDEBAR
// AFTER MENU CLICK
// ======================

window.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".sidebar a").forEach(link => {

        link.addEventListener("click", () => {

            const sidebar = document.getElementById("sidebar");
            const overlay = document.getElementById("overlay");

            if (sidebar) {
                sidebar.classList.remove("active");
            }

            if (overlay) {
                overlay.classList.remove("active");
            }

        });

    });

});

// ======================
// REVENUE POPUP
// ======================

function openRevenueModal() {

    const modal = document.getElementById("revenueModal");

    if (modal) {
        modal.style.display = "flex";
    }

}

function closeRevenueModal() {

    const modal = document.getElementById("revenueModal");

    if (modal) {
        modal.style.display = "none";
    }

}

// ======================
// CLOSE REVENUE POPUP
// ON OUTSIDE CLICK
// ======================

window.addEventListener("click", function (event) {

    const modal = document.getElementById("revenueModal");

    if (modal && event.target === modal) {
        modal.style.display = "none";
    }

});
