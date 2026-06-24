// ---------- Signup ----------
function signup(
    name,
    email,
    password,
    university,
    course,
    year
) {

    let users = getData("users");

    const userExists = users.find(
        user => user.email === email
    );

    if (userExists) {
        return {
            success: false,
            message: "This email already has an Academix account. Please login instead.",
            type: "error"
        };
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        university,
        course,
        year
    };

    users.push(newUser);

    saveData("users", users);

    return {
        success: true,
        message: "Account created successfully! Redirecting to login...",
        type: "success"
    };
}


// ---------- Login ----------
function login(email, password) {

    const users = getData("users");

    const userByEmail = users.find(
        user => user.email === email
    );

    if (!userByEmail) {
        return {
            success: false,
            message: "No account found with this email. Please create an account first.",
            type: "error"
        };
    }

    if (userByEmail.password !== password) {
        return {
            success: false,
            message: "Password is incorrect. Please try again.",
            type: "error"
        };
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(userByEmail)
    );

    return {
        success: true,
        message: "Login successful! Opening your dashboard...",
        type: "success"
    };
}


// ---------- Logout ----------
function logout() {

    localStorage.removeItem("currentUser");

    flashAppMessage(
        "Logged out successfully. See you soon!",
        "success"
    );

    showAppMessage(
        "Logging you out...",
        "success",
        {
            duration: 900,
            redirectTo: "login.html"
        }
    );

}


// ---------- Current User ----------
function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );

}


// ---------- Check LoggedIn ----------
function isLoggedIn() {

    return localStorage.getItem("currentUser") !== null;

}


// --------Protect Page ----------
function protectPage() {

    if (!isLoggedIn()) {

        window.location.href = "login.html";

    }

}


// ---------- Redirect User ----------
function redirectIfLoggedIn() {

    if (isLoggedIn()) {

        window.location.href = "dashboard.html";

    }

}


// ---------- Signup Form ----------
const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const university =
            document.getElementById("university").value;
        const course =
            document.getElementById("course").value;
        const year =
            document.getElementById("year").value;

        if (password !== confirmPassword) {

            showAppMessage(
                "Passwords do not match. Please check both fields.",
                "error"
            );
            return;

        }

        const result = signup(
            name,
            email,
            password,
            university,
            course,
            year
        );

        showAppMessage(
            result.message,
            result.type,
            result.success
                ? {
                    duration: 1800,
                    redirectTo: "login.html"
                }
                : {}
        );


    });

}


// ---------- Login Form ----------
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const result = login(email, password);

        showAppMessage(
            result.message,
            result.type,
            result.success
                ? {
                    duration: 1500,
                    redirectTo: "dashboard.html"
                }
                : {}
        );


    });

}

document.addEventListener(
    "DOMContentLoaded",
    showPendingAppMessage
);
