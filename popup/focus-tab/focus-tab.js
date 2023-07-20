chrome.runtime.onMessage.addListener(async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tabs[0].url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const domain = url.host.replace("www.", "");

  const focusToggle = document.getElementById("focus-toggle");
  const siteToggle = document.getElementById("site-toggle");
  const siteTodayUsage = document.getElementById("site-today-usage");
  const sitesTodayUsage = document.getElementById("sites-today-usage");
  const storage = await chrome.storage.local.get();

  let { focusMode, blockedSites } = storage;

  const setupFocusToggle = () => {
    focusToggle.textContent = focusMode ? "Disable Focus Mode" : "Enable Focus Mode";
    focusToggle.addEventListener("click", () => {
      focusMode = !focusMode;
      focusToggle.textContent = focusMode ? "Disable Focus Mode" : "Enable Focus Mode";
      chrome.storage.local.set({ focusMode });
    });
  };

  const setupSiteToggle = () => {
    siteToggle.textContent = blockedSites.includes(baseUrl) ? "Remove From Blocklist" : "Add To Blocklist";
    siteToggle.addEventListener("click", () => {
      if (blockedSites.includes(baseUrl)) {
        blockedSites = blockedSites.filter((element) => element !== baseUrl);
        chrome.tabs.sendMessage(tabs[0].id, "Removed From Block List");
        siteToggle.textContent = "Add To Block List";
      } else {
        blockedSites.push(baseUrl);
        chrome.tabs.sendMessage(tabs[0].id, "Added To Block List");
        siteToggle.textContent = "Remove From Block List";
      }
      chrome.storage.local.set({ blockedSites });
    });
  };

  const setupSiteTodayUsage = () => {
    const siteHrs = Math.floor((storage.tabsTime[domain] ?? 0) / 3600000);
    const siteMins = Math.floor(((storage.tabsTime[domain] ?? 0) % 3600000) / 60000);
    siteTodayUsage.textContent = `This Site: ${siteHrs} ${siteHrs === 0 ? "hr" : "hrs"} ${siteMins} ${
      siteMins === 0 ? "min" : "mins"
    }`;
  };

  const setupSitesTodayUsage = () => {
    const sitesTodaySeconds = Object.values(storage.tabsTime).reduce((acc, curr) => acc + curr, 0);
    const sitesHrs = Math.floor(sitesTodaySeconds / 3600000);
    const sitesMins = Math.floor((sitesTodaySeconds % 3600000) / 60000);
    sitesTodayUsage.textContent = `All Sites: ${sitesHrs} ${sitesHrs === 0 ? "hr" : "hrs"} ${sitesMins} ${
      sitesMins === 0 ? "min" : "mins"
    }`;
  };

  setupFocusToggle();
  setupSiteToggle();
  setupSiteTodayUsage();
  setupSitesTodayUsage();
});
