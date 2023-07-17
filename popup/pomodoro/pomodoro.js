let storage;

const getStorage = async () => {
  storage = await chrome.storage.local.get();
};

getStorage();

// back home
const back_button = document.getElementById("back");
back_button.addEventListener("click", () => {
  document.location.href = "../popup.html";
});

// pomodoro functions
const getTime = (end) => {
  const start = Date.parse(new Date());
  const time_diff = end - start;
  console.log(`time diff: ${time_diff}`);

  const total = Number.parseInt(time_diff / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
};

// start pomodoro timer
let FOCUS_TIME = 25;
let BREAK_TIME = 5;
let CYCLES = 1;

let pomodoro_interval;

// pomodoro dict
let pomodoro_info = {
  started: false,
  cycles: CYCLES,
  focus_time: FOCUS_TIME,
  break_time: BREAK_TIME,
  timer_info: {},
  end_time: null,
  start_time: null,
};

document.getElementById("start").addEventListener("click", () => {
  if (!pomodoro_info.started) {
    pomodoro_info.started = true;
    pomodoro_info.cycles = CYCLES;
    pomodoro_info.focus_time = FOCUS_TIME;
    pomodoro_info.break_time = BREAK_TIME;
    pomodoro_info.end_time = Date.parse(new Date()) + pomodoro_info.focus_time * 60000;
    pomodoro_info.start_time = Date.parse(new Date());
  }

  const minutes = `${pomodoro_info.focus_time}`.padStart(2, "0");
  const seconds = `${0}`.padStart(2, "0");

  let time_string = `${minutes}:${seconds}`;
  document.getElementById("clock").textContent = time_string;

  console.log(pomodoro_info);
});

console.log("started");
if (pomodoro_info.cycles == 0) {
  alert("Invalid number of cycles");
  pomodoro_info.started = false;

  chrome.storage.local.set({ pomodoro_info: pomodoro_info });
}

pomodoro_interval = setInterval(async () => {
  const time_remaining = getTime(pomodoro_info.end_time);
  console.log(time_remaining);
  pomodoro_info.timer_info = time_remaining;

  // chrome.storage.local.set({ pomodoro_info: pomodoro_info });

  if (time_remaining.total <= 0) {
    console.log("done");
    pomodoro_info.cycles--;
    // clear interval if theres no cycles left
    if (pomodoro_info.cycles == 0) {
      clearInterval(pomodoro_interval);
    }

    // set new end time
    // pomodoro_info.start_time = Date.parse(new Date());
    pomodoro_info.end_time = Date.parse(new Date()) + pomodoro_info.focus_time * 60000;

    chrome.storage.local.set({ pomodoro_info: pomodoro_info });
  }

  const minutes = `${time_remaining.minutes}`.padStart(2, "0");
  const seconds = `${time_remaining.seconds}`.padStart(2, "0");

  let time_string = `${minutes}:${seconds}`;
  document.getElementById("clock").textContent = time_string;

  // pomodoro_info.start_time = Date.parse(new Date());
}, 1000);
