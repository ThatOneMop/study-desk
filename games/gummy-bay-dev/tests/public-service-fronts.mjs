import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {PUBLIC_SERVICE_SITES,PUBLIC_SERVICE_PROFILES,PUBLIC_SERVICE_COLLIDERS,publicServiceProfile,publicServiceOpposed,publicServiceMounted,createPublicServiceFronts} from '../dist/public-service-fronts.mjs?v=98';

assert.equal(PUBLIC_SERVICE_SITES.length,8);assert.equal(PUBLIC_SERVICE_PROFILES.length,8);assert.equal(PUBLIC_SERVICE_COLLIDERS.length,0);assert(Object.isFrozen(PUBLIC_SERVICE_SITES)&&PUBLIC_SERVICE_SITES.every(Object.isFrozen)&&Object.isFrozen(PUBLIC_SERVICE_PROFILES)&&PUBLIC_SERVICE_PROFILES.every(Object.isFrozen));
assert.deepEqual(PUBLIC_SERVICE_SITES.map((site,index)=>publicServiceProfile(site,index)),PUBLIC_SERVICE_PROFILES,'all public/service profiles derive deterministically');assert.equal(new Set(PUBLIC_SERVICE_PROFILES.map(profile=>profile.cue)).size,8);
for(const profile of PUBLIC_SERVICE_PROFILES){
 const parts=[...profile.boxes,...profile.cylinders];assert.deepEqual(profile.counts,{public:6,service:6,boxes:10,cylinders:2});assert.equal(parts.length,12);assert(publicServiceOpposed(profile));assert(publicServiceMounted(profile));
 assert(parts.every(part=>Object.isFrozen(part)&&['public','service'].includes(part.role)&&[part.x,part.y,part.z,part.h,part.color].every(Number.isFinite)&&part.h>0));
 assert(parts.filter(part=>part.role==='public').some(part=>part.part==='public-notice-case')&&parts.filter(part=>part.role==='public').some(part=>part.part==='public-entry-lamp'));
 assert(parts.filter(part=>part.role==='service').some(part=>part.part===profile.cue+'-cue-a')&&parts.filter(part=>part.role==='service').some(part=>part.part==='service-door'));
}
assert.equal(publicServiceProfile(null),null);assert.equal(publicServiceProfile({...PUBLIC_SERVICE_SITES[0],cue:'bad'}),null);assert.equal(publicServiceProfile({...PUBLIC_SERVICE_SITES[0],w:4}),null);assert.equal(publicServiceOpposed(null),false);assert.equal(publicServiceMounted(null),false);

const scene=new THREE.Scene(),layer=createPublicServiceFronts({scene,quality:'balanced'});assert.equal(scene.children.length,2);assert.equal(layer.drawCalls,2);assert.deepEqual(layer.counts,{sites:8,boxes:80,cylinders:16,parts:96,public:48,service:48,colliders:0});assert.equal(layer.boxMesh.count,80);assert.equal(layer.cylinderMesh.count,16);
for(const mesh of [layer.boxMesh,layer.cylinderMesh])assert(mesh.isInstancedMesh&&mesh.material.vertexColors&&mesh.material.map==null&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite));
const resources=[layer.boxMesh,layer.boxMesh.geometry,layer.boxMesh.material,layer.cylinderMesh,layer.cylinderMesh.geometry,layer.cylinderMesh.material];layer.setQuality('performance');assert([layer.boxMesh,layer.cylinderMesh].every(mesh=>mesh.visible&&!mesh.castShadow&&!mesh.receiveShadow));layer.setQuality('high');assert([layer.boxMesh,layer.cylinderMesh].every(mesh=>mesh.castShadow&&mesh.receiveShadow));layer.setQuality('balanced');assert([layer.boxMesh,layer.cylinderMesh].every(mesh=>!mesh.castShadow&&mesh.receiveShadow));assert.deepEqual([layer.boxMesh,layer.boxMesh.geometry,layer.boxMesh.material,layer.cylinderMesh,layer.cylinderMesh.geometry,layer.cylinderMesh.material],resources);assert.throws(()=>createPublicServiceFronts(),/scene/);

console.log('PASS: eight real businesses pair six welcoming frontage cues with six distinct wall-mounted rear-service cues in two stable batches and zero collision. CPU geometry only; no rendered front/back identity claim.');
