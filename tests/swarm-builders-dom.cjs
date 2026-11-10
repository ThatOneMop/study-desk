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
  const r = w.Winterfold.run, station = r.pois.find(p => p.kind === 'station'), summit = r.pois.find(p => p.kind === 'summit');
  assert(w.WinterfoldEngine.commitLift(r, station, summit, 'chair').ok);
  w.nextFrame(16);
  assert(!g.$('undoBtn').disabled);
  g.$('undoBtn').click();
  assert.equal(r.lifts.length, 0);
  assert(!g.$('redoBtn').disabled);
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Z', ctrlKey: true, shiftKey: true, bubbles: true }));
  assert.equal(r.lifts.length, 1);
  assert.equal(w.WinterfoldEngine.decode(w.localStorage.getItem(w.WinterfoldEngine.SAVE_KEY)).run.lifts.length, 1);
  g.close();
  console.log('PASS Winterfold touch history, keyboard redo, persisted edits');
}
{
  const g = game('spanwright', ['engine.js', 'audio.js', 'render.js', 'game.js']), { w } = g;
  w.Spanwright.start('willow-1');
  const key = name => w.dispatchEvent(new w.KeyboardEvent('keydown', { key: name, bubbles: true }));
  key('Enter'); key('ArrowRight'); key('ArrowRight'); key('Enter'); key('Escape');
  assert.equal(w.Spanwright.session.beams.length, 1);
  g.$('undoBtn').click();
  const draft = () => w.SpanEngine.decode(w.localStorage.getItem(w.SpanEngine.SAVE_KEY)).meta.drafts['willow-1'];
  assert.equal(draft().beams.length, 0);
  g.$('redoBtn').click();
  assert.equal(draft().beams.length, 1);
  key('x'); key('ArrowLeft'); key('Enter');
  assert.equal(draft().beams.length, 0, 'deletion persists without quitting');
  g.close();
  console.log('PASS Spanwright keyboard build, undo/redo and removal save drafts immediately');
}
{
  const g = game('lanewright', ['engine.js', 'audio.js', 'render.js', 'game.js']), { w } = g;
  g.$('citiesBtn').click();
  w.document.querySelector('[data-city="larkmere"]').click();
  g.$('tutSkip').click();
  const E = w.LanewrightEngine, r = w.Lanewright.run;
  const a = r.buildings.find(b => b.role === 'house'), b = r.buildings.find(b => b.role === 'dest' && b.color === a.color);
  assert(E.connectBuildings(r, a.id, b.id).ok);
  w.nextFrame(16);
  const before = JSON.stringify(r.edges);
  g.$('undoBtn').click();
  assert(!g.$('redoBtn').disabled);
  g.$('redoBtn').click();
  assert.equal(JSON.stringify(r.edges), before);
  assert(g.$('redoBtn').disabled);
  g.close();
  console.log('PASS Lanewright touch redo restores road layout and history button state');
}
{
  const g = game('creekhold', ['engine.js', 'audio.js', 'render.js', 'guide.js', 'game.js']), { w } = g;
  g.$('playBtn').click(); g.$('startBtn').click();
  g.$('tutorSkip').click();
  const canvas = g.$('view');
  let picks = 0;
  const original = w.CreekholdRender.pick;
  w.CreekholdRender.pick = (...args) => { picks++; return original(...args); };
  const send = (type, id) => {
    const e = new w.Event(type, { bubbles: true });
    Object.assign(e, { pointerId: id, pointerType: 'touch', button: 0, clientX: 500, clientY: 400 });
    canvas.dispatchEvent(e);
  };
  send('pointerdown', 1); send('pointerdown', 2); send('pointerup', 1); send('pointerup', 2);
  assert.equal(picks, 0, 'pinch does not place or select');
  send('pointerdown', 3); send('pointercancel', 3);
  assert.equal(picks, 0, 'cancel does not place or select');
  send('pointerdown', 4); send('pointerup', 4);
  assert.equal(picks, 1, 'ordinary tap still selects');
  g.close();
  console.log('PASS Creekhold pinch and cancel protection preserves ordinary taps');
}
