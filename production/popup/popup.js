const focusBlock = document.getElementById("focus-block");

const pomodoroTimer = document.getElementById("pomodoro-timer");
const focusTab = document.getElementById("focus-tab");

const timer = document.getElementById("timer");
const powerSettings = document.getElementById("power-settings");
const settingsButton = document.getElementById("settings");

timer.addEventListener("click", () => {
  pomodoroTimer.style.display = "block";
  focusTab.style.display = "none";

  timer.style.backgroundColor = "rgb(205, 205, 205)";
  settingsButton.style.backgroundColor = "";
  powerSettings.style.backgroundColor = "";

  document.getElementById("focus-block").textContent = "Pomodoro Timer";
});

powerSettings.style.backgroundColor = "rgb(205, 205, 205)";
powerSettings.addEventListener("click", () => {
  pomodoroTimer.style.display = "none";
  focusTab.style.display = "flex";

  timer.style.backgroundColor = "";
  settingsButton.style.backgroundColor = "";
  powerSettings.style.backgroundColor = "rgb(205, 205, 205)";

  focusBlock.textContent = "Focus Tab";
});

settingsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
