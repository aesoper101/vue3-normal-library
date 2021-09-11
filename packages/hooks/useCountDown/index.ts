import { computed, onActivated, onBeforeUnmount, onDeactivated, ref } from "vue";
import { cancelRaf, raf } from "../../utils";
import { inBrowser } from "../../utils";

export interface CurrentTime {
  dayHourMinuteSecond: DayHourMinuteSecond;
  day: number;
  hourMinuteSecond: HourMinuteSecond;
  hour: number;
  minuteSecond: MinuteSecond;
  minute: number;
  second: number;
}

export interface DayHourMinuteSecond {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface HourMinuteSecond {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface MinuteSecond {
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface UseCountDownOptions {
  time: number;
  millisecond?: boolean;
  onChange?: (current: CurrentTime) => void;
  onFinish?: () => void;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const parseTime = (time: number): CurrentTime => {
  const dayHourMinuteSecond = (): DayHourMinuteSecond => {
    const days = Math.floor(time / DAY);
    const hours = Math.floor((time % DAY) / HOUR);
    const minutes = Math.floor((time % HOUR) / MINUTE);
    const seconds = Math.floor((time % MINUTE) / SECOND);
    const milliseconds = Math.floor(time % SECOND);

    return {
      days: days,
      hours: hours,
      milliseconds: milliseconds,
      minutes: minutes,
      seconds: seconds,
    };
  };

  const hourMinuteSecond = (): HourMinuteSecond => {
    const hours = Math.floor(time / HOUR);
    const minutes = Math.floor((time % HOUR) / MINUTE);
    const seconds = Math.floor((time % MINUTE) / SECOND);
    const milliseconds = Math.floor(time % SECOND);
    return {
      hours: hours,
      milliseconds: milliseconds,
      minutes: minutes,
      seconds: seconds,
    };
  };

  const minuteSecond = (): MinuteSecond => {
    const minutes = Math.floor(time / MINUTE);
    const seconds = Math.floor((time % MINUTE) / SECOND);
    const milliseconds = Math.floor(time % SECOND);
    return { milliseconds: milliseconds, minutes: minutes, seconds: seconds };
  };

  return {
    day: Math.floor(time / DAY),
    dayHourMinuteSecond: dayHourMinuteSecond(),
    hour: Math.floor(time / HOUR),
    hourMinuteSecond: hourMinuteSecond(),
    minute: Math.floor(time / MINUTE),
    minuteSecond: minuteSecond(),
    second: Math.floor(time / SECOND),
  };
};

function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}

export const useCountDown = (options: UseCountDownOptions) => {
  let rafId: number;
  let endTime: number;
  let counting: boolean;
  let deactivated: boolean;

  const remain = ref(options.time);
  const current = computed<CurrentTime>(() => parseTime(remain.value));

  const pause = () => {
    counting = false;
    cancelRaf(rafId);
  };

  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);

  const setRemain = (value: number) => {
    remain.value = value;
    options.onChange?.(current.value);

    if (value === 0) {
      pause();
      options.onFinish?.();
    }
  };

  const microTick = () => {
    rafId = raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        setRemain(getCurrentRemain());

        if (remain.value > 0) {
          microTick();
        }
      }
    });
  };

  const macroTick = () => {
    rafId = raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        const remainRemain = getCurrentRemain();

        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain);
        }

        if (remain.value > 0) {
          macroTick();
        }
      }
    });
  };

  const tick = () => {
    if (!inBrowser) {
      return;
    }

    if (options.millisecond) {
      microTick();
    } else {
      macroTick();
    }
  };

  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value;
      counting = true;
      tick();
    }
  };

  const reset = (totalTime: number = options.time) => {
    pause();
    remain.value = totalTime;
  };

  onBeforeUnmount(pause);

  onActivated(() => {
    if (deactivated) {
      counting = true;
      deactivated = false;
      tick();
    }
  });

  onDeactivated(() => {
    if (counting) {
      pause();
      deactivated = true;
    }
  });

  return {
    start,
    pause,
    reset,
    current,
  };
};
