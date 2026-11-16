'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

const dataCode = fs.readFileSync(path.join(root, 'showcase-supercross/data.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(dataCode, sandbox);
const data = sandbox.window.SX_DATA;

assert.equal(data.asOf, '16 November 2026');
assert.ok(data.timelineSeconds >= 110 && data.timelineSeconds <= 140);
assert.equal(data.track.name, 'Anaheim 1');
assert.equal(data.series.map((s) => s.id).join(','), 'supercross,motocross,enduro,ausx');

const banned = /\b(odds|bookmaker|bookie|wager|gambling|moneyline|point spread)\b/i;
assert.equal(banned.test(dataCode), false, 'tracker data must not talk like a betting site');

for (const series of data.series) {
  assert.ok(series.results.length >= 4, series.id);
  assert.ok(series.sources.length >= 2, series.id);
  assert.ok(series.sources.every((source) => source.url.startsWith('https://')), series.id);
  assert.equal(Number.isNaN(new Date(series.next.iso).getTime()), false, series.id);
  assert.ok(/opinion|fan pick/i.test(series.cheer + series.outlook), series.id);
  for (const rider of series.riders) {
    assert.equal(rider.scores.length, series.weights.length, rider.name);
    assert.ok(rider.scores.every((n) => n >= 0 && n <= 10));
  }
}

const page = fs.readFileSync(path.join(root, 'showcase-supercross/index.html'), 'utf8');
assert(page.includes('three.module.js'));
assert(page.includes('Play the start'));
assert(page.includes('id="mute"'));
assert(page.includes('id="skip"'));
assert(!page.includes('bridge.js'));
const main = fs.readFileSync(path.join(root, 'showcase-supercross/main.js'), 'utf8');
for (const piece of ['UnrealBloomPass', 'BokehPass', 'AfterimagePass', 'This is the holeshot', 'ANAHEIM']) {
  assert(main.includes(piece) || page.includes(piece) || dataCode.includes(piece), piece);
}
assert(main.includes('Web Audio') || main.includes('AudioContext'));
const study = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(!study.includes('showcase-supercross'));
assert(!fs.readFileSync(path.join(root, 'showcase/index.html'), 'utf8').includes('showcase-supercross'));

console.log('PASS supercross showcase: sourced tabs, no betting language, cinematic page stays off the study list');
