import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_ARCHETYPES,DISTRICT_BUILDING_SITES,districtArchitectureProfile,createDistrictArchitecture} from '../dist/district-architecture.mjs';

assert.equal(DISTRICT_BUILDING_SITES.length,60);
assert(Object.isFrozen(DISTRICT_BUILDING_SITES)&&DISTRICT_BUILDING_SITES.every(Object.isFrozen));
assert.equal(DISTRICT_ARCHETYPES.length,5);
const profiles=DISTRICT_BUILDING_SITES.map(districtArchitectureProfile);
assert.deepEqual(profiles,DISTRICT_BUILDING_SITES.map(districtArchitectureProfile),'profiles are deterministic');
assert.equal(new Set(profiles.map(p=>p.archetype)).size,5,'all five authored families are present');
assert.equal(new Set(profiles.map(p=>p.roof)).size,5,'each family has a distinct roof treatment');
assert.deepEqual([...new Set(profiles.map(p=>p.floors))].sort(),[1,2,3]);
for(let i=0;i<profiles.length;i++){
 const p=profiles[i],site=DISTRICT_BUILDING_SITES[i];
 assert([p.x,p.z,p.w,p.d,p.height,p.bays].every(Number.isFinite));
 assert(p.w<site.w&&p.d<site.d&&p.w>8&&p.d>8,'visible mass remains inside the authored collider');
 assert(['x','z'].includes(p.front.axis)&&[-1,1].includes(p.front.sign));
 assert(p.bays>=2&&p.bays<=5&&Object.isFrozen(p)&&Object.isFrozen(p.front)&&Object.isFrozen(p.palette));
}
assert.equal(districtArchitectureProfile(null),null);
assert.equal(districtArchitectureProfile({x:0,z:0,w:NaN,d:10}),null);
assert.throws(()=>{DISTRICT_BUILDING_SITES.push({});},TypeError);

const scene=new THREE.Scene(),architecture=createDistrictArchitecture({scene,quality:'balanced'});
assert.equal(architecture.profiles.length,60);
assert.equal(architecture.drawCalls,3,'full district uses three instanced draw calls');
assert(architecture.counts.mass>150&&architecture.counts.detail>400&&architecture.counts.gable>0);
assert.equal(scene.children.length,3);
for(const mesh of scene.children){
 assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite));
 assert(mesh.geometry.attributes.position.count>0&&mesh.material.vertexColors);
}
const savedResources=scene.children.map(m=>[m,m.geometry,m.material,m.instanceMatrix,m.instanceColor]);
architecture.setQuality('performance');assert.equal(architecture.detailMesh.visible,false);assert.equal(architecture.massMesh.visible,true);
architecture.setQuality('balanced');assert.equal(architecture.detailMesh.visible,true);
architecture.setQuality('high');
assert.deepEqual(scene.children.map(m=>[m,m.geometry,m.material,m.instanceMatrix,m.instanceColor]),savedResources,'quality changes reuse all district resources');
console.log('PASS: 60 immutable sites become five deterministic architectural families, five roof treatments and three stable instanced draw calls. CPU construction only; no rendered acceptance or FPS claim.');
