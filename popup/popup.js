const array = ["www.youtube.com", "www.facebook.com", "www.instagram.com"];
chrome.storage.local.set({ array })

chrome.storage.local.get(["array"]).then((result) => {
    if (!result.array) {
        chrome.storage.local.set({ array: [] });
    }
});