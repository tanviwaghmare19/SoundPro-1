const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".customer-card").forEach(card => {
            const text = (
                (card.dataset.name || "") +
                (card.dataset.mobile || "") +
                (card.dataset.code || "")
            ).toLowerCase();
            card.style.display = text.includes(value) ? "flex" : "none";
        });
    });
}

const customerList = document.getElementById("customerList");

if (customerList) {
    customerList.addEventListener("click", function (e) {
        const card = e.target.closest(".customer-card");
        if (!card) return;

        const customer = {
            id: card.dataset.code || "",
            name: card.dataset.name || "",
            mobile: card.dataset.mobile || "",
            city: card.dataset.city || "",
            color: card.dataset.color || "purple"
        };

        localStorage.setItem("selectedCustomer", JSON.stringify(customer));
        window.location.href = "addProductsbilling.html";
    });

    customerList.addEventListener("click", function (e) {
        const deleteBtn = e.target.closest(".delete-customer-btn");
        if (!deleteBtn) return;
        e.stopPropagation();

        const id = deleteBtn.dataset.id;
        const card = deleteBtn.closest(".customer-card");
        const name = card?.dataset.name || "this customer";

        if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

        fetch(`/api/clients/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    alert(data.message || 'Failed to delete customer');
                    return;
                }
                loadRecentCustomers();
            })
            .catch(err => {
                console.error('Delete error:', err);
                alert('Something went wrong while deleting customer');
            });
    });
}

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

const saveBtn = document.getElementById('saveCustomerBtn');

if (saveBtn) {
    saveBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const customer_name = document.getElementById('customerName').value.trim();
        const customer_phone = document.getElementById('customerMobile').value.trim();
        const customer_address = document.getElementById('customerAddress').value.trim();
        const company_name = document.getElementById('customerCompany').value.trim();

        if (!customer_name || !customer_phone) {
            alert('Please enter customer name and contact number');
            return;
        }

        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name,
                    customer_phone,
                    customer_address,
                    company_name,
                    user_email: localStorage.getItem('userEmail') || 'admin@soundpro.com'
                })
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message || 'Failed to save customer');
                return;
            }

            alert('Customer saved successfully!');
            document.getElementById('customerModal').style.display = 'none';
            document.getElementById('customerName').value = '';
            document.getElementById('customerMobile').value = '';
            document.getElementById('customerAddress').value = '';
            document.getElementById('customerCompany').value = '';
            loadRecentCustomers();

        } catch (err) {
            console.error(err);
            alert('Something went wrong while saving customer');
        }
    });
}

const menuBtn = document.querySelector(".menu-btn");
if (menuBtn) {
    menuBtn.addEventListener("click", toggleSidebar);
}

const backBtn = document.querySelector(".back-btn");
if (backBtn) {
    backBtn.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });
}

async function loadRecentCustomers() {
    try {
        const res = await fetch('/api/clients');
        const data = await res.json();
        if (!data.success) return;

        const container = document.getElementById('customerList');
        container.innerHTML = '';

        data.clients.forEach(client => {
            const card = document.createElement('div');
            card.className = 'customer-card';
            card.dataset.name = client.customer_name;
            card.dataset.mobile = client.customer_phone;
            card.dataset.city = client.customer_address || '';
            card.dataset.code = client.id;
            card.dataset.color = 'purple';
            card.innerHTML = `
                <div class="customer-left">
                    <div class="avatar purple"><i class="fas fa-user"></i></div>
                    <div class="details">
                        <h4>${client.customer_name}</h4>
                        <p>${client.customer_phone}</p>
                        <span>${client.company_name || ''}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="delete-customer-btn" data-id="${client.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load customers:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadRecentCustomers);
