// Bag the gummy, hold the crimp inside the green for 0.4 s, drop it down the chute.
// Stopping outside the green is a bad seal: the bag still closes, with a 15% complaint.
export const SEAL_GREEN_START = 0.38;
export const SEAL_GREEN_END = 0.62;
export const SEAL_HOLD = 0.4;
export const SEAL_COMPLAINT = 0.15;
export const SEAL_BAG_SEC = 0.35;

export function createSeal() {
  return {
    phase: 'bag',
    bag: 0,
    hold: 0,
    crimp: 0.5,
    holding: false,
    bad: false,
    sealed: false,
    dropped: false,
    misses: 0,
    elapsed: 0,
    assist: 0,
    done: false,
    quality: 0,
    complaint: 0,
  };
}

export function crimpInGreen(crimp) {
  return Number.isFinite(crimp) && crimp >= SEAL_GREEN_START && crimp <= SEAL_GREEN_END;
}

export function sealProgress(state) {
  if (!state) return 0;
  if (state.done || state.phase === 'done') return 1;
  if (state.phase === 'hopper') return 0.72;
  if (state.phase === 'crimp') return 0.34 + Math.min(0.34, state.hold / SEAL_HOLD * 0.34);
  return Math.min(0.33, state.bag * 0.33);
}

function result(state) {
  if (!state.dropped) {
    return {done: false, quality: sealProgress(state), bad: state.bad, complaint: 0};
  }
  const quality = state.bad ? 0.72 : 1;
  return {done: true, quality, bad: !!state.bad, complaint: state.bad ? SEAL_COMPLAINT : 0};
}

export function stepSeal(state, dt, input = {}) {
  const next = state || createSeal();
  const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
  next.elapsed += step;
  if (next.done) return next;
  if (next.phase === 'bag') {
    if (input.inBag) next.bag = Math.min(1, next.bag + step / SEAL_BAG_SEC);
    if (next.bag >= 1) next.phase = 'crimp';
  } else if (next.phase === 'crimp') {
    if (Number.isFinite(input.crimp)) next.crimp = Math.min(1, Math.max(0, input.crimp));
    const green = crimpInGreen(next.crimp);
    next.holding = !!input.holding;
    if (next.holding && green) next.hold += step;
    else if (next.holding && !green) {
      if (next.hold > 0) next.misses += 1;
      next.hold = 0;
    }
    if (next.hold >= SEAL_HOLD) {
      next.sealed = true;
      next.bad = false;
      next.phase = 'hopper';
    } else if (input.forceBad) {
      next.sealed = true;
      next.bad = true;
      next.phase = 'hopper';
    }
  } else if (next.phase === 'hopper') {
    if (input.inHopper) {
      next.dropped = true;
      next.phase = 'done';
    }
  }
  const score = result(next);
  next.done = score.done;
  next.quality = score.quality;
  next.complaint = score.complaint;
  return next;
}

// A careful hand: pick up, seat the gummy, wait on the green, then the chute.
export function assistSeal(state, dt) {
  const current = state || createSeal();
  const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
  current.assist += step;
  const t = current.assist;
  if (t < 1.8) return stepSeal(current, step, {});
  if (t < 2.6) return stepSeal(current, step, {inBag: true});
  if (t < 4.2) return stepSeal(current, step, {holding: false, crimp: 0.5});
  if (t < 5.0) return stepSeal(current, step, {holding: true, crimp: 0.5});
  return stepSeal(current, step, {inHopper: true});
}
