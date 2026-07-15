// --- 1. LOCALSTORAGE DATA EXTRACTION ---
const invoice = JSON.parse(localStorage.getItem("currentInvoice"));

if (!invoice) {
    alert("Invoice not found! Redirecting...");
    window.location.href = "billGenerated.html";
}

// --- 2. INVOICE META FILLING ---
document.getElementById("docNo").textContent = invoice.invoiceNo || "";
document.getElementById("docDate").textContent = invoice.date || "";

document.getElementById("ewayNo").textContent = "EW" + Date.now();
document.getElementById("generatedDate").textContent = new Date().toLocaleString("en-IN");
document.getElementById("generatedBy").textContent = "27BUPPG3886C1ZC";
document.getElementById("supplyType").textContent = "Outward Supply";

document.getElementById("customerName").textContent = invoice.customer.name || "";
document.getElementById("customerAddress").textContent = invoice.customer.city || "";
document.getElementById("customerMobile").textContent = invoice.customer.mobile || "";

// --- 3. DYNAMIC GOODS TABLE RENDERING ---
const tbody = document.getElementById("goodsTable");
tbody.innerHTML = "";

const cgstAmt = Number(invoice.cgstAmount) || 0;
const sgstAmt = Number(invoice.sgstAmount) || 0;
const igstAmt = Number(invoice.igstAmount) || 0;
const totalGst = cgstAmt + sgstAmt + igstAmt || Number(invoice.gstAmount) || 0;
const gstRate = totalGst > 0 ? (totalGst / Number(invoice.subtotal) * 100).toFixed(1) : (invoice.gst || "18");

invoice.products.forEach(product => {
    const amount = Number(product.qty) * Number(product.price);

    tbody.innerHTML += `
    <tr>
        <td>${product.hsn || "8518"}</td>
        <td>${product.name}</td>
        <td>${product.qty}</td>
        <td>${Number(product.price).toFixed(2)}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${gstRate}%</td>
    </tr>
    `;
});

// --- 4. SUMMARY PRICING DETAILS ---
document.getElementById("taxableAmount").textContent = Number(invoice.subtotal).toFixed(2);
document.getElementById("gstAmount").textContent = totalGst.toFixed(2);

document.getElementById("totalInvoiceAmount").textContent = Number(invoice.grandTotal).toFixed(2);

// --- 5. AMOUNT TO WORDS SYSTEM (INDIAN CURRENCY FORMAT) ---
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
document.getElementById("amountWords").textContent = numberToWords(invoice.grandTotal);

// --- 6. OPTIMIZED HIGH-SPEED DATA QR INJECTION ---
const qrElement = document.getElementById("qrCode");
if (qrElement) {
    qrElement.innerHTML = "";
    
    let itemsStr = "";
    (invoice.products || []).forEach((p, i) => {
        const qty = Number(p.qty || 0);
        const rate = Number(p.price || 0);
        const amount = qty * rate;
        const itemGst = invoice.subtotal > 0
            ? Math.round(amount * totalGst / Number(invoice.subtotal))
            : 0;
        const name = (p.name || "").length > 14 ? (p.name || "").substring(0, 14) : (p.name || "");
        itemsStr += `${i+1}  ${name.padEnd(14)} ${(p.hsn||"8518").padEnd(4)} ${String(qty).padStart(3)} ${String(rate).padStart(6)} ${String(itemGst).padStart(5)} ${String(amount).padStart(6)}\n`;
    });

    const qrPayload =
`            TAX INVOICE
────────────────────────────────
Inv No : ${invoice.invoiceNo || ""}
Date   : ${invoice.date || ""}

AudioTonic Traders
GSTIN : 27BUPPG3886C1ZC

Customer : ${invoice.customer?.name || ""}
Phone    : ${invoice.customer?.mobile || ""}

#  Name           Code  Qty  Rate    GST   Total
─────────────────────────────────────────────
${itemsStr}─────────────────────────────────────────────
Subtotal                        ${String(Number(invoice.subtotal||0)).padStart(6)}
Total GST                       ${String(totalGst).padStart(6)}
Grand Total              ₹${Number(invoice.grandTotal||0).toFixed(2).padStart(10)}`;

    new QRCode(qrElement, {
        text: qrPayload,
        width: 120,
        height: 120,
        correctLevel: QRCode.CorrectLevel.M
    });
}