const backgroundImageDropdown = document.getElementById("background-img-dropdown");

backgroundImageDropdown.addEventListener("change", async (e) => {
  const { value } = e.target;
  chrome.storage.local.set({ backgroundImage: value });
});
