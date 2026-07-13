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
if (backBtn) {
    backBtn.addEventListener("click", function () {
        window.history.back();
    });
}