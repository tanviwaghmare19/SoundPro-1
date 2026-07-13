// ======================
// LOGIN PROTECTION
// ======================

if (localStorage.getItem("isLoggedIn") !== "true") {

    window.location.href = "../LoginPage.html";

}

// ======================
// BACK BUTTON
// ======================

function goBack() {

    window.location.href = "dashboard.html";

}

// ======================
// OPEN SALES REPORT
// ======================

function openSalesReport() {

    window.location.href = "salesReport.html";

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
// MONTH FILTER
// ======================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const monthSelect =
        document.getElementById(
            "monthSelect"
        );

        if (monthSelect) {

            monthSelect.addEventListener(
                "change",
                function () {

                    console.log(
                        "Selected Month:",
                        this.value
                    );

                }
            );

        }

    }
);