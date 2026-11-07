'use strict';
const { JSDOM } = require('jsdom');
const fs = require('fs');
const assert = require('node:assert/strict');
const path = require('path');
const { unlockShell, installSynthetic, derive, randomPin, polyfillCrypto } = require('./gate-fixture.cjs');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

function boot(hash = '') {
  const dom = new JSDOM(read('index.html'), { url: 'https://example.test/study-desk/' + hash, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.confirm = () => true;
  if (w.HTMLDialogElement) {
    w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  }
  w.eval(read('catalog.js'));
  w.eval(read('app.js'));
  return { w, d: w.document, $: id => w.document.getElementById(id), close: () => w.close() };
}
function pressP(w, times, target) {
  for (let i = 0; i < times; i++) (target || w).dispatchEvent(new w.KeyboardEvent('keydown', { key: 'p', bubbles: true, cancelable: true }));
}
function studyText(d) {
  return d.getElementById('study').textContent;
}

(async () => {
  const production = read('access-verifiers.js');
  assert(!/secretPassword/.test(production), 'secret-section verifier is not part of this lock');
  const loaded = {};
  vmLoad(production, loaded);
  assert.deepEqual(Object.keys(loaded.ACCESS_VERIFIERS.credentials), ['gamesPin']);
  const record = loaded.ACCESS_VERIFIERS.credentials.gamesPin;
  assert.equal(loaded.ACCESS_VERIFIERS.iterations, 600000);
  assert.equal(Buffer.from(record.salt, 'base64').length, 16);
  assert.equal(Buffer.from(record.verifier, 'base64').length, 32);

  let g = boot();
  assert.equal(g.$('studyMonday'), null);
  assert(!/monday pick|play monday|play game/i.test(studyText(g.d)));
  assert.equal([...g.d.querySelectorAll('#study a[href*="games"], #study img')].length, 0);
  assert.equal(g.$('arcade').hidden, true);
  assert.equal(g.$('frame').getAttribute('src'), null);
  assert.equal(g.d.querySelectorAll('#games .game').length, 0, 'catalogue tiles are not built before unlock');
  const save = JSON.stringify({ favourites: ['creekhold'], recent: ['autumn-drift'] });
  g.w.localStorage.setItem('after-class-hub-v1', save);
  g.w.localStorage.setItem('study-desk-v1', '[]');
  pressP(g.w, 2);
  assert.equal(g.$('pinGate').open, false, 'two taps do not open the gate');
  g.w.dispatchEvent(new g.w.KeyboardEvent('keydown', { key: 'p', repeat: true, bubbles: true }));
  assert.equal(g.$('pinGate').open, false, 'a held key is not a third tap');
  pressP(g.w, 1);
  assert.equal(g.$('pinGate').open, true);
  assert.equal(g.$('arcade').hidden, true);
  assert.equal(g.$('frame').getAttribute('src'), null);
  assert.equal(g.d.activeElement, g.$('pinInput'));
  assert.equal(g.$('pinGate').getAttribute('aria-modal'), 'true');
  assert.equal(g.$('pinInput').getAttribute('type'), 'password');
  assert.equal(g.$('pinInput').labels[0].htmlFor, 'pinInput');
  g.$('pinInput').value = '12345';
  g.$('pinForm').dispatchEvent(new g.w.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(g.w.studyGamesUnlocked(), false);
  assert.match(g.$('pinError').textContent, /not right/);
  assert.equal(g.$('pinInput').value, '');
  const wrong = randomPin(9);
  await installSynthetic(g.w);
  g.$('pinInput').value = wrong.slice(0, wrong.length - 1) + (wrong.at(-1) === '0' ? '1' : '0');
  g.$('pinForm').dispatchEvent(new g.w.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setTimeout(resolve, 400));
  assert.equal(g.w.studyGamesUnlocked(), false);
  assert.equal(g.$('frame').getAttribute('src'), null);
  g.$('pinBack').click();
  assert.equal(g.$('pinGate').open, false);
  assert.equal(g.$('study').hidden, false);
  pressP(g.w, 3);
  assert.equal(g.$('pinGate').open, true);
  g.$('pinGate').dispatchEvent(new g.w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  assert.equal(g.$('pinGate').open, false);
  g.w.history.replaceState(null, '', '#games');
  g.w.dispatchEvent(new g.w.HashChangeEvent('hashchange'));
  assert.equal(g.$('pinGate').open, true);
  assert.equal(g.$('arcade').hidden, true);
  assert.equal(g.$('frame').getAttribute('src'), null);
  await unlockShell(g.w);
  assert.equal(g.w.studyGamesUnlocked(), true);
  assert.equal(g.$('arcade').hidden, false);
  assert.equal(g.$('study').hidden, true);
  assert.equal(g.d.querySelectorAll('#games .game').length, g.w.GAME_CATALOG.length);
  assert.match(g.$('arcadeMondayPlay').textContent, /^Play Monday pick: /);
  g.d.querySelector('[data-game="creekhold"][data-action="play"]').click();
  assert.equal(g.$('frame').getAttribute('src'), 'games/creekhold/index.html');
  assert.equal(g.w.localStorage.getItem('after-class-hub-v1') !== null, true);
  g.$('lockGames').click();
  assert.equal(g.w.studyGamesUnlocked(), false);
  assert.equal(g.$('study').hidden, false);
  assert.equal(g.$('arcade').hidden, true);
  assert.equal(g.$('frame').getAttribute('src'), null);
  assert.equal(g.w.localStorage.getItem('study-desk-v1'), '[]');
  assert.equal(g.d.querySelectorAll('#games .game').length, 0);
  g.w.history.replaceState(null, '', '#games');
  g.w.dispatchEvent(new g.w.HashChangeEvent('hashchange'));
  assert.equal(g.$('player').hidden, true);
  assert.equal(g.$('frame').getAttribute('src'), null);
  g.close();

  g = boot();
  g.$('question') || g.$('edit').click();
  pressP(g.w, 3, g.$('deckName') || g.d.body);
  const field = g.d.createElement('input');
  g.d.body.append(field);
  field.focus();
  pressP(g.w, 3, field);
  assert.equal(g.$('pinGate').open, false, 'typing in a field is not the gesture');
  g.close();

  g = boot('#movies');
  g.w.eval(read('media-catalog.js'));
  g.w.eval(read('media.js'));
  assert.equal(g.$('arcade').hidden, true);
  assert.equal(g.d.querySelectorAll('.media-card').length, 0);
  await unlockShell(g.w);
  assert.equal(g.$('mediaCollection').hidden, false);
  assert.equal(g.d.querySelectorAll('.media-card').length, 50);
  g.close();

  g = boot();
  polyfillCrypto(g.w);
  g.w.ACCESS_VERIFIERS = null;
  pressP(g.w, 3);
  g.$('pinInput').value = randomPin(8);
  g.$('pinForm').dispatchEvent(new g.w.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setTimeout(resolve, 80));
  assert.equal(g.w.studyGamesUnlocked(), false, 'missing verifier stays locked');
  g.close();

  const longPin = randomPin(12);
  const long = { version: 1, algorithm: 'PBKDF2', hash: 'SHA-256', iterations: 600000, keyLengthBytes: 32, encoding: 'base64', credentials: { gamesPin: await derive(longPin) } };
  g = boot();
  polyfillCrypto(g.w);
  g.w.ACCESS_VERIFIERS = long;
  pressP(g.w, 3);
  g.$('pinInput').value = longPin;
  g.$('pinForm').dispatchEvent(new g.w.Event('submit', { bubbles: true, cancelable: true }));
  const started = Date.now();
  while (!g.w.studyGamesUnlocked() && Date.now() - started < 8000) await new Promise(resolve => setTimeout(resolve, 25));
  assert.equal(g.w.studyGamesUnlocked(), true, 'a PIN longer than six digits is accepted whole');
  g.close();
  console.log('PASS games pin gate: study shows no games or Monday pick; triple-P opens the dialog; wrong, short, repeated and missing verifiers stay locked; a correct PIN reveals games; lock and hash return do not reload a frame');
})().catch(error => { console.error(error); process.exit(1); });

function vmLoad(source, target) {
  const windowObject = target;
  // The file assigns window.ACCESS_VERIFIERS. Evaluate against a plain object.
  const runner = new Function('window', source);
  runner(windowObject);
}
