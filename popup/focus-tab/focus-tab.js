const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
const url = new URL(tabs[0].url);
const domain = url.host.replace("www.", "");

const setupToggles = (storage, isChromeInternalPage) => {
  const focusToggle = document.getElementById("focus-toggle");
  const siteToggle = document.getElementById("site-toggle");
  const listMode = document.getElementById("list-mode");

  let { focusMode, blockedSites, whiteListMode } = storage;

  const setupFocusToggle = () => {
    focusToggle.textContent = focusMode ? "Disable Focus Mode" : "Enable Focus Mode";
    focusToggle.addEventListener("click", () => {
      focusMode = !focusMode;
      focusToggle.textContent = focusMode ? "Disable Focus Mode" : "Enable Focus Mode";
      chrome.tabs.sendMessage(tabs[0].id, focusMode ? "Focus Mode Enabled" : "Focus Mode Disabled");
      chrome.storage.local.set({ focusMode });
    });
  };

  const setupSiteToggle = () => {
    siteToggle.textContent = blockedSites.includes(domain) ? "Remove From Blocklist" : "Add To Blocklist";
    siteToggle.addEventListener("click", () => {
      if (blockedSites.includes(domain)) {
        blockedSites = blockedSites.filter((element) => element !== domain);
        chrome.tabs.sendMessage(tabs[0].id, "Removed From Block List");
        siteToggle.textContent = "Add To Block List";
      } else {
        blockedSites.push(domain);
        chrome.tabs.sendMessage(tabs[0].id, "Added To Block List");
        siteToggle.textContent = "Remove From Block List";
      }
      chrome.storage.local.set({ blockedSites });
    });
  };

  const setupListMode = () => {
    listMode.textContent = whiteListMode ? "Enable Blocklist Mode" : "Enable Whitelist Mode";
    listMode.addEventListener("click", () => {
      whiteListMode = !whiteListMode;
      listMode.textContent = whiteListMode ? "Enable Blocklist Mode" : "Enable Whitelist Mode";
      chrome.tabs.sendMessage(tabs[0].id, whiteListMode ? "Whitelist Mode Enabled" : "Blocklist Mode Enabled");
      chrome.storage.local.set({ whiteListMode });
    });
  };

  setupFocusToggle();
  isChromeInternalPage ? (siteToggle.textContent = "Page Not Applicable") : setupSiteToggle();
  setupListMode();
};

const setupStatistics = (tabsTime) => {
  const siteTodayUsage = document.getElementById("site-today-usage");
  const sitesTodayUsage = document.getElementById("sites-today-usage");

  const setupSiteTodayUsage = () => {
    const siteHrs = Math.floor((tabsTime[domain] ?? 0) / 3600000);
    const siteMins = Math.floor(((tabsTime[domain] ?? 0) % 3600000) / 60000);
    siteTodayUsage.textContent = `This Site: ${siteHrs} ${siteHrs === 0 ? "hr" : "hrs"} ${siteMins} ${
      siteMins === 0 ? "min" : "mins"
    }`;
  };

  const setupSitesTodayUsage = () => {
    const sitesTodaySeconds = Object.values(tabsTime).reduce((acc, curr) => acc + curr, 0);
    const sitesHrs = Math.floor(sitesTodaySeconds / 3600000);
    const sitesMins = Math.floor((sitesTodaySeconds % 3600000) / 60000);
    sitesTodayUsage.textContent = `All Sites: ${sitesHrs} ${sitesHrs === 0 ? "hr" : "hrs"} ${sitesMins} ${
      sitesMins === 0 ? "min" : "mins"
    }`;
  };

  setupSiteTodayUsage();
  setupSitesTodayUsage();
};

const storage = await chrome.storage.local.get();
const tabsTime = storage.tabsTime;

if (url.protocol === "chrome:") {
  setupToggles(storage, true);
} else {
  setupToggles(storage, false);

  chrome.storage.onChanged.addListener((changes) => {
    console.log(changes);
    setupStatistics(changes.tabsTime.newValue);
  });
}

setupStatistics(tabsTime);
