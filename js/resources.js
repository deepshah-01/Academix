// Protect page
protectPage();

// Load resources from localStorage
let resources = getData("resources");

let editId = null;

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
    category,
    url,
    tags
) {

    const isEditing = editId !== null;

    const resource = {

        id: Date.now(),

        title,

        subject,

        category,

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

            category,

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

        const category =
            document.getElementById(
                "category"
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

            category,

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

    const filteredResources =
        resources.filter(resource =>

            resource.title
                .toLowerCase()
                .includes(query)

            ||

            resource.subject
                .toLowerCase()
                .includes(query)

            ||

            resource.category
                .toLowerCase()
                .includes(query)

            ||

            resource.tags
                .join(" ")
                .toLowerCase()
                .includes(query)

        );

    filteredResources.forEach(

        resource => {

            resourceList.innerHTML +=

                `
            <div class="resource-card">

                <h2>${resource.title}</h2>

                <p>
                    Subject :
                    ${resource.subject}
                </p>

                <p>
                    Category :
                    ${resource.category}
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

        }

    );

}

function openResource(url){

    window.open(
        url,
        "_blank"
    );

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
        "category"
    ).value = resource.category;

    document.getElementById(
        "url"
    ).value = resource.url;

    document.getElementById(
        "tags"
    ).value =

        resource.tags.join(",");

    editId = id;

}

renderResources();