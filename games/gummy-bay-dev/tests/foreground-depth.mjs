import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {FOREGROUND_DEPTH_SITES,FOREGROUND_DEPTH_PROFILES,FOREGROUND_DEPTH_COLLIDERS,foregroundDepthProfile,foregroundPointBlocked,foregroundSightlineClear,createForegroundDepth} from '../dist/foreground-depth.mjs?v=82';

assert.equal(FOREGROUND_DEPTH_SITES.length,4);assert.equal(FOREGROUND_DEPTH_PROFILES.length,4);assert.equal(FOREGROUND_DEPTH_COLLIDERS.length,8);
assert(Object.isFrozen(FOREGROUND_DEPTH_SITES)&&FOREGROUND_DEPTH_SITES.every(Object.isFrozen)&&Object.isFrozen(FOREGROUND_DEPTH_PROFILES)&&FOREGROUND_DEPTH_PROFILES.every(Object.isFrozen)&&Object.isFrozen(FOREGROUND_DEPTH_COLLIDERS)&&FOREGROUND_DEPTH_COLLIDERS.every(Object.isFrozen));
assert.deepEqual(FOREGROUND_DEPTH_SITES.map((site,index)=>foregroundDepthProfile(site,index)),FOREGROUND_DEPTH_PROFILES,'approach profiles are deterministic');
for(const profile of FOREGROUND_DEPTH_PROFILES){
 assert.equal(profile.targetDistance,13);assert.equal(profile.beds.length,2);assert.equal(profile.colliders.length,2);assert.equal(profile.centralClearWidth,5.35);assert(Math.abs(profile.depthRatio-8/13)<1e-12);assert(foregroundSightlineClear(profile));
 assert(!foregroundPointBlocked(profile,profile.view.x,profile.view.z));assert(!foregroundPointBlocked(profile,profile.target.x,profile.target.z));
 for(const bed of profile.beds)assert(foregroundPointBlocked(profile,bed.x,bed.z));
}
assert.equal(foregroundDepthProfile(null),null);assert.equal(foregroundDepthProfile({...FOREGROUND_DEPTH_SITES[0],target:{x:-70,z:-154}}),null);assert.equal(foregroundPointBlocked(null,0,0),true);assert.equal(foregroundSightlineClear(null),false);

const scene=new THREE.Scene(),depth=createForegroundDepth({scene,quality:'balanced'});assert.equal(depth.profiles.length,4);assert.equal(depth.drawCalls,2);assert.deepEqual(depth.counts,{approaches:4,beds:8,boxes:16,plants:48,colliders:8});assert.equal(scene.children.length,2);
for(const mesh of scene.children){assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite)&&mesh.material.map==null);}
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
depth.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));depth.setQuality('balanced');assert(depth.boxMesh.castShadow&&!depth.plantMesh.castShadow);depth.setQuality('high');assert(scene.children.every(mesh=>mesh.castShadow));
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);assert.throws(()=>createForegroundDepth(),/scene/);
console.log('PASS: four shop approaches gain paired low planting beds at a 0.615 depth ratio, retaining exact 5.35 m clear centre routes and target sightlines in two stable batches. CPU geometry only; no rendered depth or occlusion claim.');
