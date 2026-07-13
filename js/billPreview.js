document.addEventListener("DOMContentLoaded", () => {
    // Hidden internal processing IDs tracking
    const invoiceNo = "INV" + Date.now();
    const today = new Date();

    // 1. Populate Customer details
    const customer = JSON.parse(localStorage.getItem("selectedCustomer"));
    if (customer) {
        document.getElementById("customerName").textContent = customer.name || "Rahul Sharma";
        document.getElementById("customerMobile").innerHTML = '<i class="fa fa-phone"></i> ' + (customer.mobile || "9876543210");
        document.getElementById("customerCity").innerHTML = '<i class="fa fa-location-dot"></i> ' + (customer.city || "Ahmedabad");

        const avatar = document.getElementById("customerAvatar");
        if (avatar) {
            avatar.className = "avatar " + (customer.color || "purple");
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
    }

    // 2. Populate Products list and calculate base base billing sums
    const products = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const productContainer = document.getElementById("productContainer");

    let subtotal = 0;
    let totalQty = 0;

    products.forEach(product => {
        const qty = Number(product.qty);
        const price = Number(product.price);
        const amount = qty * price;
        subtotal += amount;
        totalQty += qty;

        productContainer.innerHTML += `
        <div class="product-row">
            <span>${product.name}</span>
            <span>${qty}</span>
            <span>₹${price.toFixed(2)}</span>
            <span>₹${amount.toFixed(2)}</span>
        </div>`;
    });

    document.getElementById("subtotal").textContent = "₹" + subtotal.toFixed(2);

    // 3. Dynamic Calculation & UI Display matching your custom multi-tax selections
    const gstType = localStorage.getItem("gstType") || "No GST";
    const gstBreakdown = JSON.parse(localStorage.getItem("gstBreakdown")) || [];
    const dynamicTaxContainer = document.getElementById("dynamicTaxContainer");
    
    dynamicTaxContainer.innerHTML = ""; // Clear placeholders
    let combinedTaxValue = 0;

    // Check mapping database structure sent from screen 1
    if (gstBreakdown.length > 0) {
        gstBreakdown.forEach(taxItem => {
            const taxAmount = Number(taxItem.totalAmount) || 0;
            combinedTaxValue += taxAmount;

            // Generate clean row structure dynamically matching your selection list layout
            dynamicTaxContainer.innerHTML += `
                <div class="row">
                    <span>${taxItem.type} (${taxItem.rate}%)</span>
                    <span>₹${taxAmount.toFixed(2)}</span>
                </div>
            `;
        });
    } else {
        // Fallback backward compatibility calculation if array breakdown object is absent
        let fallbackCgst = 0, fallbackSgst = 0, fallbackIgst = 0;
        if (gstType === "CGST+SGST") {
            fallbackCgst = subtotal * 0.09;
            fallbackSgst = subtotal * 0.09;
        } else if (gstType === "IGST") {
            fallbackIgst = subtotal * 0.18;
        } else if (gstType === "CGST+SGST+IGST") {
            fallbackCgst = subtotal * 0.09;
            fallbackSgst = subtotal * 0.09;
            fallbackIgst = subtotal * 0.18;
        }

        combinedTaxValue = fallbackCgst + fallbackSgst + fallbackIgst;

        if (fallbackCgst > 0) dynamicTaxContainer.innerHTML += `<div class="row"><span>CGST (9%)</span><span>₹${fallbackCgst.toFixed(2)}</span></div>`;
        if (fallbackSgst > 0) dynamicTaxContainer.innerHTML += `<div class="row"><span>SGST (9%)</span><span>₹${fallbackSgst.toFixed(2)}</span></div>`;
        if (fallbackIgst > 0) dynamicTaxContainer.innerHTML += `<div class="row"><span>IGST (18%)</span><span>₹${fallbackIgst.toFixed(2)}</span></div>`;
    }

    // Set Final calculated figures
    const grandTotal = subtotal + combinedTaxValue;
    document.getElementById("grandTotal").textContent = "₹" + grandTotal.toFixed(2);

    // 4. E-Way configuration block checks
    let ewayBillNo = null;
    if (grandTotal >= 50000) {
        ewayBillNo = "EWB" + Math.floor(10000000 + Math.random() * 90000000);

        const ewaySection = document.getElementById("ewaySection");
        if (ewaySection) {
            ewaySection.style.display = "block";
        }

        const ewayNumber = document.getElementById("ewayNumber");
        if (ewayNumber) {
            ewayNumber.textContent = ewayBillNo;
        }

        const finalBillBtn = document.getElementById("finalBillBtn");
        if (finalBillBtn) {
            finalBillBtn.textContent = "Generate Final Bill + E-Way Bill";
        }
    }

    // Helper translation string generator
    function numberToWords(num) {
        const a = [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
            "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        ];
        const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        function convert(n) {
            if (n < 20) return a[n];
            if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
            if (n < 1000) return a[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
            if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
            if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
            return convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000);
        }

        return "Indian Rupees " + convert(Math.round(num)).trim() + " Only";
    }

    // Save handler trigger dispatch
    document.getElementById("finalBillBtn").addEventListener("click", () => {
        const invoiceData = {
            invoiceNo: invoiceNo,
            ewayBillNo: ewayBillNo,
            date: today.toLocaleDateString("en-IN"),
            customer: {
                name: customer ? customer.name : "",
                city: customer ? customer.city : "",
                mobile: customer ? customer.mobile : ""
            },
            products: products,
            totalQty: totalQty,
            subtotal: subtotal,
            grandTotal: grandTotal,
            gstType: gstType,
            gstBreakdown: gstBreakdown,
            amountWords: numberToWords(grandTotal)
        };

        localStorage.setItem("currentInvoice", JSON.stringify(invoiceData));

        if (grandTotal >= 50000) {
            alert("Final Bill and E-Way Bill Generated Successfully");
        } else {
            alert("Final Bill Generated Successfully");
        }

        window.location.href = "billGenerated.html";
    });

    // Back routing listener bind
    const backBtn = document.getElementById("backBtn");
    if(backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "addProductsbilling.html";
        });
    }
});