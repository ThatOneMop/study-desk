// Scoring for the four bench minigames. No renderer, no DOM.
import assert from 'node:assert/strict';
import {CAVITY_POINTS, MOULD_GAP, SEED_SNAP_M, nearestCavity} from '../mould.mjs';
import {createPour, stepPour, assistPour, POUR_FILL_PER_SEC, POUR_SPILL, POUR_DONE} from '../mg-pour.mjs';
import {createSeed, stepSeed, assistSeed, trySeed, SEED_POP_SEC, SEED_DROP_SEC} from '../mg-seed.mjs';
import {createDrizzle, stepDrizzle, assistDrizzle, drizzleTarget, DRIZZLE_FILL_PER_SEC, DRIZZLE_INTERVAL, DRIZZLE_PUDDLE, DRIZZLE_PRIME} from '../mg-drizzle.mjs';
import {createSeal, stepSeal, assistSeal, crimpInGreen, SEAL_HOLD, SEAL_GREEN_START, SEAL_GREEN_END, SEAL_COMPLAINT} from '../mg-seal.mjs';
import {SKIP_QUALITY, PRICE_QUALITY_FLOOR, growQuality, hasGrowScore, blendQuality, packScore, listedQuality, qualityPrice, complaintHits, roundTripCraft, ensureCraftQuality} from '../craft-quality.mjs';
import {validateSave} from '../business-core.mjs';
import {BENCH_KIND} from '../bench-mode.mjs';

function untilDone(step, state, dt = 1 / 30, limit = 800) {
  let guard = 0;
  while (!state.done && guard++ < limit) state = step(state, dt);
  assert.equal(state.done, true, 'minigame did not finish');
  return state;
}

const origin = CAVITY_POINTS[0];
assert.equal(SEED_SNAP_M, 0.025);
assert.ok(MOULD_GAP > SEED_SNAP_M * 2);
assert.ok(nearestCavity(origin.x + 0.024, origin.z));
assert.equal(nearestCavity(origin.x + 0.026, origin.z), null);
assert.equal(nearestCavity(origin.x, origin.z).accuracy, 1);

const spilled = stepPour(createPour(), 1.2, {pouring: true, cavity: 0});
assert.equal(spilled.spills, 1);
assert.equal(spilled.fills[0], POUR_SPILL);
assert.equal(spilled.sticky[0], true);
assert.equal(spilled.done, false);
const unitsAfterSpill = spilled.units;
const stuck = stepPour(spilled, 0.5, {pouring: true, cavity: 0});
assert.equal(stuck.spills, 1);
assert.equal(stuck.fills[0], POUR_SPILL);
assert.ok(stuck.units < unitsAfterSpill);

const pour = untilDone(assistPour, createPour());
assert.equal(pour.spills, 0);
assert.ok(pour.fills.every(fill => fill >= POUR_DONE));
assert.ok(pour.quality >= 0.98);
assert.ok(pour.elapsed >= 5 - 1e-6 && pour.elapsed <= 12, 'pour elapsed ' + pour.elapsed);
assert.equal(POUR_FILL_PER_SEC, 1.05);

const sealed = createSeed();
assert.equal(trySeed(sealed, origin.x, origin.z), null);
assert.equal(stepSeed(sealed, SEED_POP_SEC - 0.01, {pop: true}).popped, false);
const seed = untilDone(assistSeed, createSeed());
assert.equal(seed.placed.filter(Boolean).length, 12);
assert.equal(seed.quality, 1);
assert.ok(seed.elapsed >= 5 - 1e-6 && seed.elapsed <= 12, 'seed elapsed ' + seed.elapsed);
assert.equal(SEED_POP_SEC + 12 * SEED_DROP_SEC > 5, true);

let drizzle = createDrizzle();
const dt = 0.05;
let primed = 0;
while (drizzle.prime < DRIZZLE_PRIME && primed++ < 40) {
  const target = drizzleTarget(drizzle);
  drizzle = stepDrizzle(drizzle, dt, {pouring: true, aimX: target.x, aimZ: target.z});
}
const afterPrime = drizzle.fill;
const aimed = drizzleTarget(drizzle);
drizzle = stepDrizzle(drizzle, 1, {pouring: true, aimX: aimed.x, aimZ: aimed.z});
assert.ok(Math.abs(drizzle.fill - afterPrime - DRIZZLE_FILL_PER_SEC) < 0.02);
assert.equal(DRIZZLE_FILL_PER_SEC, 0.25);
assert.equal(DRIZZLE_INTERVAL, 0.9);

