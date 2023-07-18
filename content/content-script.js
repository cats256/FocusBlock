const blockSite = async () => {
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
    window.location.reload();
  };

  content.head.appendChild(title);
  CSS.href = `${chrome.runtime.getURL("content/content.css")}`;
  icon.src = chrome.runtime.getURL("icons/lotus.svg");
  threeMinTimeout.addEventListener("click", () => setUnblockTime(3 * 60 * 1000));
  fiveMinTimeout.addEventListener("click", () => setUnblockTime(5 * 60 * 1000));
  fifteenMinTimeout.addEventListener("click", () => setUnblockTime(15 * 60 * 1000));
  document.replaceChild(content.documentElement, document.documentElement);
};

const url = new URL(window.location.origin);
const domain = url.host.replace("www.", "");
let tabStartTime = Date.now();

window.addEventListener("focus", () => {
  tabStartTime = Date.now();
});

window.addEventListener("blur", async () => {
  const { tabsTime } = await chrome.storage.local.get();
  chrome.storage.local.set({
    tabsTime: {
      [domain]: (tabsTime[domain] ?? 0) + (Date.now() - tabStartTime),
    },
  });
  chrome.runtime.sendMessage(null);
});

chrome.storage.local.get().then(async (storage) => {
  const siteInBlockList = storage.blockedSites.includes(window.location.origin);
  const pastUnblockTime = (storage.unblockTimes[domain] ?? 0) < Date.now();

  if (siteInBlockList && pastUnblockTime) {
    blockSite();
  } else if (siteInBlockList && storage.unblockTimes[domain]) {
    const checkUnblock = setInterval(() => {
      const thirtySecondsBeforeUnblock = storage.unblockTimes[domain] < Date.now() + 30 * 1000;

      if (thirtySecondsBeforeUnblock) {
        alert("You have 30 seconds left before this site is blocked.");
        setTimeout(blockSite, 30 * 1000);
        clearInterval(checkUnblock);
      }
    }, 10000);
  }
});
