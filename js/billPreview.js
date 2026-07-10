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

    </div>

    `;
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

// ======================================
// Grand Total
// ======================================

const grandTotal =
subtotal +
cgstAmount +
sgstAmount +
igstAmount;

// ======================================
// Display Summary
// ======================================

document.getElementById("subtotal").textContent =
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

// ======================================
// Amount in Words
// ======================================

function numberToWords(num) {

    return "Indian Rupees " +
        Math.round(num) +
        " Only";
}

// ======================================
// Generate Final Bill
// ======================================

document.getElementById("finalBillBtn")
.addEventListener("click", () => {

    const invoiceData = {

        invoiceNo: invoiceNo,

        date:
            today.toLocaleDateString("en-IN"),

        customer: {

            name: customer ? customer.name : "",

            city: customer ? customer.city : "",

            mobile: customer ? customer.mobile : ""

        },

        products: products,

        totalQty: totalQty,

        subtotal: subtotal,

        cgst: cgst,
        sgst: sgst,
        igst: igst,

        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount,

        grandTotal: grandTotal,

        amountWords:
            numberToWords(grandTotal)

    };

    localStorage.setItem(
        "currentInvoice",
        JSON.stringify(invoiceData)
    );

    console.log("Invoice Saved");

    console.log(invoiceData);

    window.location.href =
        "billGenerated.html";

});