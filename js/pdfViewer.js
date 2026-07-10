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

        };

        localStorage.setItem(
            "selectedCustomer",
            JSON.stringify(customer)
        );

        window.location.href = "addProductsbilling.html";

    });

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






