document.addEventListener("DOMContentLoaded", () => {
    const customer = JSON.parse(localStorage.getItem("selectedCustomer"));
    if (customer) {
        document.getElementById("customerName").textContent = customer.name || "Rahul Sharma";
        document.getElementById("customerMobile").innerHTML = `<i class="fa fa-phone"></i> ${customer.mobile || "9876543210"}`;
        document.getElementById("customerCity").innerHTML = `<i class="fa fa-location-dot"></i> ${customer.city || "Ahmedabad"}`;
        const avatar = document.getElementById("customerAvatar");
        avatar.className = "avatar " + (customer.color || "purple");
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    }

    let allProducts = [];
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const generateBtn = document.getElementById("generateBtn");
    const tableHeaderRow = document.getElementById("tableHeaderRow");
    const tableBody = document.getElementById("productTableBody");
    const dynamicSummaryRows = document.getElementById("dynamicSummaryRows");

    const gstRateSettings = {
        "CGST+SGST": { headers: ["CGST", "SGST"], rates: [9, 9] },
        "IGST": { headers: ["IGST"], rates: [18] },
        "CGST+SGST+IGST": { headers: ["CGST", "SGST", "IGST"], rates: [9, 9, 18] },
        "No GST": { headers: [], rates: [] }
    };

    const savedGstType = localStorage.getItem("gstType");
    if (savedGstType) {
        const radio = document.querySelector(`input[name="gstType"][value="${savedGstType}"]`);
        if (radio) {
            radio.checked = true;
            rebuildTableStructure(savedGstType);
        }
    }

    const savedCalcMode = localStorage.getItem("calcMode");
    if (savedCalcMode) {
        const radio = document.querySelector(`input[name="calcMode"][value="${savedCalcMode}"]`);
        if (radio) radio.checked = true;
    }

    const savedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const isRestoreCalc = savedCalcMode === "calculated";
    savedProducts.forEach(p => addProductRow(p.name, p.price, p.id));
    const restoredRows = document.querySelectorAll(".product-row");
    restoredRows.forEach((row, i) => {
        if (savedProducts[i]) {
            const qtyInput = row.querySelector(".qty-input");
            if (qtyInput) qtyInput.value = savedProducts[i].qty || 1;
            if (isRestoreCalc) {
                const amountInput = row.querySelector(".amount-input");
                if (amountInput && savedProducts[i].amount) {
                    amountInput.value = savedProducts[i].amount;
                }
            }
        }
    });
    if (savedProducts.length) calculateTotals();

    fetch("/api/products")
        .then(r => r.json())
        .then(data => {
            if (data.success) allProducts = data.products;
        })
        .catch(() => {});

    function updateSerialNumbers() {
        document.querySelectorAll(".product-row").forEach((row, index) => {
            row.children[0].textContent = index + 1;
        });
    }

    function rebuildTableStructure(gstType) {
        const settings = gstRateSettings[gstType];
        const isCalc = document.querySelector('input[name="calcMode"]:checked')?.value === "calculated";

        const savedData = [];
        document.querySelectorAll(".product-row").forEach(row => {
            const name = row.querySelector(".product-name")?.textContent || "";
            const qty = row.querySelector(".qty-input")?.value || "1";
            let initPrice = 0;
            if (isCalc) {
                const existingAmount = row.querySelector(".amount-input")?.value;
                if (existingAmount !== undefined) {
                    initPrice = existingAmount;
                } else {
                    const rate = parseFloat(row.querySelector(".rate-input")?.value || row.querySelector(".rate-display")?.textContent || "0");
                    const exclTotal = rate * (parseInt(qty) || 1);
                    const totalGstRate = settings.rates.reduce((s, r) => s + r, 0);
                    initPrice = totalGstRate > 0 ? (exclTotal * (1 + totalGstRate / 100)).toFixed(2) : exclTotal.toFixed(2);
                }
            } else {
                const existingRate = row.querySelector(".rate-input")?.value;
                if (existingRate !== undefined) {
                    initPrice = existingRate;
                } else {
                    const amount = parseFloat(row.querySelector(".amount-input")?.value || row.querySelector(".amount")?.textContent || "0");
                    const totalGstRate = settings.rates.reduce((s, r) => s + r, 0);
                    const exclTotal = totalGstRate > 0 ? amount / (1 + totalGstRate / 100) : amount;
                    initPrice = (parseInt(qty) || 1) > 0 ? (exclTotal / (parseInt(qty) || 1)).toFixed(2) : "0";
                }
            }
            savedData.push({ name, qty, initPrice, productId: row.dataset.productId || "" });
        });

        tableHeaderRow.innerHTML = `
            <th>Sr No</th>
            <th>Product Name</th>
            <th>Rate</th>
            <th>Qty</th>
            ${settings.headers.map(h => `<th>${h}</th>`).join('')}
            <th>Amount</th>
            <th>Delete</th>
        `;

        tableBody.innerHTML = "";
        savedData.forEach(({ name, qty, initPrice, productId }) => {
            _addTableRow(name, initPrice, productId);
        });

        document.querySelectorAll(".product-row").forEach((row, i) => {
            if (savedData[i]) {
                const qInp = row.querySelector(".qty-input");
                if (qInp) qInp.value = savedData[i].qty;
            }
        });

        dynamicSummaryRows.innerHTML = settings.headers.map(h => {
            return `<div class="summary-row"><span>${h}</span><span id="${h.toLowerCase()}SummaryAmount">₹0.00</span></div>`;
        }).join('');

        updateSerialNumbers();
        attachInputListeners();
        calculateTotals();
    }

    function attachInputListeners() {
        document.querySelectorAll(".rate-input, .qty-input, .amount-input").forEach(input => {
            input.removeEventListener("input", calculateTotals);
            input.removeEventListener("change", calculateTotals);
            input.addEventListener("input", calculateTotals);
            input.addEventListener("change", calculateTotals);
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.removeEventListener("click", handleDeleteRow);
            btn.addEventListener("click", handleDeleteRow);
        });
    }

    function handleDeleteRow(event) {
        if (confirm("Remove this product?")) {
            event.target.closest(".product-row").remove();
            updateSerialNumbers();
            calculateTotals();
        }
    }

    function calculateTotals() {
        const isCalc = document.querySelector('input[name="calcMode"]:checked')?.value === "calculated";
        let subtotal = 0;
        let runningTaxes = { "CGST": 0, "SGST": 0, "IGST": 0 };
        let expectedInclTotal = 0;

        document.querySelectorAll(".product-row").forEach(row => {
            const qtyInput = row.querySelector(".qty-input");
            const taxCells = row.querySelectorAll(".tax-cell");
            const qty = parseInt(qtyInput?.value) || 0;

            let rate = 0;
            let amount = 0;

            if (isCalc) {
                const amountInput = row.querySelector(".amount-input");
                const inclTotal = parseFloat(amountInput?.value) || 0;
                const totalGstRate = Array.from(taxCells).reduce((s, c) => s + parseFloat(c.dataset.gstRate), 0);
                const taxableValue = totalGstRate > 0 ? Math.round(inclTotal / (1 + totalGstRate / 100) * 1000000) / 1000000 : inclTotal;
                const display = row.querySelector(".rate-display");
                if (display) display.textContent = qty > 0 ? (taxableValue / qty).toFixed(2) : "0.00";
                expectedInclTotal += inclTotal;
                rate = qty > 0 ? taxableValue / qty : 0;
                amount = taxableValue;
            } else {
                const rateInput = row.querySelector(".rate-input");
                rate = parseFloat(rateInput?.value) || 0;
                amount = rate * qty;
                const amountCell = row.querySelector(".amount");
                if (amountCell) amountCell.textContent = amount.toFixed(2);
            }

            subtotal += amount;

            taxCells.forEach(taxCell => {
                const taxType = taxCell.dataset.gstHeader;
                const taxRate = parseFloat(taxCell.dataset.gstRate);
                const computedTax = (amount * taxRate) / 100;
                taxCell.innerHTML = `₹${computedTax.toFixed(2)} (${taxRate}%)`;
                runningTaxes[taxType] += computedTax;
            });
        });

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

        if (isCalc && expectedInclTotal > 0) {
            netTotal = expectedInclTotal;
        }

        document.getElementById("netTotal").textContent = "₹" + netTotal.toFixed(2);
    }

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.trim().toLowerCase();
        if (!value) {
            searchResults.classList.remove("active");
            searchResults.innerHTML = "";
            return;
        }

        const matches = allProducts.filter(p =>
            (p.name || "").toLowerCase().includes(value) ||
            (p.sku || "").toLowerCase().includes(value)
        );

        if (matches.length === 0) {
            searchResults.classList.remove("active");
            searchResults.innerHTML = "";
            return;
        }

        searchResults.innerHTML = matches.map(p => `
            <div class="search-result-item" data-id="${p.id}" data-name="${p.name}" data-price="${p.price || 0}">
                <div>
                    <div class="result-name">${p.name}</div>
                    <div class="result-stock">Stock: ${p.stock || 0} | ${p.brand || ""}</div>
                </div>
                <div style="display:flex;align-items:center;gap:12px;">
                    <span class="result-price">₹${Number(p.price || 0).toLocaleString()}</span>
                    <button class="add-btn">Add</button>
                </div>
            </div>
        `).join("");

        searchResults.classList.add("active");

        searchResults.querySelectorAll(".add-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const item = btn.closest(".search-result-item");
                const name = item.dataset.name;
                const price = item.dataset.price;
                const productId = item.dataset.id;
                addProductRow(name, price, productId);
                searchResults.classList.remove("active");
                searchResults.innerHTML = "";
                searchInput.value = "";
            });
        });
    });

    function _addTableRow(name, initPrice, productId) {
        const currentGstType = document.querySelector('input[name="gstType"]:checked')?.value || "No GST";
        const settings = gstRateSettings[currentGstType];
        const isCalc = document.querySelector('input[name="calcMode"]:checked')?.value === "calculated";

        const taxCellsHtml = settings.rates.map((rate, index) => {
            return `<td class="tax-cell" data-gst-header="${settings.headers[index]}" data-gst-rate="${rate}">₹0.00 (${rate}%)</td>`;
        }).join('');

        const rateCellHtml = isCalc
            ? `<td><div>Rate: <span class="rate-display">0.00</span></div></td>`
            : `<td><input type="number" class="rate-input" value="${initPrice}" step="any"></td>`;

        const amountCellHtml = isCalc
            ? `<td><input type="number" class="amount-input" value="${initPrice}" step="any"></td>`
            : `<td class="amount">0.00</td>`;

        const tr = document.createElement("tr");
        tr.className = "product-row";
        tr.dataset.productId = productId || "";
        tr.innerHTML = `
            <td></td>
            <td class="product-name">${name}</td>
            ${rateCellHtml}
            <td><input type="number" class="qty-input" value="1" min="1"></td>
            ${taxCellsHtml}
            ${amountCellHtml}
            <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
        `;
        tableBody.appendChild(tr);
    }

    function addProductRow(name, price, productId) {
        const isCalc = document.querySelector('input[name="calcMode"]:checked')?.value === "calculated";
        if (isCalc) {
            const currentGstType = document.querySelector('input[name="gstType"]:checked')?.value || "No GST";
            const settings = gstRateSettings[currentGstType];
            const totalGstRate = settings.rates.reduce((s, r) => s + r, 0);
            price = totalGstRate > 0 ? (parseFloat(price) * (1 + totalGstRate / 100)).toFixed(2) : price;
        }
        _addTableRow(name, price, productId);
        updateSerialNumbers();
        calculateTotals();
        attachInputListeners();
    }

    document.querySelectorAll('input[name="gstType"]').forEach(radio => {
        radio.addEventListener("change", () => {
            rebuildTableStructure(radio.value);
        });
    });

    document.querySelectorAll('input[name="calcMode"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const gstType = document.querySelector('input[name="gstType"]:checked')?.value || "No GST";
            rebuildTableStructure(gstType);
        });
    });

    generateBtn.addEventListener("click", () => {
        const products = [];
        let subtotal = 0;
        const gstType = document.querySelector('input[name="gstType"]:checked')?.value || "No GST";
        const settings = gstRateSettings[gstType];
        let totalTaxes = settings.rates.map(() => 0);

        document.querySelectorAll(".product-row").forEach(row => {
            const name = row.querySelector(".product-name").textContent.trim();
            const isCalc = document.querySelector('input[name="calcMode"]:checked')?.value === "calculated";
            const qty = parseInt(row.querySelector(".qty-input").value) || 0;
            const taxCells = row.querySelectorAll(".tax-cell");
            let rate, amount;
            if (isCalc) {
                const inclGst = parseFloat(row.querySelector(".amount-input")?.value) || 0;
                const totalGstRate = Array.from(taxCells).reduce((s, c) => s + parseFloat(c.dataset.gstRate), 0);
                const divisor = 1 + totalGstRate / 100;
                const taxableValue = totalGstRate > 0 ? Math.round(inclGst / divisor * 1000000) / 1000000 : inclGst;
                rate = qty > 0 ? taxableValue / qty : 0;
                amount = taxableValue;
            } else {
                rate = parseFloat(row.querySelector(".rate-input")?.value) || 0;
                amount = rate * qty;
            }

            if (qty > 0) {
                subtotal += amount;

                let productGstDetails = [];
                taxCells.forEach((taxCell, index) => {
                    const taxRate = parseFloat(taxCell.dataset.gstRate);
                    const taxAmount = (amount * taxRate) / 100;
                    totalTaxes[index] += taxAmount;
                    productGstDetails.push({ type: settings.headers[index], rate: taxRate, amount: taxAmount });
                });

                products.push({ id: row.dataset.productId || "", name, price: rate, qty, amount, hsn: "8518", tax: productGstDetails, inclGst: 0 });
            }
        });

        if (products.length === 0) {
            alert("Please select at least one product.");
            return;
        }

        let totalNetValue = subtotal;
        totalTaxes.forEach(t => totalNetValue += t);

        localStorage.setItem("selectedProducts", JSON.stringify(products));
        localStorage.setItem("selectedCustomer", JSON.stringify(customer || null));
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

    if (savedGstType) {
        rebuildTableStructure(savedGstType);
    } else {
        rebuildTableStructure("No GST");
    }
});
