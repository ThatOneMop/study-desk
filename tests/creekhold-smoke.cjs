'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const E = require('../games/creekhold/engine.js');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'games/creekhold/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'games/creekhold/style.css'), 'utf8');

assert.equal(E.SAVE_KEY, 'study-desk-creekhold-v1');
assert(E.BUILDINGS.length >= 30, 'tech tree');
assert.equal(Object.keys(E.FACTIONS).length, 2);
assert.equal(E.MAPS.length, 3);
assert(html.includes('../../bridge.js'));
assert(html.includes('href="../../index.html#games"'));
for (const id of ['view', 'topbar', 'dock', 'title', 'pick', 'pause', 'tech', 'settings', 'tutor', 'alerts']) {
  assert(html.includes('id="' + id + '"'), id);
}
assert(css.includes('touch-action: none') || css.includes('touch-action:none'));
assert(!/timberborn|folktails|iron teeth|badwater|mechanistry/i.test(html + css));

function layWillow(run, withWorks) {
  const pathPts = [[5, 5], [5, 6]];
  for (let x = 6; x <= 14; x++) pathPts.push([x, 6]);
  pathPts.push([14, 7]);
  for (const [x, y] of pathPts) {
    const placed = E.place(run, 'path', x, y);
    assert.equal(placed.ok, true, placed.reason + ' path ' + x + ',' + y);
  }
  if (!withWorks) return;
  for (const [id, x, y] of [['pump', 8, 7], ['tank', 6, 5], ['forager', 10, 5], ['lumber', 7, 5]]) {
    const placed = E.place(run, id, x, y);
    assert.equal(placed.ok, true, placed.reason + ' ' + id);
  }
  for (const y of [8, 9, 10, 11]) {
    const placed = E.place(run, 'dam', 14, y);
    assert.equal(placed.ok, true, placed.reason + ' dam ' + y);
  }
}

const held = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
layWillow(held, true);
E.finishAll(held);
E.tick(held, 12);
const up = E.get(held, 13, 9).water;
const down = E.get(held, 16, 9).water;
assert(up > down + 0.45, 'dam holds a step, upstream ' + up.toFixed(2) + ' downstream ' + down.toFixed(2));

const open = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
E.tick(open, 12);
const openDrop = E.get(open, 13, 9).water - E.get(open, 16, 9).water;
assert(openDrop < up - down, 'an open channel drops less than a dam');

const dry = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
const before = E.totalWater(dry);
dry.season = 'drought';
E.tick(dry, 30);
assert(E.totalWater(dry) < before * 0.25, 'drought drains the river');

const sour = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
sour.season = 'badtide';
sour.seasonHour = 18;
E.tick(sour, 6);
assert(E.get(sour, 2, 9).bad > 0.8, 'sour tide contaminates the source');

const far = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
assert.equal(E.place(far, 'tank', 20, 2).ok, false);
assert.equal(E.place(far, 'tank', 20, 2).reason, 'unreached');

const stack = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
assert.equal(E.place(stack, 'stairs', 5, 5).ok, true);
E.finishAll(stack);
stack.store.science = 40;
assert.equal(E.unlock(stack, 'platform').ok, true);
assert.equal(E.place(stack, 'platform', 6, 5).ok, true);
E.finishAll(stack);
assert.equal(E.get(stack, 6, 5).floors, 1);
assert.equal(E.place(stack, 'platform', 6, 5).ok, true);
E.finishAll(stack);
assert.equal(E.get(stack, 6, 5).floors, 2);
assert.equal(E.walkZ(E.get(stack, 6, 5)), E.get(stack, 6, 5).ground + 2);
assert(stack.network.has('6,5'), 'a stair links the stacked platform');

held.store.science = 20;
assert.equal(E.unlock(held, 'wheel').ok, true);
assert.equal(E.place(held, 'path', 10, 7).ok, true);
const wheelPlace = E.place(held, 'wheel', 10, 8);
assert.equal(wheelPlace.ok, true, wheelPlace.reason);
E.finishAll(held);
E.tick(held, 3);
const wheel = E.get(held, 10, 8);
assert(wheel.flow > 0.05 || E.powerAt(held, wheel) > 0, 'paddle wheel sees current');

