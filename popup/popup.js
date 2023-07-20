const pomodoroTimer = document.getElementById("pomodoro-timer");
const pomodoroHTML = await fetch("pomodoro/pomodoro.html");
const pomodoroHTMLText = await pomodoroHTML.text();
pomodoroTimer.innerHTML = pomodoroHTMLText;

const focusTab = document.getElementById("focus-tab");
const focusBlock = document.getElementById("focus-block");

const timer = document.getElementById("timer");
timer.addEventListener("click", () => {
  focusTab.style.display = "none";
  pomodoroTimer.style.display = "block";
  timer.style.backgroundColor = "rgb(205, 205, 205)";
  powerSettings.style.backgroundColor = "";
  focusBlock.textContent = "Pomorodo Timer";
});

const powerSettings = document.getElementById("power-settings");
powerSettings.addEventListener("click", () => {
  focusTab.style.display = "flex";
  pomodoroTimer.style.display = "none";
  powerSettings.style.backgroundColor = "rgb(205, 205, 205)";
  timer.style.backgroundColor = "";
  focusBlock.textContent = "Focus Tab";
});

// For debugging
chrome.storage.local.get().then((storage) => {
  console.log(storage);
});
