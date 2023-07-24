const pomodoroHTML = await fetch("pomodoro/pomodoro.html");
const pomodoroHTMLText = await pomodoroHTML.text();
document.getElementById("pomodoro-timer").innerHTML = pomodoroHTMLText;

const focusMinutesInput = document.getElementById("focus-minutes");
const breakMinutesInput = document.getElementById("break-minutes");
const cyclesInput = document.getElementById("cycles");

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

let pomodoroInformation = {};
let currentSession = 0;
let pomodoroTimer = null;

const storage = await chrome.storage.local.get();

const reset = () => {
  chrome.storage.local.set({ pomodoro_info: {}, pomodoro: false });
  clearInterval(pomodoroTimer);
  currentSession = 0;
  document.getElementById("clock").textContent = "00:00";
};

const checkFinished = () => {
  console.log(`current: ${currentSession} total: ${pomodoroInformation.cycles}`);
  if (currentSession === pomodoroInformation.cycles) {
    clearInterval(pomodoroTimer);
    console.log("Cleared");
    document.getElementById("clock").textContent = "00:00";
    reset();
  }

  document.getElementById("type").textContent = pomodoroInformation.focus
    ? `Focus ${currentSession}`
    : `Break ${currentSession}`;
};

const getTimeDifference = (endTime) => {
  const startTime = Date.now();
  const timeDiff = endTime - startTime;

  const total = Number.parseInt(timeDiff / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
};

const changeTime = () => {
  const { total } = getTimeDifference(pomodoroInformation.end_time);
  let { minutes, seconds } = getTimeDifference(pomodoroInformation.end_time);
  minutes = `${minutes}`.padStart(2, "0");
  seconds = `${seconds}`.padStart(2, "0");

  pomodoroInformation.time_info = { total, minutes, seconds };

  if (total <= 0) {
    if (pomodoroInformation.focus) {
      pomodoroInformation.focus = false;
      pomodoroInformation.break = true;
      pomodoroInformation.end_time = pomodoroInformation.session_info[currentSession][1].end_time;
      checkFinished();
    } else if (pomodoroInformation.break) {
      pomodoroInformation.focus = true;
      pomodoroInformation.break = false;
      currentSession += 1;
      checkFinished();
      pomodoroInformation.end_time = pomodoroInformation.session_info[currentSession][0].end_time;
    }
  }

  console.log(pomodoroInformation);

  chrome.storage.local.set({ pomodoro_info: pomodoroInformation });
  document.getElementById("clock").textContent = `${minutes}:${seconds}`;
};

startButton.addEventListener("click", () => {
  if (!storage.pomodoro) {
    currentSession = 0;
    pomodoroInformation = {
      focus: true,
      break: false,
      focus_time: focusMinutesInput.value,
      break_time: breakMinutesInput.value,
      cycles: cyclesInput.value,
      end_time: null,
      start_time: null,
      time_info: {},
      session_info: [],
      all_session_info: [],
    };

    chrome.storage.local.set({ pomodoro: true }); // setting the start of the pomodoro timer

    // initiate the time info
    const startTime = Date.now();
    let temp = startTime;
    for (let i = 0; i < cyclesInput.value; i += 1) {
      const tempArray = [];

      temp += focusMinutesInput.value * 60 * 1000;
      const focusData = { type: "focus", end_time: temp, session: i };

      temp += breakMinutesInput.value * 60 * 1000;
      const breakData = { type: "break", end_time: temp, session: i };

      tempArray.push(focusData);
      tempArray.push(breakData);

      pomodoroInformation.all_session_info.push(focusData);
      pomodoroInformation.all_session_info.push(breakData);

      pomodoroInformation.session_info.push(tempArray);
    }

    pomodoroInformation.start_time = startTime;
    pomodoroInformation.end_time = pomodoroInformation.session_info[0][0].end_time;

    chrome.storage.local.set({ pomodoro_info: pomodoroInformation });
    pomodoroTimer = setInterval(changeTime, 1000);
  }
});

resetButton.addEventListener("click", () => {
  reset();
});

const resume = async () => {
  if (storage.pomodoro) {
    pomodoroInformation = storage.pomodoro_info;

    focusMinutesInput.value = parseInt(pomodoroInformation.focus_time, 10);
    breakMinutesInput.value = parseInt(pomodoroInformation.break_time, 10);
    cyclesInput.value = parseInt(pomodoroInformation.cycles, 10);

    const checkDate = Date.now();

    if (checkDate > pomodoroInformation.all_session_info.slice(-1)[0].end_time) {
      chrome.storage.local.set({ pomodoro: false });
    }

    pomodoroInformation.all_session_info.forEach((sessionInfo) => {
      if (checkDate < sessionInfo.end_time) {
        pomodoroInformation.end_time = sessionInfo.end_time;
        pomodoroInformation.start_time = checkDate;
        currentSession = sessionInfo.session;

        if (sessionInfo.type === "focus") {
          pomodoroInformation.focus = true;
          pomodoroInformation.break = false;
        } else {
          pomodoroInformation.focus = false;
          pomodoroInformation.break = true;
        }
      }
    });

    pomodoroTimer = setInterval(changeTime, 1000);
  }
};

resume();
