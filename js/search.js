// Protect page
protectPage();

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );

searchInput.addEventListener(
    "input",
    renderSearch
);

function renderSearch(){

    searchResults.innerHTML = "";

    const query =
        searchInput.value
            .toLowerCase();

    if(query === ""){

        searchResults.innerHTML =

        `
        <div class="empty-state">

            Start typing to search

        </div>
        `;

        return;

    }

    const notes =
        getData(
            "academix_notes"
        );

    const resources =
        getData(
            "resources"
        );

    let results = [];

    // Notes

    notes.forEach(note => {

        if(

            note.title
                .toLowerCase()
                .includes(query)

            ||

            note.content
                .toLowerCase()
                .includes(query)

            ||    

            (note.tags || [])
                .join(" ")
                .toLowerCase()
                .includes(query)

        ){

            results.push({

                icon : "📚",

                type : "NOTE",

                title : note.title,

                subtitle : (note.tags || []).join(", "),

                id : note.id

            });

        }

    });



    // Resources

    resources.forEach(resource => {

        if(

            resource.title
                .toLowerCase()
                .includes(query)

            ||

            (resource.tags || [])
                .join(" ")
                .toLowerCase()
                .includes(query)

        ){

            results.push({

                icon: getResourceIcon(resource.type),

                type: "RESOURCE",

                title: resource.title,

                subtitle: resource.subject,

                id: resource.id,

                url: resource.url,

                sourceType: resource.sourceType,

                storedPath: resource.storedPath

            });

        }

    });


    if(results.length === 0){

        searchResults.innerHTML =

        `
        <div class="empty-state">

            No results found

        </div>
        `;

        return;

    }


    results.forEach(item => {

        searchResults.innerHTML +=

        `
        <div class="search-card">

            <h2>

                ${item.icon}

                ${item.title}

            </h2>

            <p>

                ${item.type}

            </p>

            <p>

                ${item.subtitle}

            </p>

            ${
                item.type === "RESOURCE"
                
                ?

                `
                <button
                    onclick="openSearchResource(${item.id})"
                >
                    Open
                </button>
                `

                :

                `
                <button
                    onclick="openNote('${item.id}')"
                >
                    Open
                </button>
                `
            }

        </div>
        `;

    });

}

function openNote(id) {

    localStorage.setItem(

        "selectedNoteId",

        id

    );

    window.location.href =

        "notes.html";

}


function openSearchResource(id) {
    const resources = getData("resources");
    const resource = resources.find(function (item) {
        return item.id == id;
    });

    if (!resource) {
        showAppMessage(
            "Resource not found.",
            "error"
        );
        return;
    }

    if (resource.sourceType === "DEVICE_FILE") {
        openStoredDeviceFile(resource.storedPath).catch(function (error) {
            showAppMessage(
                error.message,
                "error"
            );
        });
        return;
    }

    if (!resource.url) {
        showAppMessage(
            "This resource does not have a link or device file.",
            "error"
        );
        return;
    }

    window.open(
        resource.url,
        "_blank",
        "noopener,noreferrer"
    );
}

function getResourceIcon(type){

    switch(type){

        case "PDF":
            return "📄";

        case "PPT":
            return "📊";

        case "VIDEO":
            return "🎥";

        case "PYQ":
            return "📝";

        case "LINK":
            return "🔗";

        case "BOOK":
            return "📚";

        default:
            return "📁";

    }

}


renderSearch();