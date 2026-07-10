
// Load Invoice Details


const invoice = JSON.parse(
    localStorage.getItem("currentInvoice")
);

if (invoice) {

    document.getElementById("invoiceNo").textContent =
        invoice.invoiceNo;

    document.getElementById("customerName").textContent =
        invoice.customer;

    document.getElementById("totalAmount").textContent =
        invoice.totalAmount;
}


// Save Bill


document.getElementById("saveBtn")
.addEventListener("click", () => {

    let history = JSON.parse(
        localStorage.getItem("invoiceHistory")
    ) || [];

    history.push({

        invoiceNo:
            document.getElementById("invoiceNo").textContent,

        customer:
            document.getElementById("customerName").textContent,

        total:
            document.getElementById("totalAmount").textContent,

        date:
            new Date().toLocaleDateString(),

        time:
            new Date().toLocaleTimeString()

    });

    localStorage.setItem(
        "invoiceHistory",
        JSON.stringify(history)
    );

    alert("Bill Saved Successfully");

});


// Home Button

document.getElementById("homeBtn")
.addEventListener("click", () => {

    window.location.href = "createBill.html";

});


// New Bill Button



document.getElementById("newBillBtn")
.addEventListener("click", () => {

    window.location.href = "createBill.html";

});


// Get PDF


document.getElementById("pdfBtn").addEventListener("click",function(){

    window.location.href="pdfViewer.html";

});


// Print Bill


document.getElementById("printBtn")
.addEventListener("click", () => {

    window.print();

});


// Auto Save Current Invoice

const currentInvoice = {

    invoiceNo:
        document.getElementById("invoiceNo").textContent,

    customer:
        document.getElementById("customerName").textContent,

    totalAmount:
        document.getElementById("totalAmount").textContent

};

localStorage.setItem(
    "currentInvoice",
    JSON.stringify(currentInvoice)
);


// Success Message


console.log("Bill Generated Successfully");