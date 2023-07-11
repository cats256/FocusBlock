const generateHTML = (siteName) => {
  return `
    <div>
      <h1>GET BACK TO WORK!!!</h1>
      <p>You are on ${siteName}</p>
    </div>
  `;
};

chrome.storage.local.get(["array"]).then((result) => {
  if (result.array.includes(window.location.origin)) {
    document.body.innerHTML = generateHTML(window.location.origin);
  }
});
