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
assert.equal(Areas.canOpen(4, twoSets, 40), false, 'Cosmos wants a Starlit or Mythic card');
twoSets['5:3'] = true;
assert.equal(Areas.canOpen(4, twoSets, 40), true);

const wild = fillSet(fillSet(fillSet({}, 0, 20), 1, 20), 2, 20);
assert.equal(Areas.canOpen(5, wild, 80), true);

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
console.log('PASS Packworks shelves: Meadow first, later goals are collection tasks, old cards keep their shelf, rolls stay inside open shelves');
