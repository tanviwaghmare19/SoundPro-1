<<<<<<< HEAD
// ===============================
// CUSTOMER DATA
// ===============================

const customer = JSON.parse(
    localStorage.getItem("selectedCustomer")
);
=======

// CUSTOMER DATA


const customer = JSON.parse(localStorage.getItem("selectedCustomer"));
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

if (customer) {

    document.getElementById("customerName").textContent = customer.name;

    document.getElementById("customerMobile").innerHTML =
        '<i class="fa fa-phone"></i> ' + customer.mobile;

    document.getElementById("customerCity").innerHTML =
        '<i class="fa fa-location-dot"></i> ' + customer.city;

    const avatar = document.getElementById("customerAvatar");

<<<<<<< HEAD
    avatar.className =
        "avatar " + (customer.color || "purple");

    avatar.innerHTML =
        '<i class="fas fa-user"></i>';
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("searchInput");

    const generateBtn =
        document.getElementById("generateBtn");



    // ==========================
    // SEARCH PRODUCT
    // ==========================

    searchInput.addEventListener("input", () => {

        const value =
            searchInput.value.toLowerCase();

        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const productName =
                    row.children[2]
                        .textContent
                        .toLowerCase();

                row.style.display =
                    productName.includes(value)
                        ? ""
                        : "none";

            });

    });



    // ==========================
    // TOTAL CALCULATION
    // ==========================

    function updateGrandTotal() {

        let subtotal = 0;

        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const checkbox =
                    row.querySelector(".product-select");

                if (
                    checkbox &&
                    !checkbox.checked
                ) {
                    row.querySelector(".amount")
                        .textContent = "0.00";
                    return;
                }

                const rate =
                    parseFloat(
                        row.querySelector(".rate-input").value
                    ) || 0;

                const qty =
                    parseInt(
                        row.querySelector(".qty-input").value
                    ) || 0;

                const amount =
                    rate * qty;

                row.querySelector(".amount")
                    .textContent =
                    amount.toFixed(2);

                subtotal += amount;

            });


        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        const gstRadio =
            document.querySelector(
                'input[name="gstType"]:checked'
            );

        const gstType =
            gstRadio
                ? gstRadio.value
                : "none";


        if (gstType === "cgstsgst") {

            cgst = subtotal * 0.09;
            sgst = subtotal * 0.09;

        }

        else if (gstType === "igst") {

            igst = subtotal * 0.18;

        }

        const netTotal =
            subtotal +
            cgst +
            sgst +
            igst;


        document.getElementById(
            "grandTotal"
        ).textContent =
            "₹" + subtotal.toFixed(2);

        document.getElementById(
            "cgstAmount"
        ).textContent =
            "₹" + cgst.toFixed(2);

        document.getElementById(
            "sgstAmount"
        ).textContent =
            "₹" + sgst.toFixed(2);

        document.getElementById(
            "igstAmount"
        ).textContent =
            "₹" + igst.toFixed(2);

        document.getElementById(
            "netTotal"
        ).textContent =
            "₹" + netTotal.toFixed(2);
    }
    // ==========================
// UPDATE SERIAL NUMBERS
// ==========================

function updateSerialNumbers() {

    const rows =
        document.querySelectorAll(".product-row");

    rows.forEach((row, index) => {

        row.children[1].textContent = index + 1;

    });

}

    // ==========================
    // RATE / QTY CHANGE
    // ==========================

    document
        .querySelectorAll(
            ".rate-input, .qty-input"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                updateGrandTotal
            );

        });



    // ==========================
    // GST CHANGE
    // ==========================

    document
        .querySelectorAll(
            'input[name="gstType"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                updateGrandTotal
            );

        });



    // ==========================
    // PRODUCT SELECT
    // ==========================

    document
        .querySelectorAll(
            ".product-select"
        )
        .forEach(box => {

            box.addEventListener(
                "change",
                updateGrandTotal
            );

        });



    // ==========================
    // DELETE PRODUCT
    // ==========================

    document
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    if (
                        confirm(
                            "Remove this product?"
                        )
                    ) {

                        btn
                         .closest(".product-row")
                         .remove();

                        updateSerialNumbers();

                        updateGrandTotal();

                    }

                }
            );

        });
            // ==========================
    // GENERATE BILL
    // ==========================

    generateBtn.addEventListener(
        "click",
        () => {

            const products = [];

            let subtotal = 0;

            document
                .querySelectorAll(".product-row")
                .forEach(row => {

                    const checkbox =
                        row.querySelector(
                            ".product-select"
                        );

                    if (
                        checkbox &&
                        !checkbox.checked
                    ) {
                        return;
                    }

                    const productName =
                        row.children[2].textContent;

                    const rate =
                        parseFloat(
                            row.querySelector(
                                ".rate-input"
                            ).value
                        ) || 0;

                    const qty =
                        parseInt(
                            row.querySelector(
                                ".qty-input"
                            ).value
                        ) || 0;

                    const amount =
                        rate * qty;

                    subtotal += amount;

                    products.push({
                        name: productName,
                        price: rate,
                        qty: qty,
                        amount: amount
                    });

                });


            if (
                products.length === 0
            ) {

                alert(
                    "Please select at least one product."
                );

                return;
            }


            let cgst = 0;
            let sgst = 0;
            let igst = 0;

            const gstType =
                document.querySelector(
                    'input[name="gstType"]:checked'
                )?.value || "none";

            if (
                gstType ===
                "cgstsgst"
            ) {

                cgst =
                    subtotal * 0.09;

                sgst =
                    subtotal * 0.09;
            }

            else if (
                gstType === "igst"
            ) {

                igst =
                    subtotal * 0.18;
            }

            const netTotal =
                subtotal +
                cgst +
                sgst +
                igst;


            localStorage.setItem(
                "selectedProducts",
                JSON.stringify(
                    products
                )
            );

            localStorage.setItem(
                "subtotal",
                subtotal
            );

            localStorage.setItem(
                "cgst",
                cgst
            );

            localStorage.setItem(
                "sgst",
                sgst
            );

            localStorage.setItem(
                "igst",
                igst
            );

            localStorage.setItem(
                "grandTotal",
                netTotal
            );

            localStorage.setItem(
                "gstType",
                gstType
            );


            window.location.href =
                "billPreview.html";

        }
    );



    // ===============================
    // BOTTOM SHEET TOGGLE
    // ===============================

    const toggleSummary =
        document.getElementById("toggleSummary");

    const bottomSheet =
        document.getElementById("bottomSheet");

    const toggleIcon =
        document.getElementById("toggleIcon");

    toggleSummary.addEventListener(
        "click",
        () => {

            bottomSheet.classList.toggle("show");

            if (
                bottomSheet.classList.contains("show")
            ) {

                toggleIcon.classList.remove(
                    "fa-chevron-up"
                );

                toggleIcon.classList.add(
                    "fa-chevron-down"
                );

            }

            else {

                toggleIcon.classList.remove(
                    "fa-chevron-down"
                );

                toggleIcon.classList.add(
                    "fa-chevron-up"
                );

            }

        }
    );


// FIRST CALCULATION

updateSerialNumbers();

updateGrandTotal();

=======
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
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

});


<<<<<<< HEAD

// ===============================
// BACK BUTTON
// ===============================

const backBtn =
    document.querySelector(
        ".back-btn"
    );

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "createBill.html";

        }
    );
=======
// BACK BUTTON


const backBtn = document.querySelector(".back-btn");

if (backBtn) {

    backBtn.addEventListener("click", () => {

        window.location.href = "createBill.html";

    });
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

}