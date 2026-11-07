'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const Areas = require('../games/packworks/areas.js');
const html = fs.readFileSync(path.join(__dirname, '../games/packworks/index.html'), 'utf8');
assert(html.includes('src="areas.js"'));
assert(html.includes('Areas.rollId'));
assert(html.includes('packworks-v1'));
assert(!html.includes("SET_NAMES=['Meadow'"));

function seenFrom(pairs) {
  const seen = {};
  for (const [id, variant] of pairs) seen[id + ':' + variant] = true;
  return seen;
}
function fillSet(seen, setIndex, count, variant = 0) {
  for (let card = 0; card < count; card++) seen[(setIndex * 20 + card) + ':' + variant] = true;
  return seen;
}

const fresh = Areas.reconcile({ seen: {}, opened: 0 });
assert.equal(fresh, 0, 'a new shelf starts at Meadow');
assert.equal(Areas.canOpen(1, {}, 3), false);
assert.equal(Areas.canOpen(1, fillSet({}, 0, 10), 3), false, 'cards without the pack count do not skip Meadow');
assert.equal(Areas.canOpen(1, fillSet({}, 0, 9), 8), false);
assert.equal(Areas.canOpen(1, fillSet({}, 0, 10), 4), true);

const meadowDone = fillSet({}, 0, 20);
assert.equal(Areas.canOpen(2, meadowDone, 4), false, 'Deep Sea still needs Midnight cards');
fillSet(meadowDone, 1, 8);
assert.equal(Areas.canOpen(2, meadowDone, 4), true);

const midnightDone = fillSet(fillSet({}, 0, 20), 1, 20);
assert.equal(Areas.canOpen(3, midnightDone, 30), false);
fillSet(midnightDone, 2, 8);
assert.equal(Areas.canOpen(3, midnightDone, 30), true);

const twoSets = fillSet(fillSet({}, 0, 20), 1, 20);
twoSets['5:3'] = true;
assert.equal(Areas.canOpen(4, twoSets, 40), false, 'Cosmos still needs a run of Clockwork cards');
fillSet(twoSets, 3, 12);
assert.equal(Areas.canOpen(4, twoSets, 40), true);

const wild = fillSet(fillSet(fillSet({}, 0, 20), 1, 20), 2, 20);
assert.equal(Areas.canOpen(5, wild, 80), false, 'Wildwood needs Cosmos cards from the shelf before it');
fillSet(wild, 4, 10);
assert.equal(Areas.canOpen(5, wild, 80), true);
assert.equal(Areas.canOpen(2, fillSet({}, 2, 20), 100), false, 'a later shelf cannot satisfy an earlier goal');
assert.equal(Areas.canOpen(5, fillSet({}, 5, 20), 100), false, 'Wildwood cards are not required to open Wildwood');

const legacy = { seen: { '80:0': true }, opened: 2, cash: 40, upgrades: { worker: 3 } };
assert.equal(Areas.reconcile(legacy), 4, 'an old Cosmos card keeps Cosmos open');
assert.equal(Areas.reconcile({ ...legacy, areas: 5 }), 5, 'a stored later shelf is not revoked');
assert.equal(Areas.reconcile({ seen: { '119:4': true }, opened: 0 }), 5);

const ids = new Set();
for (let i = 0; i < 200; i++) ids.add(Areas.rollId(0, {}, Math.random));
assert.equal([...ids].every(id => id >= 0 && id < 20), true);
const wider = new Set();
for (let i = 0; i < 400; i++) wider.add(Math.floor(Areas.rollId(2, meadowDone, Math.random) / 20));
assert.deepEqual([...wider].sort(), [0, 1, 2]);

const lines = Areas.status(0, fillSet({}, 0, 3), 1);
assert.equal(lines.sealed, 'Midnight');
assert.equal(lines.lines[0].text, 'Meadow cards 3/10');
assert.equal(Areas.openNames(0).join(','), 'Meadow');
assert.equal(Areas.REWARDS[1] > 0 && Areas.REWARDS[1] < 200, true);
const migrated = Areas.reconcile({ seen: { '80:0': true }, opened: 40, cash: 900 });
assert.equal(migrated, 4);
const firstClaim = Areas.freshShelves(migrated, { seen: { '80:0': true }, opened: 40, areas: migrated, cash: 900 });
assert.deepEqual(firstClaim.gained, [], 'loading an advanced save does not mint shelf rewards');
assert.deepEqual(Areas.freshShelves(firstClaim.area, { seen: { '80:0': true }, opened: 40, areas: firstClaim.area }).gained, []);

