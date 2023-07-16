chrome.storage.local.clear();
chrome.storage.local.set({
  tabsTime: {
    'chat.openai.com': 314000,
    'developer.mozilla.org': 45000,
    'discord.com': 538000,
    'github.com': 175000,
    'google.com': 24000,
    'stackoverflow.com': 41000,
  },
});

chrome.storage.local.get().then((storage) => {
  if (!storage.blockedSites) {
    chrome.storage.local.set({ blockedSites: [] });
  }

  if (!storage.tabsTime) {
    chrome.storage.local.set({ tabsTime: {} });
  }
});
