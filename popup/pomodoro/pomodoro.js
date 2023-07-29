const pomodoroHTML = await fetch("pomodoro/pomodoro.html");
const pomodoroHTMLText = await pomodoroHTML.text();
document.getElementById("pomodoro-timer").innerHTML = pomodoroHTMLText;

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const clock = document.getElementById("clock");

const storage = await chrome.storage.local.get(["pomodoroEnabled", "pomodoroInformation"]);
let { pomodoroEnabled, pomodoroInformation } = storage;

const focusMinutesInput = document.getElementById("focus-minutes");
const breakMinutesInput = document.getElementById("break-minutes");
const cyclesInput = document.getElementById("cycles");

let pomodoroTimer;

let focusMinutes = parseInt(focusMinutesInput.value, 10);
let breakMinutes = parseInt(breakMinutesInput.value, 10);
let cycles = parseInt(cyclesInput.value, 10);

const keepInputUnchanged = (inputElement, value) => {
  const inputElementCopy = inputElement;
  inputElementCopy.value = value;
};

const keepFocusMinutesUnchanged = () => keepInputUnchanged(focusMinutesInput, focusMinutes);
const keepBreakMinutesUnchanged = () => keepInputUnchanged(breakMinutesInput, breakMinutes);
const keepCyclesUnchanged = () => keepInputUnchanged(cyclesInput, cycles);

const resetPomodoro = () => {
  clearInterval(pomodoroTimer);

  clock.textContent = "00:00";
  startButton.textContent = "Start Session";

  focusMinutesInput.removeEventListener("input", keepFocusMinutesUnchanged);
  breakMinutesInput.removeEventListener("input", keepBreakMinutesUnchanged);
  cyclesInput.removeEventListener("input", keepCyclesUnchanged);

  pomodoroEnabled = false;
  pomodoroInformation = { cyclesTimes: [] };
  chrome.storage.local.set({ pomodoroInformation, pomodoroEnabled });
};

const changeTime = () => {
  const nextTimeIndex = pomodoroInformation.cyclesTimes.findIndex((time) => Date.now() < time);

  if (nextTimeIndex === -1) {
    resetPomodoro();
  } else {
    const sessionTimeLeft = pomodoroInformation.cyclesTimes[nextTimeIndex] - Date.now();
    const minutes = `${Math.floor(sessionTimeLeft / 60000)}`.padStart(2, "0");
    const seconds = `${Math.floor((sessionTimeLeft / 1000) % 60)}`.padStart(2, "0");
    const sessionType = nextTimeIndex % 2 === 1 ? "Focus" : "Break";

    clock.textContent = `${minutes}:${seconds}`;
    startButton.textContent = `${sessionType} Cycle ${Math.floor((nextTimeIndex + 1) / 2)}`;
  }
};

const resumePomodoro = async () => {
  pomodoroTimer = setInterval(changeTime, 100);

  ({ focusMinutes, breakMinutes, cycles } = pomodoroInformation);

  focusMinutesInput.value = pomodoroInformation.focusMinutes;
  breakMinutesInput.value = pomodoroInformation.breakMinutes;
  cyclesInput.value = pomodoroInformation.cycles;

  focusMinutesInput.addEventListener("input", keepFocusMinutesUnchanged);
  breakMinutesInput.addEventListener("input", keepBreakMinutesUnchanged);
  cyclesInput.addEventListener("input", keepCyclesUnchanged);
};

const restrictInputRange = (inputElement) => {
  const inputElementCopy = inputElement;

  if (inputElement.value < 1) {
    inputElementCopy.value = 1;
  } else if (inputElement.value > 999) {
    inputElementCopy.value = 999;
  }
};

focusMinutesInput.addEventListener("input", () => restrictInputRange(focusMinutesInput));
breakMinutesInput.addEventListener("input", () => restrictInputRange(breakMinutesInput));
cyclesInput.addEventListener("input", () => restrictInputRange(cyclesInput));

startButton.addEventListener("click", () => {
  if (!pomodoroEnabled) {
    focusMinutes = parseInt(focusMinutesInput.value, 10);
    breakMinutes = parseInt(breakMinutesInput.value, 10);
    cycles = parseInt(cyclesInput.value, 10);

    const cyclesTimes = [];
    const currentTime = Date.now();
    for (let i = 0; i < cycles; i += 1) {
      const focusStart = currentTime + (focusMinutes + breakMinutes) * i * 60 * 1000;
      const focusEnded = focusStart + focusMinutes * 60 * 1000;

      cyclesTimes.push(focusStart);
      cyclesTimes.push(focusEnded);
    }

    pomodoroTimer = setInterval(changeTime, 100);

    pomodoroEnabled = true;
    pomodoroInformation = { focusMinutes, breakMinutes, cycles, cyclesTimes };
    chrome.storage.local.set({ pomodoroEnabled, pomodoroInformation });

    focusMinutesInput.addEventListener("input", keepFocusMinutesUnchanged);
    breakMinutesInput.addEventListener("input", keepBreakMinutesUnchanged);
    cyclesInput.addEventListener("input", keepCyclesUnchanged);
  }
});

resetButton.addEventListener("click", () => {
  if (pomodoroEnabled) {
    resetPomodoro();
  }
});

if (pomodoroEnabled) {
  resumePomodoro();
}
