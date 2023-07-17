var pomodoro_information;

const reset = () => {
  let pomodoro_information = {
    started: false,
    focus: true,
    break: false,
    focus_time: 1,
    break_time: 1,
    cycles: 1,
    end_time: null,
    start_time: null,
  };
  chrome.storage.local.set({ pomodoro_info: pomodoro_information });
  document.getElementById("clock").textContent = `00:00`;
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

  if (total <= 0) {
    console.log(pomodoro_information.cycles);

    if (pomodoro_information.focus) {
      pomodoro_information.start_time = Date.now();
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.focus_time * 60 * 1000;
      pomodoro_information.focus = false;
      pomodoro_information.break = true;
      document.getElementById("type").textContent = "Break Time";
    } else if (pomodoro_information.break) {
      pomodoro_information.start_time = Date.now();
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.break_time * 60 * 1000;
      pomodoro_information.focus = true;
      pomodoro_information.break = false;
      pomodoro_information.cycles -= 1;
      document.getElementById("type").textContent = "Focus Time";
    }
  }

  document.getElementById("clock").textContent = `${minutes}:${seconds}`;
  chrome.storage.local.set({ pomodoro_info: pomodoro_information });
  check_finished();
};

const start_pomodoro = (resume = false) => {
  pomodoro_information.start_time = Date.now();

  if (!resume) {
    if (pomodoro_information.focus) {
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.focus_time * 60 * 1000;
    } else if (pomodoro_information.break) {
      pomodoro_information.end_time = pomodoro_information.start_time + pomodoro_information.break_time * 60 * 1000;
    }
  }

  pomodoro_timer = setInterval(change_time, 1000);
};

const onGot = (result) => {
  pomodoro_information = result.pomodoro_info || {
    started: false,
    focus: true,
    break: false,
    focus_time: 1,
    break_time: 1,
    cycles: 1,
    end_time: null,
    start_time: null,
  };

  if (pomodoro_information.started) {
    start_pomodoro(true);
  }
};

const onError = (error) => {
  console.log(error);
};

const storage = chrome.storage.local.get();
storage.then(onGot, onError);

document.getElementById("start").addEventListener("click", () => {
  pomodoro_information = {
    started: false,
    focus: true,
    break: false,
    focus_time: 0.3,
    break_time: 0.1,
    cycles: 1,
    end_time: null,
    start_time: null,
  };

  pomodoro_information.started = true;
  start_pomodoro();
});
