document.addEventListener("DOMContentLoaded", () => {
    let invoice;
    try {
        invoice = JSON.parse(localStorage.getItem("currentInvoice"));
    } catch (e) {
        invoice = null;
    }

    if (!invoice) {
        alert("Invoice not found.");
        window.location.href = "createBill.html";
        return;
    }

document.getElementById("invoiceNo").textContent = invoice.invoiceNo;
document.getElementById("customerName").textContent = invoice.customer.name;
document.getElementById("subtotal").textContent = "₹" + Number(invoice.subtotal).toFixed(2);
document.getElementById("totalAmount").textContent = "₹" + Number(invoice.grandTotal).toFixed(2);

const cgstAmt = Number(invoice.cgstAmount) || 0;
const sgstAmt = Number(invoice.sgstAmount) || 0;
const igstAmt = Number(invoice.igstAmount) || 0;

if (cgstAmt > 0) {
    document.getElementById("cgstAmount").textContent = "₹" + cgstAmt.toFixed(2);
} else {
    document.getElementById("cgstRow").style.display = "none";
}

if (sgstAmt > 0) {
    document.getElementById("sgstAmount").textContent = "₹" + sgstAmt.toFixed(2);
} else {
    document.getElementById("sgstRow").style.display = "none";
}

if (igstAmt > 0) {
    document.getElementById("igstAmount").textContent = "₹" + igstAmt.toFixed(2);
} else {
    document.getElementById("igstRow").style.display = "none";
}

const ewayRow = document.getElementById("ewayRow");
if (invoice.ewayBillNo) {
    ewayRow.style.display = "flex";
    document.getElementById("ewayBillNo").textContent = invoice.ewayBillNo;
}

document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "createBill.html";
});

document.getElementById("newBillBtn").addEventListener("click", () => {
    localStorage.removeItem("currentInvoice");
    window.location.href = "createBill.html";
});

document.getElementById("pdfBtn").addEventListener("click", () => {
    window.location.href = "pdfViewer.html";
});

document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
});

    console.log("Bill Generated Successfully");
});