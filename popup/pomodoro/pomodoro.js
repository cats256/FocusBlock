const pomodoroHTML = await fetch("pomodoro/pomodoro.html");
const pomodoroHTMLText = await pomodoroHTML.text();
document.getElementById("pomodoro-timer").innerHTML = pomodoroHTMLText;

const focusMinutesInput = document.getElementById("focus-minutes");
const breakMinutesInput = document.getElementById("break-minutes");
const cyclesInput = document.getElementById("cycles");

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const clock = document.getElementById("clock");

const storage = await chrome.storage.local.get(["pomodoroEnabled", "pomodoroInformation"]);

let { pomodoroEnabled, pomodoroInformation } = storage;
let pomodoroTimer;

let focusMinutes = parseInt(focusMinutesInput.value, 10);
let breakMinutes = parseInt(breakMinutesInput.value, 10);
let cycles = parseInt(cyclesInput.value, 10);

const keepFocusMinutesInputUnchanged = () => {
  focusMinutesInput.value = focusMinutes;
};

const keepBreakMinutesInputUnchanged = () => {
  breakMinutesInput.value = breakMinutes;
};

const keepCyclesInputUnchanged = () => {
  cyclesInput.value = cycles;
};

const resetPomodoro = () => {
  clearInterval(pomodoroTimer);

  clock.textContent = "00:00";
  startButton.textContent = "Start Session";

  focusMinutesInput.removeEventListener("input", keepFocusMinutesInputUnchanged);
  breakMinutesInput.removeEventListener("input", keepBreakMinutesInputUnchanged);
  cyclesInput.removeEventListener("input", keepCyclesInputUnchanged);

  pomodoroEnabled = false;
  pomodoroInformation = {};
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

const resume = async () => {
  if (pomodoroEnabled) {
    pomodoroTimer = setInterval(changeTime, 100);

    focusMinutesInput.value = focusMinutes;
    breakMinutesInput.value = breakMinutes;
    cyclesInput.value = cycles;

    focusMinutesInput.addEventListener("input", keepFocusMinutesInputUnchanged);
    breakMinutesInput.addEventListener("input", keepBreakMinutesInputUnchanged);
    cyclesInput.addEventListener("input", keepCyclesInputUnchanged);
  }

  focusMinutesInput.addEventListener("input", () => {
    if (focusMinutesInput.value < 1) {
      focusMinutesInput.value = 1;
    } else if (focusMinutesInput.value > 999) {
      focusMinutesInput.value = 999;
    }
  });

  breakMinutesInput.addEventListener("input", () => {
    if (breakMinutesInput.value < 1) {
      breakMinutesInput.value = 1;
    } else if (breakMinutesInput.value > 999) {
      breakMinutesInput.value = 999;
    }
  });

  cyclesInput.addEventListener("input", () => {
    if (cyclesInput.value < 1) {
      cyclesInput.value = 1;
    } else if (cyclesInput.value > 999) {
      cyclesInput.value = 999;
    }
  });
};

resume();

focusMinutesInput.addEventListener("input", () => {});

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

    focusMinutesInput.addEventListener("input", keepFocusMinutesInputUnchanged);
    breakMinutesInput.addEventListener("input", keepBreakMinutesInputUnchanged);
    cyclesInput.addEventListener("input", keepCyclesInputUnchanged);
  }
});

resetButton.addEventListener("click", () => {
  if (pomodoroEnabled) {
    resetPomodoro();
  }
});
