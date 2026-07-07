// ================================
// BACK BUTTON
// ================================

document.getElementById("backBtn").addEventListener("click", function () {

    window.history.back();

});

// ================================
// ELEMENTS
// ================================

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const adminName = document.getElementById("adminName");
const mobile = document.getElementById("mobile");
const email = document.getElementById("email");
const role = document.getElementById("role");
const company = document.getElementById("company");
const address = document.getElementById("address");

const inputs = [
    adminName,
    mobile,
    email,
    role,
    company,
    address
];

// ================================
// LOAD SAVED DATA
// ================================

let profile = JSON.parse(localStorage.getItem("adminProfile"));

if(profile){

    adminName.value = profile.adminName;
    mobile.value = profile.mobile;
    email.value = profile.email;
    role.value = profile.role;
    company.value = profile.company;
    address.value = profile.address;

}

// ================================
// EDIT PROFILE
// ================================

editBtn.addEventListener("click", function(){

    inputs.forEach(function(input){

        input.disabled = false;

    });

    editBtn.style.display = "none";
    saveBtn.style.display = "block";
    cancelBtn.style.display = "block";

});

// ================================
// SAVE PROFILE
// ================================

saveBtn.addEventListener("click", function(){

    if(adminName.value.trim() === ""){

        alert("Admin Name is required.");
        return;

    }

    if(mobile.value.trim() === ""){

        alert("Mobile Number is required.");
        return;

    }

    if(email.value.trim() === ""){

        alert("Email is required.");
        return;

    }

    profile = {

        adminName: adminName.value,
        mobile: mobile.value,
        email: email.value,
        role: role.value,
        company: company.value,
        address: address.value

    };

    localStorage.setItem("adminProfile", JSON.stringify(profile));

    inputs.forEach(function(input){

        input.disabled = true;

    });

    editBtn.style.display = "block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";

    alert("Profile Updated Successfully!");

});

// ================================
// CANCEL
// ================================

cancelBtn.addEventListener("click", function(){

    let profile = JSON.parse(localStorage.getItem("adminProfile"));

    if(profile){

        adminName.value = profile.adminName;
        mobile.value = profile.mobile;
        email.value = profile.email;
        role.value = profile.role;
        company.value = profile.company;
        address.value = profile.address;

    }

    else{

        adminName.value = "Admin";
        mobile.value = "9876543210";
        email.value = "admin@soundpro.com";
        role.value = "Administrator";
        company.value = "SoundPro Pvt. Ltd.";
        address.value = "Nagpur, Maharashtra, India";

    }

    inputs.forEach(function(input){

        input.disabled = true;

    });

    editBtn.style.display = "block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";

});