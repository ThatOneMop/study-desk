import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {SHOP_APPROACH_SITES,SHOP_APPROACH_PROFILES,SHOP_APPROACH_COLLIDERS,shopApproachProfile,shopApproachPointBlocked,shopApproachSightlineClear,createShopApproaches} from '../dist/shop-approaches.mjs?v=84';

assert.equal(SHOP_APPROACH_SITES.length,4);assert.equal(SHOP_APPROACH_PROFILES.length,4);assert.equal(SHOP_APPROACH_COLLIDERS.length,8);
assert(Object.isFrozen(SHOP_APPROACH_SITES)&&SHOP_APPROACH_SITES.every(Object.isFrozen)&&Object.isFrozen(SHOP_APPROACH_PROFILES)&&SHOP_APPROACH_PROFILES.every(Object.isFrozen)&&Object.isFrozen(SHOP_APPROACH_COLLIDERS)&&SHOP_APPROACH_COLLIDERS.every(Object.isFrozen));
assert.deepEqual(SHOP_APPROACH_SITES.map((site,index)=>shopApproachProfile(site,index)),SHOP_APPROACH_PROFILES,'entrance profiles are deterministic');
assert.equal(new Set(SHOP_APPROACH_PROFILES.map(p=>p.kind)).size,4);assert.equal(new Set(SHOP_APPROACH_PROFILES.map(p=>p.signature)).size,4);
assert.deepEqual(SHOP_APPROACH_PROFILES.map(p=>p.signature),['leaf-arch-4-4-2','striped-awning-9-0-0','braced-tool-portal-5-4-0','droplet-totem-3-3-1']);
for(const profile of SHOP_APPROACH_PROFILES){
 assert.equal(profile.distance,13);assert.equal(profile.setback,1.8);assert.equal(profile.posts.length,2);assert.equal(profile.colliders.length,2);assert(profile.centralClearWidth>=3.8);assert(profile.targetClearance>=1.1);assert(shopApproachSightlineClear(profile));
 assert(!shopApproachPointBlocked(profile,profile.view.x,profile.view.z));assert(!shopApproachPointBlocked(profile,profile.target.x,profile.target.z));assert(!shopApproachPointBlocked(profile,profile.anchor.x,profile.anchor.z));
 for(const post of profile.posts)assert(shopApproachPointBlocked(profile,post.x,post.z));
}
assert.equal(shopApproachProfile(null),null);assert.equal(shopApproachProfile({...SHOP_APPROACH_SITES[0],width:5}),null);assert.equal(shopApproachPointBlocked(null,0,0),true);assert.equal(shopApproachSightlineClear(null),false);

const scene=new THREE.Scene(),approaches=createShopApproaches({scene,quality:'balanced'});
assert.equal(approaches.profiles.length,4);assert.equal(approaches.drawCalls,3);assert.deepEqual(approaches.counts,{approaches:4,boxes:21,cylinders:11,cones:3,colliders:8});assert.equal(scene.children.length,3);
for(const mesh of scene.children)assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite)&&mesh.material.map==null);
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
approaches.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));approaches.setQuality('balanced');assert(approaches.boxMesh.castShadow&&!approaches.cylinderMesh.castShadow&&!approaches.coneMesh.castShadow);approaches.setQuality('high');assert(approaches.boxMesh.castShadow&&approaches.cylinderMesh.castShadow&&!approaches.coneMesh.castShadow);
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);assert.throws(()=>createShopApproaches(),/scene/);
console.log('PASS: four real shop targets gain unique leaf, striped, braced-tool and droplet entrance silhouettes in three stable batches; exact side-post collision leaves 3.8 m or more clear and the complete 13 m interaction sightlines open. CPU geometry only; no rendered-recognition claim.');
