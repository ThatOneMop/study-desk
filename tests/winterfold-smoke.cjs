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

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const entry = catalog.find(g => g.id === 'winterfold');
assert(entry, 'catalogue entry');
assert.equal(entry.url, 'games/winterfold/index.html');
assert(fs.readFileSync(path.join(root, 'credits.html'), 'utf8').includes('id="winterfold"'));

console.log('PASS winterfold: opening green run and chair clear day 1, an empty hill closes at dusk, colours and unlocks hold, save round-trips');
