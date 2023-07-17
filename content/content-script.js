let tabStartTime = Date.now();
const url = new URL(window.location.origin);
const domain = url.host.replace('www.', '');

window.addEventListener('focus', () => {
  tabStartTime = Date.now();
});

window.addEventListener('blur', async () => {
  const { tabsTime } = await chrome.storage.local.get();
  tabsTime[domain] = (tabsTime[domain] ?? 0) + (Date.now() - tabStartTime);

  chrome.storage.local.set({ tabsTime });
  chrome.runtime.sendMessage(null);
});

chrome.storage.local.get(['blockedSites']).then(async (storage) => {
  if (storage.blockedSites.includes(window.location.origin)) {
    const title = document.querySelector('title').cloneNode(true);
    const contentHTML = await fetch(chrome.runtime.getURL('content/content.html'));
    const contentText = await contentHTML.text();
    const content = new DOMParser().parseFromString(contentText, 'text/html');
    const CSS = content.getElementById('CSS');
    const icon = content.getElementById('icon');

    content.head.appendChild(title);
    CSS.href = chrome.runtime.getURL('content/content.css');
    icon.src = `${chrome.runtime.getURL('icons/lotus.svg')}`;
    document.replaceChild(content.documentElement, document.documentElement);
  }
});
