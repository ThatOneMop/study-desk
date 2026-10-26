// Tilt-pour gelatin into the 12-cavity mould.
// A cavity fills while the spout is over it. Past 115% the extra spills,
// one unit is lost, and a sticky mark stays. Done when every cavity is ≥ 80%.
import {MOULD_CAVITIES} from './mould.mjs';

export const POUR_FILL_PER_SEC = 1.05;
export const POUR_DONE = 0.8;
export const POUR_SPILL = 1.15;
export const POUR_UNITS = 14;
export const POUR_SPILL_PENALTY = 0.08;

export function createPour() {
  return {
    fills: Array(MOULD_CAVITIES).fill(0),
    sticky: Array(MOULD_CAVITIES).fill(false),
    spills: 0,
    units: POUR_UNITS,
    elapsed: 0,
    pouring: false,
    cavity: 0,
    done: false,
    quality: 0,
  };
}

function clampCavity(index) {
  if (!Number.isInteger(index)) return 0;
  return Math.max(0, Math.min(MOULD_CAVITIES - 1, index));
}

export function pourQuality(fills, spills) {
  const list = Array.isArray(fills) && fills.length === MOULD_CAVITIES ? fills : Array(MOULD_CAVITIES).fill(0);
  const lost = Math.max(0, Number(spills) || 0);
  let sum = 0;
  for (const raw of list) {
    const fill = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    if (fill < POUR_DONE) sum += (fill / POUR_DONE) * 0.75;
    else if (fill <= 1.05) sum += 1;
    else sum += Math.max(0.62, 1 - ((Math.min(fill, POUR_SPILL) - 1.05) / 0.1) * 0.28);
  }
  const quality = Math.min(1, Math.max(0, sum / MOULD_CAVITIES - lost * POUR_SPILL_PENALTY));
  const done = list.every(fill => fill >= POUR_DONE);
  return {done, quality: done ? quality : quality, spills: lost};
}

export function pourProgress(state) {
  if (!state?.fills) return 0;
  return state.fills.filter(fill => fill >= POUR_DONE).length / MOULD_CAVITIES;
}

export function stepPour(state, dt, input = {}) {
  const next = state || createPour();
  const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
  next.elapsed += step;
  next.pouring = !!input.pouring;
  next.cavity = clampCavity(input.cavity);
  if (next.done) return next;
  if (next.pouring && next.units > 0 && step > 0) {
    const i = next.cavity;
    let add = Math.min(next.units, POUR_FILL_PER_SEC * step);
    next.units -= add;
    const before = next.fills[i];
    let fill = before + add;
    if (fill > POUR_SPILL) {
      if (!next.sticky[i]) {
        next.spills += 1;
        next.units = Math.max(0, next.units - 1);
        next.sticky[i] = true;
      }
      fill = POUR_SPILL;
    }
    next.fills[i] = fill;
  }
  const score = pourQuality(next.fills, next.spills);
  next.done = score.done;
  next.quality = score.quality;
  if (next.done) next.pouring = false;
  return next;
}

export function assistPour(state, dt) {
  const current = state || createPour();
  const index = current.fills.findIndex(fill => fill < 0.92);
  if (index < 0) return stepPour(current, dt, {pouring: false, cavity: current.cavity});
  return stepPour(current, dt, {pouring: true, cavity: index});
}
