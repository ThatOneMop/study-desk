import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {RESIDENT_ACCESSORY_PROFILES,RESIDENT_ACCESSORY_COLLIDERS,residentAccessoryProfile,residentAccessoryParts,selectResidentAccessories,createResidentAccessories} from '../dist/resident-accessories.mjs';

assert.equal(Object.isFrozen(RESIDENT_ACCESSORY_PROFILES),true);assert.equal(RESIDENT_ACCESSORY_PROFILES.length,8);
assert.equal(new Set(RESIDENT_ACCESSORY_PROFILES.map(profile=>profile.type)).size,8);
assert.equal(new Set(RESIDENT_ACCESSORY_PROFILES.map(profile=>profile.style)).size,8);
assert.equal(new Set(RESIDENT_ACCESSORY_PROFILES.map(profile=>profile.label)).size,8);
assert.equal(RESIDENT_ACCESSORY_COLLIDERS.length,0);
for(const profile of RESIDENT_ACCESSORY_PROFILES){
 const parts=residentAccessoryParts(profile.type);assert.ok(parts.length>=4&&parts.length<=5,profile.type+' bounded parts');
 assert.ok(parts.every(part=>[part.x,part.y,part.z,part.w??part.r,part.h,part.d??part.r,part.color].every(Number.isFinite)),profile.type+' finite parts');
 assert.ok(parts.every(part=>part.y+part.h/2<=2.55&&((part.y-part.h/2>=2.02)||Math.abs(part.x)-(part.w??part.r*2)/2>=.28)),profile.type+' keeps the front face open');
 assert.equal(Object.isFrozen(parts),true);
}
assert.equal(new Set(RESIDENT_ACCESSORY_PROFILES.map(profile=>residentAccessoryParts(profile.type).map(part=>part.part).join('|'))).size,8);
assert.equal(residentAccessoryProfile('unknown'),null);assert.deepEqual(residentAccessoryParts('__proto__'),[]);assert.deepEqual(selectResidentAccessories(null),[]);

const actors=Array.from({length:10},()=>new THREE.Group()),types=['reception','dealer','hardware','store','laundry','property','helpers','servo','dealer','customer'];
const points=actors.map((actor,index)=>({type:types[index],actor}));points.push({type:'dealer',actor:actors[1]});
const entries=selectResidentAccessories(points);assert.equal(entries.length,9);assert.equal(new Set(entries.map(entry=>entry.profile.style)).size,8);assert.equal(Object.isFrozen(entries),true);
const scene=new THREE.Scene(),accessories=createResidentAccessories({scene,points,quality:'balanced'});
assert.deepEqual(accessories.counts,{actors:9,styles:8,boxes:23,cylinders:15,colliders:0});assert.equal(accessories.drawCalls,2);assert.equal(scene.children.length,2);
assert.equal(accessories.boxMesh.frustumCulled,false);assert.equal(accessories.cylinderMesh.frustumCulled,false);
const resources=[accessories.boxMesh,accessories.boxMesh.geometry,accessories.boxMesh.material,accessories.cylinderMesh,accessories.cylinderMesh.geometry,accessories.cylinderMesh.material];
accessories.update({active:true});const before=new THREE.Matrix4();accessories.boxMesh.getMatrixAt(0,before);actors[0].position.set(3,0,-4);actors[0].rotation.y=.8;accessories.update({active:true});const after=new THREE.Matrix4();accessories.boxMesh.getMatrixAt(0,after);assert.notDeepEqual(after.elements,before.elements);
accessories.update({active:false});const hidden=new THREE.Matrix4();accessories.boxMesh.getMatrixAt(0,hidden);assert.ok(hidden.elements.every(Number.isFinite)&&Math.abs(hidden.determinant())<1e-12);
for(const quality of ['performance','high','balanced'])accessories.setQuality(quality);
assert.deepEqual([accessories.boxMesh,accessories.boxMesh.geometry,accessories.boxMesh.material,accessories.cylinderMesh,accessories.cylinderMesh.geometry,accessories.cylinderMesh.material],resources);
assert.throws(()=>createResidentAccessories({scene:null,points:[]}),TypeError);
console.log('PASS: eight original head-accessory silhouettes keep the front face open, select unique authored residents, follow actor turns in two dynamic instanced batches and add zero collision. CPU geometry only; no rendered-recognition claim.');
