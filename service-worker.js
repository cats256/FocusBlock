chrome.storage.local.get().then((storage) => {
  if (!storage.blockedSites) {
    chrome.storage.local.set({ blockedSites: [], tabsTime: {}, unblockTimes: {} });
  }
});

chrome.runtime.onMessage.addListener(() => {});

var pomodoro_timer;
var pomodoro_information = {};
var pomodoro_connection;

const reset = () => {
  pomodoro_information = {
    started: false,
    focus: true,
    break: false,
    focus_time: 0.3,
    break_time: 0.2,
    cycles: 1,
    end_time: null,
    start_time: null,
    time_info: {},
  };

  chrome.storage.local.set({ pomodoro_info: pomodoro_information });
};

const get_time_difference = (end_time) => {
  const start_time = Date.now();
  const time_diff = end_time - start_time;

  const total = Number.parseInt(time_diff / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
};

const check_finished = () => {
  if (pomodoro_information.cycles <= 0) {
    clearInterval(pomodoro_timer);
    reset();
  }
};

const change_time = () => {
  let { total, minutes, seconds } = get_time_difference(pomodoro_information.end_time);
  minutes = `${minutes}`.padStart(2, "0");
  seconds = `${seconds}`.padStart(2, "0");
  pomodoro_information.time_info = { total, minutes, seconds };

  // let time_string = `${minutes}:${seconds}`;
  // document.getElementById("clock").innerHTML = time_string;

  if (total <= 0) {
    if (pomodoro_information.focus) {
      pomodoro_information.start_time = Date.now();
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.focus_time * 60 * 1000;
      pomodoro_information.focus = false;
      pomodoro_information.break = true;
    } else if (pomodoro_information.break) {
      pomodoro_information.start_time = Date.now();
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.break_time * 60 * 1000;
      pomodoro_information.focus = true;
      pomodoro_information.break = false;
      pomodoro_information.cycles -= 1;
    }
  }

  // chrome.storage.local.set({ pomodoro_info: pomodoro_information });
  pomodoro_connection.postMessage({ pomodoro_info: pomodoro_information });
  check_finished();
};

export const start_pomodoro = (resume = false) => {
  pomodoro_information.start_time = Date.now();
  pomodoro_information.started = true;

  if (!resume) {
    if (pomodoro_information.focus) {
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.focus_time * 60 * 1000;
    } else if (pomodoro_information.break) {
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.break_time * 60 * 1000;
    }
  }

  pomodoro_timer = setInterval(change_time, 1000);
};

chrome.runtime.onConnect.addListener((port) => {
  pomodoro_connection = port;
  if (port.name == "start pomodoro") {
    console.log("Started pomodoro");
    reset();
    start_pomodoro();
  }

  port.onDisconnect.addListener(() => {
    start_pomodoro();
  });
});
