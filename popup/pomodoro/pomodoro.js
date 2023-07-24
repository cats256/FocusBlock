const pomodoroHTML = await fetch("pomodoro/pomodoro.html");
const pomodoroHTMLText = await pomodoroHTML.text();
document.getElementById("pomodoro-timer").innerHTML = pomodoroHTMLText;

const focusMinutesInput = document.getElementById("focus-minutes");
const breakMinutesInput = document.getElementById("break-minutes");
const cyclesInput = document.getElementById("cycles");

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

const storage = await chrome.storage.local.get();

let { pomodoroInformation, pomodoroEnabled } = storage;
let pomodoroTimer = null;

const changeTime = () => {
  console.log(pomodoroInformation);
  const nextTimeIndex = pomodoroInformation.cyclesInfo.findIndex((time) => Date.now() < time);
  if (nextTimeIndex === -1) {
    chrome.storage.local.set({ pomodoroEnabled: false });
  } else {
    const sessionTimeLeft = pomodoroInformation.cyclesInfo[nextTimeIndex] - Date.now();
    const minutes = `${Math.floor(sessionTimeLeft / 60000)}`.padStart(2, "0");
    const seconds = `${Math.floor((sessionTimeLeft / 1000) % 60)}`.padStart(2, "0");
    document.getElementById("clock").textContent = `${minutes}:${seconds}`;

    const sessionType = nextTimeIndex % 2 === 1 ? "Focus" : "Break";
    document.getElementById("type").textContent = `${sessionType} Session ${Math.floor((nextTimeIndex + 1) / 2)}`;
  }
};

startButton.addEventListener("click", () => {
  if (!pomodoroEnabled) {
    const focusMinutes = parseInt(focusMinutesInput.value, 10);
    const breakMinutes = parseInt(breakMinutesInput.value, 10);
    const cycles = parseInt(cyclesInput.value, 10);

    pomodoroInformation = {
      focusMinutes,
      breakMinutes,
      cycles,
      cyclesInfo: [],
    };

    chrome.storage.local.set({ pomodoroEnabled: true });

    const currentTime = Date.now();

    for (let i = 0; i < cycles; i += 1) {
      const focusStart = currentTime + (focusMinutes + breakMinutes) * i * 60 * 1000;
      const focusEnded = focusStart + focusMinutes * 60 * 1000;

      pomodoroInformation.cyclesInfo.push(focusStart);
      pomodoroInformation.cyclesInfo.push(focusEnded);
    }

    console.log(pomodoroInformation);

    pomodoroTimer = setInterval(changeTime, 1000);
    chrome.storage.local.set({ pomodoroInformation });
  }
});

resetButton.addEventListener("click", () => {
  pomodoroInformation = {};
  pomodoroEnabled = false;
  chrome.storage.local.set({ pomodoroInformation, pomodoroEnabled });
  clearInterval(pomodoroTimer);
  document.getElementById("clock").textContent = "00:00";
});

const resume = async () => {
  if (storage.pomodoroEnabled) {
    setInterval(changeTime, 1000);
  }
};

resume();