function play(build) {
  const colony = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
  if (build) layWillow(colony, true);
  for (let hour = 0; hour < 250; hour++) E.tick(colony, 1);
  return colony;
}
const smart = play(true);
const idle = play(false);
assert.equal(smart.phase, 'play');
assert.equal(smart.deaths, 0);
assert(E.living(smart).length >= 8, 'prepared colony population');
assert(smart.store.water > 8, 'stored water through the first dry spell');
assert.equal(idle.phase, 'over');
assert.equal(E.living(idle).length, 0);
assert.equal(idle.overWhy, 'thirst');

const grown = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
layWillow(grown, true);
assert.equal(E.place(grown, 'lodge', 4, 5).ok, true, 'spare lodge');
E.finishAll(grown);
assert(E.beds(grown) > E.living(grown).length, 'a free bed');
grown.store.water = 70;
grown.store.berry = 50;
const beforePop = E.living(grown).length;
E.tick(grown, 40);
assert(grown.born >= 1, 'a kit is born when a bed, food and water are spare');
assert(E.living(grown).length > beforePop);
assert(E.goal(grown) && E.goal(grown).title, 'there is a next aim');
const woods = grown.cells.find(function (c) { return c.tree && !c.building; });
assert.equal(E.preview(grown, 'dam', woods.x, woods.y).ok, false, 'valid-tile marks agree with place() on trees');
assert.equal(E.place(grown, 'dam', woods.x, woods.y).ok, false);
const oldSave = E.encode({ meta: E.createMeta(), run: smart });
assert.equal(E.decode(oldSave).ok, true);

const saved = E.encode({ meta: E.createMeta(), run: smart });
const back = E.decode(saved);
assert.equal(back.ok, true);
assert.equal(back.run.nibs.length, E.living(smart).length);
assert.equal(E.get(back.run, 14, 9).building.id, 'dam');
assert.equal(E.decode('{').ok, false);
assert.equal(E.decode('{"v":1}').ok, false);
assert.equal(E.decode('{"v":2,"meta":{}}').ok, false);

const cog = E.startRun(E.createMeta(), 'split', 'cog', 'normal');
assert.equal(cog.faction, 'cog');
assert(cog.cells.some(function (c) { return c.building && c.building.id === 'bunk'; }));
const gorge = E.startRun(E.createMeta(), 'gorge', 'reed', 'hard');
assert.equal(gorge.rules.badFrom, 2);
assert(gorge.network.has('9,11'), 'the gorge stair reaches the bench');

// QA: a step-stair can be laid down a bank from the path above, and a plain path says why it cannot.
const bank = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
for (const y of [5, 6, 7]) assert.equal(E.place(bank, 'path', 5, y).ok, true);
assert.equal(E.place(bank, 'path', 5, 8).reason, 'step');
assert.equal(E.place(bank, 'stairs', 5, 8).ok, true);
assert.equal(E.place(bank, 'path', 4, 8).ok, true);
// QA: the idea tree opens tier by tier.
bank.store.science = 200;
assert.equal(E.unlock(bank, 'bridge').reason, 'tier');
assert.equal(E.unlock(bank, 'platform').ok, true);
assert.equal(E.unlock(bank, 'saw').ok, true);
assert.equal(E.unlock(bank, 'bridge').ok, true);
assert.equal(E.unlock(bank, 'mill').reason, 'prereq');
assert(html.includes('rel="icon"'), 'favicon link so the live page has no 404');
assert(html.includes('id="overlayBtn"'), 'on-screen overlay toggle for touch');

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const entry = catalog.find(function (g) { return g.id === 'creekhold'; });
assert(entry, 'catalogue entry');
assert.equal(entry.url, 'games/creekhold/index.html');
assert.equal(entry.credits, 'credits.html#creekhold');
assert(fs.readFileSync(path.join(root, 'credits.html'), 'utf8').includes('id="creekhold"'));

console.log('PASS creekhold: a dam holds a step, a dry spell drains an open river, a sour tide contaminates, a prepared colony survives the first drought and an idle one dies of thirst');
