// --- 1. LOCALSTORAGE SE DATA UTUANA AUR VALIDATION ---
const invoice = JSON.parse(localStorage.getItem("currentInvoice"));

if (!invoice) {
    alert("Invoice not found! Redirecting to preview...");
    window.location.href = "billGenerated.html";
}

// --- 2. BASIC E-WAY META DETAILS POPULATION ---
document.getElementById("ewayDocNo").textContent = invoice.invoiceNo || "";
document.getElementById("ewayDocDate").textContent = invoice.date || "";
document.getElementById("ewayAckDate").textContent = invoice.date || "";
document.getElementById("ewayGenDate").textContent = (invoice.date || "") + " 1:09 PM";
document.getElementById("ewayValidDate").textContent = invoice.date || "";

// --- 3. CUSTOMER & SHIPPED TO DETAILS ---
document.getElementById("ewayCustomerName").textContent = invoice.customer.name || "";
document.getElementById("ewayShipToAddress").innerHTML = 
    `Behind Majhi Amdar Upendra Shende's office Panchsheel Nagar, ${invoice.customer.city || ""}<br>Mob: ${invoice.customer.mobile || ""}`;

// --- 4. GOODS TABLE POPULATION ---
const ewayTable = document.getElementById("ewayProducts");
ewayTable.innerHTML = "";

// Tax Calculations for Rows
const cgstAmt = Number(invoice.cgstAmount) || 0;
const sgstAmt = Number(invoice.sgstAmount) || 0;
const igstAmt = Number(invoice.igstAmount) || 0;
const totalGst = cgstAmt + sgstAmt + igstAmt || Number(invoice.gstAmount) || 0;
const gstRate = totalGst > 0 ? (totalGst / Number(invoice.subtotal) * 100) : (Number(invoice.gst) || 18);

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

// --- 5. FINAL SUMMARY AMOUNTS ---
document.getElementById("ewayTotalTaxable").textContent = Number(invoice.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
document.getElementById("ewayTotalInvAmt").textContent = Number(invoice.grandTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 });
document.getElementById("ewayCGSTAmt").textContent = cgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 });
document.getElementById("ewaySGSTAmt").textContent = sgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 });

// --- 6. STANDALONE BIG QR CODE GENERATION LOGIC ---
// Yeh dynamic timeout handles ensure karega ki script layout rendering ke baad inject ho
setTimeout(() => {
    const currentOrigin = window.location.origin;
    const ewayBox = document.getElementById("ewayQrContainer");

    if (ewayBox) {
        // Purane images aur duplicate canvas elements ko clear karne ke liye
        const oldQr = ewayBox.querySelector("div:not(.qr-header-text)");
        if (oldQr) oldQr.remove();
        const oldImg = ewayBox.querySelector("img");
        if (oldImg) oldImg.remove(); 

        // Naya wrapper create karenge dynamic size structure handle karne ke liye
        const qrWrap = document.createElement("div");
        qrWrap.style.display = "inline-block";
        qrWrap.style.marginTop = "4px";
        ewayBox.appendChild(qrWrap);

        // Dynamic multi-parameter structural payload URL
        const invoiceDataStr = encodeURIComponent(JSON.stringify(invoice));
        const realEwayUrl = `${currentOrigin}/SoundPro/pages/pdfViewer.html?data=${invoiceDataStr}#ewayBillPage`;
        
        // Final QRCode compile instantiation
        new QRCode(qrWrap, {
            text: realEwayUrl, 
            width: 105, // Box element (135px) ke sath scale alignment ke liye optimal size
            height: 105,
            correctLevel: QRCode.CorrectLevel.M // Fast response and standard processing level
        });
    }
}, 300);
