// ======================
// LOGIN PROTECTION
// ======================

if (localStorage.getItem("isLoggedIn") !== "true") {
<<<<<<< HEAD
    window.location.href = "../LoginPage.html";
=======
    window.location.href = "login.html";
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
}

// ======================
// SIDEBAR TOGGLE
// ======================

function toggleSidebar() {

<<<<<<< HEAD
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (!sidebar) return;

    sidebar.classList.toggle("active");

    if (overlay) {
        overlay.classList.toggle("active");
=======
    const sidebar =
    document.getElementById("sidebar");

    if(sidebar){
        sidebar.classList.toggle("active");
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
    }
}

// ======================
<<<<<<< HEAD
// CLOSE SIDEBAR WHEN CLICKING OUTSIDE
// ======================

document.addEventListener("click", function (event) {

    const sidebar = document.getElementById("sidebar");
    const menuButton = document.querySelector(".menu-title i");
    const overlay = document.getElementById("overlay");

    if (
=======
// CLOSE SIDEBAR
// ======================

document.addEventListener("click", function(event){

    const sidebar =
    document.getElementById("sidebar");

    const menuButton =
    document.querySelector(".menu-title i");

    if(
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
        sidebar &&
        menuButton &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
<<<<<<< HEAD
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
=======
    ){
        sidebar.classList.remove("active");
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
    }

});

// ======================
// LOGOUT
// ======================

<<<<<<< HEAD
function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        localStorage.removeItem("isLoggedIn");

        window.location.href = "../LoginPage.html";
=======
function logout(){

    const result = confirm(
        "Are you sure you want to logout?"
    );

    if(result){

        localStorage.removeItem(
            "isLoggedIn"
        );

        window.location.href =
        "login.html";
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
    }
}

// ======================
<<<<<<< HEAD
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
=======
// PAGE ANIMATION
// ======================

window.addEventListener("load",()=>{

    const cards =
    document.querySelectorAll(".card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";
        card.style.transform=
        "translateY(20px)";

        setTimeout(()=>{

            card.style.transition=
            "all 0.4s ease";

            card.style.opacity="1";
            card.style.transform=
            "translateY(0)";

        },index*150);

    });

});
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
