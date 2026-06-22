const noteState = {
    notes: [],
    selectedId: null,
    mode: 'preview',
    active: false
};

const STORAGE_KEY = 'academix_notes';

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(noteState.notes));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            noteState.notes = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading notes:', e);
        }
    }
}

function addActivity(text) {

    let activity =
        JSON.parse(
            localStorage.getItem("activity")
        ) || [];

    activity.unshift({

        text,

        time:
            new Date()
                .toLocaleString()

    });

    if (activity.length > 10) {

        activity.pop();

    }

    localStorage.setItem(

        "activity",

        JSON.stringify(activity)

    );

}

const newNoteBtn = document.getElementById('newNoteBtn');
const searchNote = document.getElementById('searchNote');
const pinnedList = document.getElementById('pinnedList');
const notesList = document.getElementById('notesList');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const noteTags = document.getElementById('noteTags');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');
const pinToggle = document.getElementById('pinToggle');
const bookmarkToggle = document.getElementById('bookmarkToggle');
const toggleViewBtn = document.getElementById('toggleViewBtn');
const noteItemTemplate = document.getElementById('noteItemTemplate');
const noteEditor = document.querySelector('.note-editor');

function createNoteItem(note) {
    const clone = noteItemTemplate.content.firstElementChild.cloneNode(true);
    clone.dataset.id = note.id;
    clone.dataset.pinned = note.pinned;
    clone.dataset.bookmarked = note.bookmarked;

    const titleEl = clone.querySelector('.note-title');
    const excerptEl = clone.querySelector('.note-excerpt');
    const editBtn = clone.querySelector('.btn-edit');
    const pinBtn = clone.querySelector('.btn-pin');
    const bookmarkBtn = clone.querySelector('.btn-bookmark');
    const deleteBtn = clone.querySelector('.btn-delete');

    titleEl.textContent = note.title || 'Untitled note';
    const temp = document.createElement('div');
    temp.innerHTML = note.content;

    excerptEl.textContent = temp.textContent.slice(0, 80) || 'No content yet.';

    if (note.tags.length > 0) {

        excerptEl.textContent +=

            "\n#" +

            note.tags.join(" #");

    }

    if (note.pinned) {
        clone.classList.add('pinned');
        pinBtn.querySelector('i').style.color = '#f59e0b';
    }

    if (note.bookmarked) {
        bookmarkBtn.classList.add('active');
        bookmarkBtn.querySelector('i').style.color = '#f97316';
    }

    if (noteState.selectedId === note.id) {
        clone.classList.add('active');
    }

    clone.addEventListener('click', () => selectNote(note.id));
    editBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        selectNote(note.id);
    });
    pinBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        togglePin(note.id);
    });
    bookmarkBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleBookmark(note.id);
    });
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        removeNote(note.id);
    });

    return clone;
}

function renderNotes() {
    pinnedList.innerHTML = '';
    notesList.innerHTML = '';

    const filtered = noteState.notes.filter(note => {
        const query = searchNote.value.toLowerCase();
        return (

            note.title
                .toLowerCase()
                .includes(query)

            ||

            note.content
                .toLowerCase()
                .includes(query)

            ||

            note.tags
                .join(" ")
                .toLowerCase()
                .includes(query)

        );
    });

    const pinnedNotes = filtered.filter(note => note.pinned);
    const normalNotes = filtered.filter(note => !note.pinned);

    if (!pinnedNotes.length) {
        pinnedList.innerHTML = '<div class="empty-note">No pinned notes</div>';
    }
    pinnedNotes.forEach(note => pinnedList.appendChild(createNoteItem(note)));

    if (!normalNotes.length) {
        notesList.innerHTML = '<div class="empty-note">No notes yet</div>';
    }
    normalNotes.forEach(note => notesList.appendChild(createNoteItem(note)));
}

function setEditorState(active) {
    noteState.active = active;
    if (active) {
        noteEditor.classList.add('active');
        saveNoteBtn.disabled = false;
        deleteNoteBtn.disabled = false;
        toggleViewBtn.disabled = false;
    } else {
        noteEditor.classList.remove('active');
        saveNoteBtn.disabled = true;
        deleteNoteBtn.disabled = true;
        toggleViewBtn.disabled = true;
    }
}

function updateToggleButtons(note) {
    pinToggle.classList.toggle('active', note.pinned);
    bookmarkToggle.classList.toggle('active', note.bookmarked);
    pinToggle.querySelector('i').style.color = note.pinned ? '#f59e0b' : '#374151';
    bookmarkToggle.querySelector('i').style.color = note.bookmarked ? '#f97316' : '#374151';
}

