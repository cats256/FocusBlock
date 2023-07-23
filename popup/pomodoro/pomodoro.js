const pomodoroHTML = await fetch("pomodoro/pomodoro.html");
const pomodoroHTMLText = await pomodoroHTML.text();
document.getElementById("pomodoro-timer").innerHTML = pomodoroHTMLText;

const focusMinuteInput = document.getElementById("focus-minutes");
const breakMinuteInput = document.getElementById("break-minutes");
const sessionsInput = document.getElementById("sessions");

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

let pomodoroInformation = {};
let currentSession = 0;
let pomodoroTimer = null;

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

  if (pomodoroInformation.focus) {
    document.getElementById("type").textContent = `Focus ${currentSession}`;
  } else {
    document.getElementById("type").textContent = `Break ${currentSession}`;
  }
};

const generatePomodoroInformation = async () => {
  const storage = await chrome.storage.local.get();
  if (storage.pomodoro) {
    pomodoroInformation = storage.pomodoro_info;
    console.log(pomodoroInformation);

    focusMinuteInput.value = parseInt(pomodoroInformation.focus_time, 10);
    breakMinuteInput.value = parseInt(pomodoroInformation.break_time, 10);
    // console.log(pomodoro_information.cycles);
    sessionsInput.value = parseInt(pomodoroInformation.cycles, 10);
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
  } else {
    currentSession = 0;
    pomodoroInformation = {
      focus: true,
      break: false,
      focus_time: focusMinuteInput.value,
      break_time: breakMinuteInput.value,
      cycles: sessionsInput.value,
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
    for (let i = 0; i < sessionsInput.value; i += 1) {
      const tempArray = [];
      temp += focusMinuteInput.value * 60 * 1000;
      const focusData = { type: "focus", end_time: temp, session: i };
      temp += breakMinuteInput.value * 60 * 1000;
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
    console.log(pomodoroInformation);
  }
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
    console.log(`current session: ${currentSession}`);
    if (pomodoroInformation.focus) {
      // pomodoro_information.start_time = Date.now();
      pomodoroInformation.focus = false;
      pomodoroInformation.break = true;
      pomodoroInformation.end_time = pomodoroInformation.session_info[currentSession][1].end_time;
      checkFinished();
    } else if (pomodoroInformation.break) {
      // pomodoro_information.start_time = Date.now();
      pomodoroInformation.focus = true;
      pomodoroInformation.break = false;
      currentSession += 1;
      checkFinished();
      pomodoroInformation.end_time = pomodoroInformation.session_info[currentSession][0].end_time;
    }
  }

  // check_finished();

  chrome.storage.local.set({ pomodoro_info: pomodoroInformation });
  document.getElementById("clock").textContent = `${minutes}:${seconds}`;
};

startButton.addEventListener("click", () => {
  generatePomodoroInformation();
  pomodoroTimer = setInterval(changeTime, 1000);
  // chrome.runtime.sendMessage({ type: "start pomodoro" });
});

// back_button.addEventListener("click", () => {
//   document.location.href = "../popup.html";
// });

resetButton.addEventListener("click", () => {
  reset();
});

const resume = async () => {
  const storage = await chrome.storage.local.get();
  if (storage.pomodoro) {
    generatePomodoroInformation();
    pomodoroTimer = setInterval(changeTime, 1000);
  }
};

resume();
