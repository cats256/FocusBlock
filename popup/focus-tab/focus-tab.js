const focusTabHTML = await fetch("focus-tab/focus-tab.html");
const focusTabHTMLText = await focusTabHTML.text();
document.getElementById("focus-tab").innerHTML = focusTabHTMLText;

const storage = await chrome.storage.local.get(["focusMode", "blockedSites", "whiteListMode", "tabsTime"]);

const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
const url = new URL(tabs[0].url);
const domain = url.host.replace("www.", "");

const setupToggles = (isChromeInternalPage) => {
  const focusToggle = document.getElementById("focus-toggle");
  const siteToggle = document.getElementById("site-toggle");
  const listMode = document.getElementById("list-mode");

  let { focusMode, blockedSites, whiteListMode } = storage;

  const setupFocusToggle = () => {
    focusToggle.textContent = focusMode ? "Disable Focus Mode" : "Enable Focus Mode";
    focusToggle.addEventListener("click", () => {
      focusMode = !focusMode;
      focusToggle.textContent = focusMode ? "Disable Focus Mode" : "Enable Focus Mode";
      chrome.storage.local.set({ focusMode });
    });
  };

  const setupSiteToggle = () => {
    if (isChromeInternalPage) {
      siteToggle.textContent = "Page Not Applicable";
    } else {
      siteToggle.textContent = blockedSites.includes(domain) ? "Remove From Blocklist" : "Add To Blocklist";
      siteToggle.addEventListener("click", () => {
        if (blockedSites.includes(domain)) {
          blockedSites = blockedSites.filter((element) => element !== domain);
          siteToggle.textContent = "Add To Block List";
        } else {
          blockedSites.push(domain);
          siteToggle.textContent = "Remove From Block List";
        }
        chrome.storage.local.set({ blockedSites });
      });
    }
  };

  const setupListToggle = () => {
    listMode.textContent = whiteListMode ? "Enable Blocklist Mode" : "Enable Whitelist Mode";
    listMode.addEventListener("click", () => {
      whiteListMode = !whiteListMode;
      listMode.textContent = whiteListMode ? "Enable Blocklist Mode" : "Enable Whitelist Mode";
      chrome.storage.local.set({ whiteListMode });
    });
  };

  setupFocusToggle();
  setupSiteToggle();
  setupListToggle();
};

const setupStatistics = (tabsTime, isChromeInternalPage) => {
  const siteTodayUsage = document.getElementById("site-today-usage");
  const sitesTodayUsage = document.getElementById("sites-today-usage");

  const date = new Date();
  const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;

  const setupSiteTodayUsage = () => {
    if (isChromeInternalPage) {
      siteTodayUsage.textContent = "Page Not Applicable";
    } else if (tabsTime[dateString]) {
      const siteHrs = Math.floor((tabsTime[dateString][domain] ?? 0) / 3600000);
      const siteMins = Math.floor(((tabsTime[dateString][domain] ?? 0) % 3600000) / 60000);
      siteTodayUsage.textContent = `This Site: ${siteHrs} ${siteHrs === 0 ? "hr" : "hrs"} ${siteMins} ${
        siteMins === 0 ? "min" : "mins"
      }`;
    }
  };

  const setupSitesTodayUsage = () => {
    if (tabsTime[dateString]) {
      const sitesTodaySeconds = Object.values(tabsTime[dateString]).reduce((acc, curr) => acc + curr, 0);
      const sitesHrs = Math.floor(sitesTodaySeconds / 3600000);
      const sitesMins = Math.floor((sitesTodaySeconds % 3600000) / 60000);
      sitesTodayUsage.textContent = `All Sites: ${sitesHrs} ${sitesHrs === 0 ? "hr" : "hrs"} ${sitesMins} ${
        sitesMins === 0 ? "min" : "mins"
      }`;
    }
  };

  setupSiteTodayUsage();
  setupSitesTodayUsage();
};

const setupFocusTab = () => {
  const { tabsTime } = storage;

  if (url.protocol === "chrome:") {
    setupToggles(true);
    setupStatistics(tabsTime, true);
  } else {
    setupToggles(false);
    setupStatistics(tabsTime, false);

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.tabsTime) {
        setupStatistics(changes.tabsTime.newValue, false);
      }
    });
  }
};

setupFocusTab();
