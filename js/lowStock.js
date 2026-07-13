// ======================
// LOGIN PROTECTION
// ======================

if (localStorage.getItem("isLoggedIn") !== "true") {

    window.location.href = "../LoginPage.html";

}

// ======================
// GO TO DASHBOARD
// ======================

function goDashboard() {

    window.location.href = "dashboard.html";

}

// ======================
// LOGOUT
// ======================

function logout() {

    const result = confirm(
        "Are you sure you want to logout?"
    );

    if (result) {

        localStorage.removeItem(
            "isLoggedIn"
        );

        window.location.href =
        "../LoginPage.html";

    }

}

// ======================
// PAGE ANIMATION
// ======================

window.addEventListener("load", () => {

    const products =
    document.querySelectorAll(".product");

    products.forEach((product, index) => {

        product.style.opacity = "0";
        product.style.transform =
        "translateY(20px)";

        setTimeout(() => {

            product.style.transition =
            "all 0.4s ease";

            product.style.opacity = "1";
            product.style.transform =
            "translateY(0)";

        }, index * 100);

    });

});
