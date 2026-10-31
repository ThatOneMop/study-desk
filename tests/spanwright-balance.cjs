'use strict';
const assert = require('node:assert/strict');
const E = require('../games/spanwright/engine.js');
const S = require('../games/spanwright/solutions.js');

function simulate(session) {
  const started = E.beginSim(session);
  assert.equal(started.ok, true, started.reason);
  const limit = (session.level.timeLimit || 48) + 2;
  for (let i = 0; i < limit / E.FRAME && session.sim.mode === 'run'; i++) E.tick(session);
  return session.sim;
}

const meta = E.defaultMeta();
for (const level of E.LEVELS) meta.stars[level.id] = 1;

const rows = [];
for (const level of E.LEVELS) {
  const ref = E.startLevel(meta, level.id);
  const kind = S.buildReference(E, ref);
  const refSim = simulate(ref);
  const ratio = ref.level.budget / ref.spent;
  assert.equal(refSim.result, 'success', level.id + ' reference ' + (refSim.why || refSim.result));
  assert.ok(ref.spent <= ref.level.budget + 0.5, level.id + ' spent ' + ref.spent + ' over ' + ref.level.budget);
  if (level.id !== 'willow-1') {
    assert.ok(ratio >= 1.19 && ratio <= 1.61, level.id + ' budget ratio ' + ratio.toFixed(2));
  }

  const flat = E.startLevel(meta, level.id);
  let flatResult = 'success';
  try {
    S.buildFlat(E, flat);
    flatResult = simulate(flat).result || 'run';
  } catch (err) {
    flatResult = 'unbuildable';
  }
  if (level.id === 'willow-1') assert.equal(flatResult, 'success', 'opening plank');
  else assert.notEqual(flatResult, 'success', level.id + ' flat deck should fail');

  rows.push(level.id + '\t' + kind + '\t' + refSim.result + '\t' + (refSim.grade.stars || 0) + '\t' + Math.round(ref.spent) + '\t' + ref.level.budget + '\t' + ratio.toFixed(2) + '\t' + flatResult);
}

console.log('id\tpattern\treference\tstars\tspent\tbudget\tratio\tflat');
console.log(rows.join('\n'));
console.log('PASS spanwright balance: reference spans clear inside 1.2–1.6× budget, and a flat deck fails after the opening plank');
