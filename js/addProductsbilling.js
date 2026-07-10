// ===============================
// CUSTOMER DATA
// ===============================

const customer = JSON.parse(
    localStorage.getItem("selectedCustomer")
);

if (customer) {

    document.getElementById("customerName").textContent = customer.name;

    document.getElementById("customerMobile").innerHTML =
        '<i class="fa fa-phone"></i> ' + customer.mobile;

    document.getElementById("customerCity").innerHTML =
        '<i class="fa fa-location-dot"></i> ' + customer.city;

    const avatar = document.getElementById("customerAvatar");

    avatar.className =
        "avatar " + (customer.color || "purple");

    avatar.innerHTML =
        '<i class="fas fa-user"></i>';
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("searchInput");

    const generateBtn =
        document.getElementById("generateBtn");



    // ==========================
    // SEARCH PRODUCT
    // ==========================

    searchInput.addEventListener("input", () => {

        const value =
            searchInput.value.toLowerCase();

        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const productName =
                    row.children[2]
                        .textContent
                        .toLowerCase();

                row.style.display =
                    productName.includes(value)
                        ? ""
                        : "none";

            });

    });



    // ==========================
    // TOTAL CALCULATION
    // ==========================

    function updateGrandTotal() {

        let subtotal = 0;

        document
            .querySelectorAll(".product-row")
            .forEach(row => {

                const checkbox =
                    row.querySelector(".product-select");

                if (
                    checkbox &&
                    !checkbox.checked
                ) {
                    row.querySelector(".amount")
                        .textContent = "0.00";
                    return;
                }

                const rate =
                    parseFloat(
                        row.querySelector(".rate-input").value
                    ) || 0;

                const qty =
                    parseInt(
                        row.querySelector(".qty-input").value
                    ) || 0;

                const amount =
                    rate * qty;

                row.querySelector(".amount")
                    .textContent =
                    amount.toFixed(2);

                subtotal += amount;

            });


        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        const gstRadio =
            document.querySelector(
                'input[name="gstType"]:checked'
            );

        const gstType =
            gstRadio
                ? gstRadio.value
                : "none";


        if (gstType === "cgstsgst") {

            cgst = subtotal * 0.09;
            sgst = subtotal * 0.09;

        }

        else if (gstType === "igst") {

            igst = subtotal * 0.18;

        }

        const netTotal =
            subtotal +
            cgst +
            sgst +
            igst;


        document.getElementById(
            "grandTotal"
        ).textContent =
            "₹" + subtotal.toFixed(2);

        document.getElementById(
            "cgstAmount"
        ).textContent =
            "₹" + cgst.toFixed(2);

        document.getElementById(
            "sgstAmount"
        ).textContent =
            "₹" + sgst.toFixed(2);

        document.getElementById(
            "igstAmount"
        ).textContent =
            "₹" + igst.toFixed(2);

        document.getElementById(
            "netTotal"
        ).textContent =
            "₹" + netTotal.toFixed(2);
    }
    // ==========================
// UPDATE SERIAL NUMBERS
// ==========================

function updateSerialNumbers() {

    const rows =
        document.querySelectorAll(".product-row");

    rows.forEach((row, index) => {

        row.children[1].textContent = index + 1;

    });

}

    // ==========================
    // RATE / QTY CHANGE
    // ==========================

    document
        .querySelectorAll(
            ".rate-input, .qty-input"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                updateGrandTotal
            );

        });



    // ==========================
    // GST CHANGE
    // ==========================

    document
        .querySelectorAll(
            'input[name="gstType"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                updateGrandTotal
            );

        });



    // ==========================
    // PRODUCT SELECT
    // ==========================

    document
        .querySelectorAll(
            ".product-select"
        )
        .forEach(box => {

            box.addEventListener(
                "change",
                updateGrandTotal
            );

        });



    // ==========================
    // DELETE PRODUCT
    // ==========================

    document
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    if (
                        confirm(
                            "Remove this product?"
                        )
                    ) {

                        btn
                         .closest(".product-row")
                         .remove();

                        updateSerialNumbers();

                        updateGrandTotal();

                    }

                }
            );

        });
            // ==========================
    // GENERATE BILL
    // ==========================

    generateBtn.addEventListener(
        "click",
        () => {

            const products = [];

            let subtotal = 0;

            document
                .querySelectorAll(".product-row")
                .forEach(row => {

                    const checkbox =
                        row.querySelector(
                            ".product-select"
                        );

                    if (
                        checkbox &&
                        !checkbox.checked
                    ) {
                        return;
                    }

                    const productName =
                        row.children[2].textContent;

                    const rate =
                        parseFloat(
                            row.querySelector(
                                ".rate-input"
                            ).value
                        ) || 0;

                    const qty =
                        parseInt(
                            row.querySelector(
                                ".qty-input"
                            ).value
                        ) || 0;

                    const amount =
                        rate * qty;

                    subtotal += amount;

                    products.push({
                        name: productName,
                        price: rate,
                        qty: qty,
                        amount: amount
                    });

                });


            if (
                products.length === 0
            ) {

                alert(
                    "Please select at least one product."
                );

                return;
            }


            let cgst = 0;
            let sgst = 0;
            let igst = 0;

            const gstType =
                document.querySelector(
                    'input[name="gstType"]:checked'
                )?.value || "none";

            if (
                gstType ===
                "cgstsgst"
            ) {

                cgst =
                    subtotal * 0.09;

                sgst =
                    subtotal * 0.09;
            }

            else if (
                gstType === "igst"
            ) {

                igst =
                    subtotal * 0.18;
            }

            const netTotal =
                subtotal +
                cgst +
                sgst +
                igst;


            localStorage.setItem(
                "selectedProducts",
                JSON.stringify(
                    products
                )
            );

            localStorage.setItem(
                "subtotal",
                subtotal
            );

            localStorage.setItem(
                "cgst",
                cgst
            );

            localStorage.setItem(
                "sgst",
                sgst
            );

            localStorage.setItem(
                "igst",
                igst
            );

            localStorage.setItem(
                "grandTotal",
                netTotal
            );

            localStorage.setItem(
                "gstType",
                gstType
            );


            window.location.href =
                "billPreview.html";

        }
    );



    // ===============================
    // BOTTOM SHEET TOGGLE
    // ===============================

    const toggleSummary =
        document.getElementById("toggleSummary");

    const bottomSheet =
        document.getElementById("bottomSheet");

    const toggleIcon =
        document.getElementById("toggleIcon");

    toggleSummary.addEventListener(
        "click",
        () => {

            bottomSheet.classList.toggle("show");

            if (
                bottomSheet.classList.contains("show")
            ) {

                toggleIcon.classList.remove(
                    "fa-chevron-up"
                );

                toggleIcon.classList.add(
                    "fa-chevron-down"
                );

            }

            else {

                toggleIcon.classList.remove(
                    "fa-chevron-down"
                );

                toggleIcon.classList.add(
                    "fa-chevron-up"
                );

            }

        }
    );


// FIRST CALCULATION

updateSerialNumbers();

updateGrandTotal();


});



// ===============================
// BACK BUTTON
// ===============================

const backBtn =
    document.querySelector(
        ".back-btn"
    );

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "createBill.html";

        }
    );

}