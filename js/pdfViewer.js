window.onload = function () {
    const invoice = JSON.parse(localStorage.getItem("currentInvoice"));

    if (!invoice) {

        alert("Invoice Data Not Found");
        window.location.href = "billPreview.html";
        return;
    }

    console.log("Invoice Loaded:", invoice);

    
    //  ORIGINAL INVOICE RENDER ENGINE//
   
    document.getElementById("invoiceNo").textContent = invoice.invoiceNo || "";
    document.getElementById("invoiceDate").textContent = invoice.date || "";

    document.getElementById("customerName").textContent =
        invoice.customer?.name || "";

    document.getElementById("customerAddress").textContent =
        invoice.customer?.city || "";

    document.getElementById("customerMobile").textContent =
        invoice.customer?.mobile || "";

    document.getElementById("customerName2").textContent =
        invoice.customer?.name || "";

    document.getElementById("customerAddress2").textContent =
        invoice.customer?.city || "";

    document.getElementById("customerMobile2").textContent =
        invoice.customer?.mobile || "";

    // ==========================
    // PRODUCT TABLE
    // ==========================

    const table = document.getElementById("productTable");
    table.innerHTML = "";

    let totalQty = 0;
    const sgstRate = Number(invoice.sgst) || 0;
    const cgstRate = Number(invoice.cgst) || 0;
    const totalGst = Number(invoice.cgstAmount || 0) + Number(invoice.sgstAmount || 0) + Number(invoice.igstAmount || 0);

    invoice.products.forEach((item, index) => {

        const qty =
            Number(item.qty) || 0;

        const price =
            Number(item.price) || 0;

        const amount =
            qty * price;

        totalQty += qty;

        const rowCgst = cgstRate > 0 ? (amount * cgstRate / 100) : 0;
        const rowSgst = sgstRate > 0 ? (amount * sgstRate / 100) : 0;

        table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.hsn || "8518"}</td>
            <td>${qty} Pcs</td>
            <td>${price.toFixed(2)}</td>
            <td>${rowSgst.toFixed(2)}</td>
            <td>${rowCgst.toFixed(2)}</td>
            <td>${amount.toFixed(2)}</td>
        </tr>
        `;
    });

    document.getElementById("totalQty").textContent = totalQty + " Pcs";
    document.getElementById("totalPieces").textContent = totalQty + " Pcs";
    document.getElementById("grandTotal").textContent = Number(invoice.grandTotal).toFixed(2);

    const gstContainer = document.getElementById("gstSummaryContainer");
    if (gstContainer) {
        const breakdown = invoice.gstBreakdown || [];
        if (breakdown.length > 0) {
            const totalRate = breakdown.reduce((s, t) => s + Number(t.rate || 0), 0);
            let html = `<table class="items-table no-border-top"><thead><tr><th rowspan="2">HSN/SAC</th><th rowspan="2">Tax Rate</th><th rowspan="2">Taxable Amt.</th>`;
            breakdown.forEach(t => { html += `<th colspan="2">${t.type}</th>`; });
            html += `<th rowspan="2">Total Tax</th></tr><tr>`;
            breakdown.forEach(() => { html += `<th>Rate</th><th>Amt.</th>`; });
            html += `</tr></thead><tbody><tr><td>8518</td><td>${totalRate}%</td><td>${Number(invoice.subtotal).toFixed(2)}</td>`;
            breakdown.forEach(t => { html += `<td>${t.rate}%</td><td>₹${Number(t.totalAmount || 0).toFixed(2)}</td>`; });
            html += `<td>${totalGst.toFixed(2)}</td></tr></tbody></table>`;
            gstContainer.innerHTML = html;
        }
    }
    document.getElementById("amountWords").textContent = invoice.amountWords || "";

    
    //   e-WAY BILL CONDITION ENGINE (>= 50,000)//
    
    const ewayPage = document.getElementById("ewayBillPage");

    if (ewayPage) {
        if (Number(invoice.grandTotal) >= 50000) {
            ewayPage.style.display = "block";
            document.getElementById("mainEwayNo").textContent = "652066202588";

            // Headers Details
            document.getElementById("ewayDocNo").textContent = invoice.invoiceNo || "";
            document.getElementById("ewayDocDate").textContent = invoice.date || "";
            document.getElementById("ewayAckDate").textContent = invoice.date || "";
            document.getElementById("ewayGenDate").textContent = (invoice.date || "") + " 1:09 PM";
            document.getElementById("ewayValidDate").textContent = invoice.date || "";

            // Dynamic Shipping Data Address
            document.getElementById("ewayCustomerName").textContent = invoice.customer.name || "";
            document.getElementById("ewayShipToAddress").innerHTML = 
                `Behind Majhi Amdar Upendra Shende's office Panchsheel Nagar, ${invoice.customer.city || ""}<br>Mob: ${invoice.customer.mobile || ""}`;

            // Goods Loop Rendering
            const ewayTable = document.getElementById("ewayProducts");
            ewayTable.innerHTML = "";

        invoice.products.forEach(item => {

            const qty =
                Number(item.qty) || 0;

            const rate =
                Number(item.price) || 0;

            const amount =
                qty * rate;

                ewayTable.innerHTML += `
                <tr>
                    <td>${item.hsn || "85184000"}</td>
                    <td>${item.name} & ${item.hsn || "85184000"}</td>
                    <td class="text-center">${qty} <span style="font-weight: normal; font-size: 11px;">NOS</span></td>
                    <td class="text-right">${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td class="text-right">${cgstRate + sgstRate + Number(invoice.igst || 0) || "18"}</td>
                </tr>
                `;
            });

            // Financial Summaries Mapping
            document.getElementById("ewayTotalTaxable").textContent = Number(invoice.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewayTotalInvAmt").textContent = Number(invoice.grandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewayCGSTAmt").textContent = Number(invoice.cgstAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewaySGSTAmt").textContent = Number(invoice.sgstAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

    } else {

        ewayPage.style.display = "none";

        document.getElementById("mainEwayNo").textContent =
            "N/A";
    }
    }

    // --- QR CODE GENERATION ---
    setTimeout(() => {
        if (typeof QRCode === "undefined") {
            console.warn("QRCode library not loaded (CDN failed)");
            return;
        }

        // A. Invoice QR
        const invoiceBox = document.getElementById("largeInvoiceQr");
        if (invoiceBox) {
            invoiceBox.innerHTML = "";
            let itemsStr = "";
            (invoice.products || []).forEach((p, i) => {
                const qty = Number(p.qty || 0);
                const rate = Number(p.price || 0);
                const amount = qty * rate;
                const itemGst = invoice.subtotal > 0
                    ? Math.round(amount * totalGst / Number(invoice.subtotal))
                    : 0;
                const name = (p.name || "").length > 12 ? (p.name || "").substring(0, 12) : (p.name || "");
                itemsStr += ` ${i+1} ${name.padEnd(12)} ${(p.hsn||"8518").padEnd(4)} ${String(qty).padStart(3)} ${String(rate).padStart(5)} ${String(itemGst).padStart(4)} ${String(amount).padStart(6)}\n`;
            });

            const qrRaw =
`TAX INVOICE
==========================
Inv No : ${invoice.invoiceNo || ""}
Date   : ${invoice.date || ""}

AudioTonic Traders
GSTIN : 27BUPPG3886C1ZC

Customer : ${invoice.customer?.name || ""}
Phone    : ${invoice.customer?.mobile || ""}

# Name         Code Qty  Rate  GST  Total
------------------------------------------
${itemsStr}------------------------------------------
Subtotal                ${String(Number(invoice.subtotal||0)).padStart(8)}
Total GST               ${String(totalGst).padStart(8)}
Grand Total       Rs ${Number(invoice.grandTotal||0).toFixed(2).padStart(10)}`;

            try {
                new QRCode(invoiceBox, {
                    text: qrRaw,
                    width: 185,
                    height: 185,
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (e) {
                invoiceBox.textContent = "[QR Error]";
            }
        }

        // B. E-Way Bill QR
        if (Number(invoice.grandTotal) >= 50000) {
            const ewayBox = document.getElementById("ewayQrContainer");
            if (ewayBox) {
                const oldQr = ewayBox.querySelector("div:not(.qr-header-text)");
                if (oldQr) oldQr.remove();
                const oldImg = ewayBox.querySelector("img");
                if (oldImg) oldImg.remove();

                const qrWrap = document.createElement("div");
                qrWrap.style.display = "inline-block";
                ewayBox.appendChild(qrWrap);

                const ewayRaw =
`E-WAY BILL
==========================
EWB No : 652066202588
Inv No : ${invoice.invoiceNo || ""}
Date   : ${invoice.date || ""}

From : AHMEDABAD
To   : ${invoice.customer?.city || ""}
Dist : 872 KM

Customer : ${invoice.customer?.name || ""}
Amount   : Rs ${Number(invoice.grandTotal||0).toFixed(2)}`;

                try {
                    new QRCode(qrWrap, {
                        text: ewayRaw,
                        width: 165,
                        height: 165,
                        correctLevel: QRCode.CorrectLevel.M
                    });
                } catch (e) {
                    qrWrap.textContent = "[QR Error]";
                }
            }
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get("print") === "1") {
            setTimeout(() => window.print(), 300);
        }
    }, 400);
};