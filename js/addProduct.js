// ================================
// IMAGE PREVIEW
// ================================

const imageInput = document.getElementById("productImage");
const previewImage = document.getElementById("previewImage");
const saveBtn = document.getElementById("saveBtn");

let imageData = "";

// ================================
// EDIT MODE CHECK
// ================================

let editIndex = localStorage.getItem("editIndex");

if (editIndex !== null) {

    let products = JSON.parse(localStorage.getItem("products")) || [];

    let product = products[editIndex];

    if (product) {

        document.getElementById("productName").value = product.name;
        document.getElementById("sku").value = product.sku;
        document.getElementById("price").value = product.price;
        document.getElementById("stock").value = product.stock;
        document.getElementById("category").value = product.category;
        document.getElementById("brand").value = product.brand;

        imageData = product.image;

        if (imageData) {

            previewImage.src = imageData;
            previewImage.style.display = "block";

        }

        saveBtn.innerHTML =
        `<i class="fa-solid fa-pen"></i> Update Product`;

    }

}

// ================================
// IMAGE SELECT
// ================================

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        imageData = e.target.result;

        previewImage.src = imageData;

        previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);

});

// ================================
// SAVE BUTTON
// ================================

saveBtn.addEventListener("click", saveProduct);

// ================================
// SAVE PRODUCT
// ================================

function saveProduct() {

    const name = document.getElementById("productName").value.trim();

    const sku = document.getElementById("sku").value.trim();

    const price = document.getElementById("price").value.trim();

    const stock = document.getElementById("stock").value.trim();

    const category = document.getElementById("category").value;

    const brand = document.getElementById("brand").value.trim();

    // ===========================
    // VALIDATION
    // ===========================

    if (
        name === "" ||
        sku === "" ||
        price === "" ||
        stock === "" ||
        category === "" ||
        brand === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    // ===========================
    // GET PRODUCTS
    // ===========================

    let products = JSON.parse(localStorage.getItem("products")) || [];

    // ===========================
    // CREATE OBJECT
    // ===========================

    const product = {

        image: imageData || "no-image.png",

        name: name,

        sku: sku,

        price: Number(price),

        stock: Number(stock),

        category: category,

        brand: brand

    };

    // ===========================
    // UPDATE OR ADD
    // ===========================

    if (editIndex !== null) {

        products[editIndex] = product;

        localStorage.removeItem("editIndex");

        alert("Product Updated Successfully!");

    }

    else {

        products.push(product);

        alert("Product Added Successfully!");

    }

    // ===========================
    // SAVE LOCALSTORAGE
    // ===========================

    localStorage.setItem("products", JSON.stringify(products));

    // ===========================
    // REDIRECT
    // ===========================

    window.location.href = "products.html";

}