function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function removeData(key) {
    localStorage.removeItem(key);
}