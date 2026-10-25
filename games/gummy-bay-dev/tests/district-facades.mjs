import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile,districtFacadeDepth,createDistrictArchitecture} from '../dist/district-architecture.mjs';

const profiles=DISTRICT_BUILDING_SITES.map(districtArchitectureProfile);
const depths=profiles.map(districtFacadeDepth);
assert.equal(depths.length,60);
for(let i=0;i<depths.length;i++){
 const p=profiles[i],d=depths[i],site=DISTRICT_BUILDING_SITES[i];
 assert(d&&Object.isFrozen(d)&&Object.isFrozen(d.layers));
 assert(d.layers.doorBack<0&&d.layers.windowPane<0,'door and glazing sit behind the wall plane');
 assert(d.layers.frame>0&&d.layers.sill>d.layers.frame&&d.layers.cornice>0,'surrounds and cornices project from the wall plane');
 assert(d.layers.step>d.layers.cornice,'entrance step projects beyond the trim');
 assert.equal(d.layers.canopy,p.canopy?.82:0);
 assert(d.clearance>=.18-1e-9,'deepest frontage stays inside the authored collider with clearance');
 assert(d.maxProjection<=p.setback&&p.siteW===site.w&&p.siteD===site.d);
 const massHalf=p.front.axis==='z'?p.d/2:p.w/2;
 const siteHalf=p.front.axis==='z'?p.siteD/2:p.siteW/2;
 assert(massHalf+d.maxProjection<siteHalf,'all reported facade layers remain inside the existing collision footprint');
}
assert.equal(districtFacadeDepth(null),null);
assert.equal(districtFacadeDepth({w:10,d:10,siteW:12,siteD:12,setback:.5,front:{axis:'z',sign:1}}),null);
assert.equal(districtFacadeDepth({w:10,d:10,siteW:12,siteD:12,setback:1,front:{axis:'q',sign:1}}),null);
assert.throws(()=>{depths[0].layers.step=99;},TypeError);

const oldScene=new THREE.Scene(),newScene=new THREE.Scene();
const architecture=createDistrictArchitecture({scene:newScene,quality:'balanced'});
const sparse=createDistrictArchitecture({scene:oldScene,sites:DISTRICT_BUILDING_SITES.slice(0,1),quality:'balanced'});
assert.equal(architecture.drawCalls,3);
assert.equal(newScene.children.length,3);
assert(architecture.counts.detail>1100,'recesses, frames, lintels, sills, steps and cornices are explicitly instanced');
assert(sparse.counts.detail>=18,'even one single-storey facade receives multiple independent depth layers');
assert.equal(architecture.detailMesh.count,architecture.counts.detail);
architecture.setQuality('performance');
assert.equal(architecture.massMesh.visible,true);
assert.equal(architecture.detailMesh.visible,false);
architecture.setQuality('balanced');
assert.equal(architecture.detailMesh.visible,true);
console.log('PASS: 60 facades expose signed recess/projection layers, retain at least .18 m collider clearance and batch added depth into the existing three draw calls. CPU geometry only; no grazing-angle render acceptance claim.');
