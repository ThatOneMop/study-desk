import assert from 'node:assert/strict';
import {nearestOpenPoint} from '../dist/spawn-safety.mjs';
import {colliderCandidates,COLLIDER_CELL} from '../dist/spatial-hash.mjs';

const booth={x:-47,z:29,w:1.1,d:1.15};
const blocked=(x,z)=>Math.abs(x-booth.x)<booth.w/2&&Math.abs(z-booth.z)<booth.d/2;
assert.equal(blocked(-47,28.6),true,'the reported payphone save is inside the booth');
const open=nearestOpenPoint(-47,28.6,blocked);
assert.ok(open&&!blocked(open.x,open.z)&&open.distance>0&&open.distance<2,'recovery stands just outside the booth');
assert.deepEqual(nearestOpenPoint(-40,28,blocked),{x:-40,z:28,distance:0});
assert.equal(nearestOpenPoint(-47,29,()=>true),null);
assert.equal(nearestOpenPoint(Number.NaN,0,blocked),null);

const boxes=[];
for(let i=0;i<50;i++)boxes.push({x:i*3,z:0,w:1,d:1});
boxes.push({x:7.9,z:7.9,w:2,d:2});
const linear=(x,z)=>boxes.some(b=>Math.abs(x-b.x)<b.w/2&&Math.abs(z-b.z)<b.d/2);
for(const [x,z] of [[0,0],[7.2,7.2],[8,8],[20.1,-.2],[400,400]]){
 const hits=colliderCandidates(boxes,x,z);
 const found=hits.some(b=>Math.abs(x-b.x)<b.w/2&&Math.abs(z-b.z)<b.d/2);
 assert.equal(found,linear(x,z),'hash matches a full scan at '+x+','+z);
}
assert.equal(COLLIDER_CELL,8);
const grown=boxes.slice();grown.push({x:3,z:3,w:1,d:1});
assert.ok(colliderCandidates(grown,3,3).some(b=>b.x===3&&b.z===3),'a newly pushed box is visible without a stale bucket');
console.log('PASS: blocked spawns resolve to the nearest open cell, and the 8 m hash matches a linear scan.');
