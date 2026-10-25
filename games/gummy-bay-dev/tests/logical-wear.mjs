import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {PARKING_BAYS} from '../dist/parking-guide.mjs';
import {SHOP_APPROACH_PROFILES} from '../dist/shop-approaches.mjs';
import {VERTICAL_TOWN_LAYER} from '../dist/vertical-town.mjs';
import {LOGICAL_WEAR_COLLIDERS,LOGICAL_WEAR_MARKS,logicalWearMarkValid,logicalWearCoversPoint,logicalWearMarks,createLogicalWear} from '../dist/logical-wear.mjs?v=91';

assert(Object.isFrozen(LOGICAL_WEAR_COLLIDERS)&&LOGICAL_WEAR_COLLIDERS.length===0);
assert(Object.isFrozen(LOGICAL_WEAR_MARKS)&&LOGICAL_WEAR_MARKS.every(mark=>Object.isFrozen(mark)&&logicalWearMarkValid(mark)));
assert.deepEqual(Object.fromEntries(['footfall','tyre','tread'].map(kind=>[kind,LOGICAL_WEAR_MARKS.filter(mark=>mark.kind===kind).length])),{footfall:8,tyre:10,tread:16});
assert.equal(new Set(LOGICAL_WEAR_MARKS.map(mark=>mark.id)).size,34);
for(const profile of SHOP_APPROACH_PROFILES){
 const marks=LOGICAL_WEAR_MARKS.filter(mark=>mark.source===profile.id);assert.equal(marks.length,2);
 assert(marks.every(mark=>Math.hypot(mark.x-profile.target.x,mark.z-profile.target.z)<2.1&&!logicalWearCoversPoint(mark,profile.target.x,profile.target.z,.2)),'footfall wear stays near but clear of interaction target');
}
for(const bay of PARKING_BAYS){
 const marks=LOGICAL_WEAR_MARKS.filter(mark=>mark.source===bay.label);assert.equal(marks.length,2);
 assert(marks.every(mark=>Math.hypot(mark.x-bay.x,mark.z-bay.z)>.5&&Math.hypot(mark.x-bay.x,mark.z-bay.z)<.6&&mark.ry===bay.angle),'tyre wear aligns to parking pose');
}
const terrace=LOGICAL_WEAR_MARKS.filter(mark=>mark.kind==='tread');assert.equal(terrace.length,VERTICAL_TOWN_LAYER.steps*2);
assert(terrace.every(mark=>mark.w<VERTICAL_TOWN_LAYER.width&&mark.y>.006&&mark.y<=VERTICAL_TOWN_LAYER.height+.006));
assert.equal(logicalWearMarkValid({...LOGICAL_WEAR_MARKS[0],h:.03}),false);assert.equal(logicalWearCoversPoint(null,0,0),true);
assert.throws(()=>logicalWearMarks({bays:null}),/parking/);assert.throws(()=>logicalWearMarks({shops:[{}]}),/shop/);

const scene=new THREE.Scene(),wear=createLogicalWear({scene});
assert.equal(wear.drawCalls,1);assert.deepEqual(wear.counts,{marks:34,footfall:8,tyre:10,tread:16});assert.equal(wear.mesh.count,34);assert.equal(wear.mesh.material.map,null);assert.equal(wear.mesh.castShadow,false);
const resources=[wear.mesh,wear.mesh.geometry,wear.mesh.material,wear.mesh.instanceMatrix,wear.mesh.instanceColor];
for(let i=0;i<wear.mesh.count;i++){const matrix=new THREE.Matrix4();wear.mesh.getMatrixAt(i,matrix);assert(matrix.elements.every(Number.isFinite));}
wear.setQuality('performance');assert(wear.mesh.visible&&!wear.mesh.castShadow&&!wear.mesh.receiveShadow);
wear.setQuality('balanced');assert(wear.mesh.receiveShadow&&resources.every((resource,i)=>resource===[wear.mesh,wear.mesh.geometry,wear.mesh.material,wear.mesh.instanceMatrix,wear.mesh.instanceColor][i]));
assert.throws(()=>createLogicalWear({scene:null}),/scene/);assert.throws(()=>createLogicalWear({scene,marks:[{}]}),/valid/);
console.log('PASS: 34 bounded contact-only wear marks cover shop footfall, parked-van tyres and terrace tread edges in one stable untextured draw call with zero collision. CPU geometry only; no rendered-wear claim.');
