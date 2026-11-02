'use strict';
// Completes the Creekhold guided tutorial programmatically with the real engine and guide steps,
// checks the help/tutorial markup, contextual warnings and save compatibility.
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const E = require('../games/creekhold/engine.js');
const G = require('../games/creekhold/guide.js');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'games/creekhold/index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'games/creekhold/game.js'), 'utf8');

for (const id of ['tutor', 'tutorTitle', 'tutorBody', 'tutorStatus', 'tutorDots', 'tutorNext', 'tutorSkip', 'tutorShow',
  'tutorStepSkip', 'tutorialBtn', 'tutorAgainBtn', 'helpTop', 'help', 'helpTutor', 'helpBuildings', 'offer', 'offerHere',
  'offerNew', 'offerNo', 'guideConfirm', 'pieceInfo']) {
  assert(html.includes('id="' + id + '"'), 'missing #' + id);
}
assert(html.indexOf('src="engine.js"') < html.indexOf('src="guide.js"'), 'guide.js loads after engine.js');
assert(html.indexOf('src="guide.js"') < html.indexOf('src="game.js"'), 'guide.js loads before game.js');
for (const words of ['Your goal', 'Controls', 'Touch', 'Keyboard', 'Mouse', 'Seasons', 'nibs']) assert(html.includes(words), 'help mentions ' + words);
assert(game.includes('CreekholdGuide'));

assert(G.STEPS.length >= 12, 'tutorial has enough steps');
const ids = G.STEPS.map((s) => s.id);
for (const id of ['welcome', 'path', 'pump', 'tank', 'play', 'food', 'home', 'dam', 'learn', 'done']) assert(ids.includes(id), 'step ' + id);
for (const s of G.STEPS) {
  assert(s.title && s.title.length <= 40, 'short title ' + s.id);
  const body = typeof s.body === 'function' ? s.body({ touch: true, faction: 'reed' }, E.startRun(E.createMeta(), 'willow', 'reed', 'easy')) : s.body;
  assert(body && body.split(/\s+/).length <= 60, 'short body ' + s.id);
}

// Every building has a tooltip with its cost.
for (const b of E.BUILDINGS) {
  if (b.id === 'hearth') continue;
  const tip = G.pieceTip(b.id);
  assert(tip && tip.length > 10, 'tip for ' + b.id);
}

function playThrough(map, faction, diff, touch) {
  const run = E.startRun(E.createMeta(), map, faction, diff);
  const ctx = { touch: touch, cam: { x: 0, y: 0, zoom: 1, rot: 0 }, faction: faction };
  const seen = [];
  for (const s of G.STEPS) {
    const st = {};
    if (s.start) s.start(run, st, ctx);
    if (s.kind === 'info') { seen.push(s.id); continue; }
    if (s.id === 'look') { ctx.cam.x += 100; assert(s.done(run, st, ctx), 'camera move completes look'); seen.push(s.id); continue; }
    let guard = 0;
    while (!s.done(run, st, ctx) && guard++ < 400) {
      const glow = G.stepGlow(s, run) || {};
      const targets = s.targets ? s.targets(run) : [];
      if (s.id === 'learn' && E.unlock(run, 'carrots').ok) continue;
      if (glow.speed || s.id === 'learn') { E.tick(run, 1); continue; }
      if (!targets.length) { E.tick(run, 2); continue; }
      const t = targets[0];
      assert(glow.piece, 'step ' + s.id + ' names a piece to place');
      const r = E.place(run, glow.piece, t.x, t.y);
      if (!r.ok) E.tick(run, 1);
    }
    assert(s.done(run, st, ctx), map + '/' + faction + '/' + diff + ' tutorial stuck at ' + s.id);
    seen.push(s.id);
    assert.equal(run.phase, 'play', 'colony alive during ' + s.id);
  }
  return { run, seen };
}

for (const [map, faction, diff, touch] of [['willow', 'reed', 'easy', false], ['willow', 'reed', 'normal', true], ['willow', 'cog', 'easy', false]]) {
  const { run, seen } = playThrough(map, faction, diff, touch);
  assert.deepEqual(seen, ids, 'all steps completed in order');
  assert(E.living(run).length > 0);
  assert(G.count(run, 'pump') >= 1 && G.count(run, 'tank') >= 2 && G.count(run, 'dam') >= 1, 'tutorial builds the core colony');
}

// Contextual warnings: low water and an upcoming dry spell, each with advice, and not spammed.
{
  const run = E.startRun(E.createMeta(), 'willow', 'reed', 'easy');
  const memo = {};
  run.store.water = 1;
  run.seasonHour = E.seasonLenHours(run) - 10;
  const w = G.warnings(run, memo);
  assert(w.some((x) => x.id === 'water' && /tank|pump/i.test(x.text)), 'low water warning gives advice');
  assert(w.some((x) => /^dry-soon|^sour-soon/.test(x.id)), 'upcoming season warning');
  assert.equal(G.warnings(run, memo).length, 0, 'warnings are not repeated straight away');
}

// Saves: guide progress and the one-time offer survive a round trip, and old saves still load.
{
  const meta = E.createMeta();
  const run = E.startRun(meta, 'willow', 'reed', 'easy');
  meta.guideOffered = true;
  meta.guide = { on: true, step: 4 };
  const back = E.decode(E.encode({ meta, run }));
  assert.equal(back.ok, true);
  assert.equal(back.meta.guideOffered, true);
  assert.deepEqual(back.meta.guide, { on: true, step: 4 });
  const old = JSON.parse(E.encode({ meta: E.createMeta(), run }));
  delete old.meta.guideOffered;
  delete old.meta.guide;
  old.meta.tutorial = true;
  const oldBack = E.decode(JSON.stringify(old));
  assert.equal(oldBack.ok, true, 'pre-tutorial save loads');
  assert(oldBack.run && oldBack.run.mapId === 'willow');
  assert(!oldBack.meta.guideOffered, 'old players have not been offered the tutorial yet');
}

console.log('creekhold tutorial: ok (' + ids.length + ' steps)');
