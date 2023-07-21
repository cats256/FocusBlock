const focusBlock = document.getElementById("focus-block");

const pomodoroTimer = document.getElementById("pomodoro-timer");
const focusTab = document.getElementById("focus-tab");
const settingsTab = document.getElementById("settings-tab");

const timer = document.getElementById("timer");
const powerSettings = document.getElementById("power-settings");
const settingsButton = document.getElementById("settings");

powerSettings.style.backgroundColor = "rgb(205, 205, 205)";

timer.addEventListener("click", () => {
  pomodoroTimer.style.display = "block";
  focusTab.style.display = "none";
  settingsTab.style.display = "none";

  timer.style.backgroundColor = "rgb(205, 205, 205)";
  settingsButton.style.backgroundColor = "";
  powerSettings.style.backgroundColor = "";

  document.getElementById("focus-block").textContent = "Pomorodo Timer";
});

powerSettings.addEventListener("click", () => {
  pomodoroTimer.style.display = "none";
  focusTab.style.display = "flex";
  settingsTab.style.display = "none";

  timer.style.backgroundColor = "";
  settingsButton.style.backgroundColor = "";
  powerSettings.style.backgroundColor = "rgb(205, 205, 205)";

  focusBlock.textContent = "Focus Tab";
});

settingsButton.addEventListener("click", () => {
  pomodoroTimer.style.display = "none";
  focusTab.style.display = "none";
  settingsTab.style.display = "block";

  timer.style.backgroundColor = "";
  settingsButton.style.backgroundColor = "rgb(205, 205, 205)";
  powerSettings.style.backgroundColor = "";

  focusBlock.textContent = "Settings";
});

// For debugging
chrome.storage.local.get().then((storage) => {
  console.log(storage);
});
