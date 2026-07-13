window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const urlData = urlParams.get("data");
    const invoice = urlData ? JSON.parse(decodeURIComponent(urlData)) : JSON.parse(localStorage.getItem("currentInvoice"));

    if (!invoice) {
        alert("Invoice Data Not Found");
        window.location.href = "billPreview.html";
        return;
    }

    // --- 1. TAX RATES & CALCULATIONS ---
    const cgstAmt = Number(invoice.cgstAmount) || 0;
    const sgstAmt = Number(invoice.sgstAmount) || 0;
    const igstAmt = Number(invoice.igstAmount) || 0;
    const totalGst = cgstAmt + sgstAmt + igstAmt || Number(invoice.gstAmount) || 0;

    const igstRate = Number(invoice.igst) || 0;
    const cgstRate = Number(invoice.cgst) || 0;
    const sgstRate = Number(invoice.sgst) || 0;
    const gstRate = totalGst > 0 ? (totalGst / Number(invoice.subtotal) * 100) : (Number(invoice.gst) || 0);

    // --- 2. INVOICE TOP DETAILS ---
    document.getElementById("invoiceNo").textContent = invoice.invoiceNo || "";
    document.getElementById("invoiceDate").textContent = invoice.date || "";

    document.getElementById("customerName").textContent = invoice.customer.name || "";
    document.getElementById("customerAddress").textContent = invoice.customer.city || "";
    document.getElementById("customerMobile").textContent = invoice.customer.mobile || "";

    document.getElementById("customerName2").textContent = invoice.customer.name || "";
    document.getElementById("customerAddress2").textContent = invoice.customer.city || "";
    document.getElementById("customerMobile2").textContent = invoice.customer.mobile || "";

    // --- 3. ITEMS TABLE POPULATION ---
    const table = document.getElementById("productTable");
    table.innerHTML = "";
    let totalQty = 0;

    invoice.products.forEach((item, index) => {
        const qty = Number(item.qty);
        const price = Number(item.price);
        const amount = qty * price;
        totalQty += qty;

        const rowSgst = (amount * sgstRate / 100) || (totalGst > 0 ? totalGst / 2 / invoice.products.length : 0);
        const rowCgst = (amount * cgstRate / 100) || (totalGst > 0 ? totalGst / 2 / invoice.products.length : 0);

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

    // --- 4. INVOICE SUMMARY & TOTALS ---
    document.getElementById("totalQty").textContent = totalQty + " Pcs";
    document.getElementById("totalPieces").textContent = totalQty + " Pcs";
    document.getElementById("grandTotal").textContent = Number(invoice.grandTotal).toFixed(2);

    document.getElementById("gstPercent").textContent = gstRate.toFixed(1) + "%";
    document.getElementById("taxableAmount").textContent = Number(invoice.subtotal).toFixed(2);
    document.getElementById("gstAmount").textContent = totalGst.toFixed(2);
    document.getElementById("cgstAmount").textContent = cgstAmt.toFixed(2);
    document.getElementById("sgstAmount").textContent = sgstAmt.toFixed(2);
    document.getElementById("amountWords").textContent = invoice.amountWords || "";

    // --- 5. E-WAY BILL HANDLING ---
    const ewayPage = document.getElementById("ewayBillPage");

    if (ewayPage) {
        if (Number(invoice.grandTotal) >= 50000) {
            ewayPage.style.display = "block";
            document.getElementById("mainEwayNo").textContent = invoice.ewayBillNo || "652066202588";

            document.getElementById("ewayDocNo").textContent = invoice.invoiceNo || "";
            document.getElementById("ewayDocDate").textContent = invoice.date || "";
            document.getElementById("ewayAckDate").textContent = invoice.date || "";
            document.getElementById("ewayGenDate").textContent = (invoice.date || "") + " 1:09 PM";
            document.getElementById("ewayValidDate").textContent = invoice.date || "";

            document.getElementById("ewayCustomerName").textContent = invoice.customer.name || "";
            document.getElementById("ewayShipToAddress").innerHTML = 
                `Behind Majhi Amdar Upendra Shende's office Panchsheel Nagar, ${invoice.customer.city || ""}<br>Mob: ${invoice.customer.mobile || ""}`;

            const ewayTable = document.getElementById("ewayProducts");
            ewayTable.innerHTML = "";

            invoice.products.forEach((item) => {
                const qty = Number(item.qty);
                const rate = Number(item.price);
                const amount = qty * rate;

                ewayTable.innerHTML += `
                <tr>
                    <td>${item.hsn || "85184000"}</td>
                    <td>${item.name} & ${item.hsn || "85184000"}</td>
                    <td class="text-center">${qty} <span style="font-weight: normal; font-size: 11px;">NOS</span></td>
                    <td class="text-right">${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td class="text-right">${gstRate.toFixed(1)}</td>
                </tr>
                `;
            });

            document.getElementById("ewayTotalTaxable").textContent = Number(invoice.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewayTotalInvAmt").textContent = Number(invoice.grandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewayCGSTAmt").textContent = cgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewaySGSTAmt").textContent = sgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 });

        } else {
            ewayPage.style.display = "none";
            document.getElementById("mainEwayNo").textContent = "N/A";
        }
    }

    // --- ENHANCED MAXIMUM DIMENSION LOGIC FOR BOTH PAGES ---
    setTimeout(() => {
        const currentOrigin = window.location.origin; 
        
        // A. Extra-Large Tax Invoice QR Rendering (Right Float Container Box)
        const invoiceBox = document.getElementById("largeInvoiceQr");
        if (invoiceBox) {
            invoiceBox.innerHTML = ""; 
            
            const invoiceDataStr = encodeURIComponent(JSON.stringify(invoice));
            const realInvoiceUrl = `${currentOrigin}/SoundPro/pages/pdfViewer.html?data=${invoiceDataStr}`;
            
            new QRCode(invoiceBox, {
                text: realInvoiceUrl, 
                width: 185,  // Size increased to massive 185px area for maximum visibility
                height: 185, // Size increased to massive 185px area for maximum visibility
                correctLevel: QRCode.CorrectLevel.H // High-density grid mapping
            });
        }

        // B. E-Way Bill Dynamic Extra-Large QR Injection
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

                const invoiceDataStr = encodeURIComponent(JSON.stringify(invoice));
                const realEwayUrl = `${currentOrigin}/SoundPro/pages/pdfViewer.html?data=${invoiceDataStr}#ewayBillPage`;
                
                new QRCode(qrWrap, {
                    text: realEwayUrl, 
                    width: 165, // Stretches cleanly into the expanded 195px e-way container box
                    height: 165, // Stretches cleanly into the expanded 195px e-way container box
                    correctLevel: QRCode.CorrectLevel.H // High accuracy response block setup
                });
            }
        }
    }, 400);
};