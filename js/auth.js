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
        alert("Email already registered!");
        return false;
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

    localStorage.setItem(
        "currentUser",
        JSON.stringify(newUser)
    );

    return true;
}


// ---------- Login ----------
function login(email, password) {

    const users = getData("users");

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (user) {

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        return true;
    }

    return false;
}


// ---------- Logout ----------
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

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

            alert("Passwords do not match!");
            return;

        }

        const success = signup(
            name,
            email,
            password,
            university,
            course,
            year
        );

        if (success) {

            alert("Account Created Successfully!");

            window.location.href = "dashboard.html";

        }

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

        const success = login(email, password);

        if (success) {

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid Email or Password!");

        }

    });

}