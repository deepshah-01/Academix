protectPage();

const SUBJECTS_KEY = "academix_subjects";
const DELETED_RESOURCES_KEY = "academix_deleted_resources";

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
const newSubjectInput = document.getElementById("newSubjectInput");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const connectFolderBtn = document.getElementById("connectFolderBtn");
const folderStatus = document.getElementById("folderStatus");
const deletedResourcesList = document.getElementById("deletedResourcesList");
const fileNameLabel = document.getElementById("fileName");
const submitButton = resourceForm.querySelector('button[type="submit"]');

searchResource.addEventListener("input", renderResources);
fileInput.addEventListener("change", updateFileLabel);
addSubjectBtn.addEventListener("click", addSubjectFromInput);
connectFolderBtn.addEventListener("click", connectDeviceFolder);

function normalizeTags(rawTags) {
    return rawTags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
}

function normalizeSubject(subject) {
    return subject
        .trim()
        .replace(/[<>:"/\\|?*]+/g, "")
        .replace(/\s+/g, " ");
}

function getSubjects() {
    return getData(SUBJECTS_KEY);
}

function saveSubjects(subjects) {
    saveData(
        SUBJECTS_KEY,
        [...new Set(subjects.map(normalizeSubject).filter(Boolean))]
    );
}

function ensureSubject(subject) {
    const normalizedSubject =
        normalizeSubject(subject);

    if (!normalizedSubject) {
        return "";
    }

    const subjects =
        getSubjects();

    if (!subjects.includes(normalizedSubject)) {
        subjects.push(normalizedSubject);
        saveSubjects(subjects);
    }

    return normalizedSubject;
}

function renderSubjectOptions(selectedSubject = "") {
    const subjects =
        getSubjects();

    subjectInput.innerHTML =
        subjects.length === 0
            ? '<option value="">Add a subject first</option>'
            : '<option value="">Choose subject</option>';

    subjects.forEach(subject => {
        const option =
            document.createElement("option");

        option.value = subject;
        option.textContent = subject;
        option.selected = subject === selectedSubject;
        subjectInput.appendChild(option);
    });
}

function addSubjectFromInput() {
    const subject =
        normalizeSubject(newSubjectInput.value);

    if (!subject) {
        showAppMessage(
            "Enter a subject name first.",
            "error"
        );
        return;
    }

    const savedSubject =
        ensureSubject(subject);

    newSubjectInput.value = "";
    renderSubjectOptions(savedSubject);
    subjectInput.value = savedSubject;

    showAppMessage(
        `Subject "${savedSubject}" added.`,
        "success"
    );
}

async function connectDeviceFolder() {
    try {
        await connectAcademixDeviceFolder();

        folderStatus.textContent =
            "Connected. Files will save into Academix / Subject folders.";

        showAppMessage(
            "Device folder connected.",
            "success"
        );
    } catch (error) {
        if (error.name === "AbortError") {
            showAppMessage(
                "Folder connection cancelled.",
                "error"
            );
            return;
        }

        showAppMessage(
            error.message || "Folder connection cancelled or blocked.",
            "error"
        );
    }
}

async function saveFileToDeviceFolder(file, subject) {
    return saveFileToAcademixFolder(file, subject);
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

function resetFormState() {
    editId = null;
    resourceForm.reset();
    renderSubjectOptions();
    submitButton.textContent = "Add Resource";
    fileNameLabel.textContent = "";
    urlInput.placeholder = "Paste Resource Link (optional if uploading a file)";
}

function setFormStateForEdit(resource) {
    editId = resource.id;
    submitButton.textContent = "Update Resource";

    titleInput.value = resource.title || "";
    const selectedSubject =
        ensureSubject(resource.subject || "");

    renderSubjectOptions(selectedSubject);
    subjectInput.value = selectedSubject;
    typeInput.value = resource.type || "LINK";
    urlInput.value = resource.originalUrl || (resource.sourceType === "LINK" ? resource.url || "" : "");
    tagsInput.value = Array.isArray(resource.tags) ? resource.tags.join(", ") : "";
    fileInput.value = "";

    if ((resource.sourceType === "FILE" || resource.sourceType === "DEVICE_FILE") && resource.fileName) {
        fileNameLabel.textContent = resource.storedPath
            ? `Current device file: ${resource.storedPath}`
            : `Current file: ${resource.fileName}`;
    } else {
        fileNameLabel.textContent = "";
    }
}

async function buildResourcePayload() {
    const title = titleInput.value.trim();
    const subject = normalizeSubject(subjectInput.value);
    const type = typeInput.value;
    const originalUrl = urlInput.value.trim();
    const selectedFile = fileInput.files && fileInput.files[0];
    const tags = normalizeTags(tagsInput.value);
    const existingResource = editId !== null
        ? resources.find(resource => resource.id === editId)
        : null;

    if (!title || !subject) {
        throw new Error("Please fill in the title and choose a subject.");
    }

    let resolvedUrl = originalUrl || (existingResource ? existingResource.url : "");
    let sourceType = existingResource?.sourceType || "LINK";
    let fileName = existingResource?.fileName || "";
    let fileType = existingResource?.fileType || "";
    let savedOriginalUrl = originalUrl || existingResource?.originalUrl || "";
    let storedPath = existingResource?.storedPath || "";

    if (selectedFile) {
        storedPath = await saveFileToDeviceFolder(
            selectedFile,
            subject
        );
        resolvedUrl = originalUrl;
        sourceType = "DEVICE_FILE";
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        savedOriginalUrl = originalUrl;
    }

    if (!resolvedUrl && !storedPath) {
        throw new Error("Please paste a link or connect a folder and choose a local file.");
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
        storedPath,
        tags,
    };
}

function saveResources() {
    saveData("resources", resources);
}

function seedSubjectsFromResources() {
    const subjects =
        getSubjects();

    resources.forEach(resource => {
        const subject =
            normalizeSubject(resource.subject || "");

        if (subject && !subjects.includes(subject)) {
            subjects.push(subject);
        }
    });

    saveSubjects(subjects);
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
        renderDeletedResources();
        resetFormState();
    } catch (error) {
        showAppMessage(
            error.message,
            "error"
        );
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
        const sourceText = resource.sourceType === "DEVICE_FILE"
            ? `Device folder${resource.storedPath ? `: ${resource.storedPath}` : ""}`
            : resource.sourceType === "FILE"
                ? `Legacy browser file${resource.fileName ? `: ${resource.fileName}` : ""}`
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
                    <button class="openBtn" onclick="openResource(${resource.id})">Open</button>
                    <button class="bookmarkBtn" onclick="toggleBookmark(${resource.id})">
                        ${resource.bookmarked ? "Unbookmark" : "Bookmark"}
                    </button>
                    <button class="editBtn" onclick="editResource(${resource.id})">Edit</button>
                    <button class="deleteBtn" onclick="deleteResource(${resource.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

function renderDeletedResources() {
    if (!deletedResourcesList) {
        return;
    }

    const deletedResources =
        getDeletedItems(DELETED_RESOURCES_KEY);

    if (deletedResources.length === 0) {
        deletedResourcesList.innerHTML =
            '<div class="empty-state compact">No deleted resources</div>';
        return;
    }

    deletedResourcesList.innerHTML =
        deletedResources
            .map(deletedResource => `
                <div class="restore-item">
                    <div>
                        <strong>${deletedResource.item.title || "Untitled resource"}</strong>
                        <span>${deletedResource.item.subject || "No subject"} • Deleted: ${deletedResource.deletedAt}</span>
                    </div>
                    <button type="button" onclick="restoreResource('${deletedResource.deletedId}')">
                        Restore
                    </button>
                </div>
            `)
            .join("");
}

function restoreResource(deletedId) {
    const deletedResources =
        getDeletedItems(DELETED_RESOURCES_KEY);

    const deletedResource =
        deletedResources.find(item => item.deletedId === deletedId);

    if (!deletedResource) {
        return;
    }

    const restoredResource = {
        ...deletedResource.item,
        id: resources.some(resource => resource.id === deletedResource.item.id)
            ? Date.now()
            : deletedResource.item.id
    };

    ensureSubject(restoredResource.subject || "");
    resources.unshift(restoredResource);

    removeDeletedItem(
        DELETED_RESOURCES_KEY,
        deletedId
    );

    saveResources();
    addActivity(`Restored resource : ${restoredResource.title}`);
    renderSubjectOptions(restoredResource.subject || "");
    renderResources();
    renderDeletedResources();
    showAppMessage(
        "Resource restored successfully.",
        "success"
    );
}

async function openResource(id) {
    const resource = resources.find(item => item.id === id);

    if (!resource) {
        return;
    }

    try {
        if (resource.sourceType === "DEVICE_FILE") {
            await openStoredDeviceFile(resource.storedPath);
            return;
        }

        if (resource.url) {
            window.open(resource.url, "_blank", "noopener,noreferrer");
            return;
        }

        showAppMessage(
            "This resource does not have a link or uploaded file.",
            "error"
        );
    } catch (error) {
        showAppMessage(
            error.message,
            "error"
        );
    }
}

function setFilter(type, el) {
    currentFilter = type;

    // Toggle active class on filter buttons
    const btns = document.querySelectorAll('.filter-buttons .filter-btn');
    btns.forEach(b => b.classList.remove('active'));

    let activeBtn = null;

    if (el) {
        activeBtn = el;
    } else {
        activeBtn = document.querySelector(`.filter-buttons .filter-btn[data-type="${type}"]`);
    }

    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    renderResources();
}

function deleteResource(id) {
    const deletedResource = resources.find(resource => resource.id === id);

    if (!deletedResource) return;

    rememberDeletedItem(
        DELETED_RESOURCES_KEY,
        deletedResource
    );

    resources = resources.filter(resource => resource.id !== id);
    saveResources();
    addActivity(`Deleted resource : ${deletedResource.title}`);
    renderResources();
    renderDeletedResources();
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

seedSubjectsFromResources();
renderSubjectOptions();
renderResources();
renderDeletedResources();

restoreAcademixFolderConnection().then(function (isConnected) {
    if (isConnected && folderStatus) {
        folderStatus.textContent =
            "Connected. Files will save into Academix / Subject folders.";
    }
});

// Initialize active filter button on load
const _initialBtn = document.querySelector(`.filter-buttons .filter-btn[data-type="${currentFilter}"]`);
if (_initialBtn) _initialBtn.classList.add('active');
