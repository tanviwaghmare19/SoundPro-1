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

        const savedValues = [];
        document.querySelectorAll(".product-row").forEach(row => {
            savedValues.push({
                rate: row.querySelector(".rate-input")?.value || "0",
                qty: row.querySelector(".qty-input")?.value || "1"
            });
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

        document.querySelectorAll(".product-row").forEach((row, i) => {
            const cells = row.querySelectorAll('td');
            const srNo = cells[0].outerHTML;
            const prodName = cells[1].outerHTML;
            const rateInputCell = cells[2].outerHTML;
            const qtyInputCell = cells[3].outerHTML;
            const amountCell = cells[cells.length - 2].outerHTML;
            const deleteBtnCell = cells[cells.length - 1].outerHTML;

            const taxCellsHtml = settings.rates.map((rate, index) => {
                return `<td class="tax-cell" data-gst-header="${settings.headers[index]}" data-gst-rate="${rate}">₹0.00 (${rate}%)</td>`;
            }).join('');

            row.innerHTML = `${srNo}${prodName}${rateInputCell}${qtyInputCell}${taxCellsHtml}${amountCell}${deleteBtnCell}`;

            if (savedValues[i]) {
                row.querySelector(".rate-input").value = savedValues[i].rate;
                row.querySelector(".qty-input").value = savedValues[i].qty;
            }
        });

        dynamicSummaryRows.innerHTML = settings.headers.map(h => {
            return `<div class="summary-row"><span>${h}</span><span id="${h.toLowerCase()}SummaryAmount">₹0.00</span></div>`;
        }).join('');

        attachInputListeners();
    }

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
            (p.name || "").toLowerCase().includes(value)
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
                addProductRow(name, price);
                searchResults.classList.remove("active");
                searchResults.innerHTML = "";
                searchInput.value = "";
            });
        });
    });

    function addProductRow(name, price) {
        const currentGstType = document.querySelector('input[name="gstType"]:checked')?.value || "No GST";
        const settings = gstRateSettings[currentGstType];

        const taxCellsHtml = settings.rates.map((rate, index) => {
            return `<td class="tax-cell" data-gst-header="${settings.headers[index]}" data-gst-rate="${rate}">₹0.00 (${rate}%)</td>`;
        }).join('');

        const tr = document.createElement("tr");
        tr.className = "product-row";
        tr.innerHTML = `
            <td></td>
            <td class="product-name">${name}</td>
            <td><input type="number" class="rate-input" value="${price}"></td>
            <td><input type="number" class="qty-input" value="1" min="1"></td>
            ${taxCellsHtml}
            <td class="amount">0.00</td>
            <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
        `;

        tableBody.appendChild(tr);
        updateSerialNumbers();
        calculateTotals();
        attachInputListeners();
    }

    document.querySelectorAll('input[name="gstType"]').forEach(radio => {
        radio.addEventListener("change", () => {
            rebuildTableStructure(radio.value);
            calculateTotals();
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
            const rate = parseFloat(row.querySelector(".rate-input").value) || 0;
            const qty = parseInt(row.querySelector(".qty-input").value) || 0;
            const taxCells = row.querySelectorAll(".tax-cell");

            if (qty > 0) {
                const amount = rate * qty;
                subtotal += amount;

                let productGstDetails = [];
                taxCells.forEach((taxCell, index) => {
                    const taxRate = parseFloat(taxCell.dataset.gstRate);
                    const taxAmount = (amount * taxRate) / 100;
                    totalTaxes[index] += taxAmount;
                    productGstDetails.push({ type: settings.headers[index], rate: taxRate, amount: taxAmount });
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

    rebuildTableStructure("No GST");
    updateSerialNumbers();
    calculateTotals();
});
