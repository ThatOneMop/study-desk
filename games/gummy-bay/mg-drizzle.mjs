// Keep the syrup stream on a target that jumps every 0.9 s.
// On target, the tray fills at 25% per second. A missed window leaves a puddle.
import {CAVITY_POINTS, MOULD_CAVITIES, cavityAt} from './mould.mjs';

export const DRIZZLE_INTERVAL = 0.9;
export const DRIZZLE_FILL_PER_SEC = 0.25;
export const DRIZZLE_HIT_M = 0.03;
export const DRIZZLE_PUDDLE = 0.05;
export const DRIZZLE_PRIME = 1;

export function createDrizzle() {
  return {
    fill: 0,
    elapsed: 0,
    window: 0,
    target: 0,
    puddles: 0,
    covered: false,
    prime: 0,
    pouring: false,
    done: false,
    quality: 1,
  };
}

export function drizzleTarget(state) {
  return cavityAt(state?.target || 0) || CAVITY_POINTS[0];
}

export function onDrizzleTarget(state, x, z) {
  const target = drizzleTarget(state);
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
  return Math.hypot(x - target.x, z - target.z) <= DRIZZLE_HIT_M;
}

function score(state) {
  const quality = Math.min(1, Math.max(0, 1 - state.puddles * DRIZZLE_PUDDLE));
  const done = state.fill >= 1 - 1e-6;
  return {done, quality: done ? quality : state.fill * quality, fill: state.fill, puddles: state.puddles};
}

export function stepDrizzle(state, dt, input = {}) {
  const next = state || createDrizzle();
  const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
  next.elapsed += step;
  next.pouring = !!input.pouring;
  if (next.done) return next;
  const ready = next.prime >= DRIZZLE_PRIME - 1e-6;
  if (next.pouring) next.prime = Math.min(DRIZZLE_PRIME, next.prime + step);
  else next.prime = Math.max(0, next.prime - step);
  const flowing = next.pouring && ready;
  const aimed = flowing && onDrizzleTarget(next, input.aimX, input.aimZ);
  if (aimed) {
    next.fill = Math.min(1, next.fill + DRIZZLE_FILL_PER_SEC * step);
    next.covered = true;
  }
  next.window += step;
  while (next.window >= DRIZZLE_INTERVAL) {
    next.window -= DRIZZLE_INTERVAL;
    if (flowing && !next.covered) next.puddles += 1;
    next.covered = false;
    next.target = (next.target + 5) % MOULD_CAVITIES;
  }
  const result = score(next);
  next.done = result.done;
  next.quality = result.quality;
  if (next.done) next.pouring = false;
  return next;
}

export function assistDrizzle(state, dt) {
  const current = state || createDrizzle();
  const target = drizzleTarget(current);
  return stepDrizzle(current, dt, {pouring: true, aimX: target.x, aimZ: target.z});
}
