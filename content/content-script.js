let tabStartTime = Date.now();
const url = new URL(window.location.origin);
const domain = url.host.replace("www.", "");

window.addEventListener("focus", () => {
  tabStartTime = Date.now();
});

window.addEventListener("blur", async () => {
  const { tabsTime } = await chrome.storage.local.get();
  tabsTime[domain] = (tabsTime[domain] ?? 0) + (Date.now() - tabStartTime);

  chrome.storage.local.set({ tabsTime });
  chrome.runtime.sendMessage(null);
});

chrome.storage.local.get().then(async (storage) => {
  const pastUnblockTime = (storage.unblockTimes[domain] ?? 0) < Date.now();

  if (storage.blockedSites.includes(window.location.origin) && pastUnblockTime) {
    const title = document.querySelector("title").cloneNode(true);
    const contentHTML = await fetch(chrome.runtime.getURL("content/content.html"));
    const contentText = await contentHTML.text();
    const content = new DOMParser().parseFromString(contentText, "text/html");
    const CSS = content.getElementById("CSS");
    const icon = content.getElementById("icon");
    const threeMinTimeout = content.getElementById("3-min-timeout");
    const fiveMinTimeout = content.getElementById("5-min-timeout");
    const fifteenMinTimeout = content.getElementById("15-min-timeout");

    const setUnblockTime = (time) => {
      chrome.storage.local.set({ unblockTimes: { [domain]: Date.now() + time } });
    };

    content.head.appendChild(title);
    CSS.href = chrome.runtime.getURL("content/content.css");
    icon.src = chrome.runtime.getURL("icons/lotus.svg");
    threeMinTimeout.addEventListener("click", () => setUnblockTime(3 * 60 * 1000));
    fiveMinTimeout.addEventListener("click", () => setUnblockTime(5 * 60 * 1000));
    fifteenMinTimeout.addEventListener("click", () => setUnblockTime(15 * 60 * 1000));
    document.replaceChild(content.documentElement, document.documentElement);
  }
});
