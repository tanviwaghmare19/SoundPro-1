// =====================================
// Load Current Invoice
// =====================================

const invoice = JSON.parse(localStorage.getItem("currentInvoice"));

if (!invoice) {

    alert("Invoice not found.");

    window.location.href = "createBill.html";

}

// =====================================
// Display Invoice Details
// =====================================

document.getElementById("invoiceNo").textContent =
invoice.invoiceNo;

document.getElementById("customerName").textContent =
invoice.customer.name;

document.getElementById("totalAmount").textContent =
"₹" + Number(invoice.grandTotal).toFixed(2);

// =====================================
// Save Bill History
// =====================================

document.getElementById("saveBtn").addEventListener("click", () => {

    let history =
    JSON.parse(localStorage.getItem("invoiceHistory")) || [];

    history.push({

        invoiceNo: invoice.invoiceNo,

        customer: invoice.customer.name,

        total: invoice.grandTotal,

        date: invoice.date,

        time: new Date().toLocaleTimeString()

    });

    localStorage.setItem(
        "invoiceHistory",
        JSON.stringify(history)
    );

    alert("Bill Saved Successfully");

});

// =====================================
// Home
// =====================================

document.getElementById("homeBtn").addEventListener("click", () => {

    window.location.href = "createBill.html";

});


// New Bill


document.getElementById("newBillBtn").addEventListener("click", () => {

    localStorage.removeItem("currentInvoice");

    window.location.href = "createBill.html";

});


// PDF Viewer


document.getElementById("pdfBtn").addEventListener("click", () => {

    window.location.href = "pdfViewer.html";

});


// Print


document.getElementById("printBtn").addEventListener("click", () => {

    window.print();

});

console.log("Bill Generated Successfully");
