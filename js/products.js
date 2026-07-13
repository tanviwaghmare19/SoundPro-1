// ================================
// PRODUCT DATA
// ================================

let products = JSON.parse(localStorage.getItem("products"));

if (!products) {

    products = [

        {
            image: "speaker.jpg",
            name: "JBL SRX 725 Speaker",
            sku: "8763",
            stock: 5,
            price: 35000,
            category: "Speaker",
            brand: "JBL"
        },

        {
            image: "mixer.jpg",
            name: "Yamaha Sound Mixer",
            sku: "8764",
            stock: 8,
            price: 42000,
            category: "Mixer",
            brand: "Yamaha"
        },

        {
            image: "mic.jpg",
            name: "Wireless Microphone",
            sku: "8765",
            stock: 10,
            price: 8500,
            category: "Microphone",
            brand: "Shure"
        },

        {
            image: "headphones.jpg",
            name: "Sony Headphones",
            sku: "8766",
            stock: 15,
            price: 6000,
            category: "Headphone",
            brand: "Sony"
        }

    ];

    localStorage.setItem("products", JSON.stringify(products));
}

// ================================
// DISPLAY PRODUCTS
// ================================

function displayProducts(productArray) {

    const container = document.getElementById("productContainer");

    container.innerHTML = "";

    if (productArray.length === 0) {

        container.innerHTML = `
        <h2 style="text-align:center;padding:40px;">
        No Product Found
        </h2>
        `;

        return;
    }

    productArray.forEach((product, index) => {

        container.innerHTML += `

<div class="product-card">

<div class="left">

<img src="${product.image}" class="product-image">

<div class="product-details">

<h3>${product.name}</h3>

<p><b>SKU :</b> ${product.sku}</p>

<p><b>Price :</b> ₹${product.price}</p>

<p><b>Category :</b> ${product.category}</p>

<p><b>Brand :</b> ${product.brand}</p>

<p class="stock">

Stock :
<span id="stock${index}">
${product.stock}
</span>

</p>

</div>

</div>

<div class="stock-section">

<input
type="number"
id="stockInput${index}"
placeholder="Stock">

<button
class="tick-btn"
onclick="updateStock(${index})">

<i class="fa-solid fa-check"></i>

</button>

<button
class="edit-btn"
onclick="editProduct(${index})">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-btn"
onclick="deleteProduct(${index})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

    });

}

displayProducts(products);

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

function updateStock(index){

    let stockValue = document.getElementById("stockInput" + index).value;

    stockValue = parseInt(stockValue);

    if(isNaN(stockValue) || stockValue <= 0){

        alert("Please enter valid stock.");

        return;

    }

    products[index].stock += stockValue;

    localStorage.setItem("products", JSON.stringify(products));

    displayProducts(products);

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

function deleteProduct(index){

    if(confirm("Delete this product?")){

        products.splice(index, 1);

        localStorage.setItem("products", JSON.stringify(products));

        displayProducts(products);

    }

}

// ================================
// EDIT PRODUCT
// ================================

function editProduct(index){

    localStorage.setItem("editIndex", index);

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