let missed = createDrizzle();
let warm = 0;
while (missed.prime < DRIZZLE_PRIME && warm++ < 40) {
  const target = drizzleTarget(missed);
  missed = stepDrizzle(missed, dt, {pouring: true, aimX: target.x, aimZ: target.z});
}
let away = 0;
while (away < DRIZZLE_INTERVAL * 2) {
  missed = stepDrizzle(missed, dt, {pouring: true, aimX: 2, aimZ: 2});
  away += dt;
}
assert.ok(missed.puddles >= 1);
const messy = untilDone(assistDrizzle, missed);
assert.equal(messy.quality, Math.max(0, 1 - messy.puddles * DRIZZLE_PUDDLE));
assert.ok(messy.quality <= 1 - DRIZZLE_PUDDLE);

const clean = untilDone(assistDrizzle, createDrizzle());
assert.equal(clean.puddles, 0);
assert.equal(clean.quality, 1);
assert.ok(clean.elapsed >= 5 - 1e-6 && clean.elapsed <= 12, 'drizzle elapsed ' + clean.elapsed);

assert.equal(crimpInGreen(0.5), true);
assert.equal(crimpInGreen(0.2), false);
assert.equal(SEAL_HOLD, 0.4);
assert.ok(SEAL_GREEN_END - SEAL_GREEN_START >= 0.2);
let early = createSeal();
early = stepSeal(early, 0.35, {inBag: true});
early = stepSeal(early, 1, {holding: true, crimp: 0.1});
assert.equal(early.sealed, false);
assert.equal(early.phase, 'crimp');
early = stepSeal(early, 0, {forceBad: true, crimp: 0.1});
early = stepSeal(early, 0.2, {inHopper: true});
assert.equal(early.done, true);
assert.equal(early.bad, true);
assert.equal(early.quality, 0.72);
assert.equal(early.complaint, SEAL_COMPLAINT);

const seal = untilDone(assistSeal, createSeal());
assert.equal(seal.bad, false);
assert.equal(seal.complaint, 0);
assert.equal(seal.quality, 1);
assert.ok(seal.elapsed >= 5 - 1e-6 && seal.elapsed <= 12, 'seal elapsed ' + seal.elapsed);

assert.equal(SKIP_QUALITY, 0.9);
assert.equal(qualityPrice(30, 0, 1), 30);
assert.equal(qualityPrice(30, 0, 0.9), 27);
assert.equal(listedQuality({}, 0), 1);
assert.equal(qualityPrice(30, 0, listedQuality({packs: [4]}, 0)), 30);
assert.equal(PRICE_QUALITY_FLOOR, 0.55);
assert.ok(qualityPrice(30, 0, 0.1) >= 1);

const plant = {pour: pour.quality, seed: seed.quality, drizzle: clean.quality};
assert.equal(hasGrowScore(plant), true);
assert.ok(growQuality(plant) >= 0.98);
const bag = packScore(growQuality(plant), seal.quality);
assert.ok(bag >= 0.85 && bag <= 1);
const listed = {packQuality: []};
listed.packQuality[0] = blendQuality(undefined, 4, bag, 1);
assert.equal(qualityPrice(30, 0, listedQuality(listed, 0)), 30);
assert.equal(blendQuality(undefined, 4, 0.95, 1), 0.99);
assert.equal(growQuality({}), 1);
assert.equal(hasGrowScore({phase: 'mature', t: 0}), false);

assert.equal(complaintHits(0, 99), false);
assert.equal(complaintHits(1, 5), true);
assert.equal(complaintHits(0.15, 42), complaintHits(0.15, 42));

assert.deepEqual(BENCH_KIND, {prepare: 'pour', plant: 'seed', water: 'drizzle', pack: 'seal'});

const world = {minX: -280, maxX: 280, minZ: -500, maxZ: 95};
const save = {
  version: 3, mode: 'story', cash: 400, bank: 0, xp: 0, day: 1, time: 540, x: 0, z: 0,
  seeds: Array(6).fill(0), raw: Array(6).fill(0), gummies: Array(6).fill(0), packs: Array(6).fill(0),
  plants: [{phase: 'dry', t: 0, pour: 1, seed: 0.95, drizzle: 1}], deals: [], threads: {},
  packQuality: [0.91],
};
const check = validateSave(save, 30, world);
assert.equal(check.ok, true, check.reason);
const round = roundTripCraft(save);
assert.equal(round.version, 3);
assert.equal(round.packQuality[0], 0.91);
assert.equal(round.plants[0].seed, 0.95);
assert.equal(round.plants[0].pour, 1);
const kept = ensureCraftQuality(JSON.parse(JSON.stringify(round)));
assert.equal(kept.version, 3);
assert.ok(Array.isArray(kept.rawQuality));

console.log('minigames ok', {pour: pour.elapsed, seed: seed.elapsed, drizzle: clean.elapsed, seal: seal.elapsed, bag});
