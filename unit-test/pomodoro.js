const pomodoroModule = async () => {
  const focusMinutesInput = document.getElementById("focus-minutes");
  const breakMinutesInput = document.getElementById("break-minutes");
  const cyclesInput = document.getElementById("cycles");

  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");

  const storage = await chrome.storage.local.get();

  let { pomodoroInformation, pomodoroEnabled } = storage;
  let pomodoroTimer;

  const resetPomodoro = () => {
    pomodoroInformation = {};
    pomodoroEnabled = false;
    chrome.storage.local.set({ pomodoroInformation, pomodoroEnabled });
    clearInterval(pomodoroTimer);
    document.getElementById("clock").textContent = "00:00";
    document.getElementById("type").textContent = "Do More With Pomodoro";
  };

  const changeTime = () => {
    const nextTimeIndex = pomodoroInformation.cyclesTimes.findIndex((time) => Date.now() < time);

    if (nextTimeIndex === -1) {
      resetPomodoro();
    } else {
      const sessionTimeLeft = pomodoroInformation.cyclesTimes[nextTimeIndex] - Date.now();
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
        cyclesTimes: [],
      };
      pomodoroEnabled = true;
      const currentTime = Date.now();

      for (let i = 0; i < cycles; i += 1) {
        const focusStart = currentTime + (focusMinutes + breakMinutes) * i * 60 * 1000;
        const focusEnded = focusStart + focusMinutes * 60 * 1000;

        pomodoroInformation.cyclesTimes.push(focusStart);
        pomodoroInformation.cyclesTimes.push(focusEnded);
      }

      chrome.storage.local.set({ pomodoroInformation, pomodoroEnabled });
      pomodoroTimer = setInterval(changeTime, 100);
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
