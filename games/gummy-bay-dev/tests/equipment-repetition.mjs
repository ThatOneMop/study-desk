import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DOMESTIC_WORKPLACE_PROFILES,EQUIPMENT_REPETITION_SLOTS,equipmentRepetitionState,createDomesticWorkplace} from '../dist/domestic-workplace.mjs?v=94';

assert.deepEqual(EQUIPMENT_REPETITION_SLOTS,['can','trimmers','pack','mixer']);
assert(Object.isFrozen(EQUIPMENT_REPETITION_SLOTS));
for(const profile of DOMESTIC_WORKPLACE_PROFILES){
 assert.equal(profile.slots.length,4);assert.equal(profile.railWidth,3.2);assert.equal(profile.slotSpacing,.72);
 assert.deepEqual(profile.slots.map(({slot})=>slot),EQUIPMENT_REPETITION_SLOTS);
 for(let i=1;i<profile.slots.length;i++)assert(Math.abs(profile.slots[i].x-profile.slots[i-1].x-.72)<1e-12,'slot centres repeat at an exact interval');
}

assert.deepEqual(equipmentRepetitionState({active:true,room:true,home:2,can:true,trimmers:true,packStation:true,mixer:true}),{visible:true,home:2,owned:{can:true,trimmers:true,pack:true,mixer:true},key:'2|1|1|1|1'});
for(const invalid of [{active:false,room:true,home:0},{active:true,room:false,home:0},{active:true,room:true,home:-1},{active:true,room:true,home:3}])assert.equal(equipmentRepetitionState(invalid).visible,false);

const scene=new THREE.Scene(),layer=createDomesticWorkplace({scene}),matrix=new THREE.Matrix4();
const visible=(mesh,index)=>{mesh.getMatrixAt(index,matrix);return Math.abs(matrix.determinant())>1e-12;};
const selected=(mesh,predicate)=>mesh.userData.items.map((item,index)=>predicate(item)?visible(mesh,index):null).filter(value=>value!==null);
const assertView=(home,owned)=>{
 for(const mesh of [layer.boxMesh,layer.jarMesh])for(const [index,item] of mesh.userData.items.entries())if(item.home>=0){const expected=item.home===home&&(item.slot==='rail'||owned[item.slot]);assert.equal(visible(mesh,index),expected,`${item.slot} part in home ${item.home} matches active ownership`);}
};

assert.equal(layer.drawCalls,2);assert.deepEqual(layer.counts,{homes:3,rails:3,slots:12,boxes:51,jars:24,colliders:0});
assert([layer.boxMesh,layer.jarMesh].every(mesh=>selected(mesh,item=>item.home>=0).every(value=>!value)),'no equipment leaks into an inactive or unrented view');
layer.update({active:true,room:true,home:0,can:true,trimmers:false,packStation:true,mixer:false});assertView(0,{can:true,trimmers:false,pack:true,mixer:false});
const resources=[layer.boxMesh,layer.jarMesh].map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]);
layer.update({active:true,room:true,home:2,can:false,trimmers:true,packStation:false,mixer:true});assertView(2,{can:false,trimmers:true,pack:false,mixer:true});
assert.deepEqual([layer.boxMesh,layer.jarMesh].map(mesh=>[mesh,mesh.geometry,mesh.material,mesh.instanceMatrix,mesh.instanceColor]),resources,'home/ownership changes reuse the same two batches');
assert([layer.boxMesh,layer.jarMesh].every(mesh=>selected(mesh,item=>item.home<0).every(Boolean)),'existing boards and shelf jars stay visible across equipment updates');

console.log('PASS: three production homes share exact four-slot rails and only the active home’s owned can, trimmers, pack and mixer silhouettes expand from the same two instance batches. CPU matrices only; no rendered wall-spacing, day/night or live-co-op claim.');
