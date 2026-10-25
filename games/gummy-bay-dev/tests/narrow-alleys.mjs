import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {NARROW_ALLEY_SITES,NARROW_ALLEY_PROFILES,NARROW_ALLEY_COLLIDERS,narrowAlleyProfile,narrowAlleyPointBlocked,narrowAlleyPathSamples,narrowAlleyPathClear,createNarrowAlleys} from '../dist/narrow-alleys.mjs?v=99';

assert.equal(NARROW_ALLEY_SITES.length,4);assert.equal(NARROW_ALLEY_PROFILES.length,4);assert.equal(NARROW_ALLEY_COLLIDERS.length,4);
assert(Object.isFrozen(NARROW_ALLEY_SITES)&&NARROW_ALLEY_SITES.every(Object.isFrozen)&&Object.isFrozen(NARROW_ALLEY_PROFILES)&&NARROW_ALLEY_PROFILES.every(Object.isFrozen)&&Object.isFrozen(NARROW_ALLEY_COLLIDERS)&&NARROW_ALLEY_COLLIDERS.every(Object.isFrozen));
assert.deepEqual(NARROW_ALLEY_SITES.map((site,index)=>narrowAlleyProfile(site,index)),NARROW_ALLEY_PROFILES);
for(const profile of NARROW_ALLEY_PROFILES){
 assert.deepEqual(profile.counts,{boxes:7,cylinders:2,parts:9,colliders:1});assert.equal(profile.boxes.length,7);assert.equal(profile.cylinders.length,2);assert(Math.abs(profile.clearWidth-3.165)<1e-9);assert(profile.left.x<profile.right.x&&profile.left.z===profile.right.z);
 assert(profile.boxes.every(part=>Object.isFrozen(part)&&[part.x,part.y,part.z,part.w,part.h,part.d,part.color].every(Number.isFinite)));assert(profile.cylinders.every(part=>Object.isFrozen(part)&&[part.x,part.y,part.z,part.r,part.h,part.color].every(Number.isFinite)));
 assert(narrowAlleyPointBlocked(profile,profile.x,profile.screenZ));assert(!narrowAlleyPointBlocked(profile,profile.x,profile.laneZ));const samples=narrowAlleyPathSamples(profile);assert(samples.length>50&&Object.isFrozen(samples)&&samples.every(Object.isFrozen));assert(narrowAlleyPathClear(profile,()=>false));assert(!narrowAlleyPathClear(profile,(x,z)=>Math.abs(x-profile.x)<.05&&Math.abs(z-profile.laneZ)<.05));
}
assert.equal(narrowAlleyProfile(null),null);assert.equal(narrowAlleyProfile({...NARROW_ALLEY_SITES[0],w:4}),null);assert(narrowAlleyPointBlocked(null,0,0));assert.deepEqual(narrowAlleyPathSamples(null),[]);assert(!narrowAlleyPathClear(null,()=>false));

const scene=new THREE.Scene(),layer=createNarrowAlleys({scene,quality:'balanced'});assert.equal(scene.children.length,2);assert.equal(layer.drawCalls,2);assert.deepEqual(layer.counts,{alleys:4,boxes:28,cylinders:8,parts:36,colliders:4});
for(const mesh of scene.children)assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.material.map==null&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite));
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);layer.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow&&!mesh.receiveShadow));layer.setQuality('high');assert(scene.children.every(mesh=>mesh.castShadow&&mesh.receiveShadow));layer.setQuality('balanced');assert(scene.children.every(mesh=>mesh.castShadow&&mesh.receiveShadow));assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);assert.throws(()=>createNarrowAlleys(),/scene/);
console.log('PASS: four measured 3.165 m service alleys use four real screen colliders and two stable untextured batches; deterministic path samples remain open. CPU geometry only; no rendered camera or natural pursuit claim.');
