<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
    // Load customer data from storage
    const customer = JSON.parse(localStorage.getItem("selectedCustomer"));

    if (customer) {
        document.getElementById("customerName").textContent = customer.name || "Rahul Sharma";
        document.getElementById("customerMobile").innerHTML = `<i class="fa fa-phone"></i> ${customer.mobile || "9876543210"}`;
        document.getElementById("customerCity").innerHTML = `<i class="fa fa-location-dot"></i> ${customer.city || "Ahmedabad"}`;

        const avatar = document.getElementById("customerAvatar");
        avatar.className = "avatar " + (customer.color || "purple");
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    }

    const searchInput = document.getElementById("searchInput");
    const generateBtn = document.getElementById("generateBtn");
    const tableHeaderRow = document.getElementById("tableHeaderRow");
    const dynamicSummaryRows = document.getElementById("dynamicSummaryRows");

    // Unified configuration database for Tax Rules
    const gstRateSettings = {
        "CGST+SGST": {
            headers: ["CGST", "SGST"],
            rates: [9, 9]
        },
        "IGST": {
            headers: ["IGST"],
            rates: [18]
        },
        "CGST+SGST+IGST": {
            headers: ["CGST", "SGST", "IGST"],
            rates: [9, 9, 18]
        },
        "No GST": {
            headers: [],
            rates: []
        }
    };

    // Auto-arrange row indexes
    function updateSerialNumbers() {
        document.querySelectorAll(".product-row").forEach((row, index) => {
            row.children[0].textContent = index + 1;
        });
    }

    // Function to rebuild table grid & headers injection dynamically
    function rebuildTableStructure(gstType) {
        const settings = gstRateSettings[gstType];

        // 1. Rewrite matching Table Headers
        tableHeaderRow.innerHTML = `
            <th>Sr No</th>
            <th>Product Name</th>
            <th>Rate</th>
            <th>Qty</th>
            ${settings.headers.map(h => `<th>${h}</th>`).join('')}
            <th>Amount</th>
            <th>Delete</th>
        `;

        // 2. Rewrite row matching Columns
        document.querySelectorAll(".product-row").forEach(row => {
            const cells = row.querySelectorAll('td');
            
            const srNo = cells[0].outerHTML;
            const prodName = cells[1].outerHTML;
            const rateInputCell = cells[2].outerHTML;
            const qtyInputCell = cells[3].outerHTML;
            const amountCell = cells[cells.length - 2].outerHTML;
            const deleteBtnCell = cells[cells.length - 1].outerHTML;

            // Generate structured custom dynamic tax columns
            const taxCellsHtml = settings.rates.map((rate, index) => {
                return `<td class="tax-cell" data-gst-header="${settings.headers[index]}" data-gst-rate="${rate}">₹0.00 (${rate}%)</td>`;
            }).join('');

            row.innerHTML = `
                ${srNo}
                ${prodName}
                ${rateInputCell}
                ${qtyInputCell}
                ${taxCellsHtml}
                ${amountCell}
                ${deleteBtnCell}
            `;
        });

        // 3. Populate matching pricing cards rows
        dynamicSummaryRows.innerHTML = settings.headers.map(h => {
            return `
                <div class="summary-row">
                    <span>${h}</span>
                    <span id="${h.toLowerCase()}SummaryAmount">₹0.00</span>
                </div>
            `;
        }).join('');

        attachInputListeners();
    }

    // Rebind live events to dynamically generated code block elements
    function attachInputListeners() {
        document.querySelectorAll(".rate-input, .qty-input").forEach(input => {
            input.removeEventListener("input", calculateTotals);
            input.removeEventListener("change", calculateTotals);
            input.addEventListener("input", calculateTotals);
            input.addEventListener("change", calculateTotals);
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.removeEventListener("click", handleDeleteRow);
            btn.addEventListener("click", handleDeleteRow);
=======
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
>>>>>>> ca728161e421dd3d34a0115c61517471e3959553
        });
    }

