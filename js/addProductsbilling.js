// ===============================
// ===============================
// CUSTOMER DATA
// ===============================
// ===============================

document.addEventListener("DOMContentLoaded", () => {
document.addEventListener("DOMContentLoaded", () => {

    const customer = JSON.parse(
        localStorage.getItem("selectedCustomer")
    );
    const customer = JSON.parse(
        localStorage.getItem("selectedCustomer")
    );

    if (customer) {
    if (customer) {

        document.getElementById("customerName").textContent =
            customer.name || "";
        document.getElementById("customerName").textContent =
            customer.name || "";

        document.getElementById("customerMobile").innerHTML =
            `<i class="fa fa-phone"></i> ${customer.mobile || ""}`;
        document.getElementById("customerMobile").innerHTML =
            `<i class="fa fa-phone"></i> ${customer.mobile || ""}`;

        document.getElementById("customerCity").innerHTML =
            `<i class="fa fa-location-dot"></i> ${customer.city || ""}`;

        const avatar =
            document.getElementById("customerAvatar");

        avatar.className =
            "avatar " + (customer.color || "purple");
        avatar.className =
            "avatar " + (customer.color || "purple");

        avatar.innerHTML =
            '<i class="fas fa-user"></i>';
    }
        avatar.innerHTML =
            '<i class="fas fa-user"></i>';
    }

    const searchInput =
        document.getElementById("searchInput");

    const generateBtn =
        document.getElementById("generateBtn");
    const searchInput =
        document.getElementById("searchInput");

    const generateBtn =
        document.getElementById("generateBtn");

    // ==========================
    // SEARCH PRODUCT
    // ==========================
    // ==========================
    // SEARCH PRODUCT
    // ==========================

    searchInput.addEventListener("input", () => {

        const value =
            searchInput.value.toLowerCase();
        const value =
            searchInput.value.toLowerCase();

        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const productName =
                    row.children[1]
                        .textContent
                        .toLowerCase();

                row.style.display =
                    productName.includes(value)
                        ? ""
                        : "none";
            });
    });

    // ==========================
    // UPDATE TAX COLUMN
    // ==========================

    function updateTaxColumn() {

        const gstType =
            document.querySelector(
                'input[name="gstType"]:checked'
            )?.value || "No GST";

        document
            .querySelectorAll(".tax-column")
            .forEach(cell => {

                cell.textContent = gstType;

            });
    }

    // ==========================
    // UPDATE SERIAL NUMBER
    // ==========================

    function updateSerialNumbers() {

        document
            .querySelectorAll(".product-row")
            .forEach((row, index) => {

                row.children[0].textContent =
                    index + 1;

            });
    }

    // ==========================
    // CALCULATE TOTAL
    // ==========================

    function updateGrandTotal() {
        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const productName =
                    row.children[1]
                        .textContent
                        .toLowerCase();

                row.style.display =
                    productName.includes(value)
                        ? ""
                        : "none";
            });
    });

    // ==========================
    // UPDATE TAX COLUMN
    // ==========================

    function updateTaxColumn() {

        const gstType =
            document.querySelector(
                'input[name="gstType"]:checked'
            )?.value || "No GST";

        document
            .querySelectorAll(".tax-column")
            .forEach(cell => {

                cell.textContent = gstType;

            });
    }

    // ==========================
    // UPDATE SERIAL NUMBER
    // ==========================

    function updateSerialNumbers() {

        document
            .querySelectorAll(".product-row")
            .forEach((row, index) => {

                row.children[0].textContent =
                    index + 1;

            });
    }

    // ==========================
    // CALCULATE TOTAL
    // ==========================

    function updateGrandTotal() {

        let subtotal = 0;

        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const rateInput =
                    row.querySelector(".rate-input");

                const qtyInput =
                    row.querySelector(".qty-input");

                const amountCell =
                    row.querySelector(".amount");

                const rate =
                    parseFloat(rateInput.value) || 0;

                const qty =
                    parseInt(qtyInput.value) || 0;

                const amount =
                    rate * qty;

                amountCell.textContent =
                    amount.toFixed(2);

                subtotal += amount;
            });
        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const rateInput =
                    row.querySelector(".rate-input");

                const qtyInput =
                    row.querySelector(".qty-input");

                const amountCell =
                    row.querySelector(".amount");

                const rate =
                    parseFloat(rateInput.value) || 0;

                const qty =
                    parseInt(qtyInput.value) || 0;

                const amount =
                    rate * qty;

                amountCell.textContent =
                    amount.toFixed(2);

                subtotal += amount;
            });

        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        const gstType =
            document.querySelector(
                'input[name="gstType"]:checked'
            )?.value || "No GST";

        switch (gstType) {

            case "CGST+SGST":
                cgst = subtotal * 0.09;
                sgst = subtotal * 0.09;
                break;

            case "IGST":
                igst = subtotal * 0.18;
                break;
        }

        const netTotal =
            subtotal +
            cgst +
            sgst +
            igst;

        document.getElementById("grandTotal").textContent =
            "₹" + subtotal.toFixed(2);

        document.getElementById("cgstAmount").textContent =
            "₹" + cgst.toFixed(2);

        document.getElementById("sgstAmount").textContent =
            "₹" + sgst.toFixed(2);

        document.getElementById("igstAmount").textContent =
            "₹" + igst.toFixed(2);

        document.getElementById("netTotal").textContent =
            "₹" + netTotal.toFixed(2);

        updateTaxColumn();
    }

    // ==========================
    // RATE & QTY EVENTS
    // ==========================

    document
        .querySelectorAll(".rate-input, .qty-input")
        .forEach(input => {

            input.addEventListener(
                "input",
                updateGrandTotal
            );

            input.addEventListener(
                "change",
                updateGrandTotal
            );
        });

    // ==========================
    // GST EVENTS
    // ==========================

    document
        .querySelectorAll(
            'input[name="gstType"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                () => {

                    updateTaxColumn();
                    updateGrandTotal();

                });
        });

    // ==========================
    // DELETE PRODUCT
    // ==========================

    document
        .querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    if (
                        confirm(
                            "Remove this product?"
                        )
                    ) {

                        btn.closest(".product-row")
                            .remove();

                        updateSerialNumbers();
                        updateGrandTotal();
                    }
                });
        });
        document.getElementById("grandTotal").textContent =
            "₹" + subtotal.toFixed(2);

        document.getElementById("cgstAmount").textContent =
            "₹" + cgst.toFixed(2);

        document.getElementById("sgstAmount").textContent =
            "₹" + sgst.toFixed(2);

        document.getElementById("igstAmount").textContent =
            "₹" + igst.toFixed(2);

        document.getElementById("netTotal").textContent =
            "₹" + netTotal.toFixed(2);

        updateTaxColumn();
    }

    // ==========================
    // RATE & QTY EVENTS
    // ==========================

    document
        .querySelectorAll(".rate-input, .qty-input")
        .forEach(input => {

            input.addEventListener(
                "input",
                updateGrandTotal
            );

            input.addEventListener(
                "change",
                updateGrandTotal
            );
        });

    // ==========================
    // GST EVENTS
    // ==========================

    document
        .querySelectorAll(
            'input[name="gstType"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                () => {

                    updateTaxColumn();
                    updateGrandTotal();

                });
        });

    // ==========================
    // DELETE PRODUCT
    // ==========================

    document
        .querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    if (
                        confirm(
                            "Remove this product?"
                        )
                    ) {

                        btn.closest(".product-row")
                            .remove();

                        updateSerialNumbers();
                        updateGrandTotal();
                    }
                });
        });

    generateBtn.addEventListener("click", () => {

    const products = [];
    let subtotal = 0;
    const products = [];
    let subtotal = 0;

    document
        .querySelectorAll(".product-row")
        .forEach(row => {

            const name =
                row.children[1].textContent.trim();

            const rate =
                parseFloat(
                    row.querySelector(".rate-input").value
                ) || 0;
    document
        .querySelectorAll(".product-row")
        .forEach(row => {

            const name =
                row.children[1].textContent.trim();

            const rate =
                parseFloat(
                    row.querySelector(".rate-input").value
                ) || 0;

            const qty =
                parseInt(
                    row.querySelector(".qty-input").value
                ) || 0;
                parseInt(
                    row.querySelector(".qty-input").value
                ) || 0;

            if (qty > 0) {

                const amount = rate * qty;

                subtotal += amount;

                const amount = rate * qty;

                subtotal += amount;

                products.push({
                    name,
                    price: rate,
                    qty,
                    amount
                });
            }
        });

    if (products.length === 0) {

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
        )?.value || "No GST";

    
    switch (gstType) {

        case "CGST+SGST":
            cgst = subtotal * 0.09;
            sgst = subtotal * 0.09;
            break;

        case "IGST":
            igst = subtotal * 0.18;
            break;
    }

    const grandTotal =
        subtotal +
        cgst +
        sgst +
        igst;

    // Save Products
    localStorage.setItem(
        "selectedProducts",
        JSON.stringify(products)
    );

    // Save Customer
    localStorage.setItem(
        "selectedCustomer",
        JSON.stringify(customer)
    );

    // Save GST — store the RATE percentages, not calculated amounts,
    // because billPreview.js multiplies these against subtotal itself
    let cgstRate = 0, sgstRate = 0, igstRate = 0;

    switch (gstType) {
        case "CGST+SGST":
            cgstRate = 9;
            sgstRate = 9;
            break;
        case "IGST":
            igstRate = 18;
            break;
    }

    localStorage.setItem("subtotal", subtotal);
    localStorage.setItem("cgst", cgstRate);
    localStorage.setItem("sgst", sgstRate);
    localStorage.setItem("igst", igstRate);
    localStorage.setItem("grandTotal", grandTotal);
    localStorage.setItem("gstType", gstType);

    // Invoice Number
    const invoiceNo =
        "INV-" + Date.now();

    localStorage.setItem(
        "invoiceNo",
        invoiceNo
    );

    // Current Date
    const today =
        new Date().toLocaleDateString(
            "en-IN"
    localStorage.setItem(
        "invoiceNo",
        invoiceNo
    );

    // Current Date
    const today =
        new Date().toLocaleDateString(
            "en-IN"
        );

    localStorage.setItem(
        "billDate",
        today
    );
    localStorage.setItem(
        "billDate",
        today
    );

    window.location.href =
        "billPreview.html";
});
    // Initial Load
    window.location.href =
        "billPreview.html";
});
    // Initial Load

    updateTaxColumn();
    updateSerialNumbers();
    updateGrandTotal();
    updateTaxColumn();
    updateSerialNumbers();
    updateGrandTotal();
});

// ===============================
// ===============================
// BACK BUTTON
// ===============================
// ===============================

const backBtn =
    document.querySelector(".back-btn");
const backBtn =
    document.querySelector(".back-btn");

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {
    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "createBill.html";
        });
            window.location.href =
                "createBill.html";
        });
}