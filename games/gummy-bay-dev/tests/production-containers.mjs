import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {PRODUCTION_CONTAINER_HOMES,PRODUCTION_STAGES,PRODUCTION_CONTAINER_PROFILES,PRODUCTION_CONTAINER_COLLIDERS,productionContainerProfile,productionContainersOnTable,productionContainerState,createProductionContainers} from '../dist/production-containers.mjs?v=85';

assert.equal(PRODUCTION_CONTAINER_HOMES.length,3);assert.equal(PRODUCTION_STAGES.length,3);assert.equal(PRODUCTION_CONTAINER_PROFILES.length,3);assert.equal(PRODUCTION_CONTAINER_COLLIDERS.length,0);
assert(Object.isFrozen(PRODUCTION_CONTAINER_HOMES)&&PRODUCTION_CONTAINER_HOMES.every(Object.isFrozen)&&Object.isFrozen(PRODUCTION_STAGES)&&Object.isFrozen(PRODUCTION_CONTAINER_PROFILES));
assert.deepEqual(PRODUCTION_CONTAINER_HOMES.map((home,index)=>productionContainerProfile(home,index)),PRODUCTION_CONTAINER_PROFILES);
for(const profile of PRODUCTION_CONTAINER_PROFILES){assert.equal(profile.stages.length,3);assert(productionContainersOnTable(profile));assert.equal(new Set(profile.stages.map(stage=>stage.shape)).size,3);assert(profile.decorativeOnly);}
assert.equal(productionContainerProfile(null),null);assert.equal(productionContainersOnTable(null),false);
const source={active:true,room:true,home:1,raw:[4,0,1],gummies:[0,2,1],packs:[3,1,0]},before=JSON.stringify(source),view=productionContainerState(source);
assert(view.visible);assert.equal(view.home,1);assert.deepEqual(view.stages.harvest.slots,[0,2,0]);assert.deepEqual(view.stages.shape.slots,[1,2,1]);assert.deepEqual(view.stages.pack.slots,[0,1,0]);assert.equal(JSON.stringify(source),before);assert(Object.isFrozen(view)&&Object.isFrozen(view.stages)&&Object.values(view.stages).every(stage=>Object.isFrozen(stage)&&Object.isFrozen(stage.slots)));
assert.equal(productionContainerState({...source,active:false}).visible,false);assert.equal(productionContainerState({...source,room:false}).visible,false);assert.equal(productionContainerState({...source,home:9}).visible,false);

const scene=new THREE.Scene(),containers=createProductionContainers({scene,quality:'balanced'});
assert.equal(containers.drawCalls,3);assert.deepEqual(containers.counts,{homes:3,stages:9,boxes:54,cylinders:9,spheres:9,colliders:0});assert.equal(scene.children.length,3);
for(const mesh of scene.children)assert(mesh.isInstancedMesh&&mesh.count>0&&mesh.instanceMatrix.array.every(Number.isFinite)&&mesh.instanceColor.array.every(Number.isFinite)&&mesh.material.map==null);
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),colors=[0x93c35b,0xe2ca63,0xaa83ce];
const hiddenMatrices=containers.boxMesh.instanceMatrix.array.slice();assert.equal(containers.snapshot().visible,false);
assert.equal(containers.update(source,colors).home,1);assert.notDeepEqual(containers.boxMesh.instanceMatrix.array.slice(),hiddenMatrices);assert.equal(containers.update(source,colors),containers.snapshot());
containers.setQuality('performance');assert(scene.children.every(mesh=>mesh.visible&&!mesh.castShadow));containers.setQuality('balanced');assert(containers.boxMesh.castShadow&&!containers.cylinderMesh.castShadow&&!containers.sphereMesh.castShadow);containers.setQuality('high');assert(scene.children.every(mesh=>mesh.castShadow));
assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);assert.throws(()=>createProductionContainers(),/scene/);
console.log('PASS: the active workshop table uses distinct harvest basket, loose-gummy mould and finished-pack caddy silhouettes driven by real bounded inventory previews; inactive homes collapse without collision or resource replacement. CPU geometry only; no rendered-recognition claim.');
