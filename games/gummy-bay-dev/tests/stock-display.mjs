import assert from 'node:assert/strict';
import {stockDisplay} from '../dist/stock-display.mjs';
const stock=[40,0,1,3],before=JSON.stringify(stock),preview=stockDisplay(stock);
assert.equal(preview.total,44);
assert.equal(preview.flavours,3);
assert.equal(preview.slots.length,12);
assert.deepEqual(preview.slots.slice(0,3),[0,2,3]);
assert.equal(preview.hidden,32);
assert.equal(JSON.stringify(stock),before);
assert.deepEqual(stockDisplay([]),{total:0,slots:[],hidden:0,flavours:0});
assert.equal(stockDisplay([8000000],Infinity).slots.length,12);
assert.equal(stockDisplay([Infinity,NaN,-5,2.8]).total,2);
assert.equal(stockDisplay([3],-1).slots.length,0);
assert.deepEqual(stockDisplay([1,1,1,1,1],4).slots,[0,1,2,3]);
// Check varied mixtures against the inventory, including all 30 fictional flavours.
for(let seed=0;seed<80;seed++){
 const counts=Array.from({length:30},(_,i)=>(seed*17+i*13)%37);
 const frozen=Object.freeze(counts),p=stockDisplay(frozen);
 assert.equal(p.total,counts.reduce((a,b)=>a+b,0));
 assert.equal(p.slots.length,Math.min(12,p.total));
 for(let i=0;i<counts.length;i++)assert(p.slots.filter(n=>n===i).length<=counts[i]);
 assert.equal(p.hidden+p.slots.length,p.total);
 assert.deepEqual(p.slots.slice(0,Math.min(12,p.flavours)),counts.flatMap((n,i)=>n?[i]:[]).slice(0,12));
}
console.log('PASS: representative stock previews conserve counts, expose flavour variety and remain bounded/read-only.');
