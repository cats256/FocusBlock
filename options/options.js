const backgroundImageDropdown = document.getElementById("background-img-dropdown");
const backgroundImagePreview = document.getElementById("background-img-preview");
const { backgroundImage } = await chrome.storage.local.get(["backgroundImage"]);

switch (backgroundImage) {
  case "icons/lotus.svg":
    backgroundImageDropdown.selectedIndex = 1;
    break;
  case "icons/icon.png":
    backgroundImageDropdown.selectedIndex = 2;
    break;
  default:
    backgroundImageDropdown.selectedIndex = 0;
    break;
}
backgroundImagePreview.src = `../${backgroundImage}`;

backgroundImageDropdown.addEventListener("change", (e) => {
  backgroundImagePreview.src = `../${e.target.value}`;
  chrome.storage.local.set({ backgroundImage: e.target.value });
});
