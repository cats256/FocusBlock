const addBlockedSite = (blockedSites, baseUrl) => {
  blockedSites.push(baseUrl);
  chrome.storage.local.set({ blockedSites });
};

const removeBlockedSite = (blockedSites, baseUrl) => {
  blockedSites = blockedSites.filter((element) => element !== baseUrl);
  chrome.storage.local.set({ blockedSites });
};

const storage = await chrome.storage.local.get();
const body = document.querySelector("body");
const focusToggle = document.getElementById("focus-toggle");
let blockedSites = storage.blockedSites;
let focusMode = storage.focusModeToggle;

if (focusMode) {
  focusToggle.textContent = "Disable Focus Mode";
} else {
  focusToggle.textContent = "Enable Focus Mode";
}

focusToggle.addEventListener("click", () => {
  if (focusMode) {
    focusToggle.textContent = "Enable Focus Mode";
  } else {
    focusToggle.textContent = "Disable Focus Mode";
  }
  focusMode = !focusMode;
  chrome.storage.local.set({ focusModeToggle: focusMode });
});

const tabs = await chrome.tabs.query({
  active: true,
  lastFocusedWindow: true,
});
const url = new URL(tabs[0].url);
const baseUrl = url.protocol + "//" + url.host;
const siteToggle = document.getElementById("site-toggle");

if (blockedSites.includes(baseUrl)) {
  siteToggle.textContent = "Remove From Blocklist";
} else {
  siteToggle.textContent = "Add To Blocklist";
}

siteToggle.addEventListener("click", () => {
  if (blockedSites.includes(baseUrl)) {
    siteToggle.textContent = "Add To Block List";
    blockedSites = blockedSites.filter((element) => element !== baseUrl);
  } else {
    siteToggle.textContent = "Remove From Block List";
    blockedSites.push(baseUrl);
  }
  chrome.storage.local.set({ blockedSites });
});

if (blockedSites.length !== 0) {
  const blockListPanel = document.createElement("div");
  const focusTab = document.getElementById("focus-tab");

  focusTab.appendChild(blockListPanel);
  blockListPanel.id = "block-list-panel";
  blockedSites.forEach((element) => {
    const div = document.createElement("div");
    const url = new URL(element);

    div.textContent = url.host.replace("www.", "");
    blockListPanel.appendChild(div);
  });
}
