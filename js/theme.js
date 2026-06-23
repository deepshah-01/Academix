const themeBtn =
    document.getElementById(
        "themeBtn"
    );

function applyTheme(){

    const theme =
        localStorage.getItem(
            "theme"
        );

    if(theme==="dark"){

        document.body.classList.add(
            "dark"
        );

        if(themeBtn){

            themeBtn.innerText =
                "☀️ Light Mode";

        }

    }
    else{

        document.body.classList.remove(
            "dark"
        );

        if(themeBtn){

            themeBtn.innerText =
                "🌙 Dark Mode";

        }

    }

}

if(themeBtn){

    themeBtn.addEventListener(
        "click",
        ()=>{

            if(
                localStorage.getItem(
                    "theme"
                )==="dark"
            ){

                localStorage.setItem(
                    "theme",
                    "light"
                );

            }
            else{

                localStorage.setItem(
                    "theme",
                    "dark"
                );

            }

            applyTheme();

        }
    );

}

applyTheme();

document.addEventListener(
    "pointermove",
    event=>{

        const target =
            event.target.closest(
                ".resource-card, .bookmark-card, .search-card, .stat-card, .profile-card, .attendance-card, .notes-sidebar, .note-editor, #resourceForm, .bookmark-controls"
            );

        if(!target){
            return;
        }

        const bounds =
            target.getBoundingClientRect();

        const pointerX =
            ((event.clientX - bounds.left) / bounds.width) * 100;

        const pointerY =
            ((event.clientY - bounds.top) / bounds.height) * 100;

        target.style.setProperty(
            "--pointer-x",
            `${pointerX}%`
        );

        target.style.setProperty(
            "--pointer-y",
            `${pointerY}%`
        );

    }
);
