document.getElementById("start").addEventListener("click", () => {
  const pomodoro_connect = chrome.runtime.connect({ name: "start pomodoro" });
  pomodoro_connect.onMessage.addListener((m) => {
    let new_pomo_info = m.pomodoro_info;
    let time_string = `${new_pomo_info.time_info.minutes}:${new_pomo_info.time_info.seconds}`;
    document.getElementById("clock").innerHTML = time_string;
  });

  // chrome.storage.onChanged.addListener(logStorageChange);
});
