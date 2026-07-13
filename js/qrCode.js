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
document.getElementById("cgstAmount").textContent = (cgstAmt || totalGst / 2).toFixed(2);
document.getElementById("sgstAmount").textContent = (sgstAmt || totalGst / 2).toFixed(2);
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
// Elements clean up state to match larger scanner scale
const qrElement = document.getElementById("qrCode");
if (qrElement) {
    qrElement.innerHTML = ""; // Old trace lines clear setup
    
    // Core payload generation
    const qrPayload = JSON.stringify({
        Invoice: invoice.invoiceNo,
        Customer: invoice.customer.name,
        Amount: invoice.grandTotal
    });

    // Dynamic QRCode Canvas mapping block for stable dimensional scale
    new QRCode(qrElement, {
        text: qrPayload,
        width: 120,    // High resolution scaling data box diameter
        height: 120,   // High resolution scaling data box diameter
        correctLevel: QRCode.CorrectLevel.M // M level provides reliable standard grid contrast for direct scanning
    });
}