function updateModeButtons() {
     if (!noteState.active) {
        noteTitle.disabled = true;
        noteContent.contentEditable = false;
        return;
    }

    if (noteState.mode === 'edit') {
        toggleViewBtn.textContent = 'Preview';
        noteTitle.disabled = false;
        noteContent.contentEditable = true;
    } else {
        toggleViewBtn.textContent = 'Edit';
        noteTitle.disabled = true;
        noteContent.contentEditable = false;
    }
}

function selectNote(id) {
    const note = noteState.notes.find(item => item.id === id);
    if (!note) return;

    noteState.selectedId = id;
    noteState.mode = 'edit';
    noteState.active = true;

    noteTitle.value = note.title;
    noteContent.innerHTML = note.content;
    noteTags.value =
    note.tags.join(",");
    updateToggleButtons(note);
    updateModeButtons();
    setEditorState(true);
    renderNotes();
}

function resetEditor() {
    noteState.selectedId = null;
    noteState.mode = 'edit';
    noteState.active = true;
    noteTitle.value = '';
    noteContent.innerHTML = '';
    noteTags.value="";
    updateToggleButtons({ pinned: false, bookmarked: false });
    updateModeButtons();
    setEditorState(true);
}

function saveNote() {
    if (!noteTitle.value.trim() && !noteContent.innerHTML.trim()) {
        return;
    }

    const existingIndex = noteState.notes.findIndex(item => item.id === noteState.selectedId);
    const noteData = {

        id: noteState.selectedId || `note-${Date.now()}`,

        title: noteTitle.value.trim() || 'Untitled note',

        content: noteContent.innerHTML,

        pinned: pinToggle.classList.contains('active'),

        bookmarked: bookmarkToggle.classList.contains('active'),

        tags:
            noteTags.value
                .split(",")
                .map(
                    tag => tag.trim()
                )
                .filter(
                    tag => tag !== ""
                ),
        createdAt:
            new Date().toLocaleString()

    };

    if (existingIndex >= 0) {
        noteState.notes[existingIndex] = noteData;
    } else {
        noteState.notes.push(noteData);
        noteState.selectedId = noteData.id;
    }

    saveToLocalStorage();
    addActivity(

        "Added note : " +

        noteData.title

    );
    resetEditor();
    renderNotes();
}

function removeNote(id) {
    noteState.notes = noteState.notes.filter(note => note.id !== id);
    if (noteState.selectedId === id) {
        resetEditor();
    }
    addActivity(
        "Deleted note"
    );
    saveToLocalStorage();
    renderNotes();
}

function togglePin(id) {
    const note = noteState.notes.find(item => item.id === id);
    if (!note) return;
    note.pinned = !note.pinned;
    addActivity(

        note.pinned
            ?
            "Pinned note"
            :
            "Unpinned note"

    );
    saveToLocalStorage();
    renderNotes();
    if (noteState.selectedId === id) {
        updateToggleButtons(note);
    }
}

function toggleBookmark(id) {
    const note = noteState.notes.find(item => item.id === id);
    if (!note) return;
    note.bookmarked = !note.bookmarked;
    saveToLocalStorage();
    renderNotes();
    if (noteState.selectedId === id) {
        updateToggleButtons(note);
    }
}

function toggleViewMode() {
    noteState.mode = noteState.mode === 'edit' ? 'preview' : 'edit';
    updateModeButtons();
}

function initNotes() {
    loadFromLocalStorage();
    newNoteBtn.addEventListener('click', resetEditor);
    saveNoteBtn.addEventListener('click', saveNote);
    deleteNoteBtn.addEventListener('click', () => {
        if (noteState.selectedId) removeNote(noteState.selectedId);
    });
    pinToggle.addEventListener('click', () => {
        if (noteState.selectedId) togglePin(noteState.selectedId);
    });
    bookmarkToggle.addEventListener('click', () => {
        if (noteState.selectedId) toggleBookmark(noteState.selectedId);
    });
    toggleViewBtn.addEventListener('click', () => {
        if (noteState.active) toggleViewMode();
    });
    searchNote.addEventListener('input', renderNotes);
    setEditorState(false);
    updateModeButtons();
    renderNotes();
}

window.addEventListener(

    "DOMContentLoaded",

    () => {

        initNotes();

        const selectedId =

            localStorage.getItem(

                "selectedNoteId"

            );

        if (selectedId) {

            selectNote(selectedId);

            localStorage.removeItem(

                "selectedNoteId"

            );

        }

    }

);


const imageToggle = document.getElementById("imageToggle");
const imageInput = document.getElementById("imageInput");

imageToggle.addEventListener("click", () => {

    if (!noteState.active) return;

    if (noteState.mode !== 'edit') {
        alert("Switch to Edit mode to upload images.");
        return;
    }

    imageInput.click();
});

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        const img = document.createElement("img");
        img.src = event.target.result;

        noteContent.appendChild(img);
    };

    reader.readAsDataURL(file);
});
