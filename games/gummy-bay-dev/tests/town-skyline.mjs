import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES} from '../dist/district-architecture.mjs?v=126';
import {SKYLINE_LANDMARK_SITES,SKYLINE_LANDMARK_PROFILES,SKYLINE_APPROACHES,skylineLandmarkProfile,skylineFootprintOnSupport,createTownSkyline} from '../dist/town-skyline.mjs?v=78';

assert.equal(SKYLINE_LANDMARK_SITES.length,4);assert.equal(SKYLINE_LANDMARK_PROFILES.length,4);
assert(Object.isFrozen(SKYLINE_LANDMARK_SITES)&&SKYLINE_LANDMARK_SITES.every(Object.isFrozen)&&Object.isFrozen(SKYLINE_LANDMARK_PROFILES)&&SKYLINE_LANDMARK_PROFILES.every(Object.isFrozen));
assert.deepEqual(SKYLINE_LANDMARK_SITES.map((site,index)=>skylineLandmarkProfile(site,index)),SKYLINE_LANDMARK_PROFILES,'skyline profiles are deterministic');
assert.deepEqual([...new Set(SKYLINE_LANDMARK_PROFILES.map(profile=>profile.kind))].sort(),['chimney','clock-tower','signal-mast','water-tower']);
assert.deepEqual([...new Set(SKYLINE_LANDMARK_PROFILES.map(profile=>profile.approach))].sort(),['east','north','south','west']);
assert.equal(new Set(Object.values(SKYLINE_APPROACHES).map(approach=>approach.signature)).size,4,'each approach has a distinct silhouette signature');
assert.equal(new Set(SKYLINE_LANDMARK_PROFILES.map(profile=>profile.topY)).size,4,'all four skyline peaks have distinct total heights');
for(const profile of SKYLINE_LANDMARK_PROFILES){
 assert([profile.x,profile.z,profile.baseY,profile.topY,profile.footprintRadius].every(Number.isFinite));
 assert(DISTRICT_BUILDING_SITES.includes(profile.support),'every skyline feature mounts on an existing solid building site');
 assert.equal(SKYLINE_APPROACHES[profile.approach].landmark,profile.id);assert.equal(SKYLINE_APPROACHES[profile.approach].signature,profile.signature);
 assert(skylineFootprintOnSupport(profile,.5),'every roof-mounted footprint remains within its support building');
 assert(profile.topY-profile.baseY>=10&&profile.topY-profile.baseY<=24);
}
assert.equal(skylineLandmarkProfile(null),null);assert.equal(skylineLandmarkProfile({...SKYLINE_LANDMARK_SITES[0],kind:'billboard'}),null);assert.equal(skylineLandmarkProfile({...SKYLINE_LANDMARK_SITES[0],supportId:'missing'}),null);assert.equal(skylineLandmarkProfile({...SKYLINE_LANDMARK_SITES[0],structureHeight:80}),null);
assert.equal(skylineFootprintOnSupport(null),false);assert.equal(skylineFootprintOnSupport({...SKYLINE_LANDMARK_PROFILES[0],footprintRadius:100}),false);

const scene=new THREE.Scene(),skyline=createTownSkyline({scene,quality:'balanced'});
assert.equal(skyline.profiles.length,4);assert.equal(skyline.drawCalls,3);assert.deepEqual(skyline.counts,{landmarks:4,boxes:11,cylinders:10,cones:4});assert.equal(scene.children.length,3);
for(const mesh of scene.children){assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite));assert(mesh.geometry.attributes.position.count>0&&!mesh.material.vertexColors&&mesh.material.map==null&&!mesh.castShadow);}
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
skyline.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
skyline.setQuality('balanced');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
skyline.setQuality('high');assert(skyline.boxMesh.castShadow&&skyline.cylinderMesh.castShadow&&!skyline.coneMesh.castShadow);
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources,'quality changes reuse all skyline resources');
assert.throws(()=>createTownSkyline(),/scene/);
console.log('PASS: four roof-mounted original landmarks provide unique west/east/north/south silhouettes and four distinct total heights in three stable instanced draw calls. CPU geometry only; no rendered recognition or FPS claim.');
