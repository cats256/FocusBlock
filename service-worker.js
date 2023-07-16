chrome.storage.local.get().then((storage) => {
  if (!storage.blockedSites) {
    chrome.storage.local.set({ blockedSites: [], tabsTime: {} });
  }
});

chrome.runtime.onMessage.addListener(() => {});
