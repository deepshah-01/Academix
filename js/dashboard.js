
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

});


function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
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
        notes.filter(
            note => note.bookmarked
        ).length;

    const resourceBookmarks =
        resources.filter(
            resource => resource.bookmarked
        ).length;

    document.getElementById(
        "notesCount"
    ).innerText =
        notes.length + " Files";

    document.getElementById(
        "pinnedNotesCount"
    ).innerText =
        pinnedNotes.length;

    document.getElementById(
        "bookmarkedNotesCount"
    ).innerText =
        bookmarkedNotes.length;

    document.getElementById(
        "bookmarkedResourcesCount"
    ).innerText =
        bookmarkedResources.length;

    document.getElementById(
        "resourcesCount"
    ).innerText =
        resources.length + " Links";

    document.getElementById(
        "bookmarksCount"
    ).innerText =
        (notesBookmarks + resourceBookmarks)
        + " Saved";

}


function renderActivity(){

    const activityList =
        document.getElementById(
            "activityList"
        );

    if(!activityList){
        return;
    }

    activityList.innerHTML = "";

    if(activity.length === 0){

        activityList.innerHTML =
            "<p>No recent activity</p>";

        return;
    }

    activity
        .slice(0,5)
        .forEach(item=>{

            activityList.innerHTML +=

            `
            <div class="activity-item">

                ✓ ${item.text}

                <div class="activity-time">

                    ${item.time}

                </div>

            </div>

            `;

        });

}
