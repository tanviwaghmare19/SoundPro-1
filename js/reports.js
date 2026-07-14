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
// LOAD REPORT DATA
// ======================

async function loadReportData(month, year) {
    try {
        let url = '/api/reports/sales';
        if (month && year) {
            url += `?month=${month}&year=${year}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (!data.success) return;

        const report = data.report;
        const salesEl = document.querySelector('.card.sales h2');
        const ordersEl = document.querySelector('.card.orders h2');

        if (salesEl) {
            salesEl.textContent = '₹' + Number(report.totalRevenue).toLocaleString();
        }
        if (ordersEl) {
            ordersEl.textContent = report.totalOrders;
        }

    } catch (err) {
        console.error('Failed to load report data:', err);
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

                    const monthNames = {
                        'This Month': null,
                        'January': 1, 'February': 2, 'March': 3,
                        'April': 4, 'May': 5, 'June': 6,
                        'July': 7, 'August': 8, 'September': 9,
                        'October': 10, 'November': 11, 'December': 12
                    };
                    const month = monthNames[this.value];
                    const year = month ? new Date().getFullYear() : null;
                    loadReportData(month, year);

                }
            );

            loadReportData();
        }

    }
);
