const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const welcomeElement = document.getElementById("welcome");

    if (welcomeElement && currentUser) {
        welcomeElement.innerText = `Welcome, ${currentUser.name}`;
    }

    renderActivity();
    renderStatistics();
    bindDashboardSpotlight();
});

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

let activity =
    JSON.parse(
        localStorage.getItem(
            "activity"
        )
    ) || [];

function renderStatistics() {
    const notes =
        getData("academix_notes");

    const resources =
        getData("resources");

    const pinnedNotes =
        notes.filter(
            note => note.pinned
        );

    const bookmarkedNotes =
        notes.filter(
            note => note.bookmarked
        );

    const bookmarkedResources =
        resources.filter(
            resource => resource.bookmarked
        );

    const notesBookmarks =
        bookmarkedNotes.length;

    const resourceBookmarks =
        bookmarkedResources.length;

    setMetricText("notesCount", `${notes.length} Files`);
    setMetricText("pinnedNotesCount", pinnedNotes.length);
    setMetricText("bookmarkedNotesCount", bookmarkedNotes.length);
    setMetricText("bookmarkedResourcesCount", bookmarkedResources.length);
    setMetricText("resourcesCount", `${resources.length} Links`);
    setMetricText("bookmarksCount", `${notesBookmarks + resourceBookmarks} Saved`);
}

function setMetricText(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.innerText = value;
    }
}

function renderActivity() {
    const activityList =
        document.getElementById(
            "activityList"
        );

    if (!activityList) {
        return;
    }

    activityList.innerHTML = "";

    if (activity.length === 0) {
        activityList.innerHTML =
            `<p class="empty-activity">No recent activity yet. Create notes, resources, or bookmarks to light this up.</p>`;

        return;
    }

    activity
        .slice(0, 5)
        .forEach(item => {
            const activityItem =
                document.createElement("div");

            activityItem.className = "activity-item";
            activityItem.innerHTML =
                `
                <span>${item.text}</span>
                <div class="activity-time">${item.time}</div>
                `;

            activityList.appendChild(activityItem);
        });
}

function bindDashboardSpotlight() {
    const spotlightTargets =
        document.querySelectorAll(
            ".dashboard-hero, .metric-card, .big-card, .activity-card"
        );

    spotlightTargets.forEach(target => {
        target.addEventListener("pointermove", event => {
            const bounds =
                target.getBoundingClientRect();

            const pointerX =
                ((event.clientX - bounds.left) / bounds.width) * 100;

            const pointerY =
                ((event.clientY - bounds.top) / bounds.height) * 100;

            target.style.setProperty("--pointer-x", `${pointerX}%`);
            target.style.setProperty("--pointer-y", `${pointerY}%`);
        });
    });
}
