'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const E = require('../games/winterfold/engine.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'games/winterfold/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'games/winterfold/style.css'), 'utf8');

assert.equal(E.SAVE_KEY, 'study-desk-winterfold-v1');
assert(html.includes('../../bridge.js'));
assert(html.includes('href="../../index.html#games"'));
for (const id of ['map', 'key', 'dock', 'topbar', 'hands', 'home', 'levels', 'draft', 'result', 'guide']) {
  assert(html.includes('id="' + id + '"'), id);
}
assert(css.includes('touch-action: none') || css.includes('touch-action:none'));
assert(!/ski lines|trail map|ski dubai|yunogames/i.test(html));

const meta = E.createMeta();
assert.equal(E.unlocked(meta, 'lark'), true);
assert.equal(E.unlocked(meta, 'copper'), false);
assert.equal(E.startRun(meta, 'copper', 'run'), null);

function stroke(a, b) {
  const pts = [];
  for (let i = 0; i <= 10; i++) pts.push({ x: a.x + (b.x - a.x) * i / 10, y: a.y + (b.y - a.y) * i / 10 });
  return pts;
}
function playDay(run) {
  E.setSpeed(run, 4);
  for (let i = 0; i < 900 && run.phase === 'play'; i++) E.tick(run, 0.05);
}

let run = E.startRun(meta, 'lark', 'run');
const station = run.pois.find(p => p.kind === 'station');
const summit = run.pois.find(p => p.kind === 'summit');
const piste = E.commitStroke(run, stroke(summit, station));
assert.equal(piste.ok, true, piste.reason);
assert.equal(piste.color, 'green');
function bow(a, b, amount) {
  const pts = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
    const nx = -(b.y - a.y), ny = b.x - a.x, len = Math.hypot(nx, ny) || 1;
    pts.push({ x: x + nx / len * Math.sin(t * Math.PI) * amount, y: y + ny / len * Math.sin(t * Math.PI) * amount });
  }
  return pts;
}
const curve = E.previewStroke(E.startRun(meta, 'lark', 'run'), bow(summit, station, 40));
assert.equal(curve.ok, true, curve.reason);
assert.equal(E.counts(run).slopes.green, 1);
const lift = E.commitLift(run, station, summit, 'chair');
assert.equal(lift.ok, true, lift.reason);
assert.equal(run.resources.lift, 3);
assert(run.resources.slope < 200);
playDay(run);
assert.equal(run.phase, 'dawn', run.reason);
assert.equal(run.completed, 1);
assert(run.score > 0);
assert.equal(run.cards.length, 3);
const picked = E.chooseCard(run, 0);
assert.equal(picked.ok, true);
assert.equal(run.phase, 'play');

// A lift drawn a hair off the stops must still attach to them, not split the run at its ends.
const near = E.startRun(meta, 'lark', 'run');
const jitter = pts => pts.map(p => ({ x: p.x + 1e-6, y: p.y - 2e-6 }));
assert.equal(E.commitStroke(near, jitter(stroke(summit, station))).ok, true);
const nearLift = E.commitLift(near, { x: station.x + 1e-5, y: station.y }, { x: summit.x - 1e-5, y: summit.y }, 'chair');
assert.equal(nearLift.ok, true, nearLift.reason);
assert.equal(near.lifts[0].from, station.id);
assert.equal(near.lifts[0].to, summit.id);
assert.equal(near.pistes.length, 1);
playDay(near);
assert.equal(near.phase, 'dawn', near.reason);

const idle = E.startRun(meta, 'lark', 'run');
playDay(idle);
assert.equal(idle.phase, 'over');
assert.match(idle.reason, /18:00/);
assert.equal(idle.score, 0);

assert.equal(E.classify(0.12).color, 'green');
assert.equal(E.classify(0.22).color, 'blue');
assert.equal(E.classify(0.33).color, 'red');
assert.equal(E.classify(0.5).color, 'black');
assert.equal(E.classify(0.02).color, 'trail');
assert.equal(E.classify(-0.2).ok, false);
assert.equal(E.classify(0.8).ok, false);
assert.equal(E.allows('green', 'blue'), false);
assert.equal(E.allows('red', 'blue'), true);
assert.equal(E.allows('green', 'trail'), true);

const built = E.startRun(meta, 'lark', 'run');
E.commitStroke(built, stroke(summit, station));
const before = built.resources.slope;
assert.equal(E.eraseAt(built, (summit.x + station.x) / 2, (summit.y + station.y) / 2).ok, true);
assert(built.resources.slope > before);
assert.equal(E.undo(built), true);
assert.equal(built.pistes.length, 1);

meta.cleared.lark = 4;
assert.equal(E.unlocked(meta, 'copper'), true);
assert.equal(E.unlocked(meta, 'glass'), false);
const saved = E.encode({ meta, run: built });
const back = E.decode(saved);
assert.equal(back.ok, true);
assert.equal(back.run.pistes.length, 1);
assert.equal(back.meta.cleared.lark, 4);
assert.equal(E.decode('{').ok, false);
assert.equal(E.decode('{"version":1}').ok, false);

