// back home
const back_button = document.getElementById("back");
back_button.addEventListener("click", () => {
  document.location.href = "../popup.html";
});

// pomodoro functions
const getTime = (end) => {
  const time_diff = end - Date.parse(new Date());

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
let FOCUS_TIME = 2;
let BREAK_TIME = 5;
let CYCLES = 1;

let pomodoro_interval;

document.getElementById("start").addEventListener("click", () => {
  const end = Date.parse(new Date()) + FOCUS_TIME * 1000;
  let time_string = `${FOCUS_TIME}:${0}`;
  document.getElementById("clock").textContent = time_string;

  pomodoro_interval = setInterval(async () => {
    let time_remaining = getTime(end);
    chrome.storage.local.set({ time_remaining: time_remaining });
    let storage = await chrome.storage.local.get();
    console.log(storage);
    if (time_remaining <= 0) {
      clearInterval(pomodoro_interval);
      alert("Timer ended");
      CYCLES--;
    }

    const minutes = `${time_remaining.minutes}`.padStart(2, "0");
    const seconds = `${time_remaining.seconds}`.padStart(2, "0");

    let time_string = `${minutes}:${seconds}`;
    document.getElementById("clock").textContent = time_string;
  }, 1000);
});
