// ================================
// DEFAULT PASSWORD
// ================================

if (!localStorage.getItem("adminPassword")) {

    localStorage.setItem("adminPassword", "admin123");

}

// ================================
// BACK BUTTON
// ================================

document.getElementById("backBtn").addEventListener("click", function () {

    window.history.back();

});

// ================================
// SHOW / HIDE PASSWORD
// ================================

const togglePassword = document.querySelectorAll(".togglePassword");

togglePassword.forEach(function (icon) {

    icon.addEventListener("click", function () {

        const input = this.previousElementSibling;

        if (input.type === "password") {

            input.type = "text";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");

        } else {

            input.type = "password";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");

        }

    });

});

// ================================
// PASSWORD STRENGTH
// ================================

const newPassword = document.getElementById("newPassword");

const strengthText = document.getElementById("strengthText");

const lengthRule = document.getElementById("lengthRule");
const upperRule = document.getElementById("upperRule");
const lowerRule = document.getElementById("lowerRule");
const numberRule = document.getElementById("numberRule");
const specialRule = document.getElementById("specialRule");

newPassword.addEventListener("input", function () {

    const password = this.value;

    let score = 0;

    // 8 Characters

    if (password.length >= 8) {

        lengthRule.innerHTML = "✅ Minimum 8 Characters";
        score++;

    } else {

        lengthRule.innerHTML = "❌ Minimum 8 Characters";

    }

    // Uppercase

    if (/[A-Z]/.test(password)) {

        upperRule.innerHTML = "✅ One Uppercase Letter";
        score++;

    } else {

        upperRule.innerHTML = "❌ One Uppercase Letter";

    }

    // Lowercase

    if (/[a-z]/.test(password)) {

        lowerRule.innerHTML = "✅ One Lowercase Letter";
        score++;

    } else {

        lowerRule.innerHTML = "❌ One Lowercase Letter";

    }

    // Number

    if (/[0-9]/.test(password)) {

        numberRule.innerHTML = "✅ One Number";
        score++;

    } else {

        numberRule.innerHTML = "❌ One Number";

    }

    // Special Character

    if (/[^A-Za-z0-9]/.test(password)) {

        specialRule.innerHTML = "✅ One Special Character";
        score++;

    } else {

        specialRule.innerHTML = "❌ One Special Character";

    }

    // Strength

    if (score <= 2) {

        strengthText.innerHTML = "Weak";
        strengthText.style.color = "red";

    }
    else if (score == 3 || score == 4) {

        strengthText.innerHTML = "Medium";
        strengthText.style.color = "orange";

    }
    else {

        strengthText.innerHTML = "Strong";
        strengthText.style.color = "green";

    }

});

// ================================
// CHANGE PASSWORD
// ================================

document.getElementById("changeBtn").addEventListener("click", function () {

    const currentPassword = document.getElementById("currentPassword").value;
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const savedPassword = localStorage.getItem("adminPassword");

    // Current Password

    if (currentPassword !== savedPassword) {

        alert("Current Password is Incorrect.");

        return;

    }

    // Empty Check

    if (
        currentPassword === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    // Password Match

    if (password !== confirmPassword) {

        alert("New Password and Confirm Password do not match.");

        return;

    }

    // Password Validation

    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!regex.test(password)) {

        alert("Password does not meet all requirements.");

        return;

    }

    // Save Password

    localStorage.setItem("adminPassword", password);

    alert("Password Changed Successfully.");

    window.location.href = "settings.html";

});