<<<<<<< HEAD
    function handleDeleteRow(event) {
        if (confirm("Remove this product?")) {
            event.target.closest(".product-row").remove();
            updateSerialNumbers();
            calculateTotals();
        }
    }

    // Mathematical Calculation Core
    function calculateTotals() {
        let subtotal = 0;
        let runningTaxes = { "CGST": 0, "SGST": 0, "IGST": 0 };

        document.querySelectorAll(".product-row").forEach(row => {
            const rateInput = row.querySelector(".rate-input");
            const qtyInput = row.querySelector(".qty-input");
            const amountCell = row.querySelector(".amount");
            const taxCells = row.querySelectorAll(".tax-cell");

            const rate = parseFloat(rateInput.value) || 0;
            const qty = parseInt(qtyInput.value) || 0;
            const amount = rate * qty;

            amountCell.textContent = amount.toFixed(2);
            subtotal += amount;

            // Calculate tax breakdowns for this row
            taxCells.forEach(taxCell => {
                const taxType = taxCell.dataset.gstHeader;
                const taxRate = parseFloat(taxCell.dataset.gstRate);
                const computedTax = (amount * taxRate) / 100;

                taxCell.innerHTML = `\u20B9${computedTax.toFixed(2)} (${taxRate}%)`;
                runningTaxes[taxType] += computedTax;
            });
        });

        // Map updates to summary DOM nodes
        document.getElementById("grandTotal").textContent = "₹" + subtotal.toFixed(2);

        let netTotal = subtotal;
        const currentGstType = document.querySelector('input[name="gstType"]:checked')?.value || "No GST";
        const settings = gstRateSettings[currentGstType];

        settings.headers.forEach(header => {
            const summaryElement = document.getElementById(`${header.toLowerCase()}SummaryAmount`);
            const totalTaxAmount = runningTaxes[header] || 0;
            if (summaryElement) {
                summaryElement.textContent = "₹" + totalTaxAmount.toFixed(2);
            }
            netTotal += totalTaxAmount;
        });

        document.getElementById("netTotal").textContent = "₹" + netTotal.toFixed(2);
    }

    // Real-time search processing
    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();
        document.querySelectorAll(".product-row").forEach(row => {
            const productName = row.querySelector(".product-name").textContent.toLowerCase();
            row.style.display = productName.includes(value) ? "" : "none";
        });
    });

    // Handle Radio Changes
    document.querySelectorAll('input[name="gstType"]').forEach(radio => {
        radio.addEventListener("change", () => {
            rebuildTableStructure(radio.value);
            calculateTotals();
        });
    });

    // Save and submit handler
    generateBtn.addEventListener("click", () => {
        const products = [];
        let subtotal = 0;
        const gstType = document.querySelector('input[name="gstType"]:checked')?.value || "No GST";
        const settings = gstRateSettings[gstType];
        let totalTaxes = settings.rates.map(() => 0);

        document.querySelectorAll(".product-row").forEach(row => {
            const name = row.querySelector(".product-name").textContent.trim();
            const rate = parseFloat(row.querySelector(".rate-input").value) || 0;
            const qty = parseInt(row.querySelector(".qty-input").value) || 0;
            const taxCells = row.querySelectorAll(".tax-cell");
=======
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
>>>>>>> ca728161e421dd3d34a0115c61517471e3959553

            if (qty > 0) {
                const amount = rate * qty;
                subtotal += amount;

<<<<<<< HEAD
                let productGstDetails = [];
                taxCells.forEach((taxCell, index) => {
                    const taxRate = parseFloat(taxCell.dataset.gstRate);
                    const taxAmount = (amount * taxRate) / 100;
                    totalTaxes[index] += taxAmount;

                    productGstDetails.push({
                        type: settings.headers[index],
                        rate: taxRate,
                        amount: taxAmount
                    });
                });

                products.push({ name, price: rate, qty, amount, hsn: "8518", tax: productGstDetails });
            }
        });

        if (products.length === 0) {
            alert("Please select at least one product.");
            return;
        }

        let totalNetValue = subtotal;
        totalTaxes.forEach(t => totalNetValue += t);

        localStorage.setItem("selectedProducts", JSON.stringify(products));
        localStorage.setItem("selectedCustomer", JSON.stringify(customer));
        localStorage.setItem("subtotal", subtotal);
        localStorage.setItem("grandTotal", totalNetValue);
        localStorage.setItem("gstType", gstType);
        
        let finalGstBreakdown = settings.headers.map((h, i) => {
            return { type: h, rate: settings.rates[i], totalAmount: totalTaxes[i] }
        });
        localStorage.setItem("gstBreakdown", JSON.stringify(finalGstBreakdown));

        window.location.href = "billPreview.html";
    });

    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "createBill.html";
        });
    }

    // App bootstrapping/initial run
    rebuildTableStructure("No GST");
    updateSerialNumbers();
    calculateTotals();
});
=======
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
>>>>>>> ca728161e421dd3d34a0115c61517471e3959553
