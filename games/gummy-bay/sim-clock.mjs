// Fixed simulation steps. One second of play advances the same distance at
// 30 FPS and 120 FPS. A long frame catches up only to maxFrame, so a hitch
// cannot tunnel collision or freeze the clock at a single 60 ms slice.
export function createFixedStepper({step = 1 / 60, maxFrame = 0.25} = {}) {
  if (!(step > 0) || !(maxFrame >= step)) throw new Error('Invalid simulation step');
  const limit = Math.floor((maxFrame + 1e-9) / step);
  let pending = 0;
  return {
    step,
    maxFrame,
    consume(realSeconds) {
      const dt = Number.isFinite(realSeconds) ? Math.max(0, realSeconds) : 0;
      pending += Math.min(dt, maxFrame);
      const steps = [];
      while (pending + 1e-9 >= step && steps.length < limit) {
        pending -= step;
        steps.push(step);
      }
      if (pending < 1e-9) pending = 0;
      return steps;
    },
    pending() { return pending; },
  };
}
