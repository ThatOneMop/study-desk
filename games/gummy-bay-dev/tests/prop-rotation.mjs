import assert from 'node:assert/strict';
import {stepProp,propThrowSpin,propVisualLift,PROP_MAX_SPIN} from '../dist/prop-motion.mjs';

const clear={blocked:()=>false,floorHeight:()=>0};
const fresh=()=>({x:0,y:2,z:0,vx:0,vy:0,vz:0,owner:null,rx:0,ry:0,rz:0,wx:4,wy:2,wz:-3});
const source=Object.freeze(fresh());
const airborne=stepProp(source,.05,clear);
assert.equal(source.rx,0,'angular integration does not mutate source saves');
assert.ok(Math.abs(airborne.rx-.2)<1e-9&&Math.abs(airborne.ry-.1)<1e-9&&Math.abs(airborne.rz+.15)<1e-9,'airborne crate integrates all three spin axes');
assert.deepEqual(propThrowSpin(0),{wx:5,wy:1.6,wz:0});
assert.deepEqual(propThrowSpin(Math.PI/2),{wx:0,wy:1.6,wz:-5});
assert.deepEqual(propThrowSpin(0,true),{wx:0,wy:0,wz:0});
assert.deepEqual(propThrowSpin(NaN),{wx:0,wy:0,wz:0});
assert.equal(PROP_MAX_SPIN,8);
assert.equal(propVisualLift(0,0,0),0);
assert.ok(Math.abs(propVisualLift(0,0,Math.PI/2)-.01)<1e-9,'visual roll lift keeps the measured wide edge above support');
assert.ok(propVisualLift(Math.PI/4,Math.PI/5,Math.PI/3)>0,'combined tumble receives a finite presentation-only support lift');
for(const rotation of [[NaN,0,0],[Infinity,-Infinity,NaN]])assert.equal(propVisualLift(...rotation),0);

const legacy=stepProp({x:0,y:.325,z:0,vx:0,vy:0,vz:0,owner:null},.06,clear);
for(const key of ['rx','ry','rz','wx','wy','wz'])assert.equal(legacy[key],0,'legacy saves derive finite '+key);
const hostile=stepProp({...fresh(),rx:Infinity,ry:NaN,rz:-Infinity,wx:999,wy:NaN,wz:-999},.06,clear);
for(const key of ['rx','ry','rz','wx','wy','wz'])assert.ok(Number.isFinite(hostile[key]),'invalid '+key+' is made finite');
for(const key of ['wx','wy','wz'])assert.ok(Math.abs(hostile[key])<=PROP_MAX_SPIN,'spin is bounded');

let settling={...fresh(),y:1.8,vy:-8,rx:1.1,rz:-.9,wx:5,wy:2,wz:-4};
for(let i=0;i<300;i++)settling=stepProp(settling,.06,clear);
assert.equal(settling.y,.325);assert.equal(settling.vy,0);
assert.ok(Math.abs(settling.rx)<1e-4&&Math.abs(settling.rz)<1e-4,'resting crate eases upright');
assert.ok(settling.wx===0&&settling.wy===0&&settling.wz===0,'resting spin damps to zero');

const actor={x:0,y:1.72,z:0,yaw:0};
const held=stepProp({...fresh(),y:1.18,owner:'host',rx:.8,rz:-.7},.06,{...clear,holder:actor,reachBlocked:()=>false});
assert.equal(held.owner,'host');
assert.ok(Math.abs(held.rx)<.8&&Math.abs(held.rz)<.7,'carried crate settles toward a stable held pose');
assert.equal(held.wx,0);assert.equal(held.wy,0);assert.equal(held.wz,0);

console.log('PASS: deterministic bounded crate throw spin, airborne angular integration, legacy/invalid-save recovery, stable held pose and damped upright settling. Rotation is visual state; collision remains conservative axis-aligned.');
