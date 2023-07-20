const focusBlock = document.getElementById("focus-block");
const pomodoroTimer = document.getElementById("pomodoro-timer");
const focusTab = document.getElementById("focus-tab");

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
