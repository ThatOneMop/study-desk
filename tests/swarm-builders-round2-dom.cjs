'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
function game(id, scripts) {
  const dir = path.join(__dirname, '..', 'games', id);
  const dom = new JSDOM(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'), { url: 'https://test.example/games/' + id + '/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.requestAnimationFrame = fn => { w.nextFrame = fn; return 1; };
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (_, k) => k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => {} });
  w.HTMLCanvasElement.prototype.setPointerCapture = () => {};
  for (const file of scripts) {
    w.eval(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (file === 'render.js') {
      for (const name of ['WinterfoldRender', 'LanewrightRender']) if (w[name] && w[name].createRenderer) {
        const create = w[name].createRenderer;
        w[name].createRenderer = (...args) => { const r = create(...args); r.frame = () => {}; r.draw = () => {}; return r; };
      }
    }
  }
  return { w, $: id => w.document.getElementById(id), close: () => w.close() };
}
{
  const g = game('winterfold', ['engine.js', 'audio.js', 'render.js', 'game.js']), { w } = g;
  w.Winterfold.bootHill('lark', 'sandbox');
  const E = w.WinterfoldEngine, r = w.Winterfold.run;
  const station = r.pois.find(p => p.kind === 'station'), summit = r.pois.find(p => p.kind === 'summit');
  assert(E.routeAudit(r).some(p => p.id === summit.id && p.issue === 'outward'));
  assert(E.commitLift(r, station, summit, 'chair').ok);
  let issue = E.routeAudit(r).find(p => p.id === summit.id);
  assert.equal(issue.issue, 'return');
  assert.equal(issue.skills.length, 4);
  g.$('auditBtn').click();
  assert.match(g.$('hint').textContent, /cannot return/);
  assert.equal(r.speed, 0);
  w.nextFrame(16);
  assert.match(g.$('hint').textContent, /cannot return/, 'audit instruction stays visible while paused');
  const pts = Array.from({length: 11}, (_, i) => ({ x: summit.x + (station.x - summit.x) * i / 10, y: summit.y + (station.y - summit.y) * i / 10 }));
  assert(E.commitStroke(r, pts).ok);
  assert(!E.routeAudit(r).some(p => p.id === summit.id));
  r.pistes[0].color = 'blue';
  const skillIssue = E.routeAudit(r).find(p => p.id === summit.id);
  assert.equal(skillIssue.skills.join(','), 'green', 'green guests cannot return on a blue pitch');
  r.pistes[0].color = 'green';
  const before = E.encode({meta: w.Winterfold.meta, run: r});
  E.routeAudit(r);
  assert.equal(E.encode({meta: w.Winterfold.meta, run: r}), before, 'audit does not change the hill');
  g.close();
  console.log('PASS Winterfold detects outward gaps, unsafe returns, completed connections and persistent planning hints');
}
{
  const g = game('spanwright', ['engine.js', 'audio.js', 'render.js', 'game.js']), { w } = g;
  w.Spanwright.start('willow-1');
  const E = w.SpanEngine, r = w.Spanwright.session, a = r.level.anchors[0], b = r.level.anchors[1];
  assert.equal(E.survey(r).connected, false);
  assert(E.placeBeam(r, 'road', a.x, a.y, a.x + 2, a.y).ok);
  assert.equal(E.survey(r).frontier.x, a.x + 2);
  g.$('surveyBtn').click();
  assert.match(g.$('status').textContent, /Road stops at the survey pin/);
  assert.equal(w.Spanwright.cam.x, a.x + 2);
  for (let x = a.x + 2; x < b.x; x += 2) assert(E.placeBeam(r, 'road', x, a.y, Math.min(b.x, x + 2), a.y).ok);
  assert(E.survey(r).connected);
  assert.equal(E.survey(r).roadMembers, 3);
  g.$('surveyBtn').click();
  assert.match(g.$('status').textContent, /Road joins both banks/);
  const snapshot = JSON.stringify(E.exportDesign(r));
  E.survey(r);
  assert.equal(JSON.stringify(E.exportDesign(r)), snapshot);
  g.close();
  console.log('PASS Spanwright road frontier focusing, road completion, budget calculation and non-mutating survey');
}
{
  const g = game('creekhold', ['engine.js', 'audio.js', 'render.js', 'guide.js', 'game.js']), { w } = g;
  g.$('playBtn').click(); g.$('startBtn').click(); g.$('tutorSkip').click();
  const E = w.CreekholdEngine, r = w.Creekhold.run;
  const before = E.encode({meta: w.Creekhold.meta, run:r});
  const plan = E.reservePlan(r);
  assert.equal(plan.hours, E.hazardDays(r) * 24);
  assert(plan.water > 0 && plan.food > 0);
  assert.equal(E.encode({meta: w.Creekhold.meta, run:r}), before);
  r.store.water = 0; r.store.berry = 0; r.store.carrot = 0; r.store.spud = 0; r.store.meal = 0;
  assert.equal(E.reservePlan(r).waterShort, E.reservePlan(r).water);
  assert.equal(E.reservePlan(r).foodShort, E.reservePlan(r).food);
  g.$('reserveBtn').click();
  assert.equal(w.Creekhold.speed, 0);
  assert.match(g.$('inspectBody').textContent, /Short by/);
  g.$('inspectActions').querySelector('button').click();
  assert.equal(w.Creekhold.tool, 'tank');
  assert(g.$('inspect').hidden);
  r.season = 'drought'; r.seasonHour = E.seasonLenHours(r) - 12;
  assert.equal(E.reservePlan(r).hours, 12, 'during drought budget remaining hours only');
  g.close();
  console.log('PASS Creekhold reserve forecast, shortfalls, no state mutation and actionable tank selection');
}
{
  const g = game('lanewright', ['engine.js', 'audio.js', 'render.js', 'game.js']), { w } = g;
  g.$('citiesBtn').click(); w.document.querySelector('[data-city="larkmere"]').click(); g.$('tutSkip').click();
  const E = w.LanewrightEngine, r = w.Lanewright.run;
  assert(E.serviceAudit(r).every(p => !p.connected));
  const a = r.buildings.find(b => b.role === 'house'), b = r.buildings.find(b => b.role === 'dest' && b.color === a.color);
  assert(E.connectBuildings(r, a.id, b.id).ok);
  assert(E.serviceAudit(r).find(p => p.id === b.id).connected);
  b.timer = 3;
  assert.equal(E.serviceAudit(r)[0].id, b.id, 'growing ring takes priority');
  g.$('auditBtn').click();
  assert.equal(w.Lanewright.speed, 0);
  assert.match(g.$('status').textContent, /ring is growing/);
  g.$('auditBtn').click();
  assert.match(g.$('status').textContent, /Link a highlighted matching house/);
  g.close();
  console.log('PASS Lanewright detects missing service, prioritises rings, pauses and cycles actionable shop inspections');
}
