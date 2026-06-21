
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
