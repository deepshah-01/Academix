// Protect page
protectPage();

let bookmarkFilter = "ALL";

const bookmarkList =
    document.getElementById(
        "bookmarkList"
    );

const searchBookmark =
    document.getElementById(
        "searchBookmark"
    );

searchBookmark.addEventListener(
    "input",
    renderBookmarks
);

function setBookmarkFilter(type){

    bookmarkFilter = type;

    renderBookmarks();

}

function getBookmarkedNotes(){

    const notes =
        getData(
            "academix_notes"
        );

    return notes
        .filter(
            note =>
            note.bookmarked
        )
        .map(
            note => ({

                ...note,

                source : "NOTE"

            })
        );

}

function getBookmarkedResources(){

    const resources =
        getData(
            "resources"
        );

    return resources
        .filter(
            resource =>
            resource.bookmarked
        )
        .map(
            resource => ({

                ...resource,

                source : "RESOURCE"

            })
        );

}

function removeBookmark(id, source) {

    if (source === "NOTE") {

        let notes = getData("academix_notes");

        const note = notes.find(
            n => n.id == id
        );

        if (!note) return;

        note.bookmarked = false;

        saveData(
            "academix_notes",
            notes
        );

        addActivity(
            "Removed bookmark : " +
            note.title
        );

    }
    else {

        let resources = getData("resources");

        const resource = resources.find(
            r => r.id == id
        );

        if (!resource) return;

        resource.bookmarked = false;

        saveData(
            "resources",
            resources
        );

        addActivity(
            "Removed bookmark : " +
            resource.title
        );

    }

    renderBookmarks();

}

function openResource(url){

    window.open(

        url,

        "_blank"

    );

}

function renderBookmarks(){

    bookmarkList.innerHTML = "";

    let bookmarks = [

        ...getBookmarkedNotes(),

        ...getBookmarkedResources()

    ];

    const query =

        searchBookmark.value
        .toLowerCase();

    bookmarks = bookmarks.filter(

        item =>

            item.title
                .toLowerCase()
                .includes(query)

            ||

            (item.tags || [])
                .join(" ")
                .toLowerCase()
                .includes(query)

    );

    if(bookmarkFilter === "NOTES"){

        bookmarks =

            bookmarks.filter(

                item =>

                item.source === "NOTE"

            );

    }

    if(bookmarkFilter === "RESOURCES"){

        bookmarks =

            bookmarks.filter(

                item =>

                item.source === "RESOURCE"

            );

    }

    if(bookmarks.length === 0){

        bookmarkList.innerHTML =

        `
        <div class="empty-state">

            No bookmarks found

        </div>
        `;

        return;

    }

    bookmarks.forEach(item => {

        bookmarkList.innerHTML +=

        `
        <div class="bookmark-card">

            <h2>

                ${
                    item.source === "NOTE"

                    ?

                    "📚"

                    :

                    "📄"
                }

                ${item.title}

            </h2>

            <p>

                Type :

                ${item.source}

            </p>

            <p>

                Added :

                ${item.createdAt}

            </p>

            <div class="bookmark-buttons">

                ${
                    item.source === "RESOURCE"

                    ?

                    `
                    <button
                        class="open-btn"
                        onclick="openResource('${item.url}')"
                    >
                        Open
                    </button>
                    `

                    :

                    ""
                }

                <button
                    class="remove-btn"
                    onclick="removeBookmark('${item.id}','${item.source}')"
                >
                    Remove
                </button>

            </div>

        </div>

        `;

    });

}

renderBookmarks();