import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {WINDOW_CONNECTION_SITES,WINDOW_CONNECTION_PROFILES,WINDOW_CONNECTION_COLLIDERS,windowConnectionProfile,windowApertureSamples,windowConnectionAligned,createWindowConnections} from '../dist/window-connections.mjs?v=96';

assert.equal(WINDOW_CONNECTION_SITES.length,11);assert.equal(WINDOW_CONNECTION_PROFILES.length,11);assert.equal(WINDOW_CONNECTION_COLLIDERS.length,0);
assert(Object.isFrozen(WINDOW_CONNECTION_SITES)&&WINDOW_CONNECTION_SITES.every(Object.isFrozen)&&Object.isFrozen(WINDOW_CONNECTION_PROFILES)&&WINDOW_CONNECTION_PROFILES.every(Object.isFrozen));
assert.deepEqual(WINDOW_CONNECTION_SITES.map((site,index)=>windowConnectionProfile(site,index)),WINDOW_CONNECTION_PROFILES,'all real frontage profiles derive deterministically');
const windows=WINDOW_CONNECTION_PROFILES.flatMap(profile=>profile.windows);assert.equal(windows.length,22);assert.equal(new Set(windows.map(window=>window.id)).size,22);
for(const profile of WINDOW_CONNECTION_PROFILES){
 assert.equal(profile.paneWidth,profile.w*.18);assert.equal(profile.paneHeight,1.35);assert.equal(profile.windows.length,2);
 for(const window of profile.windows){
  assert.equal(window.parts.length,7);assert.equal(new Set(window.parts.map(part=>part.part)).size,7);assert.equal(window.depth,.55);assert.equal(windowApertureSamples(window).length,4);
  assert(window.parts.every(part=>Object.isFrozen(part)&&[part.x,part.y,part.z,part.w,part.h,part.d,part.color].every(Number.isFinite)&&part.w>0&&part.h>0&&part.d>0));
  assert(windowApertureSamples(window).every(sample=>Math.abs(sample.x-window.x)<window.paneWidth/2&&Math.abs(sample.y-window.y)<window.paneHeight/2));
  assert(windowConnectionAligned(window,{x:window.x,y:window.y,z:window.frontZ+.15,width:window.paneWidth,height:window.paneHeight}));
 }
}
assert.equal(windowConnectionProfile(null),null);assert.equal(windowConnectionProfile({...WINDOW_CONNECTION_SITES[0],family:'unknown'}),null);assert.equal(windowConnectionProfile({...WINDOW_CONNECTION_SITES[0],w:4}),null);assert.deepEqual(windowApertureSamples(null),[]);assert.equal(windowConnectionAligned(windows[0],{}),false);

const scene=new THREE.Scene(),layer=createWindowConnections({scene,quality:'balanced'});assert.equal(scene.children.length,1);assert.equal(layer.drawCalls,1);assert.deepEqual(layer.counts,{sites:11,windows:22,parts:154,colliders:0});assert.equal(layer.mesh.count,154);assert(layer.mesh.isInstancedMesh&&layer.mesh.geometry.type==='BoxGeometry'&&!layer.mesh.material.vertexColors&&layer.mesh.material.map==null&&layer.mesh.instanceMatrix.array.every(Number.isFinite)&&layer.mesh.instanceColor.array.every(Number.isFinite));
const resources=[layer.mesh,layer.mesh.geometry,layer.mesh.material,layer.mesh.instanceMatrix,layer.mesh.instanceColor];layer.setQuality('performance');assert(layer.mesh.visible&&!layer.mesh.castShadow&&!layer.mesh.receiveShadow);layer.setQuality('high');assert(layer.mesh.castShadow&&layer.mesh.receiveShadow);layer.setQuality('balanced');assert(!layer.mesh.castShadow&&layer.mesh.receiveShadow);assert.deepEqual([layer.mesh,layer.mesh.geometry,layer.mesh.material,layer.mesh.instanceMatrix,layer.mesh.instanceColor],resources);assert.throws(()=>createWindowConnections(),/scene/);

console.log('PASS: all 22 real frontage windows gain seven-part recessed reveals in one stable batch, with four measured aperture samples per transparent pane and no collision. CPU geometry only; no rendered sightline claim.');
