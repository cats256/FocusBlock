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

const body = document.querySelector("body");
const storage = await chrome.storage.local.get();

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

const addButton = document.createElement("button");
const removeButton = document.createElement("button");

addButton.addEventListener("click", () =>
  addBlockedSite(blockedSites, baseUrl)
);
removeButton.addEventListener("click", () =>
  removeBlockedSite(blockedSites, baseUrl)
);

const focusMode = document.getElementById("focus-mode");
if (blockedSites.includes(baseUrl)) {
  removeButton.textContent = "Remove From Blocklist";
  focusMode.appendChild(removeButton);
} else {
  addButton.textContent = "Add To Blocklist";
  focusMode.appendChild(addButton);
}
