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

const timer = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length !== 0) {
    console.log('Tabs', tabs);
    let url = tabs[0].url ? new URL(tabs[0].url) : new URL(tabs[0].pendingUrl);
    if (url.host !== 'newtab') {
      url = url.host.replace('www.', '');

      const { tabsTime } = await chrome.storage.local.get();
      if (tabsTime[url]) {
        tabsTime[url] += 5;
      } else {
        tabsTime[url] = 5;
      }

      chrome.storage.local.set({ tabsTime });
    }
  }
};
setInterval(timer, 5000);
