const storage = await chrome.storage.local.get();
const focusToggle = document.getElementById('focus-toggle');
let { blockedSites } = storage;
let focusMode = storage.focusModeToggle;

if (focusMode) {
  focusToggle.textContent = 'Disable Focus Mode';
} else {
  focusToggle.textContent = 'Enable Focus Mode';
}

focusToggle.addEventListener('click', () => {
  if (focusMode) {
    focusToggle.textContent = 'Enable Focus Mode';
  } else {
    focusToggle.textContent = 'Disable Focus Mode';
  }
  focusMode = !focusMode;
  chrome.storage.local.set({ focusModeToggle: focusMode });
});

const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
const url = new URL(tabs[0].url);
const baseUrl = `${url.protocol}//${url.host}`;
const siteToggle = document.getElementById('site-toggle');

if (blockedSites.includes(baseUrl)) {
  siteToggle.textContent = 'Remove From Blocklist';
} else {
  siteToggle.textContent = 'Add To Blocklist';
}

siteToggle.addEventListener('click', () => {
  if (blockedSites.includes(baseUrl)) {
    siteToggle.textContent = 'Add To Block List';
    blockedSites = blockedSites.filter((element) => element !== baseUrl);
  } else {
    siteToggle.textContent = 'Remove From Block List';
    blockedSites.push(baseUrl);
  }
  chrome.storage.local.set({ blockedSites });
});

const siteTodayUsage = document.getElementById('site-today-usage');
const tab = url.host.replace('www.', '');
if (tab in storage.tabsTime) {
  const hours = Math.floor(storage.tabsTime[tab] / 3600);
  const minutes = Math.floor((storage.tabsTime[tab] % 3600) / 60);

  siteTodayUsage.textContent = `This Site: ${hours} ${hours === 0 ? 'hr' : 'hrs'} ${minutes} ${minutes === 0 ? 'min' : 'mins'}`;
}

const sitesTodayUsage = document.getElementById('sites-today-usage');
const sitesTodaySeconds = Object.values(storage.tabsTime).reduce((acc, curr) => acc + curr, 0);
const hours = Math.floor(sitesTodaySeconds / 3600);
const minutes = Math.floor((sitesTodaySeconds % 3600) / 60);

sitesTodayUsage.textContent = `All Sites: ${hours} ${hours === 0 ? 'hr' : 'hrs'} ${minutes} ${minutes === 0 ? 'min' : 'mins'}`;

console.log(storage);
