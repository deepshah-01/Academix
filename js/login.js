const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const users =
        JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            user =>
            user.email === email &&
            user.password === password
        );

        if(!user){
            alert("Invalid Email or Password");
            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );
        

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    });

}