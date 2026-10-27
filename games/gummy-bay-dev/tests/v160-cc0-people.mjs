import assert from 'node:assert/strict';import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import * as P from '../dist/cc0-people.mjs';
// Asset budget and licence record
const names=[...P.CC0_PEOPLE_VARIANTS,P.CC0_POLICE_VARIANT];let total=0;
const glbJson=f=>{const b=fs.readFileSync(f);const len=b.readUInt32LE(12);return JSON.parse(b.slice(20,20+len).toString('utf8'));};
for(const n of names){const f='dist/assets/people/people-'+n+'.glb';assert.ok(fs.existsSync(f),f);total+=fs.statSync(f).size;
 const j=glbJson(f);assert.equal(j.meshes.length,1,n+' one mesh');assert.equal(j.meshes[0].primitives.length,1,n+' one primitive = one draw call');
 assert.ok(j.meshes[0].primitives[0].attributes.COLOR_0!==undefined,n+' vertex colours');assert.equal(j.skins.length,1,n+' rigged');
 const clips=j.animations.map(a=>a.name);for(const c of ['Idle','Walk','Run'])assert.ok(clips.includes(c),n+' has '+c);
 assert.equal(j.materials.length,1,n+' single material');assert.ok(!j.images,n+' no textures');}
assert.ok(total<4e6,'people under 4 MB, got '+total);
const credits=fs.readFileSync('dist/CREDITS.md','utf8');assert.ok(/CC0/.test(credits)&&/Quaternius/.test(credits));
for(const n of names)assert.ok(credits.includes('people-'+n+'.glb'),'credited '+n);
assert.ok(!/schedule\s*i\b/i.test(credits.replace(/No assets from Schedule I/,'')),'no Schedule I asset references');
// Clip mapping
assert.equal(P.cc0Clip('Idle',0),'Idle');assert.equal(P.cc0Clip('Walk',1.3),'Walk');assert.equal(P.cc0Clip('Talk',0),'Idle');
assert.equal(P.cc0Clip('Walk',5),'Run');assert.equal(P.cc0Clip('Idle',0,'sit'),'Sit');assert.equal(P.cc0Clip(null,1.2,'walk'),'Walk');assert.equal(P.cc0Clip(null,0,'idle'),'Idle');
assert.equal(P.cc0Clip('Idle',6),'Idle','a standing actor never sprints from position noise');
// Budgets keep Low under the draw-call cap
assert.ok(P.cc0Budget('performance')<=10&&P.cc0Budget('balanced')<=16&&P.cc0Budget('high')<=24);
// Variant choice is stable and police get the uniform
assert.equal(P.cc0Variant(5),P.cc0Variant(5));assert.equal(P.cc0Variant(5,true),'police');
assert.ok(new Set(Array.from({length:40},(_,i)=>P.cc0Variant(i))).size>=6,'varied cast');
// Picking: nearest first, out-of-range and behind-camera people skipped
const cam=new THREE.PerspectiveCamera();cam.position.set(0,1.6,0);cam.lookAt(0,1.6,-10);cam.updateMatrixWorld(true);
const cands=[{key:'a',x:0,z:-5},{key:'b',x:0,z:-2},{key:'c',x:0,z:20},{key:'d',x:0,z:-200},{key:'e',x:1,z:-8}];
assert.deepEqual(P.cc0Pick(cands,cam,2,46).map(c=>c.key),['b','a']);
assert.deepEqual(P.cc0Pick(cands,cam,9,46).map(c=>c.key),['b','a','e']);
// Runtime without a loader stays inert (chunky cast keeps drawing everyone)
const scene=new THREE.Scene();const rig=P.createCc0People({THREE,scene,GLTFLoader:null});await rig.loaded;
assert.equal(rig.ready,false);assert.equal(rig.update({dt:.1,camera:cam,candidates:cands}).size,0);
console.log('PASS: v160 CC0 rigged townsfolk · '+names.length+' models, '+(total/1e6).toFixed(2)+' MB, one draw call each, Low budget '+P.cc0Budget('performance'));
