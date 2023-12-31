const pomodoroModule = async () => {
  const focusMinutesInput = document.getElementById("focus-minutes");
  const breakMinutesInput = document.getElementById("break-minutes");
  const cyclesInput = document.getElementById("cycles");

  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");

  const clock = document.getElementById("clock");
  const type = document.getElementById("type");

  const storage = await chrome.storage.local.get();

  let { pomodoroEnabled, pomodoroInformation } = storage;
  let pomodoroTimer;

  const resetPomodoro = () => {
    clearInterval(pomodoroTimer);

    clock.textContent = "00:00";
    type.textContent = "Do More With Pomodoro";

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
      type.textContent = `${sessionType} Session ${Math.floor((nextTimeIndex + 1) / 2)}`;
    }
  };

  startButton.addEventListener("click", () => {
    if (!pomodoroEnabled) {
      const focusMinutes = parseInt(focusMinutesInput.value, 10);
      const breakMinutes = parseInt(breakMinutesInput.value, 10);
      const cycles = parseInt(cyclesInput.value, 10);

      const currentTime = Date.now();
      const cyclesTimes = [];
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
    }
  });

  resetButton.addEventListener("click", () => {
    if (pomodoroEnabled) {
      resetPomodoro();
    }
  });

  const resume = async () => {
    if (pomodoroEnabled) {
      pomodoroTimer = setInterval(changeTime, 1000);
    }
  };

  resume();
};

module.exports = pomodoroModule;
