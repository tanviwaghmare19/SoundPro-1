


// Invoice Number & Date



document.getElementById("invoiceNumber").textContent =
"INV" + Date.now();

const today = new Date();

document.getElementById("invoiceDate").textContent =
today.toLocaleDateString("en-IN");



// Customer Details


const customer =
JSON.parse(localStorage.getItem("selectedCustomer"));

if(customer){

    document.getElementById("customerName").textContent =
    customer.name;

    document.getElementById("customerMobile").innerHTML =
    '<i class="fa fa-phone"></i> ' + customer.mobile;

    document.getElementById("customerCity").innerHTML =
    '<i class="fa fa-location-dot"></i> ' + customer.city;

    const avatar =
    document.getElementById("customerAvatar");

    avatar.className = "avatar " + customer.color;

    avatar.innerHTML =
    '<i class="fas fa-user"></i>';

}


// Products



const products =
JSON.parse(localStorage.getItem("selectedProducts")) || [];

const productContainer =
document.getElementById("productContainer");

let subtotal = 0;

products.forEach(product=>{

    const amount =
    product.price * product.qty;

    subtotal += amount;

    productContainer.innerHTML += `

    <div class="product-row">

        <span>${product.name}</span>

        <span>${product.qty}</span>

        <span>₹${product.price}</span>

        <span>₹${amount}</span>

    </div>

    `;

});


// Discount


const discount = 0;

// GST


const gst =
Number(localStorage.getItem("gst")) || 0;

let gstAmount =
(subtotal-discount) * gst / 100;


// Grand Total


const grandTotal =
(subtotal-discount)+gstAmount;


// Display Summary


document.getElementById("subtotal").textContent =
"₹"+subtotal.toFixed(2);

document.getElementById("discount").textContent =
"₹"+discount.toFixed(2);

if(gst==0){

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


// Generate Final Bill

document.getElementById("finalBillBtn").addEventListener("click", () => {

    const invoiceData = {
        invoiceNo: "INV" + Date.now(),
        date: new Date().toLocaleDateString("en-IN"),

        customer: {
            name: customer?.name || "",
            city: customer?.city || "",
            mobile: customer?.mobile || ""
        },

        products: products || [],

        totalQty: totalQty || 0,
        subtotal: subtotal || 0,
        gst: gst || 0,
        gstAmount: gstAmount || 0,
        grandTotal: grandTotal || 0
    };

    localStorage.setItem("currentInvoice", JSON.stringify(invoiceData));

    console.log("Saved Invoice:", invoiceData);

    window.location.href = "billGenerated.html";
});

document.getElementById("finalBillBtn")
.addEventListener("click",()=>{

    window.location.href="billGenerated.html";

});