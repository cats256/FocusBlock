chrome.storage.local.get().then((storage) => {
  if (!storage.blockedSites) {
    chrome.storage.local.set({
      blockedSites: [],
      tabsTime: {},
      unblockTimes: {},
      backgroundImage: "icons/dangerous.svg",
      quote: "life begins at the end of your comfort zone",
      pomodoroInformation: {
        cyclesTimes: [],
      },
    });
  }
});
