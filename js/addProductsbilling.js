
// CUSTOMER DATA


const customer = JSON.parse(localStorage.getItem("selectedCustomer"));

if (customer) {

    document.getElementById("customerName").textContent = customer.name;

    document.getElementById("customerMobile").innerHTML =
        '<i class="fa fa-phone"></i> ' + customer.mobile;

    document.getElementById("customerCity").innerHTML =
        '<i class="fa fa-location-dot"></i> ' + customer.city;

    const avatar = document.getElementById("customerAvatar");

    avatar.className = "avatar " + customer.color;

    avatar.innerHTML = '<i class="fas fa-user"></i>';
}


// PAGE LOAD


document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const grandTotal = document.getElementById("grandTotal");
    const generateBtn = document.getElementById("generateBtn");

    const gstOptions =
        document.querySelectorAll('input[name="gst"]');

    
    // LIVE SEARCH
    

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach(card => {

            const name = card.dataset.name.toLowerCase();

            if (name.includes(value)) {

                card.style.display = "flex";

            } else {

                card.style.display = "none";

            }

        });

    });

    
    // UPDATE TOTAL
 

    function updateTotal() {

        let subtotal = 0;

        document.querySelectorAll(".product-card").forEach(card => {

            const price = Number(card.dataset.price);

            const qty = Number(
                card.querySelector(".count").textContent
            );

            const itemTotal = price * qty;

            card.querySelector(".itemTotal").textContent = itemTotal;

            subtotal += itemTotal;

        });

        let gstPercent = 0;

        gstOptions.forEach(option => {

            if (option.checked) {

                gstPercent = Number(option.value);

            }

        });

        const gstAmount =
            subtotal * gstPercent / 100;

        const finalTotal =
            subtotal + gstAmount;

        grandTotal.textContent =
            "₹" + finalTotal.toFixed(2);

    }

    
    // PLUS MINUS DELETE
    

    document.querySelectorAll(".product-card").forEach(card => {

        const plus = card.querySelector(".plus");
        const minus = card.querySelector(".minus");
        const qty = card.querySelector(".count");
        const del = card.querySelector(".delete");

        plus.addEventListener("click", () => {

            qty.textContent =
                Number(qty.textContent) + 1;

            updateTotal();

        });

        minus.addEventListener("click", () => {

            let q = Number(qty.textContent);

            if (q > 0) {

                qty.textContent = q - 1;

                updateTotal();

            }

        });

        del.addEventListener("click", () => {

            if (confirm("Remove Product?")) {

                card.remove();

                updateTotal();

            }

        });

    });

    
    // GST CHANGE
   
    gstOptions.forEach(option => {

        option.addEventListener("change", updateTotal);

    });

    
    // GENERATE BILL
   

    generateBtn.addEventListener("click", () => {

        const products = [];

        let subtotal = 0;

        document.querySelectorAll(".product-card").forEach(card => {

            const qty =
                Number(card.querySelector(".count").textContent);

            const price =
                Number(card.dataset.price);

            if (qty > 0) {

                products.push({

                    name: card.dataset.name,

                    price: price,

                    qty: qty,

                    amount: qty * price

                });

            }

            subtotal += qty * price;

        });

        localStorage.setItem(
            "selectedProducts",
            JSON.stringify(products)
        );

        let gst = 0;

        gstOptions.forEach(option => {

            if (option.checked) {

                gst = Number(option.value);

            }

        });

        localStorage.setItem("gst", gst);

        localStorage.setItem(
            "subtotal",
            subtotal
        );

        localStorage.setItem(
            "grandTotal",
            subtotal + (subtotal * gst / 100)
        );

        window.location.href = "billPreview.html";

    });

    updateTotal();

});


// BACK BUTTON


const backBtn = document.querySelector(".back-btn");

if (backBtn) {

    backBtn.addEventListener("click", () => {

        window.location.href = "createBill.html";

    });

}