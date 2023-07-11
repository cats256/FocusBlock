// const array = ["www.youtube.com", "www.facebook.com", "www.instagram.com"];
// chrome.storage.local.set({ array })
// chrome.storage.clear();

chrome.storage.local.get(["array"]).then((result) => {
    if (!result.array) {
        chrome.storage.local.set({ array: [] });
    }
});

const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");

addButton.addEventListener("click", () => {
    chrome.storage.local.get(["array"]).then((result) => {
        const array = result.array;
        chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tab) => {
            array.push(tab[0].url);
            chrome.storage.local.set({ array }).then(() => {
                console.log(array)
            });
        });
    });
});