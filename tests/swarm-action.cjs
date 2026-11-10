const assert=require('node:assert/strict');
const E=require('../games/roof-runner/engine.js');
const o=E.create();assert.equal(E.recall(o),false);E.step(o,{right:true});o.run.checkpoint=true;o.run.parcels[0]=true;o.run.x=1000;
assert(E.recall(o));assert.equal(o.run.x,E.levels[0].checkpoint[0]);assert.equal(o.run.falls,1);assert(o.run.parcels[0]);assert(E.decode(E.encode(o)));
o.run.falls=7;const before=E.encode(o);assert.equal(E.recall(o),false);assert.equal(E.encode(o),before);
console.log('PASS recall preserves parcels and save validity, consumes one recovery, protects last recovery');
