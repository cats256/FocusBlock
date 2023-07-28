const blockedSitesDiv = document.getElementById("blocked-sites");

const siteInput = document.getElementById("site-input");
const addButton = document.getElementById("add-button");

const backgroundImageDropdown = document.getElementById("background-img-dropdown");
const backgroundImagePreview = document.getElementById("background-img-preview");

const saveButton = document.getElementById("save-button");
const quoteInput = document.getElementById("quote-input");

const storage = await chrome.storage.local.get(["backgroundImage", "blockedSites"]);
const { backgroundImage } = storage;

let { blockedSites } = storage;

const createSiteDiv = (site) => {
  const siteDiv = document.createElement("div");
  siteDiv.classList.add("site");
  siteDiv.innerHTML = `
    <span>${site}</span> 
    <button class="remove-button">remove</button>
  `;

  siteDiv.querySelector(".remove-button").addEventListener("click", () => {
    siteDiv.remove();
    blockedSites = blockedSites.filter((blockedSite) => blockedSite !== site);
    chrome.storage.local.set({ blockedSites });
  });

  return siteDiv;
};

const addSiteToBlockedSites = () => {
  const site = siteInput.value.toLowerCase().trim();

  if (site) {
    if (!blockedSites.includes(site)) {
      const siteDiv = createSiteDiv(site);
      const insertIndex = blockedSites.findIndex((blockedSite) => blockedSite.localeCompare(site) > 0);

      if (insertIndex === -1) {
        blockedSitesDiv.appendChild(siteDiv);
        blockedSites.push(site);
      } else {
        blockedSitesDiv.insertBefore(siteDiv, blockedSitesDiv.children[insertIndex]);
        blockedSites.splice(insertIndex, 0, site);
      }

      chrome.storage.local.set({ blockedSites });
    } else {
      siteInput.value = "";
    }
  }
};

blockedSites.sort((a, b) => a.localeCompare(b));
blockedSites.forEach((site) => {
  const siteDiv = createSiteDiv(site);
  blockedSitesDiv.appendChild(siteDiv);
});

addButton.addEventListener("click", () => {
  addSiteToBlockedSites();
});

siteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addSiteToBlockedSites();
  }
});

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

saveButton.addEventListener("click", () => {
  chrome.storage.local.set({ quote: quoteInput.value.toLowerCase() });
  quoteInput.value = "";
});

quoteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    chrome.storage.local.set({ quote: quoteInput.value.toLowerCase() });
    quoteInput.value = "";
  }
});
