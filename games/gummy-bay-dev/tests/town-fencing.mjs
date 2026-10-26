import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES} from '../dist/district-architecture.mjs?v=126';
import {TOWN_FENCE_SITES,TOWN_FENCE_PROFILES,TOWN_FENCE_COLLIDERS,townFenceProfile,fencePointBlocked,fenceGateClear,createTownFencing} from '../dist/town-fencing.mjs?v=81';

assert.equal(TOWN_FENCE_SITES.length,4);assert.equal(TOWN_FENCE_PROFILES.length,4);assert.equal(TOWN_FENCE_COLLIDERS.length,16);
assert(Object.isFrozen(TOWN_FENCE_SITES)&&TOWN_FENCE_SITES.every(Object.isFrozen)&&Object.isFrozen(TOWN_FENCE_PROFILES)&&TOWN_FENCE_PROFILES.every(Object.isFrozen)&&Object.isFrozen(TOWN_FENCE_COLLIDERS)&&TOWN_FENCE_COLLIDERS.every(Object.isFrozen));
assert.deepEqual(TOWN_FENCE_SITES.map((site,index)=>townFenceProfile(site,index)),TOWN_FENCE_PROFILES,'fence profiles are deterministic');
for(const profile of TOWN_FENCE_PROFILES){
 assert(DISTRICT_BUILDING_SITES.includes(profile.support)&&profile.colliders.length===4);assert(profile.roadClearance>9&&profile.visibilityRatio>.7&&profile.gateWidth===2.8);assert(fenceGateClear(profile));
 assert(!fencePointBlocked(profile,profile.x,profile.gateZ));assert(fencePointBlocked(profile,profile.x-profile.yardW/2,profile.z));assert(fencePointBlocked(profile,profile.x+(profile.gateWidth/2+.15),profile.gateZ));
 for(let step=0;step<=40;step++)assert(!fencePointBlocked(profile,profile.x,profile.gateZ+profile.backSign*(2-step*.1)),'2.15 m padded gate route stays clear');
}
assert.equal(townFenceProfile(null),null);assert.equal(townFenceProfile({...TOWN_FENCE_SITES[0],supportId:'missing'}),null);assert.equal(fencePointBlocked(null,0,0),true);assert.equal(fenceGateClear(null),false);

const scene=new THREE.Scene(),fencing=createTownFencing({scene,quality:'balanced'});assert.equal(fencing.profiles.length,4);assert.equal(fencing.drawCalls,2);assert.deepEqual(fencing.counts,{yards:4,rails:32,posts:24,colliders:16});assert.equal(scene.children.length,2);
for(const mesh of scene.children){assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite)&&mesh.material.map==null);}
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
fencing.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));fencing.setQuality('balanced');assert(fencing.railMesh.castShadow&&!fencing.postMesh.castShadow);fencing.setQuality('high');assert(scene.children.every(mesh=>mesh.castShadow));
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);assert.throws(()=>createTownFencing(),/scene/);
console.log('PASS: four sparse service yards use see-through two-rail fencing, exact padded collision and 2.15 m clear gates in two stable instanced draw calls. CPU geometry only; no rendered visibility or FPS claim.');
