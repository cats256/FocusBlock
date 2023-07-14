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
      <style>
        :host {
          font-family: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          height: 100vh !important;
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
  
        button {
          height: 40px;
          width: 120px;
          cursor: pointer;
          background-color: rgb(241, 241, 241);
          border: 1px solid rgb(150, 150, 150);
          color: black;
          box-sizing: border-box;
          font-family: "Inter";
          font-weight: 500;
          text-align: center;
          cursor: pointer;
        }

        #button-container {
          display: flex;
          gap: 16px;
        }
      </style>
      <div id="panel">
        <p style="font-size: 28px">This site has been blocked by FocusBlock.</p>
        <img src=${chrome.runtime.getURL(
          "../icons/lotus.svg"
        )} width="200px" height="200px" />
        <p id="quote" style="font-size: 20px; margin-top: 36px" >Life begins at the end of your comfort zone.</p>
        <div id="button-container">
          <button id="setting">Settings</button>
          <button>+3 minute</button>
          <button>+10 minutes</button>
          <button>+15 minutes</button>
          <button id="set-timeout">Set Timeout</button>
        </div>
      </div>
    `;
  }
});
