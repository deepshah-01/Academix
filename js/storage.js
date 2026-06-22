function saveData(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}

function getData(key) {
    return JSON.parse(
        localStorage.getItem(key)
    ) || [];
}

function removeData(key) {
    localStorage.removeItem(key);
}

function clearStorage() {
    localStorage.clear();
}

// Protect pages
function protectPage() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    if (!currentUser) {

        window.location.href =
            "login.html";

    }

}

// Logout
function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}

// Recent Activity
function addActivity(text) {

    let activity =
        getData("activity");

    activity.unshift({

        text,

        time:
            new Date()
            .toLocaleString()

    });

    // Keep only latest 20
    if (activity.length > 20) {

        activity.pop();

    }

    saveData(
        "activity",
        activity
    );

}