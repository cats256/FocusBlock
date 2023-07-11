const generateHTML = (siteName) => {
  return `
    <div>
      <h1>GET BACK TO WORK!!!</h1>
      <p>You are on ${siteName}</p>
    </div>
  `;
};

let array = ["www.youtube.com", "www.facebook.com", "www.instagram.com"];

if (array.includes(window.location.hostname)) {
  document.body.innerHTML = generateHTML(window.location.hostname);
}
