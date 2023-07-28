const blockedSitesDiv = document.getElementById("blocked-sites");

const siteInput = document.getElementById("site-input");
const addButton = document.getElementById("add-button");

const backgroundImageDropdown = document.getElementById("background-img-dropdown");
const backgroundImagePreview = document.getElementById("background-img-preview");

const saveButton = document.getElementById("save-button");
const quoteInput = document.getElementById("quote-input");

const tabsTimeDiv = document.getElementById("tabs-time");

const storage = await chrome.storage.local.get(["backgroundImage", "blockedSites", "tabsTime"]);
const { backgroundImage, tabsTime } = storage;

let { blockedSites } = storage;

const createSiteDiv = (site) => {
  const siteDiv = document.createElement("div");
  siteDiv.classList.add("site");
  siteDiv.innerHTML = `
    <span>${site}</span> 
    <button class="remove-button">remove</button>
  `;

  siteDiv.querySelector(".remove-button").addEventListener("click", () => {
    siteDiv.remove();
    blockedSites = blockedSites.filter((blockedSite) => blockedSite !== site);
    chrome.storage.local.set({ blockedSites });
  });

  return siteDiv;
};

const addSiteToBlockedSites = () => {
  const site = siteInput.value.toLowerCase().trim();

  if (site) {
    if (!blockedSites.includes(site)) {
      const siteDiv = createSiteDiv(site);
      const insertIndex = blockedSites.findIndex((blockedSite) => blockedSite.localeCompare(site) > 0);

      if (insertIndex === -1) {
        blockedSitesDiv.appendChild(siteDiv);
        blockedSites.push(site);
      } else {
        blockedSitesDiv.insertBefore(siteDiv, blockedSitesDiv.children[insertIndex]);
        blockedSites.splice(insertIndex, 0, site);
      }

      chrome.storage.local.set({ blockedSites });
    } else {
      siteInput.value = "";
    }
  }
};

blockedSites.sort((a, b) => a.localeCompare(b));
blockedSites.forEach((site) => {
  const siteDiv = createSiteDiv(site);
  blockedSitesDiv.appendChild(siteDiv);
});

addButton.addEventListener("click", () => {
  addSiteToBlockedSites();
});

siteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addSiteToBlockedSites();
  }
});

switch (backgroundImage) {
  case "icons/lotus.svg":
    backgroundImageDropdown.selectedIndex = 1;
    break;
  case "icons/icon.png":
    backgroundImageDropdown.selectedIndex = 2;
    break;
  default:
    backgroundImageDropdown.selectedIndex = 0;
    break;
}

backgroundImagePreview.src = `../${backgroundImage}`;

backgroundImageDropdown.addEventListener("change", (e) => {
  backgroundImagePreview.src = `../${e.target.value}`;
  chrome.storage.local.set({ backgroundImage: e.target.value });
});

saveButton.addEventListener("click", () => {
  chrome.storage.local.set({ quote: quoteInput.value.toLowerCase() });
  quoteInput.value = "";
});

quoteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    chrome.storage.local.set({ quote: quoteInput.value.toLowerCase() });
    quoteInput.value = "";
  }
});

const allTimeSitesUsage = {};

Object.keys(tabsTime).forEach((dateString) => {
  const dateDiv = document.createElement("div");
  dateDiv.classList.add("date-div");
  dateDiv.classList.add("collapsible");
  dateDiv.textContent = dateString;

  const sites = Object.keys(tabsTime[dateString]);
  sites.sort((a, b) => tabsTime[dateString][b] - tabsTime[dateString][a]);
  sites.forEach((site) => {
    const sitesHrs = Math.floor(tabsTime[dateString][site] / 3600000);
    const sitesMins = Math.floor((tabsTime[dateString][site] % 3600000) / 60000);
    const tabTimeSite = document.createElement("div");

    tabTimeSite.classList.add("tabs-time-site");
    tabTimeSite.innerHTML = `
    <div>${sitesHrs} ${sitesHrs === 0 ? "hr" : "hrs"} ${sitesMins} ${sitesMins === 0 ? "min" : "mins"}</div>
    <div>${site}</div>
    `;

    dateDiv.appendChild(tabTimeSite);

    allTimeSitesUsage[site] = (allTimeSitesUsage[site] ?? 0) + tabsTime[dateString][site];
  });

  tabsTimeDiv.insertBefore(dateDiv, tabsTimeDiv.firstChild);
});

const allTimesDiv = document.createElement("div");
allTimesDiv.id = "all-times-div";
allTimesDiv.textContent = "all time usage by site";

const allTimeSites = Object.keys(allTimeSitesUsage);
allTimeSites.sort((a, b) => allTimeSitesUsage[b] - allTimeSitesUsage[a]);
allTimeSites.forEach((site) => {
  const sitesHrs = Math.floor(allTimeSitesUsage[site] / 3600000);
  const sitesMins = Math.floor((allTimeSitesUsage[site] % 3600000) / 60000);
  const tabTimeSite = document.createElement("div");

  tabTimeSite.classList.add("tabs-time-site");
  tabTimeSite.innerHTML = `
  <div>${sitesHrs} ${sitesHrs === 0 ? "hr" : "hrs"} ${sitesMins} ${sitesMins === 0 ? "min" : "mins"}</div>
  <div>${site}</div>
  `;

  allTimesDiv.appendChild(tabTimeSite);
});

tabsTimeDiv.insertBefore(allTimesDiv, tabsTimeDiv.firstChild);
