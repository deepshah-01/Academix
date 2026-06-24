function saveData(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}

function getData(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
        return JSON.parse(raw) || [];
    } catch (error) {
        console.error(`Failed to parse localStorage key ${key}:`, error);
        return [];
    }
}

function removeData(key) {
    localStorage.removeItem(key);
}

function clearStorage() {
    localStorage.clear();
}

function showAppMessage(message, type = "info", options = {}) {

    const existingToast =
        document.querySelector(".app-toast");

    if (existingToast) {
        existingToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className =
        `app-toast ${type}`;

    toast.setAttribute(
        "role",
        "status"
    );

    toast.textContent =
        message;

    document.body.appendChild(toast);

    requestAnimationFrame(
        () => toast.classList.add("show")
    );

    const duration =
        options.duration || 1800;

    window.setTimeout(
        () => {

            toast.classList.remove("show");

            if (options.redirectTo) {
                window.location.href =
                    options.redirectTo;
            }

        },
        duration
    );

}

function flashAppMessage(message, type = "info") {

    sessionStorage.setItem(
        "appMessage",
        JSON.stringify({
            message,
            type
        })
    );

}

function showPendingAppMessage() {

    const pendingMessage =
        sessionStorage.getItem("appMessage");

    if (!pendingMessage) {
        return;
    }

    sessionStorage.removeItem("appMessage");

    try {
        const parsedMessage =
            JSON.parse(pendingMessage);

        showAppMessage(
            parsedMessage.message,
            parsedMessage.type || "info"
        );
    } catch (error) {
        showAppMessage(
            pendingMessage,
            "info"
        );
    }

}

function getDeletedItems(key) {

    return getData(key);

}

function rememberDeletedItem(key, item) {

    const deletedItems =
        getDeletedItems(key);

    deletedItems.unshift({
        deletedId: `${key}-${Date.now()}`,
        deletedAt: new Date().toLocaleString(),
        item
    });

    saveData(
        key,
        deletedItems.slice(0, 5)
    );

}

function removeDeletedItem(key, deletedId) {

    const deletedItems =
        getDeletedItems(key)
            .filter(item => item.deletedId !== deletedId);

    saveData(
        key,
        deletedItems
    );

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
