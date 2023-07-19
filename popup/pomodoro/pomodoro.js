const focus_minute_input = document.getElementById("focus-minutes");
const break_minute_input = document.getElementById("break-minutes");
const sessions_input = document.getElementById("sessions");

const start_button = document.getElementById("start");
const reset_button = document.getElementById("reset");

let pomodoro_information = {};
let current_session = 0;
let pomodoro_timer = null;

const reset = () => {
  chrome.storage.local.set({ pomodoro_info: {}, pomodoro: false });
  clearInterval(pomodoro_timer);
  current_session = 0;
  document.getElementById("clock").textContent = "00:00";
  document.getElementById("type").textContent = "";
};

const check_finished = () => {
  console.log(`current: ${current_session} total: ${pomodoro_information.cycles}`);
  if (current_session == pomodoro_information.cycles) {
    clearInterval(pomodoro_timer);
    console.log("Cleared");
    document.getElementById("clock").textContent = "00:00";
    reset();
  }

  if (pomodoro_information.focus) {
    document.getElementById("type").textContent = `Focus ${current_session}`;
  } else {
    document.getElementById("type").textContent = `Break ${current_session}`;
  }
};

const generate_pomodoro_information = async () => {
  const storage = await chrome.storage.local.get();
  if (storage.pomodoro) {
    pomodoro_information = storage.pomodoro_info;
    console.log(pomodoro_information);

    focus_minute_input.value = parseInt(pomodoro_information.focus_time);
    break_minute_input.value = parseInt(pomodoro_information.break_time);
    // console.log(pomodoro_information.cycles);
    sessions_input.value = parseInt(pomodoro_information.cycles);
    let check_date = Date.now();

    if (check_date > pomodoro_information.all_session_info.slice(-1)[0].end_time) {
      chrome.storage.local.set({ pomodoro: false });
    }

    for (let session_info of pomodoro_information.all_session_info) {
      if (check_date < session_info.end_time) {
        pomodoro_information.end_time = session_info.end_time;
        pomodoro_information.start_time = check_date;
        current_session = session_info.session;

        if (session_info.type == "focus") {
          pomodoro_information.focus = true;
          pomodoro_information.break = false;
        } else {
          pomodoro_information.focus = false;
          pomodoro_information.break = true;
        }
        break;
      }
    }
  } else {
    current_session = 0;
    pomodoro_information = {
      focus: true,
      break: false,
      focus_time: focus_minute_input.value,
      break_time: break_minute_input.value,
      cycles: sessions_input.value,
      end_time: null,
      start_time: null,
      time_info: {},
      session_info: [],
      all_session_info: [],
    };

    chrome.storage.local.set({ pomodoro: true }); // setting the start of the pomodoro timer

    // initiate the time info
    let start_time = Date.now();
    let temp = start_time;
    for (let i = 0; i < sessions_input.value; i++) {
      let temp_array = [];
      temp = temp + focus_minute_input.value * 60 * 1000;
      let focus_data = { type: "focus", end_time: temp, session: i };
      temp = temp + break_minute_input.value * 60 * 1000;
      let break_data = { type: "break", end_time: temp, session: i };

      temp_array.push(focus_data);
      temp_array.push(break_data);
      pomodoro_information.all_session_info.push(focus_data);
      pomodoro_information.all_session_info.push(break_data);

      pomodoro_information.session_info.push(temp_array);
    }

    pomodoro_information.start_time = start_time;
    pomodoro_information.end_time = pomodoro_information.session_info[0][0].end_time;
    chrome.storage.local.set({ pomodoro_info: pomodoro_information });
    console.log(pomodoro_information);
  }
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

const change_time = () => {
  let { total, minutes, seconds } = get_time_difference(pomodoro_information.end_time);
  minutes = `${minutes}`.padStart(2, "0");
  seconds = `${seconds}`.padStart(2, "0");
  pomodoro_information.time_info = { total, minutes, seconds };

  if (total <= 0) {
    console.log(`current session: ${current_session}`);
    if (pomodoro_information.focus) {
      // pomodoro_information.start_time = Date.now();
      pomodoro_information.focus = false;
      pomodoro_information.break = true;
      pomodoro_information.end_time = pomodoro_information.session_info[current_session][1].end_time;
      check_finished();
    } else if (pomodoro_information.break) {
      // pomodoro_information.start_time = Date.now();
      pomodoro_information.focus = true;
      pomodoro_information.break = false;
      current_session = current_session + 1;
      check_finished();
      pomodoro_information.end_time = pomodoro_information.session_info[current_session][0].end_time;
    }
  }

  // check_finished();

  chrome.storage.local.set({ pomodoro_info: pomodoro_information });
  document.getElementById("clock").textContent = `${minutes}:${seconds}`;
};

start_button.addEventListener("click", () => {
  generate_pomodoro_information();
  pomodoro_timer = setInterval(change_time, 1000);
  // chrome.runtime.sendMessage({ type: "start pomodoro" });
});

reset_button.addEventListener("click", () => {
  reset();
});

const resume = async () => {
  const storage = await chrome.storage.local.get();
  if (storage.pomodoro) {
    generate_pomodoro_information();
    pomodoro_timer = setInterval(change_time, 1000);
  }
};

resume();
