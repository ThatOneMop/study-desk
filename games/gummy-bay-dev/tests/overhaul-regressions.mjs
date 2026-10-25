import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {roundResidentAsset} from '../dist/resident-rounding.mjs';
import {createResidentExpressionRig,residentExpressionState,updateResidentExpressionRig} from '../dist/resident-expressions.mjs';
import {dampedTravel,jumpStep} from '../dist/player-view.mjs';
// Same real-time input sequence must yield equal travel, including release, at phone and desktop rates.
function travel(fps){let v=0,x=0;for(const [seconds,target] of [[1,4.3],[1,7.8],[1,0],[1,-4.3]])for(let i=0;i<seconds*fps;i++){const step=dampedTravel(v,target,1/fps,target?18:26);v=step.velocity;x+=step.distance;}return {x,v};}
const expected=travel(240);for(const fps of [20,30,60,120,144]){const actual=travel(fps);assert(Math.abs(actual.x-expected.x)<1e-10);assert(Math.abs(actual.v-expected.v)<1e-10);}
for(const fps of [20,30,60,120]){let h=0,v=4.6;for(let i=0;i<fps*.5;i++){const step=jumpStep(h,v,1/fps);h=step.height;v=step.velocity;}assert(Math.abs(h-.8)<1e-10,'analytic jump height after half a second');assert(Math.abs(v+1.4)<1e-10);}
for(const dt of [NaN,Infinity,-1])assert.deepEqual(dampedTravel(0,4.3,dt),{velocity:0,distance:0});
// Check geometry against the real exported face, rather than only checking invented accessory coordinates.
let rebuilt=0;
for(const file of ['citizen-v11.glb','citizen-v11-1.glb','citizen-v11-2.glb','citizen-lod-v12-0.glb','citizen-lod-v12-1.glb','citizen-lod-v12-2.glb']){
 const bytes=fs.readFileSync(new URL('../dist/assets/'+file,import.meta.url)),g=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 roundResidentAsset(g);g.scene.updateMatrixWorld(true);
 g.scene.traverse(mesh=>{if(!mesh.geometry?.userData.roundedHead)return;rebuilt++;const {color,position,skinWeight}=mesh.geometry.attributes,n=mesh.geometry.userData.roundedHead.newVertices;
  for(let i=position.count-n;i<position.count;i++){assert(color.getX(i)+color.getY(i)+color.getZ(i)>.3,file+' replacement skull must retain skin colour');assert(Math.abs(skinWeight.getX(i)+skinWeight.getY(i)+skinWeight.getZ(i)+skinWeight.getW(i)-1)<.001);}
 });
 const head=g.scene.getObjectByName('Head'),rig=createResidentExpressionRig({head,skinColor:0xc58f6c,hairColor:0x443322});updateResidentExpressionRig(rig,residentExpressionState({now:0}));g.scene.updateMatrixWorld(true);
 const glint=rig.leftGlint.getWorldPosition(new THREE.Vector3()),brow=rig.leftBrow.getWorldPosition(new THREE.Vector3());
 // Exported eyes are at y=1.89 facing +Z; original accents were at y=1.67 behind the skull.
 assert(glint.z>.30&&glint.z<.40&&glint.y>1.86&&glint.y<1.93,file+' glint must sit on actual front eye plane');
 assert(brow.y>1.98&&brow.y<2.10&&brow.z>.29,file+' brows must sit above exported eyes');
 assert.equal(rig.faceFocus.visible,false,'no extra cheek/nose accent geometry');assert.equal(rig.leftBrow.visible,false,'minimal face omits block brows');
 const before=rig.group.children.length;roundResidentAsset(g);assert.equal(rig.group.children.length,before,'reapplying shape rebuild is idempotent');
}
assert(rebuilt>=3);
console.log('PASS: frame-rate-independent acceleration/release/jump; all six actual GLBs retain nonblack skull colours and normalized weights, with face accents on the exported front eye plane. CPU checks, not a rendered playtest.');
