import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {TOWN_SURFACE_TEXTURES,TOWN_MATERIAL_HIERARCHY,townMaterialOptions,townMaterialChecksum} from '../dist/town-materials.mjs?v=75';
import {createDistrictArchitecture} from '../dist/district-architecture.mjs';
import {createStreetConstruction} from '../dist/street-construction.mjs';
import {createVerticalTownLayer} from '../dist/vertical-town.mjs';
import {createContextualStreetProps} from '../dist/contextual-street-props.mjs';

assert(Object.isFrozen(TOWN_SURFACE_TEXTURES)&&Object.isFrozen(TOWN_MATERIAL_HIERARCHY));
assert(Object.values(TOWN_MATERIAL_HIERARCHY).every(Object.isFrozen));
assert.deepEqual(Object.keys(TOWN_MATERIAL_HIERARCHY),['buildingMass','buildingTrim','roof','hardscape','marking','streetBody','streetMetal']);
assert.equal(new Set(Object.values(TOWN_MATERIAL_HIERARCHY).map(profile=>profile.label)).size,7);
assert.deepEqual(Object.fromEntries(Object.entries(TOWN_SURFACE_TEXTURES).map(([key,texture])=>[key,townMaterialChecksum(texture)])),{mineral:3675083,concrete:3761245,roof:3707867},'procedural material assets are deterministic');
for(const [key,texture] of Object.entries(TOWN_SURFACE_TEXTURES)){
 assert(texture.isDataTexture&&texture.image.width===16&&texture.image.height===16&&texture.image.data.length===1024);
 assert.equal(texture.userData.townSurface,key);assert.equal(texture.wrapS,THREE.RepeatWrapping);assert.equal(texture.wrapT,THREE.RepeatWrapping);
 assert.equal(texture.colorSpace,THREE.SRGBColorSpace);assert(texture.repeat.x>=3&&texture.repeat.y===texture.repeat.x&&texture.version>0);
}
for(const [key,profile] of Object.entries(TOWN_MATERIAL_HIERARCHY)){
 const options=townMaterialOptions(key);assert(options&&options.roughness===profile.roughness&&options.metalness===profile.metalness);
 assert(profile.roughness>=.6&&profile.roughness<=1&&profile.metalness>=0&&profile.metalness<=.15);
 assert.equal(options.map,profile.texture?TOWN_SURFACE_TEXTURES[profile.texture]:null);
}
assert.equal(townMaterialOptions('missing'),null);assert.equal(townMaterialChecksum(null),null);

const scene=new THREE.Scene(),architecture=createDistrictArchitecture({scene}),streets=createStreetConstruction({scene}),terrace=createVerticalTownLayer({scene}),props=createContextualStreetProps({scene});
assert.equal(architecture.massMesh.material.map,TOWN_SURFACE_TEXTURES.mineral);
assert.equal(architecture.detailMesh.material.map,null);assert.equal(architecture.roofMesh.material.map,TOWN_SURFACE_TEXTURES.roof);
assert.equal(streets.markingMesh.material.map,null);assert.equal(streets.hardscapeMesh.material.map,TOWN_SURFACE_TEXTURES.concrete);
assert.equal(terrace.massMesh.material.map,TOWN_SURFACE_TEXTURES.concrete);assert.equal(terrace.detailMesh.material.map,null);
assert.equal(props.boxMesh.material.map,null);assert.equal(props.cylinderMesh.material.map,null);
assert.equal(new Set(scene.children.map(mesh=>mesh.material.map).filter(Boolean)).size,3,'nine procedural batches share only three detail textures');
for(const quality of ['performance','balanced','high']){architecture.setQuality(quality);streets.setQuality(quality);terrace.setQuality(quality);props.setQuality(quality);assert.equal(architecture.massMesh.material.map,TOWN_SURFACE_TEXTURES.mineral);assert.equal(streets.hardscapeMesh.material.map,TOWN_SURFACE_TEXTURES.concrete);}
console.log('PASS: deterministic 16px original microdetail establishes textured mass/roof/hardscape and clean trim/marking/prop tiers across nine batches with three shared textures. CPU material state only; no rendered hierarchy or GPU claim.');
