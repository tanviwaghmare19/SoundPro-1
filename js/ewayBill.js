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