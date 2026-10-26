import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {HORIZON_TREE_SITES,HORIZON_TREE_PROFILES,HORIZON_VIEW_CORRIDORS,horizonTreeProfile,horizonSiteOutsideBounds,horizonViewGap,createDistrictHorizon} from '../dist/district-horizon.mjs?v=77';

const bounds={minX:-280,maxX:280,minZ:95-(178*171*10/560),maxZ:95};
assert.equal(HORIZON_TREE_SITES.length,22);assert.equal(HORIZON_TREE_PROFILES.length,22);
assert(Object.isFrozen(HORIZON_TREE_SITES)&&HORIZON_TREE_SITES.every(Object.isFrozen)&&Object.isFrozen(HORIZON_TREE_PROFILES)&&HORIZON_TREE_PROFILES.every(Object.isFrozen));
assert.equal(new Set(HORIZON_TREE_SITES.map(site=>site.id)).size,22);assert.deepEqual([...new Set(HORIZON_TREE_SITES.map(site=>site.zone))].sort(),['east','north','west']);
assert.deepEqual(HORIZON_TREE_SITES.map(horizonTreeProfile),HORIZON_TREE_PROFILES,'authored tree profiles are deterministic');
for(const profile of HORIZON_TREE_PROFILES){
 assert([profile.x,profile.z,profile.height,profile.lean,profile.crownRadius,profile.trunkRadius].every(Number.isFinite));
 assert(horizonSiteOutsideBounds(profile,bounds,8),'every silhouette stays beyond playable bounds');
 assert(horizonViewGap(profile,HORIZON_VIEW_CORRIDORS)>=18,'every avenue/cross-street keeps an open skyline corridor');
 assert(profile.height>=8&&profile.height<=14&&profile.crownRadius>=1.9&&profile.crownRadius<=2.56);
}
assert.equal(horizonTreeProfile(null),null);assert.equal(horizonTreeProfile({...HORIZON_TREE_SITES[0],height:40}),null);assert.equal(horizonTreeProfile({...HORIZON_TREE_SITES[0],zone:'road'}),null);
assert.equal(horizonSiteOutsideBounds(HORIZON_TREE_PROFILES[0],null),false);assert.equal(horizonSiteOutsideBounds({x:0,z:0},bounds),false);assert.equal(horizonViewGap(null),null);assert.equal(horizonViewGap(HORIZON_TREE_PROFILES[0],{north:[],sides:[]}),null);

const scene=new THREE.Scene(),horizon=createDistrictHorizon({scene,bounds,quality:'balanced'});
assert.equal(horizon.profiles.length,22);assert.equal(horizon.drawCalls,3);assert.deepEqual(horizon.counts,{trees:22,trunks:22,crowns:44,scrub:22});assert.equal(scene.children.length,3);
for(const mesh of scene.children){assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite));assert(mesh.geometry.attributes.position.count>0&&!mesh.material.vertexColors&&mesh.material.map==null);}
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
horizon.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
horizon.setQuality('balanced');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));
horizon.setQuality('high');assert(horizon.trunkMesh.castShadow&&horizon.crownMesh.castShadow&&!horizon.scrubMesh.castShadow);
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources,'quality changes reuse all horizon resources');
assert.throws(()=>createDistrictHorizon(),/scene/);
console.log('PASS: 22 off-route windbreak trees and 22 scrub transitions preserve at least 18 m of every authored skyline corridor in three stable instanced draw calls. CPU geometry only; no rendered horizon or FPS claim.');
