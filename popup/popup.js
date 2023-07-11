const addBlockedSite = (array, baseUrl) => {
    if (!array.includes(baseUrl)) {
        array.push(baseUrl);
        chrome.storage.local.set({ array });
    }
};

chrome.storage.local.get(["array"]).then(async (result) => {
    const array = result.array;
    const body = document.querySelector("body");

    array.forEach((element) => {
        const div = document.createElement("div");
        div.textContent = element;
        body.appendChild(div);
    });

    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const url = new URL(tabs[0].url);
    const baseUrl = url.protocol + "//" + url.host;

    const addButton = document.getElementById("add-button");

    addButton.addEventListener("click", () => addBlockedSite(array, baseUrl));
});