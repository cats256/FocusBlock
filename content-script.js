const generateHTML = () => {
  const body = document.querySelector("body");
  body.innerHTML = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
      rel="stylesheet"
    />
    <style>
      body,
      :root {
        all: initial !important;
      }

      body {
        font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        height: 100vh !important;
      }
    </style>
    <div id="focus-block"></div>
  `;

  const focusBlock = document.querySelector("#focus-block");
  focusBlock.attachShadow({ mode: "open" });

  const shadowRoot = focusBlock.shadowRoot;
  shadowRoot.innerHTML = `
    <p style="font-size: 32px">This site has been blocked by FocusBlock.</p>
    <img src="icons/lotus-icon.svg" width="200px" height="200px" />
    <br />
    <p id="quote">Life begins at the end of your comfort zone.</p>
    <div>
      <button id="set-timeout">Set Timeout</button>
      <button id="setting">Settings</button>
    </div>
    <style>
      button {
        margin: 10px;
      }
    </style>
  `;
};

chrome.storage.local.get(["array"]).then((result) => {
  if (result.array.includes(window.location.origin)) {
    generateHTML();
  }
});
