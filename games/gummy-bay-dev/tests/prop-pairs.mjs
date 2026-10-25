import assert from 'node:assert/strict';
import {resolvePropPairs,PROP_HALF_WIDTH,PROP_HALF_DEPTH,PROP_RADIUS,PROP_MAX_SPIN} from '../dist/prop-motion.mjs';

const crate=(x,z,extra={})=>({x,y:PROP_RADIUS,z,vx:0,vy:0,vz:0,owner:null,rx:0,ry:0,rz:0,wx:0,wy:0,wz:0,...extra});
const separated=(a,b)=>Math.abs(a.x-b.x)>=PROP_HALF_WIDTH*2-1e-6||Math.abs(a.z-b.z)>=PROP_HALF_DEPTH*2-1e-6||Math.abs(a.y-b.y)>=PROP_RADIUS*2-1e-6;

const source=Object.freeze([Object.freeze(crate(0,0)),Object.freeze(crate(.2,0,{vx:-4}))]);
const pair=resolvePropPairs(source);
assert.equal(source[0].x,0,'pair solver never mutates the saved source array');
assert.ok(separated(pair[0],pair[1]),'overlapping floor crates separate by their measured envelopes');
assert.ok(pair[0].vx<0&&pair[1].vx>-4,'a moving crate transfers momentum to a resting crate with bounded restitution');

const stack=resolvePropPairs([crate(0,0),crate(0,0,{y:.6,vy:-5,vx:2})]);
assert.equal(stack[0].y,PROP_RADIUS,'lower crate remains on its authored support');
assert.ok(Math.abs(stack[1].y-PROP_RADIUS*3)<1e-6,'falling crate stacks on the lower crate');
assert.ok(stack[1].vy>=0&&Math.abs(stack[1].wx)+Math.abs(stack[1].wz)>0,'vertical impact stops descent and transfers travel into bounded roll');

const held=resolvePropPairs([crate(0,0,{owner:'host'}),crate(.1,0,{vx:-3})]);
assert.equal(held[0].x,0,'carried crate remains anchored to its holder');
assert.ok(held[1].x>=PROP_HALF_WIDTH*2-1e-6&&held[1].vx>0,'free crate separates and rebounds from a carried crate');
const bothHeld=resolvePropPairs([crate(0,0,{owner:'host'}),crate(0,0,{owner:'guest'})]);
assert.deepEqual(bothHeld,[crate(0,0,{owner:'host'}),crate(0,0,{owner:'guest'})],'two carried crates never move either player anchor');

const blocked=resolvePropPairs([crate(0,0),crate(.2,0)],{blocked:(x)=>x<0});
assert.equal(blocked[0].x,0,'external world blockers prevent an unsafe separation');
assert.ok(blocked[1].x>=PROP_HALF_WIDTH*2-1e-6,'the clear partner takes the full safe separation');

const chain=resolvePropPairs([crate(0,0),crate(.1,0),crate(.2,0),crate(.3,0)]);
for(let i=0;i<chain.length;i++)for(let j=i+1;j<chain.length;j++)assert.ok(separated(chain[i],chain[j]),'four-crate pile resolves pair '+i+'-'+j);
for(const p of chain)for(const key of ['x','y','z','vx','vy','vz','wx','wy','wz'])assert.ok(Number.isFinite(p[key]),'resolved '+key+' stays finite');
for(const p of chain)for(const key of ['wx','wy','wz'])assert.ok(Math.abs(p[key])<=PROP_MAX_SPIN,'resolved spin stays bounded');

const invalid={x:NaN,y:PROP_RADIUS,z:0,vx:Infinity,vy:0,vz:0,owner:null};
const mixed=resolvePropPairs([invalid,crate(0,0)]);
assert.ok(Number.isNaN(mixed[0].x)&&mixed[1].x===0,'invalid legacy records are copied and skipped without corrupting valid props');
assert.deepEqual(resolvePropPairs(null),[],'invalid collection fails closed');

console.log('PASS: measured crate-to-crate separation, stacking, carried anchors, safe world fallback, bounded rebound/spin and immutable save records.');
