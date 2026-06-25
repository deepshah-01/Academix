const ACADEMIX_DB_NAME = "academix-device-folder";
const ACADEMIX_DB_VERSION = 1;
const ACADEMIX_HANDLE_STORE = "folder-handles";
const ACADEMIX_HANDLE_KEY = "academix-folder";

let cachedAcademixHandle = null;

function openHandleDatabase() {
    return new Promise(function (resolve, reject) {
        const request = indexedDB.open(ACADEMIX_DB_NAME, ACADEMIX_DB_VERSION);

        request.onerror = function () {
            reject(request.error);
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onupgradeneeded = function (event) {
            event.target.result.createObjectStore(ACADEMIX_HANDLE_STORE);
        };
    });
}

async function persistAcademixHandle(handle) {
    const db = await openHandleDatabase();

    return new Promise(function (resolve, reject) {
        const tx = db.transaction(ACADEMIX_HANDLE_STORE, "readwrite");
        tx.objectStore(ACADEMIX_HANDLE_STORE).put(handle, ACADEMIX_HANDLE_KEY);
        tx.oncomplete = function () {
            resolve();
        };
        tx.onerror = function () {
            reject(tx.error);
        };
    });
}

async function loadPersistedAcademixHandle() {
    const db = await openHandleDatabase();

    return new Promise(function (resolve, reject) {
        const tx = db.transaction(ACADEMIX_HANDLE_STORE, "readonly");
        const request = tx.objectStore(ACADEMIX_HANDLE_STORE).get(ACADEMIX_HANDLE_KEY);

        request.onsuccess = function () {
            resolve(request.result || null);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}

async function ensureAcademixHandlePermission(handle) {
    const permission = await handle.queryPermission({ mode: "readwrite" });

    if (permission === "granted") {
        return true;
    }

    if (permission === "prompt") {
        const result = await handle.requestPermission({ mode: "readwrite" });
        return result === "granted";
    }

    return false;
}

async function resolveAcademixHandle() {
    if (cachedAcademixHandle) {
        const hasAccess = await ensureAcademixHandlePermission(cachedAcademixHandle);
        if (hasAccess) {
            return cachedAcademixHandle;
        }
    }

    const storedHandle = await loadPersistedAcademixHandle();
    if (!storedHandle) {
        return null;
    }

    const hasAccess = await ensureAcademixHandlePermission(storedHandle);
    if (!hasAccess) {
        return null;
    }

    cachedAcademixHandle = storedHandle;
    return storedHandle;
}

function parseStoredPath(storedPath) {
    const parts = storedPath.split("/").filter(Boolean);

    if (parts.length < 3 || parts[0] !== "Academix") {
        return null;
    }

    return {
        subject: parts[1],
        fileName: parts.slice(2).join("/")
    };
}

async function connectAcademixDeviceFolder() {
    if (!window.showDirectoryPicker) {
        throw new Error(
            "Your browser does not support direct folder saving. Use a Chromium browser on desktop for this feature."
        );
    }

    const rootHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    const academixHandle = await rootHandle.getDirectoryHandle("Academix", { create: true });

    cachedAcademixHandle = academixHandle;
    await persistAcademixHandle(academixHandle);

    return academixHandle;
}

async function saveFileToAcademixFolder(file, subject) {
    const handle = await resolveAcademixHandle();

    if (!handle) {
        throw new Error("Connect a device folder before uploading files.");
    }

    const subjectFolder = await handle.getDirectoryHandle(subject, { create: true });
    const fileHandle = await subjectFolder.getFileHandle(file.name, { create: true });
    const writable = await fileHandle.createWritable();

    await writable.write(file);
    await writable.close();

    return "Academix/" + subject + "/" + file.name;
}

async function openStoredDeviceFile(storedPath) {
    if (!storedPath) {
        throw new Error("No device file path is saved for this resource.");
    }

    const parsedPath = parseStoredPath(storedPath);

    if (!parsedPath) {
        throw new Error("Saved file path is invalid: " + storedPath);
    }

    const handle = await resolveAcademixHandle();

    if (!handle) {
        throw new Error(
            'Device folder is not connected. Open Resources, click "Connect Device Folder", and allow access again.'
        );
    }

    try {
        const subjectFolder = await handle.getDirectoryHandle(parsedPath.subject);
        const fileHandle = await subjectFolder.getFileHandle(parsedPath.fileName);
        const file = await fileHandle.getFile();
        const blobUrl = URL.createObjectURL(file);
        const openedWindow = window.open(blobUrl, "_blank", "noopener,noreferrer");

        if (!openedWindow) {
            URL.revokeObjectURL(blobUrl);
            throw new Error("Browser blocked the file from opening. Allow pop-ups and try again.");
        }

        window.setTimeout(function () {
            URL.revokeObjectURL(blobUrl);
        }, 60000);
    } catch (error) {
        if (error.name === "NotFoundError") {
            throw new Error(
                'File not found at "' +
                storedPath +
                '". It may have been moved, renamed, or deleted from your device folder.'
            );
        }

        throw error;
    }
}

async function restoreAcademixFolderConnection() {
    const handle = await resolveAcademixHandle();
    return Boolean(handle);
}
