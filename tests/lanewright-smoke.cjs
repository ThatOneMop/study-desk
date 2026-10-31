'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const E = require('../games/lanewright/engine.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'games/lanewright/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'games/lanewright/style.css'), 'utf8');

assert.equal(E.SAVE_KEY, 'study-desk-lanewright-v1');
assert.ok(E.CITIES.length >= 8);
assert(html.includes('../../bridge.js'));
assert(html.includes('href="../../index.html#games"'));
assert(html.includes('Lanewright'));
assert(!/mini\s*motorways|dinosaur polo|disasterpeace/i.test(html + css));
assert(css.includes('touch-action: none') || css.includes('touch-action:none'));
for (const id of ['title', 'cities', 'play', 'scene', 'hud', 'dock', 'settings', 'pause', 'result', 'upgrade', 'tutorial']) {
  assert(html.includes('id="' + id + '"'), id);
}
for (const city of E.CITIES) {
  for (const o of city.openings) {
    assert.equal(city.terrain[o.cy][o.cx], 'land', city.id + ' opening');
  }
  assert.equal(new Set(city.openings.map(o => o.color)).size >= 2, true, city.id);
}

assert.ok(E.pinRate(3, 'square') > E.pinRate(1, 'square'));
assert.ok(E.pinRate(6, 'square') > E.pinRate(1, 'square') * 1.5);
assert.ok(E.pinRate(4, 'circle') > E.pinRate(4, 'square'));

const meta = E.createMeta();
assert.equal(E.unlocked(meta, 'larkmere'), true);
assert.equal(E.unlocked(meta, 'pebble-quay'), false);
assert.equal(E.startRun(meta, 'pebble-quay', 'endless'), null);

const served = E.startRun(meta, 'larkmere', 'endless', { seed: 7 });
const house = served.buildings.find(b => b.role === 'house' && b.color === 'coral');
const dest = served.buildings.find(b => b.role === 'dest' && b.color === 'coral');
const link = E.connectBuildings(served, house.id, dest.id);
assert.equal(link.ok, true, link.reason);
assert.equal(E.linked(served, house.id, dest.id), true);
const pinsEarly = dest.pins;
while (served.phase === 'play' && served.time < 8) E.tick(served, 0.25);
assert.ok(dest.pins !== pinsEarly || served.score > 0);
while (served.phase === 'play' && served.time < 40) E.tick(served, 0.25);
assert.equal(served.phase, 'play');
assert.ok(served.score >= 2, 'scripted lane should complete trips, got ' + served.score);
assert.ok(dest.timer < 1);

const lone = E.startRun(meta, 'larkmere', 'endless', { seed: 3 });
const ignored = lone.buildings.find(b => b.role === 'dest');
const before = ignored.pins;
E.tick(lone, 5);
assert.ok(ignored.pins > before, 'unserved demand grows');
let guard = 0;
while (lone.phase === 'play' && guard++ < 400) E.tick(lone, 0.5);
assert.equal(lone.phase, 'over');
assert.match(lone.reason, /ring/i);
assert.ok(lone.time > 20 && lone.time < 140);

function maintain(run) {
  if (run.phase === 'upgrade') {
    const cards = run.offer;
    const idx = run.stock.road < 18
      ? (cards[0].roads >= cards[1].roads ? 0 : 1)
      : Math.max(0, cards.findIndex(c => c.tool));
    assert.equal(E.chooseUpgrade(run, idx).ok, true);
  }
  for (const shop of run.buildings) {
    if (shop.role !== 'dest') continue;
    const houses = run.buildings.filter(b => b.role === 'house' && b.color === shop.color);
    if (!houses.length || houses.some(h => E.linked(run, h.id, shop.id))) continue;
    houses.sort((a, b) => (Math.abs(a.cx - shop.cx) + Math.abs(a.cy - shop.cy)) - (Math.abs(b.cx - shop.cx) + Math.abs(b.cy - shop.cy)));
    for (const h of houses) {
      if (E.connectBuildings(run, h.id, shop.id).ok) break;
    }
  }
}
const bot = E.startRun(meta, 'larkmere', 'endless', { seed: 11 });
let steps = 0;
while (bot.time < E.WEEK * 3 && bot.phase !== 'over' && steps++ < 5000) {
  maintain(bot);
  if (bot.phase === 'play') E.tick(bot, 0.5);
}
assert.ok(bot.time >= E.WEEK * 2, 'a maintained city should last more than two weeks, t=' + bot.time);
assert.ok(bot.score > 120, 'score ' + bot.score);
assert.ok(bot.buildings.length > served.buildings.length, 'the city keeps spawning');

