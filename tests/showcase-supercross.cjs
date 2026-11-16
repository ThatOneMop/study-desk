'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'showcase-supercross');

const dataCode = fs.readFileSync(path.join(dir, 'data.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(dataCode, sandbox);
const data = sandbox.window.SX_DATA;

assert.equal(data.asOf, '16 November 2026');
assert.equal(data.site, 'Gateboard');
assert.equal(data.series.map((s) => s.id).join(','), 'supercross,motocross,enduro,ausx');
const banned = /\b(odds|bookmaker|bookie|wager|gambling|moneyline|point spread)\b/i;
assert.equal(banned.test(dataCode), false);
assert.equal(banned.test(fs.readFileSync(path.join(dir, 'site.js'), 'utf8')), false);

for (const series of data.series) {
  assert.ok(series.results.length >= 4, series.id);
  assert.ok(series.sources.every((source) => source.url.startsWith('https://')), series.id);
  assert.equal(Number.isNaN(new Date(series.next.iso).getTime()), false, series.id);
  assert.ok(/opinion|fan pick/i.test(series.cheer + series.outlook), series.id);
  for (const rider of series.riders) assert.equal(rider.scores.length, series.weights.length, rider.name);
}

const page = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
assert(page.includes('Gateboard'));
assert(page.includes('site.js'));
assert(!page.includes('three'));
assert(!page.includes('AudioContext'));
assert(!fs.existsSync(path.join(dir, 'vendor')));
assert(!fs.existsSync(path.join(dir, 'main.js')));
const study = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(!study.includes('showcase-supercross'));
assert(!fs.readFileSync(path.join(root, 'showcase/index.html'), 'utf8').includes('showcase-supercross'));

console.log('PASS gateboard: sourced tabs, no betting language, no film, off the study list');
