import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES,DISTRICT_CONTRAST_COLLIDERS,districtArchitectureProfile,districtGeometricContrast,createDistrictArchitecture} from '../dist/district-architecture.mjs?v=92';

assert(Object.isFrozen(DISTRICT_CONTRAST_COLLIDERS)&&DISTRICT_CONTRAST_COLLIDERS.length===0);
const profiles=DISTRICT_BUILDING_SITES.map(districtArchitectureProfile),contrast=profiles.map(districtGeometricContrast);
assert.equal(contrast.length,60);assert(contrast.every(item=>item&&Object.isFrozen(item)&&Object.isFrozen(item.verticals)&&Object.isFrozen(item.horizontals)));
assert(contrast.every((item,index)=>item.id===profiles[index].id&&item.rightAngles&&item.roundedParts===0&&item.verticals.length===2&&item.horizontals.length===profiles[index].floors));
assert.equal(new Set(contrast.map(item=>item.signature)).size,3,'one, two and three-storey structures have distinct orthogonal signatures');
for(let i=0;i<contrast.length;i++){
 const item=contrast[i],profile=profiles[i];
 assert(item.verticals.every((rib,index)=>rib.kind==='vertical-rib'&&rib.side===(index?-1:1)*-1&&Math.abs(rib.along)+rib.width/2<item.frontSpan/2&&rib.height>3&&rib.depth===.16));
 assert(item.horizontals.every((band,floor)=>band.kind==='floor-datum'&&band.floor===floor&&band.width<item.frontSpan&&band.height===.15&&band.depth===.18));
 assert(item.clearance>.75&&item.maxProjection<profile.setback,'structured details remain inside the authored collider setback');
}
assert.equal(districtGeometricContrast(null),null);assert.equal(districtGeometricContrast({...profiles[0],height:NaN}),null);

const scene=new THREE.Scene(),architecture=createDistrictArchitecture({scene});
assert.equal(architecture.contrastProfiles.length,60);assert.equal(architecture.counts.contrastVerticals,120);assert.equal(architecture.counts.contrastHorizontals,profiles.reduce((sum,profile)=>sum+profile.floors,0));
assert.equal(architecture.drawCalls,3);assert.equal(architecture.detailMesh.geometry.type,'BoxGeometry');assert.equal(architecture.detailMesh.material.map,null);
const resources=[architecture.detailMesh,architecture.detailMesh.geometry,architecture.detailMesh.material,architecture.detailMesh.instanceMatrix,architecture.detailMesh.instanceColor];
architecture.setQuality('performance');assert(!architecture.detailMesh.visible&&architecture.massMesh.visible);
architecture.setQuality('balanced');assert(architecture.detailMesh.visible&&resources.every((resource,i)=>resource===[architecture.detailMesh,architecture.detailMesh.geometry,architecture.detailMesh.material,architecture.detailMesh.instanceMatrix,architecture.detailMesh.instanceColor][i]));
console.log('PASS: 60 facades gain 120 full-height orthogonal ribs plus measured floor datums inside the existing clean box-detail batch, with zero rounded parts, collision, texture, draw-call or resource growth. CPU geometry only; no rendered character/architecture contrast claim.');
