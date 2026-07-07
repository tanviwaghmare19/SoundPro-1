// ======================
// LOGIN PROTECTION
// ======================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// ======================
// SIDEBAR TOGGLE
// ======================

function toggleSidebar() {

    const sidebar =
    document.getElementById("sidebar");

    if(sidebar){
        sidebar.classList.toggle("active");
    }
}

// ======================
// CLOSE SIDEBAR
// ======================

document.addEventListener("click", function(event){

    const sidebar =
    document.getElementById("sidebar");

    const menuButton =
    document.querySelector(".menu-title i");

    if(
        sidebar &&
        menuButton &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
    ){
        sidebar.classList.remove("active");
    }

});

// ======================
// LOGOUT
// ======================

function logout(){

    const result = confirm(
        "Are you sure you want to logout?"
    );

    if(result){

        localStorage.removeItem(
            "isLoggedIn"
        );

        window.location.href =
        "login.html";
    }
}

// ======================
// PAGE ANIMATION
// ======================

window.addEventListener("load",()=>{

    const cards =
    document.querySelectorAll(".card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";
        card.style.transform=
        "translateY(20px)";

        setTimeout(()=>{

            card.style.transition=
            "all 0.4s ease";

            card.style.opacity="1";
            card.style.transform=
            "translateY(0)";

        },index*150);

    });

});