const paved = E.startRun(meta, 'larkmere', 'endless', { seed: 1 });
const h2 = paved.buildings.find(b => b.role === 'house');
const d2 = paved.buildings.find(b => b.role === 'dest' && b.color === h2.color);
assert.equal(E.connectBuildings(paved, h2.id, d2.id).ok, true);
const spent = paved.segs.length;
assert.equal(E.undo(paved), true);
assert.equal(paved.segs.length, 0);
assert.ok(paved.stock.road > 70);
assert.equal(E.redo(paved), true);
assert.equal(paved.segs.length, spent);

meta.best.larkmere = { endless: 9999, daily: 0, weekly: 0 };
const quay = E.startRun(meta, 'pebble-quay', 'endless', { seed: 1 });
const bridges = quay.stock.bridge;
const crossed = E.stroke(quay, [{ x: 2, y: 4 }, { x: 2, y: 11 }]);
assert.equal(crossed.ok, true, crossed.reason);
assert.equal(quay.stock.bridge, bridges - 1);
assert.ok(quay.segs.some(s => s.kind === 'bridge'));

meta.best['pebble-quay'] = { endless: 9999 };
const kiln = E.startRun(meta, 'kiln-ridge', 'endless', { seed: 2 });
const tunnels = kiln.stock.tunnel;
const bored = E.stroke(kiln, [{ x: 6, y: 6 }, { x: 12, y: 6 }]);
assert.equal(bored.ok, true, bored.reason);
assert.ok(kiln.segs.some(s => s.kind === 'tunnel'));
assert.ok(kiln.stock.tunnel < tunnels);

const circle = E.startRun(meta, 'larkmere', 'endless', { seed: 4 });
circle.stock.roundabout = 1;
assert.equal(E.placeRoundabout(circle, 8, 6).ok, true);
assert.equal(circle.rounds.length, 1);

const day = '2026-10-31';
assert.equal(E.dailySeed(day), E.dailySeed(day));
const daily = E.startRun(meta, E.CITIES[E.dailySeed(day) % E.CITIES.length].id, 'daily', { dayKey: day, seed: E.dailySeed(day) });
assert.equal(daily.mode, 'daily');
assert.ok(daily.mod && daily.mod.name);

const saved = E.encode({ meta: meta, run: paved });
const back = E.decode(saved);
assert.equal(back.ok, true);
assert.equal(back.run.segs.length, spent);
assert.equal(back.meta.best.larkmere.endless, 9999);
assert.equal(E.decode('{').ok, false);
assert.equal(E.decode('{"version":1}').ok, false);

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const entry = catalog.find(g => g.id === 'lanewright');
assert(entry, 'catalogue entry');
assert.equal(entry.url, 'games/lanewright/index.html');
assert.equal(entry.title, 'Lanewright');
assert(fs.readFileSync(path.join(root, 'credits.html'), 'utf8').includes('id="lanewright"'));
assert(fs.existsSync(path.join(root, 'games/lanewright/CREDITS.md')));
assert(fs.existsSync(path.join(root, 'docs/lanewright-research.md')));

console.log('PASS lanewright: a scripted lane delivers, demand grows, an ignored shop fills its ring, and a kept-up city lasts past two weeks');
