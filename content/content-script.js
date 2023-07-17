let tabStartTime = Date.now();
const url = new URL(window.location.origin);
const domain = url.host.replace('www.', '');

window.addEventListener('focus', () => {
  tabStartTime = Date.now();
});

window.addEventListener('blur', async () => {
  const { tabsTime } = await chrome.storage.local.get();

  if (tabsTime[domain]) {
    tabsTime[domain] += Date.now() - tabStartTime;
  } else {
    tabsTime[domain] = Date.now() - tabStartTime;
  }

  chrome.storage.local.set({ tabsTime });
  chrome.runtime.sendMessage(null);
});

chrome.storage.local.get(['blockedSites']).then(async (storage) => {
  if (storage.blockedSites.includes(window.location.origin)) {
    const title = document.querySelector('title').cloneNode(true);

    const contentHTML = await fetch(chrome.runtime.getURL('content/content.html'));
    document.documentElement.innerHTML = await contentHTML.text();
    document.head.appendChild(title);

    const CSS = document.createElement('link');
    CSS.rel = 'stylesheet';
    CSS.type = 'text/css';
    CSS.href = chrome.runtime.getURL('content/content.css');
    document.head.appendChild(CSS);

    const icon = document.getElementById('icon');
    icon.src = `${chrome.runtime.getURL('../icons/lotus.svg')}`;
  }
});
