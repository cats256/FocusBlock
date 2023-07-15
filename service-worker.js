chrome.storage.local.get().then((storage) => {
  if (!storage.blockedSites) {
    chrome.storage.local.set({ blockedSites: [] });
  }

  if (!storage.tabsTime) {
    chrome.storage.local.set({ tabsTime: {} });
  }

  if (!storage.activeTab) {
    chrome.storage.local.set({
      activeTab: {
        url: null,
        startTime: null,
      },
    });
  }
});

chrome.tabs.onActivated.addListener(async () => {
  const currentTime = new Date().getTime();
  const storage = await chrome.storage.local.get();
  const lastActiveTab = storage.activeTab.url;

  if (lastActiveTab) {
    if (storage.tabsTime[lastActiveTab]) {
      storage.tabsTime[lastActiveTab] +=
        currentTime - storage.activeTab.startTime;
    } else {
      storage.tabsTime[lastActiveTab] =
        currentTime - storage.activeTab.startTime;
    }
    chrome.storage.local.set({ tabsTime: storage.tabsTime });
  }

  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  let url = new URL(tabs[0].url);
  url = url.host.replace("www.", "");

  chrome.storage.local.set({
    activeTab: { url, startTime: currentTime },
  });
});

// chrome.tabs.onRemoved.addListener(async () => {});
