// Protect page
protectPage();

// Load resources from localStorage
let resources = getData("resources");

let editId = null;

let currentFilter = "ALL";

const resourceForm =
    document.getElementById(
        "resourceForm"
    );

const resourceList =
    document.getElementById(
        "resourceList"
    );

const searchResource =
    document.getElementById(
        "searchResource"
    );

    searchResource.addEventListener(
        
        "input",
        
        renderResources
    
    );

function addResource(
title,
subject,
type,
url,
tags
) {

    const isEditing = editId !== null;

    const resource = {

        id: Date.now(),

        title,

        subject,

        type,

        url,

        tags,

        bookmarked: false,

        createdAt:
            new Date()
                .toLocaleString()

    };

    if (isEditing) {

        const index =
            resources.findIndex(
                r => r.id === editId
            );

        resources[index] = {

            ...resources[index],

            title,

            subject,

            type,

            url,

            tags

        };

        editId = null;

        addActivity(
            "Updated resource : " +
            title
        );

    }
    else {

        resources.push(resource);

        addActivity(
            "Added resource : " +
            title
        );

    }

    saveData(
        "resources",
        resources
    );

}

resourceForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const title =
            document.getElementById(
                "title"
            ).value;

        const subject =
            document.getElementById(
                "subject"
            ).value;

        const type =
            document.getElementById(
                "type"
            ).value;

        const url =
            document.getElementById(
                "url"
            ).value;

        const tags =
            document.getElementById(
                "tags"
            ).value
                .split(",")
                .map(
                    tag => tag.trim()
                )
                .filter(
                    tag => tag !== ""
                );

        addResource(

            title,

            subject,

            type,

            url,

            tags

        );

        renderResources();

        resourceForm.reset();

    }
);

function renderResources() {

    resourceList.innerHTML = "";

    const query =
        searchResource.value
            .toLowerCase();

    let filteredResources =
        resources.filter(

            resource =>

                resource.title
                    .toLowerCase()
                    .includes(query)

                ||

                resource.subject
                    .toLowerCase()
                    .includes(query)

                ||

                resource.type
                    .toLowerCase()
                    .includes(query)

                ||

                resource.tags
                    .join(" ")
                    .toLowerCase()
                    .includes(query)

        );

    if (currentFilter !== "ALL") {

        filteredResources =

            filteredResources.filter(

                resource =>

                    resource.type === currentFilter

            );

    }
    // Show cards
    filteredResources.forEach(resource => {

        resourceList.innerHTML += `

        <div class="resource-card">

            <h2>

                ${getIcon(resource.type)}

                ${resource.title}

            </h2>

            <p>
                Subject :
                ${resource.subject}
            </p>

            <p>
                Type :
                ${resource.type}
            </p>

            <p>
                Added :
                ${resource.createdAt}
            </p>

            <p class="tags">

                #${resource.tags.join(" #")}

            </p>

            <div class="resource-buttons">

                <button
                    onclick="openResource('${resource.url}')"
                >
                    Open
                </button>

                <button
                    onclick="toggleBookmark(${resource.id})"
                >
                    ${resource.bookmarked
                    ?
                    "Unbookmark"
                    :
                    "Bookmark"
                }
                </button>

                <button
                    onclick="editResource(${resource.id})"
                >
                    Edit
                </button>

                <button
                    onclick="deleteResource(${resource.id})"
                >
                    Delete
                </button>

            </div>

        </div>

        `;

    });

    // Empty state
    if (filteredResources.length === 0) {

        resourceList.innerHTML =

        `
        <div class="empty-state">

            No resources found

        </div>
        `;

    }

}

function openResource(url){

    window.open(
        url,
        "_blank"
    );

}

function setFilter(type){

    currentFilter = type;

    renderResources();

}

function deleteResource(id) {

    const deletedResource =
        resources.find(
            r => r.id === id
        );

    if (!deletedResource) return;

    resources =
        resources.filter(
            r => r.id !== id
        );

    saveData(
        "resources",
        resources
    );

    addActivity(

        "Deleted resource : " +

        deletedResource.title

    );

    renderResources();

}

function toggleBookmark(id){

    const resource =

        resources.find(

            r => r.id === id

        );

    if(!resource) return;

    resource.bookmarked =

        !resource.bookmarked;

    saveData(
        "resources",
        resources
    );

    addActivity(

        resource.bookmarked

            ?

            "Bookmarked resource : " +
            resource.title

            :

            "Removed bookmark : " +
            resource.title

    );

    renderResources();

}

function editResource(id){

    const resource =

        resources.find(

            r => r.id === id

        );

    if(!resource) return;

    document.getElementById(
        "title"
    ).value = resource.title;

    document.getElementById(
        "subject"
    ).value = resource.subject;

    document.getElementById(
        "type"
    ).value =
        resource.type;

    document.getElementById(
        "url"
    ).value = resource.url;

    document.getElementById(
        "tags"
    ).value =

        resource.tags.join(",");

    editId = id;

}

function getIcon(type){

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

renderResources();