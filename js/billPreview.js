document.addEventListener("DOMContentLoaded", () => {
    const invoiceNo = "INV" + Date.now();
    const today = new Date();

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

    const gstType = localStorage.getItem("gstType") || "No GST";
    const gstBreakdown = JSON.parse(localStorage.getItem("gstBreakdown")) || [];
    const dynamicTaxContainer = document.getElementById("dynamicTaxContainer");

    dynamicTaxContainer.innerHTML = "";
    let combinedTaxValue = 0;

    if (gstBreakdown.length > 0) {
        gstBreakdown.forEach(taxItem => {
            const taxAmount = Number(taxItem.totalAmount) || 0;
            combinedTaxValue += taxAmount;

            dynamicTaxContainer.innerHTML += `
                <div class="row">
                    <span>${taxItem.type} (${taxItem.rate}%)</span>
                    <span>₹${taxAmount.toFixed(2)}</span>
                </div>
            `;
        });
    } else {
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

    const grandTotal = subtotal + combinedTaxValue;
    document.getElementById("grandTotal").textContent = "₹" + grandTotal.toFixed(2);

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

    document.getElementById("finalBillBtn").addEventListener("click", () => {
        const cgstEntry = gstBreakdown.find(t => t.type === "CGST");
        const sgstEntry = gstBreakdown.find(t => t.type === "SGST");
        const igstEntry = gstBreakdown.find(t => t.type === "IGST");

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
            amountWords: numberToWords(grandTotal),
            cgst: cgstEntry ? cgstEntry.rate : 0,
            sgst: sgstEntry ? sgstEntry.rate : 0,
            igst: igstEntry ? igstEntry.rate : 0,
            cgstAmount: cgstEntry ? cgstEntry.totalAmount : 0,
            sgstAmount: sgstEntry ? sgstEntry.totalAmount : 0,
            igstAmount: igstEntry ? igstEntry.totalAmount : 0
        };

        localStorage.setItem("currentInvoice", JSON.stringify(invoiceData));

        const cgstAmt = Number(invoiceData.cgstAmount) || 0;
        const sgstAmt = Number(invoiceData.sgstAmount) || 0;
        const igstAmt = Number(invoiceData.igstAmount) || 0;

        let history = JSON.parse(localStorage.getItem("invoiceHistory")) || [];
        history.push({
            invoiceNo: invoiceData.invoiceNo,
            customer: invoiceData.customer.name,
            total: invoiceData.grandTotal,
            date: invoiceData.date,
            time: new Date().toLocaleTimeString()
        });
        localStorage.setItem("invoiceHistory", JSON.stringify(history));

        const stockDeductions = products
            .filter(p => p.id)
            .map(p => ({ id: p.id, qty: p.qty }));

        fetch('/api/bills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                invoice_no: invoiceData.invoiceNo,
                customer_name: invoiceData.customer.name,
                subtotal: invoiceData.subtotal,
                cgst: Number(invoiceData.cgst) || 0,
                sgst: Number(invoiceData.sgst) || 0,
                igst: Number(invoiceData.igst) || 0,
                cgst_amount: cgstAmt,
                sgst_amount: sgstAmt,
                igst_amount: igstAmt,
                discount: 0,
                grand_total: invoiceData.grandTotal,
                products: stockDeductions
            })
        }).then(() => {
            window.location.href = "pdfViewer.html?print=1";
        }).catch(() => {
            window.location.href = "pdfViewer.html?print=1";
        });
    });

    document.getElementById("editBillBtn")?.addEventListener("click", () => {
        window.location.href = "addProductsbilling.html";
    });
});