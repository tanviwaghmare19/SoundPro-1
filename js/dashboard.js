// ======================
// LOGIN PROTECTION
// ======================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../LoginPage.html";
}

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
        "../LoginPage.html";
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