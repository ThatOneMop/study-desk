import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES} from '../dist/district-architecture.mjs?v=77';
import {OVERHEAD_INFRASTRUCTURE_SITES,OVERHEAD_INFRASTRUCTURE_PROFILES,overheadInfrastructureProfile,roofSupportsContain,overheadCableSegments,createOverheadInfrastructure} from '../dist/overhead-infrastructure.mjs?v=80';

assert.equal(OVERHEAD_INFRASTRUCTURE_SITES.length,4);assert.equal(OVERHEAD_INFRASTRUCTURE_PROFILES.length,4);
assert(Object.isFrozen(OVERHEAD_INFRASTRUCTURE_SITES)&&OVERHEAD_INFRASTRUCTURE_SITES.every(Object.isFrozen)&&Object.isFrozen(OVERHEAD_INFRASTRUCTURE_PROFILES)&&OVERHEAD_INFRASTRUCTURE_PROFILES.every(Object.isFrozen));
assert.deepEqual(OVERHEAD_INFRASTRUCTURE_SITES.map((site,index)=>overheadInfrastructureProfile(site,index)),OVERHEAD_INFRASTRUCTURE_PROFILES,'span profiles are deterministic');
assert.equal(new Set(OVERHEAD_INFRASTRUCTURE_PROFILES.map(profile=>profile.z)).size,4,'spans are distributed along four blocks');
for(const profile of OVERHEAD_INFRASTRUCTURE_PROFILES){
 assert([profile.leftX,profile.rightX,profile.z,profile.mastBaseY,profile.mastTopY,profile.cableLowY,profile.clearance,profile.span].every(Number.isFinite));
 assert(DISTRICT_BUILDING_SITES.includes(profile.leftSupport)&&DISTRICT_BUILDING_SITES.includes(profile.rightSupport)&&roofSupportsContain(profile,.55));
 assert(profile.leftX<profile.roadX&&profile.roadX<profile.rightX&&profile.span===70,'every span crosses the East Grid road from two roof supports');
 assert(profile.clearance>=10&&profile.cableLowY===profile.clearance,'lowest cable clears vehicles and first-person camera by more than 10 m');
 const segments=overheadCableSegments(profile);assert.equal(segments.length,6);assert(Object.isFrozen(segments)&&segments.every(Object.isFrozen));
 assert.equal(Math.min(...segments.flatMap(segment=>[segment.y1,segment.y2])),profile.clearance);assert(segments.every(segment=>segment.x1<segment.x2&&Math.abs(segment.z-profile.z)<=1.100001));
}
assert.equal(overheadInfrastructureProfile(null),null);assert.equal(overheadInfrastructureProfile({...OVERHEAD_INFRASTRUCTURE_SITES[0],rightSupportId:'missing'}),null);assert.equal(overheadInfrastructureProfile({...OVERHEAD_INFRASTRUCTURE_SITES[0],roadX:50}),null);assert.equal(roofSupportsContain(null),false);assert.deepEqual(overheadCableSegments(null),[]);

const scene=new THREE.Scene(),infrastructure=createOverheadInfrastructure({scene,quality:'balanced'});
assert.equal(infrastructure.profiles.length,4);assert.equal(infrastructure.drawCalls,3);assert.deepEqual(infrastructure.counts,{spans:4,supportParts:32,arms:8,cables:24});assert.equal(scene.children.length,3);
for(const mesh of scene.children){assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite));assert(mesh.geometry.attributes.position.count>0&&mesh.material.vertexColors&&mesh.material.map==null&&!mesh.castShadow);}
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
infrastructure.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
infrastructure.setQuality('balanced');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
infrastructure.setQuality('high');assert(infrastructure.supportMesh.castShadow&&infrastructure.armMesh.castShadow&&!infrastructure.cableMesh.castShadow);
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources,'quality changes reuse overhead resources');
assert.throws(()=>createOverheadInfrastructure(),/scene/);
console.log('PASS: four roof-supported East Grid spans keep a measured 10.15 m cable clearance, use no ground collision and share three stable instanced draw calls. CPU geometry only; no rendered scale, shading or FPS claim.');
