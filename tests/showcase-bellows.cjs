'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const G = require('../showcase/game.js');
const root = path.resolve(__dirname, '..');

function play(open, later) {
  const state = G.create();
  G.start(state);
  for (const [pad, tool] of open) assert.equal(G.place(state, pad, tool).ok, true, tool);
  assert.equal(G.openGate(state).ok, true);
  let bought = 0;
  for (let n = 0; n < 20000 && state.phase !== 'win' && state.phase !== 'lose'; n++) {
    if (state.phase === 'breath' && later[bought] && G.place(state, later[bought][0], later[bought][1]).ok) bought += 1;
    G.tick(state, 0.05);
  }
  return state;
}

const lost = play([], []);
assert.equal(lost.phase, 'lose');
assert.equal(lost.embers, 0);

const weak = play([['a', 'fan']], []);
assert.equal(weak.phase, 'lose');

const held = play(
  [['e', 'hammer'], ['b', 'quench']],
  [['a', 'fan'], ['f', 'fan'], ['h', 'quench']]
);
assert.equal(held.phase, 'win');
assert.ok(held.embers > 0);
assert.equal(held.wave, G.WAVES.length);

const page = fs.readFileSync(path.join(root, 'showcase/index.html'), 'utf8');
assert(page.includes('How this was built'));
assert(!page.includes('bridge.js'));
assert(!page.includes('catalog.js'));
const study = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(!study.includes('showcase/'));

console.log('PASS bellows gate: an empty yard loses, one fan loses, a planned yard holds');
