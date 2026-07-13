if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "../LoginPage.html";
}

if (data.success) {
  localStorage.setItem('userEmail', data.email);
  window.location.href = '/pages/home.html'; // or wherever
}