// ================================
// PRODUCT DATA
// ================================

let products = [];

document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
            products = data.products;
displayProducts(products);
        }
    } catch (err) {
        console.error('Failed to load products:', err);
    }
}

// ================================
// DISPLAY PRODUCTS
// ================================

function displayProducts(productArray) {
    const container = document.getElementById("productContainer");
    if (productArray.length === 0) {
        container.innerHTML = '<h2 style="text-align:center;padding:40px;">No Product Found</h2>';
        return;
    }
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2224%22%3E📦%3C/text%3E%3C/svg%3E';
    container.innerHTML = productArray.map((p, i) => `
<div class="product-card">
<div class="left">
<img src="${p.image || placeholder}" class="product-image">
<div class="product-details">
<h3>${p.name}</h3>
<p><b>SKU :</b> ${p.sku}</p>
<p><b>Price :</b> ₹<span id="price${i}">${p.price}</span></p>
<p><b>Category :</b> ${p.category}</p>
<p><b>Brand :</b> ${p.brand}</p>
<p class="stock">Stock : <span id="stock${i}">${p.stock}</span></p>
</div>
</div>
<div class="stock-section">
<input type="number" id="stockInput${i}" placeholder="Stock" style="width:72px">
<button class="tick-btn" onclick="updateStock(${i})"><i class="fa-solid fa-check"></i></button>
<input type="number" id="priceInput${i}" placeholder="Price" style="width:72px">
<button class="tick-btn" onclick="updatePrice(${i})"><i class="fa-solid fa-check"></i></button>
<button class="edit-btn" onclick="editProduct(${i})"><i class="fa-solid fa-pen"></i></button>
<button class="delete-btn" onclick="deleteProduct(${i})"><i class="fa-solid fa-trash"></i></button>
</div>
</div>
`).join('');
}

// ================================
// SEARCH
// ================================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const value = this.value.toLowerCase();

    const filtered = products.filter(product =>

        product.name.toLowerCase().includes(value) ||

        product.brand.toLowerCase().includes(value) ||

        product.category.toLowerCase().includes(value) ||

        product.sku.toLowerCase().includes(value)

    );

    displayProducts(filtered);

});
// ================================
// UPDATE STOCK
// ================================

async function updateStock(index){

    let stockValue = document.getElementById("stockInput" + index).value;

    stockValue = parseInt(stockValue);

    if(isNaN(stockValue) || stockValue <= 0){

        alert("Please enter valid stock.");

        return;

    }

    const product = products[index];
    if (!product || !product.id) return;

    try {
        const res = await fetch(`/api/products/${product.id}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment: stockValue })
        });
        const data = await res.json();
        if (data.success) {
            product.stock += stockValue;
            displayProducts(products);
        }
    } catch (err) {
        console.error('Update stock error:', err);
        alert('Failed to update stock');
    }

}

// ================================
// UPDATE PRICE
// ================================

async function updatePrice(index){

    let priceValue = document.getElementById("priceInput" + index).value;

    priceValue = parseFloat(priceValue);

    if(isNaN(priceValue) || priceValue <= 0){

        alert("Please enter a valid price.");

        return;

    }

    const product = products[index];
    if (!product || !product.id) return;

    try {
        const res = await fetch(`/api/products/${product.id}/price`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: priceValue })
        });
        const data = await res.json();
        if (data.success) {
            product.price = priceValue;
            displayProducts(products);
        }
    } catch (err) {
        console.error('Update price error:', err);
        alert('Failed to update price');
    }

}

// ================================
// FLOATING BUTTON
// ================================

const addBtn = document.querySelector(".floating-btn");

addBtn.addEventListener("click", function(){

    window.location.href = "addProduct.html";

});

// ================================
// FILTER PANEL
// ================================

const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const closeFilter = document.getElementById("closeFilter");

filterBtn.addEventListener("click", function(){

    filterPanel.classList.add("active");

});

closeFilter.addEventListener("click", function(){

    filterPanel.classList.remove("active");

});

// Close Filter Panel when clicking outside

window.addEventListener("click", function(e){

    if(

        !filterPanel.contains(e.target)

        &&

        !filterBtn.contains(e.target)

    ){

        filterPanel.classList.remove("active");

    }

});

// ================================
// APPLY FILTER
// ================================

document.getElementById("applyFilter").addEventListener("click", function(){

    let filteredProducts = [...products];

    // CATEGORY

    const selectedCategory = [...document.querySelectorAll(".categoryFilter:checked")]

        .map(item => item.value);

    if(selectedCategory.length){

        filteredProducts = filteredProducts.filter(product =>

            selectedCategory.includes(product.category)

        );

    }

    // BRAND

    const selectedBrand = [...document.querySelectorAll(".brandFilter:checked")]

        .map(item => item.value);

    if(selectedBrand.length){

        filteredProducts = filteredProducts.filter(product =>

            selectedBrand.includes(product.brand)

        );

    }

    displayProducts(filteredProducts);

    filterPanel.classList.remove("active");

});

// ================================
// RESET FILTER
// ================================

document.getElementById("resetFilter").addEventListener("click", function(){

    document.querySelectorAll(".filter-panel input").forEach(function(input){

        input.checked = false;

    });

    displayProducts(products);

});
// ================================
// DELETE PRODUCT
// ================================

async function deleteProduct(index){

    const product = products[index];
    if (!product || !product.id) return;

    if(confirm("Delete this product?")){

        try {
            const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                products.splice(index, 1);
                displayProducts(products);
            }
        } catch (err) {
            console.error('Delete product error:', err);
            alert('Failed to delete product');
        }

    }

}

// ================================
// EDIT PRODUCT
// ================================

function editProduct(index){

    const product = products[index];
    if (!product || !product.id) return;

    localStorage.setItem("editIndex", product.id);

    window.location.href = "addProduct.html";

}

// ================================
// LOGOUT
// ================================

const logoutBtn = document.querySelector(".logout");

if(logoutBtn){

    logoutBtn.addEventListener("click", function(){

        const confirmLogout = confirm("Are you sure you want to logout?");

        if(confirmLogout){

            window.location.href = "../LoginPage.html";

        }

    });

}
// LOAD ADMIN PROFILE
// ================================
const savedProfile = JSON.parse(localStorage.getItem("adminProfile"));

if(savedProfile){

    const adminName = document.getElementById("adminNameSidebar");

    if(adminName){

        adminName.innerText = savedProfile.adminName;

    }

}