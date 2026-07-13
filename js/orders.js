// ===============================
// DUMMY ORDERS DATA
// ===============================

const orders = [

{
    id:1001,
    customer:"Rahul Sharma",
    phone:"9876543210",
    email:"rahul@gmail.com",
    address:"Nagpur, Maharashtra",
    payment:"Paid",
    status:"Delivered",
    total:45000,

    products:[
        {
            name:"Gaming Mouse",
            qty:2,
            price:500
        },

        {
            name:"Mechanical Keyboard",
            qty:1,
            price:3500
        },

        {
            name:"Monitor",
            qty:2,
            price:20000
        }
    ]
},

{
    id:1002,
    customer:"Priya Patel",
    phone:"9988776655",
    email:"priya@gmail.com",
    address:"Pune, Maharashtra",
    payment:"Pending",
    status:"Pending",
    total:22000,

    products:[
        {
            name:"Printer",
            qty:1,
            price:18000
        },

        {
            name:"USB Cable",
            qty:2,
            price:2000
        }
    ]
},

{
    id:1003,
    customer:"Aman Verma",
    phone:"9870011223",
    email:"aman@gmail.com",
    address:"Mumbai",
    payment:"Paid",
    status:"Processing",
    total:18500,

    products:[
        {
            name:"SSD 1TB",
            qty:1,
            price:8500
        },

        {
            name:"RAM 16GB",
            qty:2,
            price:5000
        }
    ]
},

{
    id:1004,
    customer:"Sneha Joshi",
    phone:"9090909090",
    email:"sneha@gmail.com",
    address:"Amravati",
    payment:"Refunded",
    status:"Cancelled",
    total:12000,

    products:[
        {
            name:"Speaker",
            qty:2,
            price:6000
        }
    ]
},

{
    id:1005,
    customer:"Rohit Singh",
    phone:"9999999999",
    email:"rohit@gmail.com",
    address:"Delhi",
    payment:"Paid",
    status:"Delivered",
    total:32000,

    products:[
        {
            name:"CPU",
            qty:1,
            price:32000
        }
    ]
}

];


// ===============================
// CURRENT DATE
// ===============================

function currentDate(){

    return new Date().toLocaleDateString("en-IN",{

        day:"2-digit",
        month:"short",
        year:"numeric"

    });

}


// ===============================
// DISPLAY ORDERS
// ===============================

const container = document.getElementById("ordersContainer");

function displayOrders(data){

    container.innerHTML = "";

    data.forEach(order=>{

        container.innerHTML += `

        <div class="order-card" onclick="openOrder(${order.id})">

            <div class="order-top">

                <div class="order-id">

                    Order #${order.id}

                </div>

                <div class="order-date">

                    ${currentDate()}

                </div>

            </div>

            <div class="customer">

                Customer :
                <span>${order.customer}</span>

            </div>

            <div class="order-bottom">

                <div class="amount">

                    ₹${order.total.toLocaleString()}

                </div>

                <div class="status ${order.status.toLowerCase()}">

                    ${order.status}

                </div>

            </div>

        </div>

        `;

    });

}

displayOrders(orders);
// ===============================
// FILTER BUTTONS
// ===============================

const buttons = document.querySelectorAll(".filter-btn");

buttons.forEach(btn => {

    btn.addEventListener("click", function () {

        buttons.forEach(b => b.classList.remove("active"));

        this.classList.add("active");

        const status = this.dataset.status;

        if (status === "All") {

            displayOrders(orders);

        } else {

            const filteredOrders = orders.filter(order =>

                order.status === status

            );

            displayOrders(filteredOrders);

        }

    });

});


// ===============================
// SEARCH ORDER
// ===============================

document.getElementById("search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const result = orders.filter(order =>

        order.customer.toLowerCase().includes(value) ||

        order.id.toString().includes(value)

    );

    displayOrders(result);

});


// ===============================
// MODAL
// ===============================

const modal = document.getElementById("orderModal");

const modalBody = document.getElementById("modalBody");

const close = document.querySelector(".close");

close.addEventListener("click", function () {

    modal.style.display = "none";

});

window.addEventListener("click", function (e) {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});
<<<<<<< HEAD
=======
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

closeSidebar.addEventListener("click", function () {
    sidebar.classList.remove("active");
});


>>>>>>> ca728161e421dd3d34a0115c61517471e3959553
// ======================================
// LOGOUT
// ======================================
const logoutBtn = document.querySelector(".logout");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {

            window.location.href = "../LoginPage.html";

        }

    });
}

function openOrder(id){

    const order = orders.find(o => o.id === id);

    let rows = "";
    let subtotal = 0;

    order.products.forEach(product=>{

        let total = product.qty * product.price;

        subtotal += total;

        rows += `

        <tr>

            <td>${product.name}</td>

            <td>${product.qty}</td>

            <td>₹${product.price.toLocaleString()}</td>

            <td>₹${total.toLocaleString()}</td>

        </tr>

        `;

    });

    let gst = Math.round(subtotal * 0.18);
    let shipping = 500;
    let discount = 1000;

    let grandTotal = subtotal + gst + shipping - discount;

    modalBody.innerHTML = `

<h2 style="margin-bottom:20px;">
Order #${order.id}
</h2>

<div class="details-section">

<h3>Customer Details</h3>

<p><strong>Name :</strong> ${order.customer}</p>

<p><strong>Phone :</strong> ${order.phone}</p>

<p><strong>Email :</strong> ${order.email}</p>

<p><strong>Address :</strong> ${order.address}</p>

<p><strong>Order Date :</strong> ${currentDate()}</p>

</div>

<hr>

<div class="details-section">

<h3>Payment Details</h3>

<p><strong>Payment Method :</strong> UPI</p>

<p><strong>Payment Status :</strong> ${order.payment}</p>

<p><strong>Delivery Status :</strong>

<span class="status ${order.status.toLowerCase()}">

${order.status}

</span>

</p>

</div>

<hr>

<h3>Products</h3>

<table>

<tr>

<th>Product</th>

<th>Qty</th>

<th>Price</th>

<th>Total</th>

</tr>

${rows}

</table>

<div style="margin-top:20px;font-size:17px;line-height:32px;">

<p><strong>Subtotal :</strong> ₹${subtotal.toLocaleString()}</p>

<p><strong>GST (18%) :</strong> ₹${gst.toLocaleString()}</p>

<p><strong>Shipping :</strong> ₹${shipping.toLocaleString()}</p>

<p><strong>Discount :</strong> ₹${discount.toLocaleString()}</p>

<hr>

<h2 style="color:#ff7a2f;">

Grand Total : ₹${grandTotal.toLocaleString()}

</h2>

</div>

<div style="margin-top:25px;
display:flex;
gap:12px;
flex-wrap:wrap;">

<button class="action-btn">

<i class="fa-solid fa-print"></i>

Print Invoice

</button>

<button class="action-btn">

<i class="fa-solid fa-download"></i>

Download Invoice

</button>

<button class="action-btn close-popup">

Close

</button>

</div>

`;

    modal.style.display = "flex";

    document.querySelector(".close-popup").onclick = function(){

        modal.style.display = "none";

    };

}
// LOAD ADMIN PROFILE
// ================================
const savedProfile = JSON.parse(localStorage.getItem("adminProfile"));

if(savedProfile){

    const adminName = document.getElementById("adminNameSidebar");

    if(adminName){

        adminName.innerText = savedProfile.adminName;

    }

}