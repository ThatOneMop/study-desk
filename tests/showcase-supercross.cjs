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
  assert.equal(series.results.length, 10, series.id);
  series.results.forEach((row, i) => assert.equal(row.pos, i + 1, series.id));
  assert.ok(series.sources.every((source) => source.url.startsWith('https://')), series.id);
  assert.equal(Number.isNaN(new Date(series.next.iso).getTime()), false, series.id);
  assert.ok(/opinion|fan pick/i.test(series.cheer + series.outlook), series.id);
  for (const rider of series.riders) assert.equal(rider.scores.length, series.weights.length, rider.name);
}

const sx = data.series[0];
assert.equal(sx.results[5].name, 'Justin Hill');
assert.match(sx.results[5].detail, /14\.263/);
assert.equal(sx.standings[0].points, 349);
assert.equal(sx.standings[1].points, 346);
assert.equal(sx.next.iso, '2027-01-10T11:00:00+11:00');

const mx = data.series[1];
assert.equal(mx.results[6].name, 'Garrett Marchbanks');
assert.equal(mx.standings[0].points, 474);
assert.equal(mx.standings[1].points, 472);
assert.equal(mx.next.timeStatus, 'unconfirmed');

assert.equal(data.series[2].results[5].confirmed, false);
assert.equal(data.series[3].results[3].confirmed, false);
assert.match(data.series[3].watch, /7plus/);
assert.match(data.series[3].watch, /Kayo/);
assert.doesNotMatch(dataCode, /seven points/i);
assert.doesNotMatch(dataCode, /0\.155/);

const page = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const site = fs.readFileSync(path.join(dir, 'site.js'), 'utf8');
assert(page.includes('Gateboard'));
assert(page.includes('site.js'));
assert(site.includes('podium'));
assert(site.includes('digit'));
assert(!page.includes('three'));
assert(!page.includes('AudioContext'));
assert(!fs.existsSync(path.join(dir, 'vendor')));
assert(!fs.existsSync(path.join(dir, 'main.js')));
const study = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(!study.includes('showcase-supercross'));
assert(!fs.readFileSync(path.join(root, 'showcase/index.html'), 'utf8').includes('showcase-supercross'));

console.log('PASS gateboard: top 10s, sourced clocks, no betting language, off the study list');
