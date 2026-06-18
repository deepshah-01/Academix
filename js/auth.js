const signupForm = document.getElementById("signupForm");

if(signupForm){

    signupForm.addEventListener("submit", function(e){

        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const university = document.getElementById("university").value;
        const course = document.getElementById("course").value;
        const year = document.getElementById("year").value;

        if(password !== confirmPassword){
            alert("Passwords do not match!");
            return;
        }

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(
            user => user.email === email
        );

        if(userExists){
            alert("Email already registered!");
            return;
        }

        const newUser = {
            name,
            email,
            password,
            university,
            course,
            year
        };

        users.push(newUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );
        /* Auto Login After Signup */

        localStorage.setItem(
            "currentUser",
            JSON.stringify(newUser)
        );

        alert("Account Created Successfully!");

        window.location.href = "dashboard.html";

    });

}