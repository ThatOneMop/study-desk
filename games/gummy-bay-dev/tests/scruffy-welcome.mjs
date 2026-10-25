import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {SCRUFFY_WELCOME_SITES,SCRUFFY_WELCOME_PROFILES,SCRUFFY_WELCOME_COLLIDERS,scruffyWelcomeProfile,scruffyWelcomeMounted,createScruffyWelcome} from '../dist/scruffy-welcome.mjs';

assert.equal(SCRUFFY_WELCOME_SITES.length,5);assert.equal(SCRUFFY_WELCOME_PROFILES.length,5);assert.equal(SCRUFFY_WELCOME_COLLIDERS.length,0);
assert(Object.isFrozen(SCRUFFY_WELCOME_SITES)&&SCRUFFY_WELCOME_SITES.every(Object.isFrozen)&&Object.isFrozen(SCRUFFY_WELCOME_PROFILES)&&SCRUFFY_WELCOME_PROFILES.every(Object.isFrozen));
assert.deepEqual(SCRUFFY_WELCOME_SITES.map(scruffyWelcomeProfile),SCRUFFY_WELCOME_PROFILES);
assert.equal(SCRUFFY_WELCOME_PROFILES.filter(profile=>profile.kind==='campsite').length,1);assert.equal(SCRUFFY_WELCOME_PROFILES.filter(profile=>profile.kind==='shop').length,4);
for(const profile of SCRUFFY_WELCOME_PROFILES){assert(profile.decorativeOnly&&profile.attached&&scruffyWelcomeMounted(profile));assert.equal(profile.pairing,'weathered-repair+kept-care');assert(profile.lowestY>=.4);assert(Math.abs(profile.anchorX-profile.x)+profile.boardWidth/2<=profile.w/2-.18);}
assert.equal(scruffyWelcomeProfile(null),null);assert.equal(scruffyWelcomeProfile({...SCRUFFY_WELCOME_SITES[1],z:999}),null);assert.equal(scruffyWelcomeMounted(null),false);
const scene=new THREE.Scene(),layer=createScruffyWelcome({scene,quality:'balanced'});assert.equal(layer.drawCalls,2);assert.deepEqual(layer.counts,{sites:5,boxes:40,tins:10,repair:10,care:40,colliders:0});assert.equal(scene.children.length,2);
for(const mesh of scene.children){assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite)&&mesh.material.map==null&&!mesh.castShadow);}
for(const profile of layer.profiles){const items=scene.children.flatMap(mesh=>mesh.userData.items).filter(item=>item.site===profile.id);assert.equal(items.filter(item=>item.role==='repair').length,2);assert.equal(items.filter(item=>['welcome','care','shelf','kept-bed','planter'].includes(item.role)).length,8);}
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);layer.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));layer.setQuality('high');assert(scene.children.every(mesh=>mesh.visible&&mesh.castShadow));assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);
assert.throws(()=>createScruffyWelcome(),/scene/);
console.log('PASS: campsite and four real shopfronts pair two deliberately weathered repairs with eight tidy welcome/care details in two stable untextured batches, zero collision and no gameplay state. CPU geometry only; no rendered daylight comparison claim.');
