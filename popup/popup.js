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

const focusToggle = document.getElementById("focus-toggle");
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

const siteToggle = document.getElementById("site-toggle");
if (blockedSites.includes(baseUrl)) {
  siteToggle.textContent = "Remove From Blocklist";
  siteToggle.addEventListener("click", () =>
    removeBlockedSite(blockedSites, baseUrl)
  );
} else {
  siteToggle.textContent = "Add To Blocklist";
  siteToggle.addEventListener("click", () =>
    addBlockedSite(blockedSites, baseUrl)
  );
}
