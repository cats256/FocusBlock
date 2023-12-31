const { JSDOM } = require("jsdom");
const { fireEvent } = require("@testing-library/dom");
const pomodoroModule = require("./pomodoro");

const dom = new JSDOM(`
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
</div>`);

global.document = dom.window.document;

const get = jest.fn();
const set = jest.fn();
global.chrome = {
  storage: {
    local: {
      set,
      get,
    },
  },
};

global.chrome = chrome;

describe("pomodoroModule", () => {
  jest.useFakeTimers();

  it("click on startButton", () => {
    global.chrome.storage.local.get.mockImplementation(() => {
      const mockData = {
        pomodoroInformation: { cyclesTimes: [] },
        pomodoroEnabled: false,
      };
      return Promise.resolve(mockData);
    });

    const startTest = async () => {
      await pomodoroModule();

      expect(global.chrome.storage.local.get).toHaveBeenCalledTimes(1);
      expect(document.getElementById("clock").textContent).toBe("00:00");
      expect(document.getElementById("type").textContent).toBe("Do More With Pomodoro");

      const focusMinutesInput = document.getElementById("focus-minutes");
      const breakMinutesInput = document.getElementById("break-minutes");
      const cyclesInput = document.getElementById("cycles");
      const startButton = document.getElementById("start");

      const clock = document.getElementById("clock");
      const type = document.getElementById("type");

      fireEvent.change(focusMinutesInput, { target: { value: "30" } });
      fireEvent.change(breakMinutesInput, { target: { value: "5" } });
      fireEvent.change(cyclesInput, { target: { value: "4" } });
      fireEvent.click(startButton);

      jest.advanceTimersByTime(1000);
      expect(clock.textContent).toBe("29:59");
      expect(type.textContent).toBe("Focus Session 1");

      jest.advanceTimersByTime(30 * 60 * 1000);
      expect(clock.textContent).toBe("04:59");
      expect(type.textContent).toBe("Break Session 1");

      jest.advanceTimersByTime(5 * 60 * 1000);
      expect(clock.textContent).toBe("29:59");
      expect(type.textContent).toBe("Focus Session 2");

      jest.advanceTimersByTime(30 * 60 * 1000);
      expect(clock.textContent).toBe("04:59");
      expect(type.textContent).toBe("Break Session 2");

      jest.advanceTimersByTime(5 * 60 * 1000);
      expect(clock.textContent).toBe("29:59");
      expect(type.textContent).toBe("Focus Session 3");

      jest.advanceTimersByTime(30 * 60 * 1000);
      expect(clock.textContent).toBe("04:59");
      expect(type.textContent).toBe("Break Session 3");

      jest.advanceTimersByTime(5 * 60 * 1000);
      expect(clock.textContent).toBe("29:59");
      expect(type.textContent).toBe("Focus Session 4");

      jest.advanceTimersByTime(30 * 60 * 1000);
      expect(clock.textContent).toBe("00:00");
      expect(type.textContent).toBe("Do More With Pomodoro");
    };

    startTest();
  });
});
