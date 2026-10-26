import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {VERTICAL_TOWN_LAYER,VERTICAL_TOWN_BARRIERS,verticalTownFloorHeight,createVerticalTownLayer} from '../dist/vertical-town.mjs';

const l=VERTICAL_TOWN_LAYER;
assert(Object.isFrozen(l)&&Object.isFrozen(VERTICAL_TOWN_BARRIERS)&&VERTICAL_TOWN_BARRIERS.every(Object.isFrozen));
assert.equal(l.steps,8);assert.equal(l.height,1.44);assert.equal(l.width,12);
assert.equal(verticalTownFloorHeight(l.x,l.northStart),0);
assert.equal(verticalTownFloorHeight(l.x,l.northEnd),l.height);
assert.equal(verticalTownFloorHeight(l.x,l.platformSouth),l.height);
assert.equal(verticalTownFloorHeight(l.x,l.southEnd),0);
assert.equal(verticalTownFloorHeight(l.x,l.northEnd-.1),l.height);
assert.equal(verticalTownFloorHeight(l.x+l.width/2+.001,-62),0);
assert.equal(verticalTownFloorHeight(NaN,-62),0);
assert.equal(verticalTownFloorHeight(l.x,Infinity),0);

let previous=0;
for(let z=l.northStart;z>=l.northEnd;z-=.25){const height=verticalTownFloorHeight(l.x,z);assert(height>=previous-1e-9&&height-previous<=.061,'north stair support rises smoothly by no more than 6.1 cm per 25 cm sample');previous=height;}
previous=l.height;
for(let z=l.platformSouth;z>=l.southEnd;z-=.25){const height=verticalTownFloorHeight(l.x,z);assert(height<=previous+1e-9&&previous-height<=.061,'south stair support descends smoothly by no more than 6.1 cm per 25 cm sample');previous=height;}

const scene=new THREE.Scene(),terrace=createVerticalTownLayer({scene,quality:'balanced'});
assert.equal(terrace.drawCalls,2);assert.deepEqual(terrace.counts,{steps:16,platforms:1,detail:26});
assert.equal(scene.children.length,2);assert.equal(terrace.massMesh.count,17);assert.equal(terrace.detailMesh.count,26);
for(const mesh of scene.children)assert(mesh.isInstancedMesh&&mesh.instanceMatrix.array.every(Number.isFinite)&&!mesh.material.vertexColors);
const resources=scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
terrace.setQuality('performance');assert(terrace.massMesh.visible&&terrace.detailMesh.visible&&!terrace.detailMesh.castShadow);
terrace.setQuality('balanced');assert(terrace.detailMesh.castShadow);
terrace.setQuality('high');assert.deepEqual(scene.children.map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources);
assert.throws(()=>createVerticalTownLayer({scene:new THREE.Scene(),layer:{}}),TypeError);
console.log('PASS: Gumdrop Terrace has two eight-step flights, a 1.44 m public platform, two safety rails and continuous finite support capped at 6.1 cm per 25 cm sample. CPU construction only; no rendered traversal claim.');
