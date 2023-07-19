const resetStyle = `
@import url('https://fonts.googleapis.com/css2?family=Inter&family=Roboto&display=swap');

body,
:root {
  all: initial !important;
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
  <img id="icon" />
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

const stayFree = `
<html>
  <head>
    <meta charset="utf-8" />
    <title>Pop-up info box — web components</title>
    <script src="test.js" defer></script>
  </head>
  <body>
  <div id="dimScreen">Random Crap</div>
  <style>
  #dimScreen
{
    position:fixed;
    padding:0;
    margin:0;

    top:0;
    left:0;

    width: 100%;
    height: 100%;
    background:rgba(255,255,255);
}
    </style>
  </body>
</html>
`;

class FocusBlock extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "closed" });

    shadowRoot.innerHTML = stayFree;
  }
}

customElements.define("focus-block", FocusBlock);
