// Pop the vial, then drop one flavour crystal in each cavity.
// A drop counts only inside the 2.5 cm snap radius.
import {CAVITY_POINTS, MOULD_CAVITIES, SEED_SNAP_M, nearestCavity} from './mould.mjs';

export {SEED_SNAP_M};
export const SEED_POP_SEC = 0.45;
export const SEED_DROP_SEC = 0.42;

export function createSeed() {
  return {
    popped: false,
    popTimer: 0,
    placed: Array(MOULD_CAVITIES).fill(false),
    accuracy: Array(MOULD_CAVITIES).fill(0),
    elapsed: 0,
    gap: 0,
    done: false,
    quality: 0,
  };
}

export function seedProgress(state) {
  if (!state?.placed) return 0;
  return state.placed.filter(Boolean).length / MOULD_CAVITIES;
}

export function seedQuality(state) {
  const placed = state?.placed || [];
  const accuracy = state?.accuracy || [];
  const done = placed.length === MOULD_CAVITIES && placed.every(Boolean);
  if (!done) {
    const hits = placed.filter(Boolean).length;
    return {done: false, quality: hits / MOULD_CAVITIES};
  }
  const quality = accuracy.reduce((sum, n) => sum + (Number.isFinite(n) ? n : 0), 0) / MOULD_CAVITIES;
  return {done: true, quality: Math.min(1, Math.max(0, quality))};
}

export function placeSeed(state, hit) {
  if (!state?.popped || !hit || state.placed[hit.index]) return false;
  state.placed[hit.index] = true;
  state.accuracy[hit.index] = Math.min(1, Math.max(0, hit.accuracy));
  const score = seedQuality(state);
  state.done = score.done;
  state.quality = score.quality;
  return true;
}

export function trySeed(state, x, z) {
  if (!state?.popped || state.done) return null;
  const hit = nearestCavity(x, z, SEED_SNAP_M);
  if (!hit || state.placed[hit.index]) return null;
  placeSeed(state, hit);
  return hit;
}

export function stepSeed(state, dt, input = {}) {
  const next = state || createSeed();
  const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
  next.elapsed += step;
  if (!next.popped) {
    if (input.pop) next.popTimer += step;
    if (next.popTimer >= SEED_POP_SEC) next.popped = true;
    return next;
  }
  if (input.release && Number.isFinite(input.x) && Number.isFinite(input.z)) trySeed(next, input.x, input.z);
  const score = seedQuality(next);
  next.done = score.done;
  next.quality = score.quality;
  return next;
}

export function assistSeed(state, dt) {
  const current = state || createSeed();
  const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
  if (!current.popped) return stepSeed(current, step, {pop: true});
  current.gap += step;
  current.elapsed += step;
  if (current.gap < SEED_DROP_SEC) {
    const score = seedQuality(current);
    current.done = score.done;
    current.quality = score.quality;
    return current;
  }
  const index = current.placed.findIndex(placed => !placed);
  if (index < 0) return current;
  const cavity = CAVITY_POINTS[index];
  const hit = nearestCavity(cavity.x, cavity.z, SEED_SNAP_M);
  placeSeed(current, hit);
  current.gap = 0;
  return current;
}
