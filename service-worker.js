const result = await chrome.storage.local.get();
if (!result.array) chrome.storage.local.set({ array: [] });
