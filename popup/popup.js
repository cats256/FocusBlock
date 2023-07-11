const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");

addButton.addEventListener("click", () => {
    chrome.storage.local.get(["array"]).then((result) => {
        console.log(result)
        const array = result.array;
        chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tab) => {
            const url = new URL(tab[0].url);
            const baseUrl = url.protocol + "//" + url.host;
            array.push(baseUrl);
            chrome.storage.local.set({ array }).then(() => {
                console.log(array)
            });
        });
    });
});