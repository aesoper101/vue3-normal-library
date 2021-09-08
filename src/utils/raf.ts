import requestAnimationFrame from "raf";
import { forEach, isArray, isNumber } from "lodash-es";

export function cancelRaf(rafId: number | number[]) {
  if (isNumber(rafId)) {
    requestAnimationFrame.cancel(rafId);
  } else if (isArray(rafId)) {
    forEach(rafId, cancelRaf);
  }
}

export function raf(cb: FrameRequestCallback) {
  return requestAnimationFrame(cb);
}

export function doubleRaf(cb: FrameRequestCallback): [number, number] {
  const rafIds: [number, number] = [0, 0];
  rafIds[1] = requestAnimationFrame(() => {
    rafIds[0] = requestAnimationFrame(cb);
  });
  return rafIds;
}
