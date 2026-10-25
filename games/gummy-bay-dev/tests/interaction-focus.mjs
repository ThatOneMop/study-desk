import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {focusScore,chooseInteraction} from '../dist/interaction-focus.mjs';
import {createResidentAccessories} from '../dist/resident-accessories.mjs';
const actor={x:0,z:0},front={x:0,z:-2},back={x:0,z:1},side={x:1,z:-2};
assert.equal(chooseInteraction([back,side,front],actor,0),front);assert.equal(chooseInteraction([front,back],actor,Math.PI),back);assert.equal(chooseInteraction([front],actor,0,null,()=>false),null);assert.equal(focusScore(back,actor,0),Infinity);assert.equal(focusScore({x:0,z:-3},actor,0),Infinity);assert(Number.isFinite(focusScore(actor,actor,1)));
const left={x:-.1,z:-2},right={x:.1,z:-2};assert.equal(chooseInteraction([right,left],actor,0,left),left,'small aiming fluctuations keep current target');assert.equal(chooseInteraction([right,left],actor,-.2,left),right,'deliberate turn changes target');
const scene=new THREE.Scene(),root=new THREE.Group(),high=new THREE.Group(),low=new THREE.Group();root.add(high,low);scene.add(root);high.scale.setScalar(.86);low.scale.setScalar(.86);low.visible=false;
for(const body of [high,low]){const head=new THREE.Bone();head.name='Head';head.position.y=1.43;body.add(head);}
const hats=createResidentAccessories({scene,points:[{type:'reception',actor:root}]});hats.update({active:true});const before=new THREE.Matrix4();hats.boxMesh.getMatrixAt(0,before);
high.getObjectByName('Head').rotation.z=.25;hats.update({active:true});const moved=new THREE.Matrix4();hats.boxMesh.getMatrixAt(0,moved);assert(!moved.equals(before),'visor follows animated head');
high.visible=false;low.visible=true;low.getObjectByName('Head').rotation.z=.25;hats.update({active:true});const lod=new THREE.Matrix4();hats.boxMesh.getMatrixAt(0,lod);assert(lod.equals(moved),'LOD preserves attachment pose');
low.visible=false;hats.update({active:true});hats.boxMesh.getMatrixAt(0,lod);const scale=new THREE.Vector3();lod.decompose(new THREE.Vector3(),new THREE.Quaternion(),scale);assert.equal(scale.length(),0,'culled characters do not leave floating hats');
console.log('PASS: front-facing reachable selection, stable focus, deliberate retargeting, head-attached hat matrices and LOD/culling behavior. CPU only.');
const {bufferedJump}=await import('../dist/player-view.mjs');
let jump=bufferedJump(0,true,false,true,.016);assert.equal(jump.queued,.12);assert(!jump.launch);jump=bufferedJump(jump.queued,false,true,true,.04);assert(jump.launch);assert.equal(jump.queued,0);assert(!bufferedJump(0,false,true,true,.016).launch,'held key does not repeat');assert(!bufferedJump(.03,false,true,true,.04).launch,'expired press does not jump later');assert.equal(bufferedJump(.1,false,true,false,.01).queued,0,'blocked/crouching clears pending press');
