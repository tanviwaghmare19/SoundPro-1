window.onload = function () {

    const invoice =
        JSON.parse(localStorage.getItem("currentInvoice"));

    if (!invoice) {

        alert("Invoice Data Not Found");
        window.location.href = "billPreview.html";
        return;
    }

    console.log("Invoice Loaded:", invoice);

    // ==========================
    // HEADER DETAILS
    // ==========================

    document.getElementById("invoiceNo").textContent =
        invoice.invoiceNo || "";

    document.getElementById("invoiceDate").textContent =
        invoice.date || "";

    // ==========================
    // CUSTOMER DETAILS
    // ==========================

    document.getElementById("customerName").textContent =
        invoice.customer?.name || "";

    document.getElementById("customerAddress").textContent =
        invoice.customer?.city || "";

    document.getElementById("customerMobile").textContent =
        invoice.customer?.mobile || "";

    document.getElementById("customerName2").textContent =
        invoice.customer?.name || "";

    document.getElementById("customerAddress2").textContent =
        invoice.customer?.city || "";

    document.getElementById("customerMobile2").textContent =
        invoice.customer?.mobile || "";

    // ==========================
    // PRODUCT TABLE
    // ==========================

    const table =
        document.getElementById("productTable");

    table.innerHTML = "";

    let totalQty = 0;

    invoice.products.forEach((item, index) => {

        const qty =
            Number(item.qty) || 0;

        const price =
            Number(item.price) || 0;

        const amount =
            qty * price;

        totalQty += qty;

        table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.hsn || "8518"}</td>
            <td>${qty} Pcs</td>
            <td>${price.toFixed(2)}</td>
            <td>${(invoice.cgst || 0).toFixed(2)}</td>
            <td>${(invoice.sgst || 0).toFixed(2)}</td>
            <td>${amount.toFixed(2)}</td>
        </tr>
        `;
    });

    // ==========================
    // TOTALS
    // ==========================

    document.getElementById("totalQty").textContent =
        totalQty + " Pcs";

    document.getElementById("totalPieces").textContent =
        totalQty + " Pcs";

    document.getElementById("grandTotal").textContent =
        Number(invoice.grandTotal || 0).toFixed(2);

    document.getElementById("taxableAmount").textContent =
        Number(invoice.subtotal || 0).toFixed(2);

    document.getElementById("cgstAmount").textContent =
        Number(invoice.cgst || 0).toFixed(2);

    document.getElementById("sgstAmount").textContent =
        Number(invoice.sgst || 0).toFixed(2);

    document.getElementById("gstAmount").textContent =
        (
            Number(invoice.cgst || 0) +
            Number(invoice.sgst || 0) +
            Number(invoice.igst || 0)
        ).toFixed(2);

    document.getElementById("amountWords").textContent =
        invoice.amountWords || "";

    // GST %

    let gstPercent = "0";

    if (invoice.igst > 0) {
        gstPercent = "18";
    }
    else if (
        invoice.cgst > 0 ||
        invoice.sgst > 0
    ) {
        gstPercent = "18";
    }

    document.getElementById("gstPercent").textContent =
        gstPercent + "%";

    // ==========================
    // E-WAY BILL
    // ==========================

    const ewayPage =
        document.getElementById("ewayBillPage");

    if (!ewayPage) return;

    if (Number(invoice.grandTotal) >= 50000) {

        ewayPage.style.display = "block";

        document.getElementById("mainEwayNo").textContent =
            "652066202588";

        document.getElementById("ewayDocNo").textContent =
            invoice.invoiceNo || "";

        document.getElementById("ewayDocDate").textContent =
            invoice.date || "";

        document.getElementById("ewayAckDate").textContent =
            invoice.date || "";

        document.getElementById("ewayGenDate").textContent =
            invoice.date + " 1:09 PM";

        document.getElementById("ewayValidDate").textContent =
            invoice.date || "";

        document.getElementById("ewayCustomerName").textContent =
            invoice.customer?.name || "";

        document.getElementById("ewayShipToAddress").innerHTML =
            `${invoice.customer?.city || ""}
            <br>
            Mob: ${invoice.customer?.mobile || ""}`;

        const ewayTable =
            document.getElementById("ewayProducts");

        ewayTable.innerHTML = "";

        invoice.products.forEach(item => {

            const qty =
                Number(item.qty) || 0;

            const rate =
                Number(item.price) || 0;

            const amount =
                qty * rate;

            ewayTable.innerHTML += `
            <tr>
                <td>${item.hsn || "85184000"}</td>
                <td>${item.name}</td>
                <td>${qty}</td>
                <td>${amount.toFixed(2)}</td>
                <td>${gstPercent}</td>
            </tr>
            `;
        });

        document.getElementById("ewayTotalTaxable").textContent =
            Number(invoice.subtotal || 0).toFixed(2);

        document.getElementById("ewayTotalInvAmt").textContent =
            Number(invoice.grandTotal || 0).toFixed(2);

        document.getElementById("ewayCGSTAmt").textContent =
            Number(invoice.cgst || 0).toFixed(2);

        document.getElementById("ewaySGSTAmt").textContent =
            Number(invoice.sgst || 0).toFixed(2);

    } else {

        ewayPage.style.display = "none";

        document.getElementById("mainEwayNo").textContent =
            "N/A";
    }
};