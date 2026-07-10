<<<<<<< HEAD
// ======================
// SEARCH CUSTOMERS
// ======================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll(".customer-card").forEach(card => {

            const text =
                ((card.dataset.name || "") +
                (card.dataset.mobile || "") +
                (card.dataset.code || "")).toLowerCase();

            card.style.display =
                text.includes(value) ? "flex" : "none";

        });

    });
}

// ======================
// CUSTOMER CARD CLICK
// ======================

const customerList = document.getElementById("customerList");

if (customerList) {

    customerList.addEventListener("click", function (e) {

        const card = e.target.closest(".customer-card");

        if (!card) return;

        const customer = {
            name: card.dataset.name || "",
            mobile: card.dataset.mobile || "",
            city: card.dataset.city || "",
            color: card.dataset.color || "purple"
=======
const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".customer-card");

// Live Search

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    cards.forEach(card => {

        const text = (
            card.dataset.name +
            card.dataset.mobile +
            card.dataset.code
        ).toLowerCase();

        card.style.display = text.includes(value) ? "flex" : "none";

    });

});

// Customer Card Click -> Open Add Products Page

cards.forEach(card => {

    card.addEventListener("click", () => {

        const customer = {

            name: card.dataset.name,
            mobile: card.dataset.mobile,
            city: card.dataset.city,
            color: card.dataset.color

>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
        };

        localStorage.setItem(
            "selectedCustomer",
            JSON.stringify(customer)
        );

        window.location.href = "addProductsbilling.html";

    });

<<<<<<< HEAD
}

// ======================
// ADD CUSTOMER POPUP
// ======================

const addCustomerBtn = document.getElementById("addCustomerBtn");
const customerModal = document.getElementById("customerModal");
const closeBtn = document.querySelector(".close-btn");

if (addCustomerBtn && customerModal) {

    addCustomerBtn.addEventListener("click", function () {
        customerModal.style.display = "flex";
    });

}

if (closeBtn && customerModal) {

    closeBtn.addEventListener("click", function () {
        customerModal.style.display = "none";
    });

}

window.addEventListener("click", function (e) {

    if (customerModal && e.target === customerModal) {
        customerModal.style.display = "none";
    }

});

// ======================
// SAVE CUSTOMER
// ======================

const saveCustomerBtn =
    document.getElementById("saveCustomerBtn");

if (saveCustomerBtn) {

    saveCustomerBtn.addEventListener("click", function () {

        const name =
            document.getElementById("customerName").value.trim();

        const mobile =
            document.getElementById("customerMobile").value.trim();

        const address =
            document.getElementById("customerAddress").value.trim();

        const company =
            document.getElementById("customerCompany").value.trim();

        if (!name || !mobile || !address || !company) {

            alert("Please fill all fields");
            return;

        }

        const customerCode =
            "CUST" + Math.floor(1000 + Math.random() * 9000);

        const customerHTML = `
        <div class="customer-card"
             data-name="${name}"
             data-mobile="${mobile}"
             data-city="${address}"
             data-code="${customerCode}"
             data-color="purple">

            <div class="customer-left">

                <div class="avatar purple">
                    <i class="fas fa-user"></i>
                </div>

                <div class="details">
                    <h4>${name}</h4>
                    <p>${mobile}</p>
                    <span>${customerCode}</span>
                </div>

            </div>

            <i class="fas fa-chevron-right"></i>

        </div>
        `;

        customerList.insertAdjacentHTML(
            "beforeend",
            customerHTML
        );

        customerModal.style.display = "none";

        document.getElementById("customerName").value = "";
        document.getElementById("customerMobile").value = "";
        document.getElementById("customerAddress").value = "";
        document.getElementById("customerCompany").value = "";

        alert("Customer Added Successfully");

    });

}

// ======================
// SIDE MENU
// ======================

const menuBtn =
    document.querySelector(".menu-btn");

if (menuBtn) {

    menuBtn.addEventListener("click", function () {

        window.location.href = "dashboard.html";

    });

}

// ======================
// BACK BUTTON
// ======================

const backBtn =
    document.querySelector(".back-btn");

if (backBtn) {

    backBtn.addEventListener("click", function () {

        window.location.href = "dashboard.html";

    });

}
=======
});

// Add New Customer Button

document.getElementById("addCustomerBtn")
.addEventListener("click", () => {

    window.location.href =
`addProductsbilling.html?name=${encodeURIComponent(name)}
&mobile=${encodeURIComponent(mobile)}
&city=${encodeURIComponent(city)}
&code=${encodeURIComponent(code)}
&color=${encodeURIComponent(color)}`;
});
>>>>>>> 0576e7ad4e7adbc3d0442558202571326998f3e5
