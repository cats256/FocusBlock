const { JSDOM } = require("jsdom");
const { fireEvent } = require("@testing-library/dom");
const { pomodoroModule } = require("./pomodoro");

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;

describe("test startButton", () => {
  beforeEach(() => {
    const mockSet = jest.fn();
    global.chrome = {
      storage: {
        local: {
          set: mockSet,
        },
      },
    };

    document.body.innerHTML = `
    <p class="text-gray-500 text-center text-sm" id="type">Do More With Pomodoro</p>
    <div class="m-auto mt-10">
      <p class="text-3xl m-auto text-center" id="clock">00:00</p>
    </div>
    <div class="flex-col m-auto py-8 w-2/3">
      <div class="flex justify-between my-2">
        <p>Focus Minutes</p>
        <input value="25" type="number" id="focus-minutes" class="border-2 border-blue-300 rounded w-1/4 text-center" />
      </div>
      <div class="flex justify-between my-2">
        <p>Break Minutes</p>
        <input type="number" value="5" id="break-minutes" class="border-2 border-blue-300 rounded w-1/4 text-center" />
      </div>
      <div class="flex justify-between my-2">
        <p>Total Cycles</p>
        <input type="number" value="2" id="cycles" class="border-2 border-blue-300 rounded w-1/4 text-center" />
      </div>
    </div>
    <div class="flex-col">
      <div class="m-auto w-2/3 my-2">
        <button class="w-full border-2 border-green-500 rounded bg-green-500 m-auto p-1 text-white" id="start">
          Start Session
        </button>
      </div>
      <div class="m-auto w-2/3 my-2">
        <button class="w-full border-2 border-red-400 rounded bg-red-400 m-auto p-1 text-white" id="reset">
          Reset Session
        </button>
      </div>
    </div>`;
  });

  test("start pomodoro timer", () => {
    jest.useFakeTimers();

    const startButton = document.getElementById("start");
    fireEvent.click(startButton);

    jest.advanceTimersByTime(2000);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ pomodoroEnabled: true });

    jest.clearAllTimers();
  });
});

// describe("changeTime", () => {
//   // Write test cases for changeTime function here
//   test("should update the clock and session type", () => {
//     // Mock chrome.storage.local.get
//     const mockGet = jest.fn().mockResolvedValue({ pomodoroInformation: {}, pomodoroEnabled: true });
//     global.chrome = {
//       storage: {
//         local: {
//           get: mockGet,
//         },
//       },
//     };

//     const mockNow = Date.now();
//     global.Date.now = jest.fn(() => mockNow);

//     document.body.innerHTML = `
//       <div id="clock">00:00</div>
//       <div id="type">Do More With Pomodoro</div>
//     `;

//     jest.advanceTimersByTime(1000);
//     changeTime();

//     expect(document.getElementById("clock").textContent).toBe("...");
//     expect(document.getElementById("type").textContent).toBe("...");
//   });
// });
