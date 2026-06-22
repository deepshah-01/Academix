const currentUser =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );

if(!currentUser){

    window.location.href =
        "login.html";

}

document.getElementById(
    "userName"
).innerText =
    currentUser.name;

document.getElementById(
    "userEmail"
).innerText =
    currentUser.email;

const notes =
    getData(
        "academix_notes"
    );

const resources =
    getData(
        "resources"
    );

const bookmarkedNotes =
    notes.filter(
        note =>
        note.bookmarked
    ).length;

const bookmarkedResources =
    resources.filter(
        resource =>
        resource.bookmarked
    ).length;

document.getElementById(
    "totalNotes"
).innerText =
    notes.length;

document.getElementById(
    "totalResources"
).innerText =
    resources.length;

document.getElementById(
    "totalBookmarks"
).innerText =
    bookmarkedNotes +
    bookmarkedResources;


function logout(){

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}


const themeBtn =
    document.getElementById(
        "themeBtn"
    );

themeBtn.addEventListener(
    "click",
    ()=>{

        if(
            localStorage.getItem(
                "theme"
            ) === "dark"
        ){

            localStorage.setItem(
                "theme",
                "light"
            );

            location.reload();

        }
        else{

            localStorage.setItem(
                "theme",
                "dark"
            );

            location.reload();

        }

    }
);