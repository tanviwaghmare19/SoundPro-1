// ======================================
// Invoice Number & Date
// ======================================

const invoiceNo = "INV" + Date.now();

document.getElementById("invoiceNumber").textContent = invoiceNo;

const today = new Date();

document.getElementById("invoiceDate").textContent =
today.toLocaleDateString("en-IN");

// ======================================
// Customer Details
// ======================================

const customer =
JSON.parse(localStorage.getItem("selectedCustomer"));

<<<<<<< HEAD
if (customer) {

    document.getElementById("customerName").textContent =
        customer.name;

    document.getElementById("customerMobile").innerHTML =
        '<i class="fa fa-phone"></i> ' + customer.mobile;

    document.getElementById("customerCity").innerHTML =
        '<i class="fa fa-location-dot"></i> ' + customer.city;

    const avatar =
        document.getElementById("customerAvatar");

    if (avatar) {

        avatar.className =
            "avatar " + customer.color;

        avatar.innerHTML =
            '<i class="fas fa-user"></i>';
    }
=======
if(customer){

    document.getElementById("customerName").textContent =
    customer.name;

    document.getElementById("customerMobile").innerHTML =
    '<i class="fa fa-phone"></i> ' + customer.mobile;

    document.getElementById("customerCity").innerHTML =
    '<i class="fa fa-location-dot"></i> ' + customer.city;

    const avatar =
    document.getElementById("customerAvatar");

    avatar.className =
    "avatar " + customer.color;

    avatar.innerHTML =
    '<i class="fas fa-user"></i>';

>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
}

// ======================================
// Products
// ======================================

const products =
JSON.parse(localStorage.getItem("selectedProducts")) || [];

const productContainer =
document.getElementById("productContainer");

let subtotal = 0;
let totalQty = 0;

<<<<<<< HEAD
products.forEach(product => {
=======
products.forEach(product=>{
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

    const qty = Number(product.qty);
    const price = Number(product.price);

    const amount = qty * price;

    subtotal += amount;
<<<<<<< HEAD
=======

>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
    totalQty += qty;

    productContainer.innerHTML += `

    <div class="product-row">

        <span>${product.name}</span>

        <span>${qty}</span>

        <span>₹${price.toFixed(2)}</span>

        <span>₹${amount.toFixed(2)}</span>

    </div>

    `;
<<<<<<< HEAD
});

// ======================================
// Tax Calculation
// ======================================

const cgst =
Number(localStorage.getItem("cgst")) || 0;

const sgst =
Number(localStorage.getItem("sgst")) || 0;

const igst =
Number(localStorage.getItem("igst")) || 0;

const cgstAmount =
subtotal * cgst / 100;

const sgstAmount =
subtotal * sgst / 100;

const igstAmount =
subtotal * igst / 100;
=======

});

// ======================================
// Discount
// ======================================

const discount = 0;

// ======================================
// GST
// ======================================

const gst =
Number(localStorage.getItem("gst")) || 0;

const gstAmount =
(subtotal-discount) * gst / 100;
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

// ======================================
// Grand Total
// ======================================

const grandTotal =
<<<<<<< HEAD
subtotal +
cgstAmount +
sgstAmount +
igstAmount;
=======
(subtotal-discount)+gstAmount;
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

// ======================================
// Display Summary
// ======================================

document.getElementById("subtotal").textContent =
<<<<<<< HEAD
"₹" + subtotal.toFixed(2);

if (document.getElementById("cgstAmount")) {

    document.getElementById("cgstAmount").textContent =
        "₹" + cgstAmount.toFixed(2);
}

if (document.getElementById("sgstAmount")) {

    document.getElementById("sgstAmount").textContent =
        "₹" + sgstAmount.toFixed(2);
}

if (document.getElementById("igstAmount")) {

    document.getElementById("igstAmount").textContent =
        "₹" + igstAmount.toFixed(2);
}

document.getElementById("grandTotal").textContent =
"₹" + grandTotal.toFixed(2);
=======
"₹"+subtotal.toFixed(2);

document.getElementById("discount").textContent =
"₹"+discount.toFixed(2);

if(gst===0){

    document.getElementById("gstTitle").textContent =
    "No GST";

}else{

    document.getElementById("gstTitle").textContent =
    "GST ("+gst+"%)";

}

document.getElementById("gstAmount").textContent =
"₹"+gstAmount.toFixed(2);

document.getElementById("grandTotal").textContent =
"₹"+grandTotal.toFixed(2);
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

// ======================================
// Amount in Words
// ======================================

<<<<<<< HEAD
function numberToWords(num) {

    return "Indian Rupees " +
        Math.round(num) +
        " Only";
=======
function numberToWords(num){

    return "Indian Rupees " +
    Math.round(num) +
    " Only";

>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
}

// ======================================
// Generate Final Bill
// ======================================

<<<<<<< HEAD
document.getElementById("finalBillBtn")
.addEventListener("click", () => {

    const invoiceData = {
=======
document.getElementById("finalBillBtn").addEventListener("click",()=>{

    const invoiceData={
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

        invoiceNo: invoiceNo,

        date:
<<<<<<< HEAD
            today.toLocaleDateString("en-IN"),

        customer: {
=======
        today.toLocaleDateString("en-IN"),

        customer:{
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

            name: customer ? customer.name : "",

            city: customer ? customer.city : "",

            mobile: customer ? customer.mobile : ""

        },

        products: products,

        totalQty: totalQty,

        subtotal: subtotal,

<<<<<<< HEAD
        cgst: cgst,
        sgst: sgst,
        igst: igst,

        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount,
=======
        gst: gst,

        gstAmount: gstAmount,
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

        grandTotal: grandTotal,

        amountWords:
<<<<<<< HEAD
            numberToWords(grandTotal)
=======
        numberToWords(grandTotal)
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5

    };

    localStorage.setItem(
        "currentInvoice",
        JSON.stringify(invoiceData)
    );

    console.log("Invoice Saved");

    console.log(invoiceData);

    window.location.href =
<<<<<<< HEAD
        "billGenerated.html";

});
=======
    "billGenerated.html";

});
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
