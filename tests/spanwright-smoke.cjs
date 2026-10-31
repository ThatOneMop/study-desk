'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const E = require('../games/spanwright/engine.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'games/spanwright/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'games/spanwright/style.css'), 'utf8');

assert.equal(E.SAVE_KEY, 'study-desk-spanwright-v1');
assert.equal(E.LEVELS.length, 36);
assert(html.includes('../../bridge.js'));
assert(html.includes('href="../../index.html#games"'));
assert(html.includes('Spanwright'));
assert(!/poly bridge/i.test(html + css));
assert(css.includes('touch-action: none') || css.includes('touch-action:none'));
for (const id of ['title', 'map', 'scene', 'settings', 'pause', 'result', 'tools', 'hud']) {
  assert(html.includes('id="' + id + '"'), id);
}

const table = {
  road: [900, 200, 2], wood: [800, 180, 2], steel: [2000, 450, 4],
  rope: [1200, 220, 40], cable: [2200, 400, 40], hydraulic: [2000, 750, 4], spring: [960, 380, 3]
};
for (const [id, expect] of Object.entries(table)) {
  const mat = E.MATERIALS[id];
  assert.equal(mat.strength, expect[0], id);
  assert.equal(mat.cost, expect[1], id);
  assert.equal(mat.max, expect[2], id);
}
assert.equal(E.MATERIALS.rope.compression, false);
assert.equal(E.MATERIALS.cable.compression, false);
assert.equal(E.MATERIALS.road.compression, true);

function run(session, seconds) {
  const started = E.beginSim(session);
  assert.equal(started.ok, true, started.reason);
  const steps = Math.round(seconds / E.FRAME);
  for (let i = 0; i < steps && session.sim.mode === 'run'; i++) E.tick(session);
  return session.sim;
}

const meta = E.defaultMeta();
assert.equal(E.levelUnlocked(meta, 'willow-1'), true);
assert.equal(E.levelUnlocked(meta, 'willow-2'), false);
assert.equal(E.worldUnlocked(meta, 'copper'), false);

const opening = E.startLevel(meta, 'willow-1');
assert.equal(E.placeBeam(opening, 'road', 7, 6, 9, 6).ok, true);
assert.equal(E.placeBeam(opening, 'road', 9, 6, 11, 6).ok, true);
assert.equal(E.placeBeam(opening, 'road', 11, 6, 13, 6).ok, true);
assert.equal(E.placeBeam(opening, 'road', 7, 6, 13, 6).ok, false);
run(opening, 12);
assert.equal(opening.sim.result, 'success');
assert.ok(opening.sim.grade.stars >= 2);
assert.equal(opening.sim.breaks, 0);
const awarded = E.award(meta, opening);
assert.ok(awarded.includes('first-crossing'));
assert.equal(E.levelUnlocked(meta, 'willow-2'), true);

const rope = E.testSession({
  anchors: [{ x: 0, y: 0 }],
  ground: [],
  waterY: -6,
  bounds: { x0: -4, y0: -8, x1: 6, y1: 8 },
  vehicles: [],
  materials: ['rope']
});
assert.equal(E.placeBeam(rope, 'rope', 0, 0, 0, 2).ok, true);
run(rope, 2);
const ropeNode = rope.nodes.find(n => !n.pin);
assert.ok(ropeNode.y < 0, 'rope cannot hold compression');

const wood = E.testSession({
  anchors: [{ x: 0, y: 0 }],
  ground: [],
  waterY: -6,
  bounds: { x0: -4, y0: -8, x1: 6, y1: 8 },
  vehicles: [],
  materials: ['wood']
});
assert.equal(E.placeBeam(wood, 'wood', 0, 0, 0, 2).ok, true);
run(wood, 2);
const woodNode = wood.nodes.find(n => !n.pin);
assert.ok(woodNode.y > 1.5, 'wood holds a post');

for (const level of E.LEVELS) {
  if (level.world === 'willow' || level.world === 'copper') meta.stars[level.id] = 1;
}
const tide = E.startLevel(meta, 'tide-1');
function beam(mat, x0, y0, x1, y1, opt) {
  const placed = E.placeBeam(tide, mat, x0, y0, x1, y1, opt);
  assert.equal(placed.ok, true, placed.reason);
  return placed;
}
const h1 = beam('hydraulic', 8, 2, 8, 6);
const h2 = beam('hydraulic', 12, 2, 12, 6);
const sp1 = E.splitJoint(tide, 8, 6);
const sp2 = E.splitJoint(tide, 12, 6);
assert.equal(sp1.ok, true);
assert.equal(sp2.ok, true);
for (const id of [h1.id, h2.id]) {
  E.setScale(tide, id, 1.5);
  E.togglePhase(tide, id, 'A');
  E.togglePhase(tide, id, 'B');
}
for (const id of [sp1.pair, sp2.pair]) {
  E.toggleSplitPhase(tide, id, 'A');
  E.toggleSplitPhase(tide, id, 'B');
}
beam('road', 4, 6, 6, 6);
beam('road', 6, 6, 8, 6, { nodeB: sp1.id });
beam('road', 8, 6, 10, 6, { nodeA: sp1.pair });
beam('road', 10, 6, 12, 6, { nodeB: sp2.pair });
beam('road', 12, 6, 14, 6, { nodeA: sp2.id });
run(tide, 20);
assert.equal(tide.sim.result, 'success', tide.sim.why);
assert.equal(tide.sim.breaks, 0);
assert.ok(tide.sim.grade.stars >= 2);

const flat = E.startLevel(meta, 'tide-1');
for (let x = 4; x < 14; x += 2) assert.equal(E.placeBeam(flat, 'road', x, 6, x + 2, 6).ok, true);
run(flat, 16);
assert.equal(flat.sim.result, 'fail');
assert.ok(flat.sim.breaks > 0);

opening.spent = opening.level.budget * 2;
opening.sim.result = 'success';
const over = E.grade(opening);
assert.equal(over.block, 'ledger');
assert.equal(over.stars, 0);

assert.equal(E.undo(E.startLevel(meta, 'willow-1')), false);
const edited = E.startLevel(meta, 'willow-1');
E.placeBeam(edited, 'road', 7, 6, 9, 6);
assert.equal(E.undo(edited), true);
assert.equal(edited.beams.length, 0);

const round = E.encode({ meta: meta });
const decoded = E.decode(round);
assert.equal(decoded.ok, true);
assert.equal(decoded.meta.stars['willow-1'], 1);
assert.equal(E.decode('{').ok, false);
assert.equal(E.decode('{"version":1}').ok, false);

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const entry = catalog.find(g => g.id === 'spanwright');
assert(entry, 'catalogue entry');
assert.equal(entry.url, 'games/spanwright/index.html');
assert.equal(entry.title, 'Spanwright');
assert(fs.readFileSync(path.join(root, 'credits.html'), 'utf8').includes('id="spanwright"'));
assert(fs.existsSync(path.join(root, 'games/spanwright/CREDITS.md')));
assert(fs.existsSync(path.join(root, 'docs/spanwright-research.md')));

console.log('PASS spanwright: 36 crossings, a cart homes, a piston lift clears a barge, a flat deck collapses, rope slacks, saves round-trip');
