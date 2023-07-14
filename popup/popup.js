const addBlockedSite = (array, baseUrl) => {
  if (!array.includes(baseUrl)) {
    array.push(baseUrl);
    chrome.storage.local.set({ array });
  }
};

const removeBlockedSite = (array, baseUrl) => {
  array = array.filter((element) => element !== baseUrl);
  chrome.storage.local.set({ array });
};

const body = document.querySelector("body");

const array = (await chrome.storage.local.get(["array"])).array;
array.forEach((element) => {
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

const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");

addButton.addEventListener("click", () => addBlockedSite(array, baseUrl));
removeButton.addEventListener("click", () => removeBlockedSite(array, baseUrl));