// A careful Lark keeps every guest moving through the first medal.
run = E.startRun(E.createMeta(), 'lark', 'run');
assert.match(E.morningBrief(run), /Day 1/);
function poi(id) { return run.pois.find(p => p.id === id); }
assert.equal(E.commitStroke(run, stroke(poi('su'), poi('st'))).ok, true);
assert.equal(E.commitLift(run, poi('st'), poi('su'), 'chair').ok, true);
playDay(run);
assert.equal(run.phase, 'dawn', run.reason);
assert.match(E.morningBrief(run), /viewpoint/);
assert.equal(E.chooseCard(run, run.cards.findIndex(c => c.id === 'slope')).ok, true);
assert.equal(E.commitLift(run, poi('su'), poi('view'), 'chair').ok, true);
assert.equal(E.commitStroke(run, stroke(poi('view'), poi('su'))).color, 'green');
playDay(run);
assert.equal(run.phase, 'dawn', 'day 2 ' + run.reason);
assert.match(E.morningBrief(run), /cafe/);
assert.equal(E.chooseCard(run, run.cards.findIndex(c => c.id === 'slope')).ok, true);
assert.equal(E.commitStroke(run, stroke(poi('su'), poi('cafe'))).ok, true);
assert.equal(E.commitStroke(run, stroke(poi('cafe'), poi('st'))).ok, true);
playDay(run);
assert.equal(run.phase, 'dawn', 'day 3 ' + run.reason);
assert.equal(E.chooseCard(run, run.cards.findIndex(c => c.id === 'slope')).ok, true);
assert.equal(E.commitStroke(run, stroke(poi('cafe'), poi('rescue'))).ok, true);
assert.equal(E.commitStroke(run, stroke(poi('rescue'), poi('st'))).ok, true);
playDay(run);
assert.equal(run.phase, 'dawn', 'day 4 ' + run.reason);
assert.equal(run.day, 5);
assert(run.score > 1000, 'four linked mornings score');

const copperMeta = E.createMeta();
copperMeta.cleared.lark = 4;
const copper = E.startRun(copperMeta, 'copper', 'run');
const cSu = copper.pois.find(p => p.id === 'su');
const cSt = copper.pois.find(p => p.id === 'st');
assert.equal(E.commitStroke(copper, stroke(cSu, cSt)).ok, true);
assert.equal(E.commitLift(copper, cSt, cSu, 'chair').ok, true);
playDay(copper);
assert.equal(copper.phase, 'dawn');
assert.equal(E.chooseCard(copper, Math.max(0, copper.cards.findIndex(c => c.id === 'slope'))).ok, true);
const su2 = copper.pois.find(p => p.id === 'su2');
const home = E.previewStroke(copper, stroke(su2, cSu));
assert.equal(home.ok, true, home.reason);
assert.ok(home.len < 200, 'second summit is one slope card away');
assert.equal(E.previewLift(copper, cSu, su2, 'chair').ok, true);
assert.match(E.morningBrief(copper), /summit/);

// Guests pay a ticket each lift ride; lodges bring more of them; every morning
// closes with a report card; the weather is announced per day.
const econ = E.startRun(E.createMeta(), 'lark', 'run');
const eSt = econ.pois.find(p => p.id === 'st');
const eSu = econ.pois.find(p => p.id === 'su');
assert.equal(E.commitStroke(econ, stroke(eSu, eSt)).ok, true);
assert.equal(E.commitLift(econ, eSt, eSu, 'chair').ok, true);
assert(Array.isArray(econ.weather));
const baseDemand = econ.schedule.length;
econ.money = 1000;
assert.equal(E.buyLodge(econ).ok, true);
assert.equal(econ.lodges.length, 1);
assert(econ.schedule.length > baseDemand, 'a lodge brings more guests');
assert.equal(E.buyLift(econ).ok, true);
assert.equal(econ.resources.lift, 4);
assert.equal(E.tuneLifts(econ).ok, true);
assert.equal(E.buyLodge(econ).ok, true);
assert.equal(econ.lodges.length, 2);
playDay(econ);
assert.equal(econ.phase, 'dawn', econ.reason);
assert(econ.income > 0, 'guests paid tickets');
assert(econ.trips > 0, 'guests rode the lifts');
assert.equal(econ.reports.length, 1);
assert.equal(econ.reports[0].day, 1);
assert(typeof econ.reports[0].income === 'number');
assert(typeof E.happiness(econ) === 'number');
assert(['snow', 'aurora', 'clear'].includes(E.weatherKind(econ)));
assert.equal(typeof E.iceAt(econ, 500, 400), 'boolean');
assert.equal(typeof E.incomeMul(econ), 'number');

const oldSave = JSON.stringify({
  version: 1, id: 'winterfold', title: 'Winterfold',
  meta: { version: 1, sound: true, tutorial: true, seen: true, best: { lark: { score: 40, days: 2, closed: 1 } }, medals: {}, board: [], cleared: { lark: 2 } },
  run: {
    version: 1, mountainId: 'lark', mode: 'run', phase: 'play', day: 2, clock: 3, speed: 1,
    score: 40, completed: 1, pois: [{ id: 'st', kind: 'station', x: 420, y: 545, born: 1 }, { id: 'su', kind: 'summit', x: 520, y: 400, born: 1 }],
    pistes: [], lifts: [], cannons: [], joints: [], cleared: {}, resources: { slope: 80, lift: 2, cannon: 4, trees: 20, upgrade: 4 },
    nextId: 3, rerolls: 1, weekMark: 1, cards: [], schedule: [], spawnIndex: 0, sandbox: false, reason: '', skiers: []
  }
});
const old = E.decode(oldSave);
assert.equal(old.ok, true);
assert.equal(old.run.day, 2);
assert.equal(old.run.pois[0].x, 420);
assert.equal(old.meta.best.lark.score, 40);

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const entry = catalog.find(g => g.id === 'winterfold');
assert(entry, 'catalogue entry');
assert.equal(entry.url, 'games/winterfold/index.html');
assert(fs.readFileSync(path.join(root, 'credits.html'), 'utf8').includes('id="winterfold"'));

console.log('PASS winterfold: opening day clears, four Lark mornings stay open, Copper\'s second summit is one card away, old saves still load');
