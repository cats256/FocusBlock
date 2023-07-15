chrome.storage.local.clear();
chrome.storage.local.get().then((storage) => {
  if (!storage.blockedSites) {
    chrome.storage.local.set({ blockedSites: [] });
  }

  if (!storage.tabsTime) {
    chrome.storage.local.set({ tabsTime: {} });
  }
});

const timer = () => async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length !== 0) {
    let url = new URL(tabs[0].url);
    url = url.host.replace('www.', '');

    const { tabsTime } = await chrome.storage.local.get();
    if (tabsTime[url]) {
      tabsTime[url] += 1000;
    } else {
      tabsTime[url] = 1000;
    }

    chrome.storage.local.set({ tabsTime });
  }
};
setInterval(timer(), 1000);
