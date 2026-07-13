<<<<<<< HEAD
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
=======
// ===============================
// LOAD INVOICE
// ===============================

const invoice = JSON.parse(localStorage.getItem("currentInvoice"));

if (!invoice) {
    alert("Invoice not found");
    window.location.href = "billGenerated.html";
}

// ===============================
// HEADER DETAILS
// ===============================

document.getElementById("docNo").textContent =
invoice.invoiceNo;

document.getElementById("docDate").textContent =
invoice.date;

// ===============================
// EWAY BILL DETAILS
// ===============================

document.getElementById("ewayNo").textContent =
"EW" + Date.now();

document.getElementById("generatedDate").textContent =
new Date().toLocaleString("en-IN");

document.getElementById("generatedBy").textContent =
"27BUPPG3886C1ZC";

document.getElementById("supplyType").textContent =
"Outward Supply";

// ===============================
// CUSTOMER DETAILS
// ===============================

document.getElementById("customerName").textContent =
invoice.customer.name;

document.getElementById("customerAddress").textContent =
invoice.customer.city;

document.getElementById("customerMobile").textContent =
invoice.customer.mobile;

// ===============================
// GOODS TABLE
// ===============================

const tbody =
document.getElementById("goodsTable");

tbody.innerHTML = "";

invoice.products.forEach(product=>{

const amount =
Number(product.qty) * Number(product.price);

tbody.innerHTML += `

<tr>

<td>${product.hsn || "8518"}</td>

<td>${product.name}</td>

<td>${product.qty}</td>

<td>${Number(product.price).toFixed(2)}</td>

<td>${amount.toFixed(2)}</td>

<td>${invoice.gst}%</td>

</tr>

`;

});

// ===============================
// SUMMARY
// ===============================

document.getElementById("taxableAmount").textContent =
Number(invoice.subtotal).toFixed(2);

document.getElementById("gstAmount").textContent =
Number(invoice.gstAmount).toFixed(2);

document.getElementById("cgstAmount").textContent =
(Number(invoice.gstAmount) / 2).toFixed(2);

document.getElementById("sgstAmount").textContent =
(Number(invoice.gstAmount) / 2).toFixed(2);

document.getElementById("totalInvoiceAmount").textContent =
Number(invoice.grandTotal).toFixed(2);

// ===============================
// QR CODE
// ===============================

QRCode.toCanvas(
    document.getElementById("qrCode"),
    JSON.stringify({
        Invoice: invoice.invoiceNo,
        Customer: invoice.customer.name,
        Amount: invoice.grandTotal
    }),
    function (error) {
        if (error) console.error(error);
    }
);

// ===============================
// NUMBER TO WORDS
// ===============================

function numberToWords(num){

const a=[
"",
"One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
"Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen",
"Sixteen","Seventeen","Eighteen","Nineteen"
];

const b=[
"",
"",
"Twenty",
"Thirty",
"Forty",
"Fifty",
"Sixty",
"Seventy",
"Eighty",
"Ninety"
];

function convert(n){

if(n<20) return a[n];

if(n<100)
return b[Math.floor(n/10)] +
(n%10 ? " "+a[n%10] : "");

if(n<1000)
return a[Math.floor(n/100)] +
" Hundred " +
convert(n%100);

if(n<100000)
return convert(Math.floor(n/1000)) +
" Thousand " +
convert(n%1000);

if(n<10000000)
return convert(Math.floor(n/100000)) +
" Lakh " +
convert(n%100000);

return convert(Math.floor(n/10000000)) +
" Crore " +
convert(n%10000000);

}

return "Indian Rupees " +
convert(Math.round(num)).trim() +
" Only";

}

document.getElementById("amountWords").textContent =
numberToWords(invoice.grandTotal);

// ===============================
// PRINT
// ===============================

// Uncomment if you want the print dialog to open automatically
// window.print();
>>>>>>> ca728161e421dd3d34a0115c61517471e3959553
