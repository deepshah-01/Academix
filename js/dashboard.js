
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {

    
    const welcomeElement = document.getElementById("welcome");

    if (welcomeElement && currentUser) {
        welcomeElement.innerText = `Welcome, ${currentUser.name}`;
    }
});


function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}