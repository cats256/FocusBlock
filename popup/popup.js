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

const body = document.querySelector("body");

chrome.storage.local.get(["array"]).then((result) => {
    const array = result.array;
    array.forEach((element) => {
        const div = document.createElement("div");
        div.textContent = element;
        body.appendChild(div);
    });
});