function mulberry32(seed) {
  let value = seed >>> 0;
  return function () {
    value |= 0; value = value + 0x6D2B79F5 | 0;
    let mixed = Math.imul(value ^ value >>> 15, 1 | value);
    mixed = mixed + Math.imul(mixed ^ mixed >>> 7, 61 | mixed) ^ mixed;
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
}
const PACKS = [
  { name: 'Paper', cost: 0, count: 3, level: 0 },
  { name: 'Copper', cost: 55, count: 4, level: 1 },
  { name: 'Neon', cost: 220, count: 5, level: 2 },
  { name: 'Collector', cost: 650, count: 6, level: 3 },
  { name: 'Workshop', cost: 1700, count: 12, level: 2 },
  { name: 'Wildcard', cost: 3200, count: 8, level: 4 }
];
const UPGRADES = [
  { id: 'fingers', cost: 45, cap: 5 },
  { id: 'luck', cost: 90, cap: 5 },
  { id: 'hand', cost: 130, cap: 3 },
  { id: 'discount', cost: 210, cap: 4 }
];
function rank(state, id) { return state.upgrades[id] || 0; }
function packCost(state, pack) { return Math.max(0, Math.floor(pack.cost * Math.pow(0.92, rank(state, 'discount')))); }
function upgradeCost(spec, lv) { return Math.round(spec.cost * Math.pow(1.85, lv)); }
function sellValue(variant, fingers) { return Math.ceil([4, 11, 35, 95, 280][variant] * (1 + fingers * 0.25)); }
function chooseVariant(random, boost, luckLevel) {
  const roll = random();
  const luck = luckLevel * 0.017 + boost * 0.023;
  if (roll < 0.006 + luck * 0.12) return 4;
  if (roll < 0.026 + luck * 0.26) return 3;
  if (roll < 0.075 + luck * 0.65) return 2;
  if (roll < 0.19 + luck) return 1;
  return 0;
}
function sellDuplicates(state) {
  for (const key of Object.keys(state.inventory)) {
    const extras = state.inventory[key] - 1;
    if (extras <= 0) continue;
    state.cash += extras * sellValue(Number(key.split(':')[1]), rank(state, 'fingers'));
    state.totalSales += extras * sellValue(Number(key.split(':')[1]), rank(state, 'fingers'));
    state.inventory[key] = 1;
  }
}
function buyUpgrades(state) {
  for (let guard = 0; guard < 8; guard++) {
    let choice = null;
    for (const spec of UPGRADES) {
      const lv = rank(state, spec.id);
      if (lv >= spec.cap) continue;
      if (spec.id === 'luck' && lv >= 2 && state.areas < 3) continue;
      const cost = upgradeCost(spec, lv);
      if (state.cash < cost) continue;
      if (!choice || cost < choice.cost) choice = { spec, cost };
    }
    if (!choice) break;
    state.cash -= choice.cost;
    state.upgrades[choice.spec.id] = rank(state, choice.spec.id) + 1;
    state.actions++;
  }
}
function runEconomy(seed) {
  const random = mulberry32(seed);
  const state = { cash: 0, opened: 0, seen: {}, inventory: {}, upgrades: {}, areas: 0, totalSales: 0, actions: 0, paid: [], marks: {} };
  for (let step = 0; step < 800 && state.areas < 5; step++) {
    buyUpgrades(state);
    let pack = PACKS[0];
    for (const candidate of PACKS) {
      if (candidate.level >= 4 && state.areas < 3) continue;
      if (state.cash >= packCost(state, candidate) && candidate.count >= pack.count) pack = candidate;
    }
    state.cash -= packCost(state, pack);
    for (let card = 0; card < pack.count + rank(state, 'hand'); card++) {
      const id = Areas.rollId(state.areas, state.seen, random);
      const variant = chooseVariant(random, pack.level, rank(state, 'luck'));
      const token = id + ':' + variant;
      if (!state.seen[token]) state.cash += 2 + variant * 7;
      state.seen[token] = true;
      state.inventory[token] = (state.inventory[token] || 0) + 1;
    }
    state.opened++;
    state.actions++;
    sellDuplicates(state);
    const stepShelves = Areas.freshShelves(state.areas, state);
    for (const area of stepShelves.gained) {
      state.cash += Areas.REWARDS[area];
      state.paid.push(area);
      state.marks[area] = state.opened;
    }
    state.areas = stepShelves.area;
  }
  return state;
}
const seeds = [1, 2, 3, 7, 11, 19];
const reports = seeds.map(seed => ({ seed, ...runEconomy(seed) }));
for (const report of reports) {
  assert.equal(report.areas, 5, 'seed ' + report.seed + ' should open Wildwood');
  assert.deepEqual(report.paid, [1, 2, 3, 4, 5], 'each shelf is paid once');
  assert.ok(report.marks[2] < report.marks[3] && report.marks[3] < report.marks[4] && report.marks[4] < report.marks[5], 'shelves open in order');
  assert.ok(report.opened <= 220, 'seed ' + report.seed + ' took ' + report.opened + ' packs');
  assert.ok(report.opened >= 40, 'opening every shelf stays more than a handful of free packs');
}
const packs = reports.map(report => report.opened);
console.log('PASS Packworks shelves and economy: seeds ' + seeds.join(',') + ' opened Wildwood in ' + Math.min(...packs) + '-' + Math.max(...packs) + ' packs; shelf packs ' + reports.map(report => [report.marks[1], report.marks[2], report.marks[3], report.marks[4], report.marks[5]].join('/')).join(' | '));
