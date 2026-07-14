// ======================
// LOGIN PROTECTION
// ======================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../LoginPage.html";
}

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
// LOAD DASHBOARD STATS
// ======================

async function loadDashboardStats() {
    try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (data.success && data.stats) {
            const cards = document.querySelectorAll(".card-content p");
            if (cards.length >= 4) {
                cards[0].textContent = data.stats.totalProducts;
                cards[1].textContent = data.stats.lowStockCount;
                cards[2].textContent = data.stats.totalOrders;
                cards[3].textContent = '₹' + Number(data.stats.totalRevenue).toLocaleString();
            }
        }
    } catch (err) {
        console.error('Failed to load dashboard stats:', err);
    }
}

// ======================
// CARD ANIMATION
// ======================

window.addEventListener("load", () => {

    loadDashboardStats();

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
