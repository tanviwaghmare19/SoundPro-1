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

    (async function loadEditProduct() {
        try {
            const res = await fetch(`/api/products/${editIndex}`);
            const data = await res.json();
            if (data.success && data.product) {
                const product = data.product;
                document.getElementById("productName").value = product.name || '';
                document.getElementById("sku").value = product.sku || '';
                document.getElementById("price").value = product.price || '';
                document.getElementById("stock").value = product.stock || '';
                document.getElementById("category").value = product.category || '';
                document.getElementById("brand").value = product.brand || '';

                imageData = product.image || '';

                if (imageData) {
                    previewImage.src = imageData;
                    previewImage.style.display = "block";
                }

                saveBtn.innerHTML =
                `<i class="fa-solid fa-pen"></i> Update Product`;
            }
        } catch (err) {
            console.error('Failed to load product for editing:', err);
        }
    })();

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

async function saveProduct() {

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

    try {
        if (editIndex !== null) {

            const res = await fetch(`/api/products/${editIndex}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            if (!data.success) {
                alert(data.message || 'Failed to update product');
                return;
            }

            localStorage.removeItem("editIndex");
            alert("Product Updated Successfully!");

        } else {

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            if (!data.success) {
                alert(data.message || 'Failed to add product');
                return;
            }

            alert("Product Added Successfully!");

        }

        // ===========================
        // REDIRECT
        // ===========================

        window.location.href = "products.html";

    } catch (err) {
        console.error('Save product error:', err);
        alert('Failed to save product. Check server connection.');
    }

}