// Logout Function

function logout() {

```
const confirmLogout = confirm(
    "Are you sure you want to logout?"
);

if (confirmLogout) {

    alert("Logged out successfully!");

    window.location.href = "index.html";
}
```

}

// Optional Dashboard Data

document.addEventListener("DOMContentLoaded", function () {

```
console.log("Dashboard Loaded");
```

});

// Card Animation

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

```
card.addEventListener("mouseenter", () => {

    card.style.transform = "translateY(-5px)";
    card.style.transition = "0.3s";

});

card.addEventListener("mouseleave", () => {

    card.style.transform = "translateY(0px)";

});
```

});
