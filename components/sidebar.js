function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.toggle("active");
}

function openSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.add("active");
}

function closeSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("active");
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        window.location.href = "/LoginPage.html";
    }
}

(function () {
    if (document.getElementById("sidebar")) return;

    var sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    sidebar.id = "sidebar";

    var header = document.createElement("div");
    header.className = "sidebar-header";

    var closeIcon = document.createElement("i");
    closeIcon.className = "fa-solid fa-arrow-left close-sidebar";
    closeIcon.id = "closeSidebar";
    header.appendChild(closeIcon);

    var title = document.createElement("h2");
    title.innerHTML = "AUDIO<span>TONIC</span>";
    header.appendChild(title);

    sidebar.appendChild(header);

    var admin = document.createElement("div");
    admin.className = "admin";

    var adminImg = document.createElement("img");
    adminImg.src = "../assets/admin.png";
    adminImg.className = "admin-img";
    adminImg.id = "adminImage";
    adminImg.alt = "Admin";
    admin.appendChild(adminImg);

    var adminInfo = document.createElement("div");
    adminInfo.className = "admin-info";
    
    var adminName = document.createElement("h3");
    adminName.id = "adminNameSidebar";
    adminName.textContent = "Admin";
    adminInfo.appendChild(adminName);

    var adminRole = document.createElement("p");
    adminRole.textContent = "Administrator";
    adminInfo.appendChild(adminRole);

    admin.appendChild(adminInfo);
    sidebar.appendChild(admin);

    var ul = document.createElement("ul");

    // FIXED ARRAY: Screenshot se bilkul match karta hua
    var pages = [
        ["dashboard.html", "fa-house", "Dashboard"],
        ["products.html", "fa-box", "Products"],
        ["orders.html", "fa-cart-shopping", "Orders"],
        ["reports.html", "fa-file-lines", "Reports"],
        ["salesReport.html", "fa-chart-line", "Sales Report"],
        ["createBill.html", "fa-file-invoice", "Billing"],
        ["returns.html", "fa-rotate-left", "Returns & Refunds"],
        ["settings.html", "fa-gear", "Settings"]
    ];

    pages.forEach(function (page) {
        var li = document.createElement("li");
        li.setAttribute("data-page", page[0].replace(".html", ""));
        var icon = document.createElement("i");
        icon.className = "fa-solid " + page[1];
        li.appendChild(icon);
        
        var span = document.createElement("span");
        span.textContent = page[2];
        li.appendChild(span);

        li.addEventListener("click", function () {
            location.href = page[0];
        });
        ul.appendChild(li);
    });

    sidebar.appendChild(ul);

    var logoutDiv = document.createElement("div");
    logoutDiv.className = "logout";

    var logoutIcon = document.createElement("i");
    logoutIcon.className = "fa-solid fa-right-from-bracket";
    logoutDiv.appendChild(logoutIcon);
    
    var logoutSpan = document.createElement("span");
    logoutSpan.textContent = " Logout";
    logoutDiv.appendChild(logoutSpan);

    logoutDiv.addEventListener("click", logout);
    sidebar.appendChild(logoutDiv);

    document.body.insertBefore(sidebar, document.body.firstChild);

    document.getElementById("closeSidebar").addEventListener("click", closeSidebar);

    var pageFile = window.location.pathname.split("/").pop().replace(".html", "");
    document.querySelectorAll(".sidebar ul li").forEach(function (li) {
        if (li.getAttribute("data-page") === pageFile || (pageFile === "" && li.getAttribute("data-page") === "dashboard")) {
            li.classList.add("active");
        }
    });

    if (!document.querySelector(".menu, .menu-btn, .menu-icon, .sidebar-toggle, .fa-bars")) {
        var btn = document.createElement("div");
        btn.className = "sidebar-float-toggle";
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        btn.style.cssText = "position:fixed;top:12px;left:12px;z-index:10000;width:40px;height:40px;background:#667eea;color:#fff;border:none;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)";
        btn.onclick = toggleSidebar;
        document.body.appendChild(btn);
    }
})();

document.addEventListener("click", function (event) {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    var toggles = document.querySelectorAll(".menu, .menu-btn, .menu-icon, .sidebar-toggle, .sidebar-float-toggle, .fa-bars");
    var isToggle = false;
    toggles.forEach(function (el) {
        if (el.contains(event.target)) isToggle = true;
    });

    if (sidebar.classList.contains("active") && !sidebar.contains(event.target) && !isToggle) {
        sidebar.classList.remove("active");
    }
});