chrome.storage.local.get(["array"]).then((result) => {
    if (!result.array) {
        chrome.storage.local.set({ array: [] });
    }
});