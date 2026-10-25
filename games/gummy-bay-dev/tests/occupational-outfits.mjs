import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {OCCUPATIONAL_OUTFIT_PROFILES,OCCUPATIONAL_OUTFIT_COLLIDERS,occupationOutfitProfile,occupationOutfitParts,selectOccupationalActors,createOccupationalOutfits} from '../dist/occupational-outfits.mjs';

assert.equal(Object.isFrozen(OCCUPATIONAL_OUTFIT_PROFILES),true);
assert.equal(OCCUPATIONAL_OUTFIT_PROFILES.length,8);
assert.equal(new Set(OCCUPATIONAL_OUTFIT_PROFILES.map(profile=>profile.type)).size,8);
assert.equal(new Set(OCCUPATIONAL_OUTFIT_PROFILES.map(profile=>profile.style)).size,8);
assert.equal(new Set(OCCUPATIONAL_OUTFIT_PROFILES.map(profile=>`${profile.base}:${profile.accent}`)).size,8);
assert.equal(OCCUPATIONAL_OUTFIT_COLLIDERS.length,0);
for(const profile of OCCUPATIONAL_OUTFIT_PROFILES){
 const parts=occupationOutfitParts(profile.type);
 assert.ok(parts.length>=6&&parts.length<=8,profile.type+' bounded parts');
 assert.ok(parts.every(part=>[part.x,part.y,part.z,part.w??part.r,part.h,part.d??part.r,part.color].every(Number.isFinite)),profile.type+' finite parts');
 assert.ok(parts.every(part=>part.y-part.h/2>=.58&&part.y+part.h/2<=1.5),profile.type+' keeps face and legs clear');
 assert.equal(Object.isFrozen(parts),true);
}
assert.equal(new Set(OCCUPATIONAL_OUTFIT_PROFILES.map(profile=>occupationOutfitParts(profile.type).map(part=>part.part).join('|'))).size,8);
assert.equal(occupationOutfitProfile('unknown'),null);assert.deepEqual(occupationOutfitParts('__proto__'),[]);assert.deepEqual(selectOccupationalActors(null),[]);

const actors=Array.from({length:10},()=>new THREE.Group()),types=['dealer','dealer','hardware','store','laundry','property','helpers','servo','reception','customer'];
const points=actors.map((actor,index)=>({type:types[index],actor,label:'point '+index}));points.push({type:'dealer',actor:actors[0],label:'duplicate'});
const entries=selectOccupationalActors(points);assert.equal(entries.length,9);assert.equal(entries.filter(entry=>entry.type==='dealer').length,2);assert.equal(Object.isFrozen(entries),true);
const scene=new THREE.Scene(),outfits=createOccupationalOutfits({scene,points,quality:'balanced'});
assert.deepEqual(outfits.counts,{actors:9,roles:8,boxes:52,cylinders:7,colliders:0});assert.equal(outfits.drawCalls,2);assert.equal(scene.children.length,2);
const resources={boxGeometry:outfits.boxMesh.geometry,boxMaterial:outfits.boxMesh.material,cylinderGeometry:outfits.cylinderMesh.geometry,cylinderMaterial:outfits.cylinderMesh.material};
outfits.update({active:true});const before=new THREE.Matrix4();outfits.boxMesh.getMatrixAt(0,before);actors[0].position.set(4,0,-3);actors[0].rotation.y=.7;outfits.update({active:true});const after=new THREE.Matrix4();outfits.boxMesh.getMatrixAt(0,after);assert.notDeepEqual(after.elements,before.elements);
outfits.update({active:false});const hidden=new THREE.Matrix4();outfits.boxMesh.getMatrixAt(0,hidden);assert.ok(hidden.elements.every(Number.isFinite));
for(const quality of ['performance','high','balanced'])outfits.setQuality(quality);
assert.equal(outfits.boxMesh.geometry,resources.boxGeometry);assert.equal(outfits.boxMesh.material,resources.boxMaterial);assert.equal(outfits.cylinderMesh.geometry,resources.cylinderGeometry);assert.equal(outfits.cylinderMesh.material,resources.cylinderMaterial);
assert.throws(()=>createOccupationalOutfits({scene:null,points:[]}),TypeError);
console.log('PASS: eight original occupational outfit languages remain face-clear, select nine unique authored actors in the fixture, add two dynamic instanced batches with zero collision, follow actor turns and reuse resources across quality modes. CPU geometry only; no rendered-distance claim.');
