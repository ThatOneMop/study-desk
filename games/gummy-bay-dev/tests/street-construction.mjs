import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {VEHICLE_ROADS,PEDESTRIAN_WAYS} from '../dist/road-zones.mjs';
import {PARKING_BAYS} from '../dist/parking-guide.mjs';
import {STREET_JUNCTIONS,STREET_CURBS,streetConstructionProfile,createStreetConstruction} from '../dist/street-construction.mjs';

assert.equal(STREET_JUNCTIONS.length,30,'five vertical roads meet six expanded-town roads');
assert.equal(STREET_CURBS.length,PEDESTRIAN_WAYS.length);
assert(Object.isFrozen(STREET_JUNCTIONS)&&STREET_JUNCTIONS.every(Object.isFrozen));
assert(Object.isFrozen(STREET_CURBS)&&STREET_CURBS.every(Object.isFrozen));
assert.equal(new Set(STREET_JUNCTIONS.map(j=>`${j.x}:${j.z}`)).size,30);
for(const [index,junction] of STREET_JUNCTIONS.entries()){
 const p=streetConstructionProfile(junction,index);
 assert(p&&Object.isFrozen(p)&&p.stripes===16&&p.ramps===4&&p.tactile===8);
 assert.equal(p.roadSpan,10);assert(p.crossingOffset>6&&p.crossingOffset<9);
 const horizontal=VEHICLE_ROADS.some(r=>r.axis==='horizontal'&&Math.abs(r.z-p.z)<1e-9&&Math.abs(p.x-r.x)<=r.w/2);
 const vertical=VEHICLE_ROADS.some(r=>r.axis==='vertical'&&Math.abs(r.x-p.x)<1e-9&&Math.abs(p.z-r.z)<=r.d/2);
 assert(horizontal&&vertical,'each crossing is derived from a real road intersection');
}
for(const curb of STREET_CURBS){
 assert([curb.x,curb.z,curb.w,curb.d].every(Number.isFinite)&&curb.w>0&&curb.d>0);
 assert(curb.axis==='horizontal'?curb.d===.22:curb.w===.22);
}
assert.equal(streetConstructionProfile(null),null);
assert.equal(streetConstructionProfile({x:NaN,z:0}),null);

const scene=new THREE.Scene(),construction=createStreetConstruction({scene,quality:'balanced'});
assert.equal(construction.drawCalls,2);
assert.deepEqual(construction.counts,{junctions:30,curbs:26,bays:5,markings:500,hardscape:391});
assert.equal(scene.children.length,2);
assert.equal(construction.markingMesh.count,500);
assert.equal(construction.hardscapeMesh.count,391);
for(const mesh of scene.children)assert(mesh.isInstancedMesh&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.material.vertexColors);
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
construction.setQuality('performance');
assert(construction.markingMesh.visible&&construction.hardscapeMesh.visible&&!construction.hardscapeMesh.castShadow);
construction.setQuality('balanced');
assert(construction.hardscapeMesh.castShadow);
construction.setQuality('high');
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);
assert.equal(PARKING_BAYS.length,5,'all guided parking targets receive world-space bay markings');
console.log('PASS: 30 real junctions receive 480 zebra bars, 120 curb ramps, 240 tactile strips and 26 continuous curb edges; all five guided bays receive world-space markings in two stable instanced draw calls. CPU construction only; no pedestrian-height render claim.');
