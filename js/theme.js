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
