chrome.storage.local.get(["array"]).then((result) => {
  if (result.array.includes(window.location.origin)) {
    const body = document.querySelector("body");
    body.innerHTML = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
      <style>      
        body,
        :root {
          all: initial !important;
        }
      </style>
      <div id="focus-block"></div>
    `;

    const focusBlock = body.querySelector("#focus-block");
    focusBlock.attachShadow({ mode: "open" });

    const shadowRoot = focusBlock.shadowRoot;
    shadowRoot.innerHTML = `
      <div id="panel">
        <p style="font-size: 28px">This site has been blocked by FocusBlock.</p>
        <img width="200px" height="200px" />
        <br />
        <p id="quote" style="font-size: 20px">Life begins at the end of your comfort zone.</p>
        <div>
          <button id="set-timeout">Set Timeout</button>
          <button id="setting">Settings</button>
        </div>
      </div>
      <style>
      :host {
        font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: rgb(184, 215, 248);
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
 
      button {
          margin: 10px;
        }
      </style>
    `;

    const icon = shadowRoot.querySelector("img");
    icon.src = chrome.runtime.getURL("../icons/lotus.svg");
  }
});
