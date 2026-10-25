import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile} from '../dist/district-architecture.mjs?v=77';
import {TOWN_UTILITY_SITES,TOWN_UTILITY_KINDS,TOWN_UTILITY_PROFILES,townUtilityProfile,utilityInsideSupport,createTownUtilities} from '../dist/town-utilities.mjs?v=79';

assert.equal(TOWN_UTILITY_SITES.length,10);assert.equal(TOWN_UTILITY_PROFILES.length,10);
assert(Object.isFrozen(TOWN_UTILITY_SITES)&&TOWN_UTILITY_SITES.every(Object.isFrozen)&&Object.isFrozen(TOWN_UTILITY_PROFILES)&&TOWN_UTILITY_PROFILES.every(Object.isFrozen));
assert.deepEqual(TOWN_UTILITY_SITES.map((site,index)=>townUtilityProfile(site,index)),TOWN_UTILITY_PROFILES,'utility profiles are deterministic');
assert.deepEqual([...new Set(TOWN_UTILITY_PROFILES.map(profile=>profile.kind))].sort(),['condenser','extractor','meter-bank','rain-tank']);
assert.equal(new Set(TOWN_UTILITY_PROFILES.map(profile=>profile.supportId)).size,10,'one purposeful utility cluster per selected building');
for(const profile of TOWN_UTILITY_PROFILES){
 assert([profile.x,profile.z,profile.backSign,profile.footprint.w,profile.footprint.d].every(Number.isFinite));assert(profile.label&&profile.purpose===TOWN_UTILITY_KINDS[profile.kind].purpose);
 assert(DISTRICT_BUILDING_SITES.includes(profile.support)&&utilityInsideSupport(profile,.08),'utility geometry stays inside its existing blocked support footprint');
 const building=districtArchitectureProfile(profile.support,profile.supportIndex),delta=building.front.axis==='z'?profile.z-building.z:profile.x-building.x;
 assert.equal(Math.sign(delta),-building.front.sign,'utility sits on the service back, opposite the public frontage');
}
for(let i=0;i<TOWN_UTILITY_PROFILES.length;i++)for(let j=i+1;j<TOWN_UTILITY_PROFILES.length;j++)assert(Math.hypot(TOWN_UTILITY_PROFILES[i].x-TOWN_UTILITY_PROFILES[j].x,TOWN_UTILITY_PROFILES[i].z-TOWN_UTILITY_PROFILES[j].z)>12,'utility clusters remain deliberately sparse');
assert.equal(townUtilityProfile(null),null);assert.equal(townUtilityProfile({...TOWN_UTILITY_SITES[0],kind:'bin'}),null);assert.equal(townUtilityProfile({...TOWN_UTILITY_SITES[0],supportId:'missing'}),null);assert.equal(utilityInsideSupport(null),false);assert.equal(utilityInsideSupport({...TOWN_UTILITY_PROFILES[0],footprint:{w:100,d:100}}),false);

const scene=new THREE.Scene(),utilities=createTownUtilities({scene,quality:'balanced'});
assert.equal(utilities.profiles.length,10);assert.equal(utilities.drawCalls,2);assert.deepEqual(utilities.counts,{sites:10,boxes:16,cylinders:17});assert.equal(scene.children.length,2);
for(const mesh of scene.children){assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite));assert(mesh.geometry.attributes.position.count>0&&mesh.material.vertexColors&&mesh.material.map==null&&!mesh.castShadow);}
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
utilities.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
utilities.setQuality('balanced');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
utilities.setQuality('high');assert(utilities.boxMesh.castShadow&&!utilities.cylinderMesh.castShadow);
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources,'quality changes reuse utility resources');
assert.throws(()=>createTownUtilities(),/scene/);
console.log('PASS: ten sparse rear-of-building utility sites cover four purposes inside existing blocked footprints in two stable instanced draw calls. CPU geometry only; no rendered clutter or FPS claim.');
