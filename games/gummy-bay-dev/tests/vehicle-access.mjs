import assert from 'node:assert/strict';
import {vehicleDoorAccess} from '../dist/vehicle-access.mjs';
const van={x:0,z:0,angle:0},actor={x:-3,y:1.72,z:0},open=()=>false;
assert.equal(vehicleDoorAccess(van,actor,open).side,-1);
assert.equal(vehicleDoorAccess(van,null,open).side,-1);
const wall=(x,z)=>x<-.9&&x>-1.1;
assert.equal(vehicleDoorAccess(van,actor,wall),null,'cannot enter through clear endpoints across a wall');
assert.equal(vehicleDoorAccess(van,null,wall).side,1,'exit uses the other clear door');
assert.equal(vehicleDoorAccess(van,null,(x,z)=>Math.abs(x)>.9&&Math.abs(x)<1.1),null);
assert.equal(vehicleDoorAccess(van,{...actor,y:3},open),null,'roof/elevated actor cannot enter');
assert.equal(vehicleDoorAccess(van,{...actor,x:-5.01},open),null);
assert.equal(vehicleDoorAccess(van,{x:0,z:4,y:1.72},open),null,'approach a side door, not a far bumper');
assert.equal(vehicleDoorAccess(van,{...actor,x:-4.5},open).side,-1,'inclusive door reach');
assert.equal(vehicleDoorAccess(van,{...actor,x:-4.501},open),null);
assert.equal(vehicleDoorAccess(van,{...actor,x:0},open).side,-1,'old saves at the seat remain recoverable');
assert.equal(vehicleDoorAccess(van,null,open,(x,z)=>Math.abs(x)>.8?1:0),null,'no exit across abrupt elevation');
assert.equal(vehicleDoorAccess(van,null,open,()=>.3).side,-1);
let calls=0;assert.equal(vehicleDoorAccess({...van,x:Infinity},actor,()=>{calls++;return false}),null);assert.equal(calls,0);
for(const bad of [NaN,Infinity,-Infinity]){
 assert.equal(vehicleDoorAccess({...van,angle:bad},actor,open),null);
 assert.equal(vehicleDoorAccess(van,{...actor,y:bad},open),null);
}
for(let i=0;i<32;i++){
 const angle=i*Math.PI/16,v={x:20,z:10,angle},a={x:20-Math.cos(angle)*3,z:10+Math.sin(angle)*3,y:1.72};
 const before=JSON.stringify([v,a]);assert.equal(vehicleDoorAccess(v,a,open).side,-1);assert.equal(JSON.stringify([v,a]),before);
}
console.log('PASS: rotated door reach, swept entry/exit occlusion, alternate exits, elevation, finite bounds, legacy seat recovery and immutable input. No rendered vehicle scale verified.');
