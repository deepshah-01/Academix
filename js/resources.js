protectPage();

let resources = getData("resources");
let editId = null;
let currentFilter = "ALL";

const resourceForm = document.getElementById("resourceForm");
const resourceList = document.getElementById("resourceList");
const searchResource = document.getElementById("searchResource");
const titleInput = document.getElementById("title");
const subjectInput = document.getElementById("subject");
const typeInput = document.getElementById("type");
const urlInput = document.getElementById("url");
const fileInput = document.getElementById("fileUpload");
const tagsInput = document.getElementById("tags");
const fileNameLabel = document.getElementById("fileName");
const submitButton = resourceForm.querySelector('button[type="submit"]');

searchResource.addEventListener("input", renderResources);
fileInput.addEventListener("change", updateFileLabel);

function normalizeTags(rawTags) {
    return rawTags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
}

function updateFileLabel() {
    const selectedFile = fileInput.files && fileInput.files[0];

    if (selectedFile) {
        fileNameLabel.textContent = `Selected file: ${selectedFile.name}`;
        return;
    }

    fileNameLabel.textContent = editId !== null
        ? "Keeping the current file unless you choose a new one."
        : "";
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the selected file."));
        reader.readAsDataURL(file);
    });
}

function resetFormState() {
    editId = null;
    resourceForm.reset();
    submitButton.textContent = "Add Resource";
    fileNameLabel.textContent = "";
    urlInput.placeholder = "Paste Resource Link (optional if uploading a file)";
}

function setFormStateForEdit(resource) {
    editId = resource.id;
    submitButton.textContent = "Update Resource";

    titleInput.value = resource.title || "";
    subjectInput.value = resource.subject || "";
    typeInput.value = resource.type || "LINK";
    urlInput.value = resource.originalUrl || (resource.sourceType === "LINK" ? resource.url || "" : "");
    tagsInput.value = Array.isArray(resource.tags) ? resource.tags.join(", ") : "";
    fileInput.value = "";

    if (resource.sourceType === "FILE" && resource.fileName) {
        fileNameLabel.textContent = `Current file: ${resource.fileName}`;
    } else {
        fileNameLabel.textContent = "";
    }
}

async function buildResourcePayload() {
    const title = titleInput.value.trim();
    const subject = subjectInput.value.trim();
    const type = typeInput.value;
    const originalUrl = urlInput.value.trim();
    const selectedFile = fileInput.files && fileInput.files[0];
    const tags = normalizeTags(tagsInput.value);
    const existingResource = editId !== null
        ? resources.find(resource => resource.id === editId)
        : null;

    if (!title || !subject) {
        throw new Error("Please fill in the title and subject.");
    }

    let resolvedUrl = originalUrl || (existingResource ? existingResource.url : "");
    let sourceType = existingResource?.sourceType || "LINK";
    let fileName = existingResource?.fileName || "";
    let fileType = existingResource?.fileType || "";
    let savedOriginalUrl = originalUrl || existingResource?.originalUrl || "";

    if (selectedFile) {
        resolvedUrl = await readFileAsDataUrl(selectedFile);
        sourceType = "FILE";
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        savedOriginalUrl = originalUrl;
    }

    if (!resolvedUrl) {
        throw new Error("Please paste a link or choose a local file.");
    }

    return {
        title,
        subject,
        type,
        url: resolvedUrl,
        originalUrl: savedOriginalUrl,
        sourceType,
        fileName,
        fileType,
        tags,
    };
}

function saveResources() {
    saveData("resources", resources);
}

function upsertResource(resourceData) {
    if (editId !== null) {
        const index = resources.findIndex(resource => resource.id === editId);

        if (index === -1) {
            editId = null;
            return;
        }

        resources[index] = {
            ...resources[index],
            ...resourceData,
            id: resources[index].id,
            bookmarked: resources[index].bookmarked || false,
            createdAt: resources[index].createdAt,
        };

        addActivity(`Updated resource : ${resourceData.title}`);
        editId = null;
        return;
    }

    resources.unshift({
        id: Date.now(),
        ...resourceData,
        bookmarked: false,
        createdAt: new Date().toLocaleString(),
    });

    addActivity(`Added resource : ${resourceData.title}`);
}

resourceForm.addEventListener("submit", async event => {
    event.preventDefault();

    try {
        const resourceData = await buildResourcePayload();
        upsertResource(resourceData);
        saveResources();
        renderResources();
        resetFormState();
    } catch (error) {
        alert(error.message);
    }
});

function renderResources() {
    resourceList.innerHTML = "";

    const query = searchResource.value.toLowerCase();

    let filteredResources = resources.filter(resource => {
        const tags = Array.isArray(resource.tags) ? resource.tags : [];

        return (
            (resource.title || "").toLowerCase().includes(query) ||
            (resource.subject || "").toLowerCase().includes(query) ||
            (resource.type || "").toLowerCase().includes(query) ||
            tags.join(" ").toLowerCase().includes(query)
        );
    });

    if (currentFilter !== "ALL") {
        filteredResources = filteredResources.filter(resource => resource.type === currentFilter);
    }

    if (filteredResources.length === 0) {
        resourceList.innerHTML = `
            <div class="empty-state">
                No resources found
            </div>
        `;
        return;
    }

    filteredResources.forEach(resource => {
        const tags = Array.isArray(resource.tags) ? resource.tags : [];
        const sourceText = resource.sourceType === "FILE"
            ? `Local file${resource.fileName ? `: ${resource.fileName}` : ""}`
            : "Link";

        resourceList.innerHTML += `
            <div class="resource-card">
                <h2>
                    ${getIcon(resource.type)}
                    ${resource.title}
                </h2>

                <p>Subject : ${resource.subject}</p>
                <p>Type : ${resource.type}</p>
                <p class="source-label">Source : ${sourceText}</p>
                <p>Added : ${resource.createdAt}</p>

                ${
                    tags.length > 0
                        ? `<p class="tags">#${tags.join(" #")}</p>`
                        : ""
                }

                <div class="resource-buttons">
                    <button onclick="openResource(${resource.id})">Open</button>
                    <button onclick="toggleBookmark(${resource.id})">
                        ${resource.bookmarked ? "Unbookmark" : "Bookmark"}
                    </button>
                    <button onclick="editResource(${resource.id})">Edit</button>
                    <button onclick="deleteResource(${resource.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

function openResource(id) {
    const resource = resources.find(item => item.id === id);

    if (!resource || !resource.url) {
        alert("This resource does not have a link or uploaded file.");
        return;
    }

    window.open(resource.url, "_blank", "noopener,noreferrer");
}

function setFilter(type) {
    currentFilter = type;
    renderResources();
}

function deleteResource(id) {
    const deletedResource = resources.find(resource => resource.id === id);

    if (!deletedResource) return;

    resources = resources.filter(resource => resource.id !== id);
    saveResources();
    addActivity(`Deleted resource : ${deletedResource.title}`);
    renderResources();
}

function toggleBookmark(id) {
    const resource = resources.find(item => item.id === id);

    if (!resource) return;

    resource.bookmarked = !resource.bookmarked;
    saveResources();

    addActivity(
        resource.bookmarked
            ? `Bookmarked resource : ${resource.title}`
            : `Removed bookmark : ${resource.title}`
    );

    renderResources();
}

function editResource(id) {
    const resource = resources.find(item => item.id === id);

    if (!resource) return;

    setFormStateForEdit(resource);
}

function getIcon(type) {
    switch (type) {
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
