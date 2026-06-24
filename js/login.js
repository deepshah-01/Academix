const loginPageForm =
    document.getElementById("loginForm");

if (loginPageForm && typeof login !== "function") {

    loginPageForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const userByEmail =
            users.find(user => user.email === email);

        if (!userByEmail) {
            showAppMessage(
                "No account found with this email. Please create an account first.",
                "error"
            );
            return;
        }

        if (userByEmail.password !== password) {
            showAppMessage(
                "Password is incorrect. Please try again.",
                "error"
            );
            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(userByEmail)
        );

        showAppMessage(
            "Login successful! Opening your dashboard...",
            "success",
            {
                duration: 1500,
                redirectTo: "dashboard.html"
            }
        );

    });

}
