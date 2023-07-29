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

  setupFocusToggle();
  setupSiteToggle();
};

const setupStatistics = (tabsTime, isChromeInternalPage) => {
  const dateToString = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const siteTodayUsage = document.getElementById("site-today-usage");
  const sitesTodayUsage = document.getElementById("sites-today-usage");
  const siteWeekUsage = document.getElementById("site-week-usage");
  const sitesWeekUsage = document.getElementById("sites-week-usage");

  const date = new Date();
  const dateString = dateToString(date);

  const setupSiteTodayUsage = () => {
    if (isChromeInternalPage) {
      siteTodayUsage.textContent = "Page Not Applicable";
    } else if (tabsTime[dateString]) {
      const siteHrs = Math.floor((tabsTime[dateString][domain] ?? 0) / 3600000);
      const siteMins = Math.floor(((tabsTime[dateString][domain] ?? 0) % 3600000) / 60000);
      siteTodayUsage.textContent = `This Site: ${siteHrs} ${siteHrs === 0 ? "hr" : "hrs"} ${siteMins} ${
        siteMins === 0 ? "min" : "mins"
      }`;
    } else {
      siteTodayUsage.textContent = "This Site: 0 hr 0 min";
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
    } else {
      sitesTodayUsage.textContent = "All Sites: 0 hr 0 min";
    }
  };

  const prevWeekMonday = new Date();
  const prevWeekSunday = new Date();

  prevWeekMonday.setDate(date.getDate() - date.getDay() + 1 - 7);
  prevWeekSunday.setDate(date.getDate() - date.getDay());

  const prevWeekMondayStr = dateToString(prevWeekMonday);
  const prevWeekSundayStr = dateToString(prevWeekSunday);

  const setupSiteWeekUsage = () => {
    if (isChromeInternalPage) {
      siteWeekUsage.textContent = "Page Not Applicable";
    } else {
      const siteWeekSeconds =
        Object.keys(tabsTime).reduce((acc, dateKey) => {
          if (prevWeekMondayStr <= dateKey && dateKey <= prevWeekSundayStr) {
            return acc + (tabsTime[dateKey][domain] ?? 0);
          }
          return acc;
        }, 0) / 7;
      const siteHrs = Math.floor(siteWeekSeconds / 3600000);
      const siteMins = Math.floor((siteWeekSeconds % 3600000) / 60000);
      siteWeekUsage.textContent = `This Site: ${siteHrs} ${siteHrs === 0 ? "hr" : "hrs"} ${siteMins} ${
        siteMins === 0 ? "min" : "mins"
      }`;
    }
  };

  const setupSitesWeekUsage = () => {
    const sitesWeekSeconds =
      Object.keys(tabsTime).reduce((acc, dateKey) => {
        if (prevWeekMondayStr <= dateKey && dateKey <= prevWeekSundayStr) {
          return acc + Object.values(tabsTime[dateKey]).reduce((acc2, curr) => acc2 + curr, 0);
        }
        return acc;
      }, 0) / 7;
    const sitesHrs = Math.floor(sitesWeekSeconds / 3600000);
    const sitesMins = Math.floor((sitesWeekSeconds % 3600000) / 60000);
    sitesWeekUsage.textContent = `All Sites: ${sitesHrs} ${sitesHrs === 0 ? "hr" : "hrs"} ${sitesMins} ${
      sitesMins === 0 ? "min" : "mins"
    }`;
  };

  setupSiteTodayUsage();
  setupSitesTodayUsage();
  setupSiteWeekUsage();
  setupSitesWeekUsage();
};

const setupFocusTab = () => {
  const { tabsTime } = storage;

  if (url.protocol === "chrome:" || url.protocol === "chrome-extension:") {
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

  document.getElementById("source-code").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://github.com/cats256/FocusBlock" });
  });
};

setupFocusTab();
