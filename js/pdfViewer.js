
// LOAD INVOICE DATA FROM PREVIEW PAGE


window.onload = function () {
    
    const invoice = JSON.parse(localStorage.getItem("currentInvoice"));

    if (!invoice) {
        alert("Invoice Data Not Found. Please generate from the preview page.");
        return;
    }

    
    console.log("INVOICE DATA RECEIVED ON INVOICE PAGE:", invoice);

    
    //  INVOICE NUMBER & DATE
   
    document.getElementById("invoiceNo").textContent = invoice.invoiceNo || "";
    document.getElementById("invoiceDate").textContent = invoice.date || "";

   
    //  CUSTOMER DETAILS (BILLED TO & SHIPPED TO)
    
    // Main Billed To elements
    document.getElementById("customerName").textContent = invoice.customer?.name || "";
    document.getElementById("customerAddress").textContent = invoice.customer?.city || "";
    document.getElementById("customerMobile").textContent = invoice.customer?.mobile || "";

    // Secondary Shipped To elements
    document.getElementById("customerName2").textContent = invoice.customer?.name || "";
    document.getElementById("customerAddress2").textContent = invoice.customer?.city || "";
    document.getElementById("customerMobile2").textContent = invoice.customer?.mobile || "";

    
    //  PRODUCTS & QUANTITY TABLE
    
    const table = document.getElementById("productTable");
    table.innerHTML = "";

    const products = invoice.products || [];
    let totalQtyCount = 0;

    products.forEach((item, index) => {
        const qty = Number(item.qty || 0);
        const price = Number(item.price || 0);
        const amount = qty * price;

        totalQtyCount += qty;

        
        table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.hsn || "8518"}</td>
            <td>${qty} Pcs</td>
            <td>${price.toFixed(2)}</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>${amount.toFixed(2)}</td>
        </tr>
        `;
    });

    // Displaying item totals
    document.getElementById("totalQty").textContent = totalQtyCount + " Pcs";
    document.getElementById("totalPieces").textContent = totalQtyCount + " Pcs";

    
    //  GRAND TOTAL
    
    document.getElementById("grandTotal").textContent = Number(invoice.grandTotal || 0).toFixed(2);

   
    //  GST SUMMARY
    
    document.getElementById("gstPercent").textContent = (invoice.gst || 0) + "%";
    document.getElementById("taxableAmount").textContent = Number(invoice.subtotal || 0).toFixed(2);
    document.getElementById("gstAmount").textContent = Number(invoice.gstAmount || 0).toFixed(2);
    
    // Split GST equally into Central and State taxes (CGST / SGST)
    const splitTax = (Number(invoice.gstAmount || 0) / 2).toFixed(2);
    document.getElementById("cgstAmount").textContent = splitTax;
    document.getElementById("sgstAmount").textContent = splitTax;

   
    //  AMOUNT IN WORDS
    
    document.getElementById("amountWords").textContent = invoice.amountWords || "Zero Rupees Only";
};