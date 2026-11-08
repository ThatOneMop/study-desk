/* Outbreak Atlas: seeded spread, two winning routes, a real loss, and a reload. */
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const O = require('../games/outbreak-atlas/model.js');
const root = path.resolve(__dirname, '..');

function play(options, buys, limit = 46) {
  let state = O.create(options);
  const queue = buys.slice();
  while (state.month < limit && !state.won && !state.lost) {
    while (queue.length && O.buy(state, queue[0]).ok) state = O.buy(state, queue.shift()).state;
    state = O.step(state);
  }
  return state;
}
const islands = ['lantern', 'spire', 'farwhistle'];
const mainland = O.LANDS.filter(land => land.kind !== 'isle').map(land => land.id);

{
  const plain = O.create({ seed: 1 });
  const bySea = O.create({ seed: 1 }); bySea.owned = ['harbors'];
  const byAir = O.create({ seed: 1 }); byAir.owned = ['sky'];
  assert.deepEqual(O.reachable(plain).filter(id => islands.includes(id)), [], 'islands stay closed until a lane opens');
  mainland.forEach(id => assert.ok(O.reachable(plain).includes(id), id));
  islands.forEach(id => { assert.ok(O.reachable(bySea).includes(id)); assert.ok(O.reachable(byAir).includes(id)); });
  assert.equal(O.UPGRADES.length, 24);
  assert.equal(O.LANDS.length, 14);
}

{
  const drift = play({ seed: 2, scenario: 'world', archetype: 'drift', pressure: 'breezy' }, ['sky', 'soft', 'footpaths', 'dim', 'carts', 'ember', 'wide']);
  const root = play({ seed: 8, scenario: 'world', archetype: 'root', pressure: 'breezy' }, ['harbors', 'soft', 'footpaths', 'dim', 'borrowed', 'carts', 'ferries', 'still']);
  assert.equal(drift.won, true);
  assert.equal(root.won, true);
  assert.ok(drift.month >= 8 && drift.month <= 24, 'drift month ' + drift.month);
  assert.ok(root.month > drift.month, 'root is the slower spread');
  assert.ok(drift.talk > root.talk, 'drift is the louder spread');
  assert.ok(drift.effort < 1 && root.effort < 1);
  const again = play({ seed: 2, scenario: 'world', archetype: 'drift', pressure: 'breezy' }, ['sky', 'soft', 'footpaths', 'dim', 'carts', 'ember', 'wide']);
  assert.equal(again.month, drift.month);
  assert.equal(again.lands.farwhistle.mark.toFixed(4), drift.lands.farwhistle.mark.toFixed(4));
}

{
  const veiled = play({ seed: 5, scenario: 'quiet', archetype: 'drift', pressure: 'breezy' }, ['soft', 'dim', 'borrowed', 'footpaths', 'still', 'sky']);
  const loud = play({ seed: 5, scenario: 'quiet', archetype: 'drift', pressure: 'breezy' }, ['footpaths', 'carts', 'sky', 'tailwinds']);
  assert.equal(veiled.won, true);
  assert.equal(loud.won, false);
  assert.equal(loud.lost, true);
  const air = play({ seed: 4, scenario: 'twin', archetype: 'drift', pressure: 'calm' }, ['sky', 'footpaths', 'soft', 'tailwinds']);
  const sea = play({ seed: 8, scenario: 'twin', archetype: 'root', pressure: 'calm' }, ['harbors', 'soft', 'footpaths', 'ferries']);
  assert.equal(air.won, true);
  assert.equal(sea.won, true);
  assert.equal(air.lands.lantern.established, true);
  assert.equal(sea.lands.farwhistle.established, true);
  const held = play({ seed: 4, scenario: 'hearth', archetype: 'root', pressure: 'calm' }, ['wide', 'roots', 'second', 'soft', 'dim']);
  assert.equal(held.won, true);
  assert.ok(held.hearthStreak >= 8);
}

{
  const lost = play({ seed: 9, scenario: 'world', archetype: 'drift', pressure: 'brisk' }, []);
  assert.equal(lost.lost, true);
  assert.equal(lost.won, false);
  islands.forEach(id => assert.equal(lost.lands[id].mark, 0));
  const blocked = play({ seed: 1, scenario: 'world', archetype: 'drift', pressure: 'calm' }, ['footpaths', 'carts', 'soft'], 12);
  islands.forEach(id => assert.ok(blocked.lands[id].mark < 0.05, id));
  const preview = O.forecast(O.create({ seed: 3, scenario: 'twin' }));
  assert.match(preview.lines.join(' '), /Harbor threads or Sky threads/);
}

{
  const state = play({ seed: 6, scenario: 'world', archetype: 'root', pressure: 'calm' }, ['harbors', 'soft'], 4);
  const restored = O.restore(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.month, state.month);
  assert.equal(restored.points, state.points);
  assert.deepEqual(restored.owned, state.owned);
  assert.equal(restored.lands.hearthlow.mark, state.lands.hearthlow.mark);
  assert.throws(() => O.restore({ version: 2 }), /Not an Outbreak Atlas save/);
  const bought = O.buy(O.create({ seed: 1 }), 'ferries');
  assert.equal(bought.ok, false);
  assert.equal(O.buy(O.create({ seed: 1 }), 'harbors').ok, true);
}

{
  const html = fs.readFileSync(path.join(root, 'games/outbreak-atlas/index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'https://example.test/games/outbreak-atlas/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.requestAnimationFrame = fn => { w.__frame = fn; return 1; };
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
  w.eval(fs.readFileSync(path.join(root, 'games/outbreak-atlas/model.js'), 'utf8'));
  w.eval(fs.readFileSync(path.join(root, 'games/outbreak-atlas/game.js'), 'utf8'));
  assert.equal(w.document.getElementById('title').hidden, false);
  w.document.getElementById('begin').click();
  assert.equal(w.document.getElementById('title').hidden, true);
  assert.equal(w.document.getElementById('landName').textContent, 'Hearthlow');
  assert.match(w.document.getElementById('outlook').textContent, /Harbor threads or Sky threads/);
  const saved = JSON.parse(w.localStorage.getItem('outbreak-atlas-v1'));
  assert.equal(saved.version, 1);
  w.document.getElementById('next').click();
  const after = JSON.parse(w.localStorage.getItem('outbreak-atlas-v1'));
  assert.equal(after.month, 1);
  assert.equal(after.lands.lantern.mark, 0);
  w.close();
}

console.log('PASS Outbreak Atlas: sea or sky reaches every island, Drift and Root both win, Quiet fails when it is too loud, brisk neglect loses, saves restore');
