const headCSS = `
@font-face {
  font-family: 'Inter';
  src: url(${chrome.runtime.getURL("font/Inter-Regular.ttf")}) format('truetype');
  font-weight: normal;
}

@font-face {
  font-family: 'Inter';
  src: url(${chrome.runtime.getURL("font/Inter-Medium.ttf")}) format('truetype');
  font-weight: 500;
}

:root {
  overflow: hidden !important;
}
`;

const CSS = `
<style>
  :host {
    all: initial !important;
    font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    position:fixed !important;
    padding:0 !important;
    margin:0 !important;
    top:0 !important;
    left:0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483647 !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    background-color: rgb(235, 235, 235) !important;
  }

  #panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 440px;
    width: 720px;
    background-color: white;
    text-align: center;
    border-radius: 16px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  }

  #blocked {
    font-size: 28px;
  }

  #icon {
    width: 200px;
    height: 200px;
  }

  #quote {
    font-size: 24px;
    margin-top: 36px;
    font-variant: small-caps;
    font-weight: 500;
  }

  #button-container {
    display: flex;
    gap: 16px;
  }

  button {
    font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    height: 40px;
    width: 120px;
    cursor: pointer;
    background-color: rgb(241, 241, 241);
    border: 1px solid rgb(150, 150, 150);
    color: black;
    text-align: center;
    font-weight: 500;
  }

  button:hover {
    background-color: rgb(220, 220, 220);
  }
</style>
`;

const HTMLpage = `
<div>
<div id="panel">
  <p id="blocked">This site has been blocked by FocusBlock</p>
  <img id="icon" src="${chrome.runtime.getURL("icons/lotus.svg")}"/>
  <p id="quote">life begins at the end of your comfort zone</p>
  <div id="button-container">
    <button title="Open Settings" id="setting">Settings</button>
    <button title="Unblock Site For 3 Minutes" id="3-min-timeout">+3 minutes</button>
    <button title="Unblock Site For 10 Minutes" id="10-min-timeout">+10 minutes</button>
    <button title="Unblock Site For 15 Minutes" id="15-min-timeout">+15 minutes</button>
    <button title="Set Site Unblock Time" id="set-extend">Set Timeout</button>
  </div>
</div>
</div>
`;

const unblockSite = () => {
  document.getElementById("head-style").remove();
  document.getElementById("focus-block").remove();
};

const url = new URL(window.location.origin);
const domain = url.host.replace("www.", "");

const blockSite = () => {
  const headStyle = document.createElement("style");
  headStyle.id = "head-style";
  headStyle.innerHTML = headCSS;
  document.head.appendChild(headStyle);

  const focusBlock = document.createElement("div");
  focusBlock.id = "focus-block";
  document.body.appendChild(focusBlock);

  const shadowRoot = focusBlock.attachShadow({ mode: "closed" });
  shadowRoot.innerHTML = CSS + HTMLpage;

  const threeMinTimeout = shadowRoot.getElementById("3-min-timeout");
  const tenMinTimeout = shadowRoot.getElementById("10-min-timeout");
  const fifteenMinTimeout = shadowRoot.getElementById("15-min-timeout");

  const setUnblockTime = (timeout) => {
    chrome.storage.local.set({ unblockTimes: { [domain]: Date.now() + timeout } });
    unblockSite();
    setTimeout(async () => {
      const { blockedSites, focusMode } = await chrome.storage.local.get();
      const siteInBlockList = blockedSites.includes(domain);

      if (siteInBlockList && focusMode) {
        blockSite();
      }
    }, timeout);
  };

  threeMinTimeout.addEventListener("click", () => setUnblockTime(3 * 60 * 1000));
  tenMinTimeout.addEventListener("click", () => setUnblockTime(10 * 60 * 1000));
  fifteenMinTimeout.addEventListener("click", () => setUnblockTime(15 * 60 * 1000));
};

let tabStartTime = Date.now();
window.addEventListener("blur", async () => {
  const { tabsTime } = await chrome.storage.local.get();
  tabsTime[domain] = (tabsTime[domain] ?? 0) + (Date.now() - tabStartTime);
  chrome.storage.local.set({ tabsTime });
});

window.addEventListener("focus", () => {
  tabStartTime = Date.now();
});

chrome.storage.local.get().then((storage) => {
  let siteInBlockList = storage.blockedSites.includes(domain);
  let { focusMode } = storage;
  let timeUntilUnblock = storage.unblockTimes[domain] - Date.now();

  let isBlocked = siteInBlockList && focusMode && timeUntilUnblock < 0;

  if (isBlocked) {
    blockSite();
  } else if (siteInBlockList && focusMode) {
    setTimeout(() => {
      blockSite();
      isBlocked = true;
    }, timeUntilUnblock);
  }

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockedSites) {
      siteInBlockList = changes.blockedSites.newValue.includes(domain);
    } else if (changes.focusMode) {
      focusMode = changes.focusMode.newValue;
    } else if (changes.unblockTimes) {
      timeUntilUnblock = changes.unblockTimes.newValue[domain] - Date.now();
    }

    if (siteInBlockList && focusMode && !isBlocked && timeUntilUnblock < 0) {
      blockSite();
      isBlocked = true;
    } else if (!(siteInBlockList && focusMode) && isBlocked) {
      unblockSite();
      isBlocked = false;
    }
  });
});

// chrome.runtime.onMessage.addListener(async (message) => {
//   const { blockedSites, focusMode, unblockTimes } = await chrome.storage.local.get();
//   const siteInBlockList = blockedSites.includes(domain);
//   const isUnblocked = unblockTimes[domain] > Date.now();

//   if (message === "Added To Block List" && !isUnblocked && focusMode) {
//     blockSite();
//   } else if (message === "Removed From Block List" && !isUnblocked && focusMode) {
//     unblockSite();
//   } else if (message === "Focus Mode Enabled" && !isUnblocked && siteInBlockList) {
//     blockSite();
//   } else if (message === "Focus Mode Disabled" && !isUnblocked && siteInBlockList) {
//     unblockSite();
//   }
// });
