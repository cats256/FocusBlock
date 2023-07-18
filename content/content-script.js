const resetStyle = `
@import url('https://fonts.googleapis.com/css2?family=Inter&family=Roboto&display=swap');

body,
:root {
  all: initial !important;
}

#focus-block {
  position:fixed !important;
  padding:0 !important;
  margin:0 !important;

  top:0 !important;
  left:0 !important;

  width: 100% !important;
  height: 100% !important;
}
`;

const CSS = `
<style>
  :host {
    font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    height: 100vh !important;
    margin: 0 !important;
    background-color: rgb(184, 215, 248) !important;
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
  }

  #button-container {
    display: flex;
    gap: 16px;
  }

  button {
    height: 40px;
    width: 120px;
    cursor: pointer;
    background-color: rgb(241, 241, 241);
    border: 1px solid rgb(150, 150, 150);
    color: black;
    font-family: "Inter";
    font-weight: 500;
    text-align: center;
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
    <button id="setting">Settings</button>
    <button id="3-min-timeout">+3 minutes</button>
    <button id="5-min-timeout">+10 minutes</button>
    <button id="15-min-timeout">+15 minutes</button>
    <button id="set-extend">Custom Time</button>
  </div>
</div>
</div>
`;

class FocusBlock extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = CSS + HTMLpage;
  }
}

// customElements.define("focus-block", FocusBlock);

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
    const headCSS = document.createElement("style");
    headCSS.innerHTML = resetStyle;
    document.head.appendChild(headCSS);

    // const focusBlock = document.createElement("focus-block");
    // document.body.appendChild(focusBlock);

    // Define the new element

    const focusBlock = document.createElement("div");
    focusBlock.id = "focus-block";
    document.body.appendChild(focusBlock);
    const shadowRoot = focusBlock.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = CSS + HTMLpage;

    // const threeMinTimeout = shadowRoot.getElementById("3-min-timeout");
    // const fiveMinTimeout = shadowRoot.getElementById("5-min-timeout");
    // const fifteenMinTimeout = shadowRoot.getElementById("15-min-timeout");

    // const setUnblockTime = (time) => {
    //   chrome.storage.local.set({ unblockTimes: { [domain]: Date.now() + time } });
    //   shadowRoot.remove();
    // };

    // threeMinTimeout.addEventListener("click", () => setUnblockTime(3 * 60 * 1000));
    // fiveMinTimeout.addEventListener("click", () => setUnblockTime(5 * 60 * 1000));
    // fifteenMinTimeout.addEventListener("click", () => setUnblockTime(15 * 60 * 1000));
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
