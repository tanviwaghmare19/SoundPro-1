// Back Button

document.getElementById("backBtn").addEventListener("click", function(){

window.location.href="products.html";

});

// Notification Switch

const notify=document.getElementById("notify");

notify.addEventListener("change",function(){

if(this.checked){

alert("Notifications ON");

}else{

alert("Notifications OFF");

}

});
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", function () {

    // Browser ke previous page par wapas jayega
    window.history.back();

});