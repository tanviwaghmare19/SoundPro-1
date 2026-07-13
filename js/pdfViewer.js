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

    invoice.products.forEach((item, index) => {

        const qty =
            Number(item.qty) || 0;

        const price =
            Number(item.price) || 0;

        const amount =
            qty * price;

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
            <td>${(invoice.gstAmount / 2).toFixed(2)}</td>
            <td>${(invoice.gstAmount / 2).toFixed(2)}</td>
            <td>${amount.toFixed(2)}</td>
        </tr>
        `;
    });

    document.getElementById("totalQty").textContent = totalQty + " Pcs";
    document.getElementById("totalPieces").textContent = totalQty + " Pcs";
    document.getElementById("grandTotal").textContent = Number(invoice.grandTotal).toFixed(2);

    document.getElementById("gstPercent").textContent = invoice.gst + "%";
    document.getElementById("taxableAmount").textContent = Number(invoice.subtotal).toFixed(2);
    document.getElementById("gstAmount").textContent = Number(invoice.gstAmount).toFixed(2);
    document.getElementById("cgstAmount").textContent = (Number(invoice.gstAmount) / 2).toFixed(2);
    document.getElementById("sgstAmount").textContent = (Number(invoice.gstAmount) / 2).toFixed(2);
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
                    <td class="text-right">${invoice.gst || "18"}</td>
                </tr>
                `;
            });

            // Financial Summaries Mapping
            document.getElementById("ewayTotalTaxable").textContent = Number(invoice.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewayTotalInvAmt").textContent = Number(invoice.grandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewayCGSTAmt").textContent = (Number(invoice.gstAmount) / 2).toLocaleString("en-IN", { minimumFractionDigits: 2 });
            document.getElementById("ewaySGSTAmt").textContent = (Number(invoice.gstAmount) / 2).toLocaleString("en-IN", { minimumFractionDigits: 2 });

    } else {

        ewayPage.style.display = "none";

        document.getElementById("mainEwayNo").textContent =
            "N/A";
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