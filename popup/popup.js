const addBlockedSite = (blockedSites, baseUrl) => {
  if (!blockedSites.includes(baseUrl)) {
    blockedSites.push(baseUrl);
    chrome.storage.local.set({ blockedSites });
  }
};

const removeBlockedSite = (blockedSites, baseUrl) => {
  blockedSites = blockedSites.filter((element) => element !== baseUrl);
  chrome.storage.local.set({ blockedSites });
};

const storage = await chrome.storage.local.get();
const body = document.querySelector("body");

const blockedSites = storage.blockedSites;
blockedSites.forEach((element) => {
  const div = document.createElement("div");
  div.textContent = element;
  body.appendChild(div);
});

const tabs = await chrome.tabs.query({
  active: true,
  lastFocusedWindow: true,
});
const url = new URL(tabs[0].url);
const baseUrl = url.protocol + "//" + url.host;

const focusMode = document.getElementById("focus-mode");

const focusToggle = document.getElementById("focus-mode-toggle");
let focusModeToggle = storage.focusModeToggle;

if (focusModeToggle) {
  focusToggle.textContent = "Disable Focus Mode";
} else {
  focusToggle.textContent = "Enable Focus Mode";
}

focusToggle.addEventListener("click", () => {
  if (focusModeToggle) {
    focusToggle.textContent = "Enable Focus Mode";
  } else {
    focusToggle.textContent = "Disable Focus Mode";
  }
  focusModeToggle = !focusModeToggle;
  chrome.storage.local.set({ focusModeToggle });
});

const blockSiteToggle = document.getElementById("site-toggle");
if (blockedSites.includes(baseUrl)) {
  blockSiteToggle.textContent = "Remove From Blocklist";
  blockSiteToggle.addEventListener("click", () =>
    removeBlockedSite(blockedSites, baseUrl)
  );
} else {
  blockSiteToggle.textContent = "Add To Blocklist";
  blockSiteToggle.addEventListener("click", () =>
    addBlockedSite(blockedSites, baseUrl)
  );
}
