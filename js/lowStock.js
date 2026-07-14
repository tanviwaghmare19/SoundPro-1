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
// LOAD LOW STOCK PRODUCTS
// ======================

async function loadLowStockProducts() {
    try {
        const res = await fetch('/api/products/low-stock?threshold=10');
        const data = await res.json();
        if (!data.success) return;

        const container = document.querySelector('.container');
        const buttons = document.querySelector('.buttons');
        const header = document.querySelector('.header');

        document.querySelectorAll('.product').forEach(el => el.remove());

        const stockProducts = data.products || [];

        if (stockProducts.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'product';
            emptyMsg.innerHTML = `
                <div class="product-left">
                    <div class="product-info">
                        <h3>No low stock items</h3>
                        <div class="stock">All products have sufficient stock</div>
                    </div>
                </div>
            `;
            container.insertBefore(emptyMsg, buttons);
            return;
        }

        stockProducts.forEach((product, index) => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <div class="product-left">
                    <img src="${product.image || 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png'}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="stock">Stock : ${product.stock}</div>
                    </div>
                </div>
                <i class="fa-solid fa-triangle-exclamation warning"></i>
            `;
            container.insertBefore(div, buttons);
        });
    } catch (err) {
        console.error('Failed to load low stock products:', err);
    }
}

// ======================
// PAGE ANIMATION
// ======================

window.addEventListener("load", () => {

    loadLowStockProducts();

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
