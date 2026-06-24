// ---------- Signup ----------
function validatePasswordPolicy(password) {

    const hasValidLength =
        password.length >= 6 && password.length <= 12;

    const hasLetter =
        /[A-Za-z]/.test(password);

    const hasNumber =
        /\d/.test(password);

    const hasSymbol =
        /[^A-Za-z0-9]/.test(password);

    if (
        hasValidLength &&
        hasLetter &&
        hasNumber &&
        hasSymbol
    ) {
        return {
            success: true,
            message: "Password looks strong."
        };
    }

    return {
        success: false,
        message: "Password must be 6–12 characters and include a letter, number, and symbol."
    };
}

function signup(
    name,
    email,
    password,
    university,
    course,
    year
) {

    const passwordCheck =
        validatePasswordPolicy(password);

    if (!passwordCheck.success) {
        return {
            success: false,
            message: passwordCheck.message,
            type: "error"
        };
    }

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

function resetPassword(email, newPassword) {

    const passwordCheck =
        validatePasswordPolicy(newPassword);

    if (!passwordCheck.success) {
        return {
            success: false,
            message: passwordCheck.message,
            type: "error"
        };
    }

    const users =
        getData("users");

    const userIndex =
        users.findIndex(user => user.email === email);

    if (userIndex === -1) {
        return {
            success: false,
            message: "No account found with this email. Create an account first.",
            type: "error"
        };
    }

    users[userIndex].password =
        newPassword;

    saveData(
        "users",
        users
    );

    return {
        success: true,
        message: "Password reset successfully. Please login with the new password.",
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
            redirectTo: "index.html"
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
const passwordInput = document.getElementById("password");
const passwordHint = document.getElementById("passwordHint");

if (passwordInput && passwordHint) {

    passwordInput.addEventListener("input", function () {

        const result =
            validatePasswordPolicy(passwordInput.value);

        passwordHint.textContent =
            result.message;

        passwordHint.classList.toggle(
            "valid",
            result.success
        );

    });

}

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
const resetPasswordForm = document.getElementById("resetPasswordForm");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const backToLoginBtn = document.getElementById("backToLoginBtn");

if (forgotPasswordBtn && resetPasswordForm && loginForm) {

    forgotPasswordBtn.addEventListener("click", function () {
        loginForm.hidden = true;
        resetPasswordForm.hidden = false;
    });

}

if (backToLoginBtn && resetPasswordForm && loginForm) {

    backToLoginBtn.addEventListener("click", function () {
        resetPasswordForm.hidden = true;
        loginForm.hidden = false;
    });

}

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

if (resetPasswordForm) {

    resetPasswordForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email =
            document.getElementById("resetEmail").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmNewPassword =
            document.getElementById("confirmNewPassword").value;

        if (newPassword !== confirmNewPassword) {
            showAppMessage(
                "New passwords do not match.",
                "error"
            );
            return;
        }

        const result =
            resetPassword(
                email,
                newPassword
            );

        showAppMessage(
            result.message,
            result.type
        );

        if (result.success) {
            resetPasswordForm.reset();
            resetPasswordForm.hidden = true;
            loginForm.hidden = false;
        }

    });

}

document.addEventListener(
    "DOMContentLoaded",
    showPendingAppMessage
);
