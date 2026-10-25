import * as THREE from './vendor/three.module.min.js';
import {stockDisplay} from './stock-display.mjs?v=28';
import {townRoleColor} from './town-palette.mjs?v=76';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const PRODUCTION_CONTAINER_HOMES=freezeRecords([
 {id:'room-04',label:'Room 04',x:-25,z:40},
 {id:'harbor-workshop',label:'Old Harbor workshop',x:-54,z:55},
 {id:'hillside-house',label:'Hillside house',x:54,z:51}
]);
export const PRODUCTION_STAGES=freezeRecords([
 {id:'harvest',label:'Harvest basket',inventory:'raw',shape:'basket',offset:-1.18},
 {id:'shape',label:'Loose gummy mould',inventory:'gummies',shape:'tray',offset:0},
 {id:'pack',label:'Finished pack caddy',inventory:'packs',shape:'caddy',offset:1.18}
]);
export const PRODUCTION_CONTAINER_COLLIDERS=Object.freeze([]);

const finite=n=>Number.isFinite(n);
export function productionContainerProfile(home,index=0){
 if(!home||typeof home.id!=='string'||!home.id||typeof home.label!=='string'||!home.label||![home.x,home.z,index].every(finite))return null;
 const table=Object.freeze({x:home.x+7,z:home.z+3,y:1.31,w:4.2,d:1.4}),stages=Object.freeze(PRODUCTION_STAGES.map(stage=>Object.freeze({...stage,x:table.x+stage.offset,z:table.z})));
 return Object.freeze({...home,index,table,stages,decorativeOnly:true});
}
export const PRODUCTION_CONTAINER_PROFILES=Object.freeze(PRODUCTION_CONTAINER_HOMES.map((home,index)=>productionContainerProfile(home,index)));

export function productionContainersOnTable(profile,margin=.08){
 if(!profile||![profile.table?.x,profile.table?.z,profile.table?.w,profile.table?.d,profile.table?.y,margin].every(finite)||margin<0||!Array.isArray(profile.stages))return false;
 return profile.stages.every(stage=>Math.abs(stage.x-profile.table.x)+.46<=profile.table.w/2-margin&&Math.abs(stage.z-profile.table.z)+.48<=profile.table.d/2-margin);
}

const freezePreview=preview=>Object.freeze({total:preview.total,hidden:preview.hidden,flavours:preview.flavours,slots:Object.freeze(preview.slots.slice())});
export function productionContainerState(state={}){
 const home=Number.isInteger(state.home)?state.home:-1,visible=!!state.active&&!!state.room&&home>=0&&home<PRODUCTION_CONTAINER_HOMES.length;
 const stages=Object.freeze({
  harvest:freezePreview(stockDisplay(state.raw,3)),
  shape:freezePreview(stockDisplay(state.gummies,3)),
  pack:freezePreview(stockDisplay(state.packs,3))
 });
 return Object.freeze({visible,home:visible?home:-1,stages,key:[visible?home:-1,...Object.values(stages).flatMap(stage=>[stage.total,stage.hidden,...stage.slots])].join('|')});
}

function pushBox(list,home,stage,x,y,z,w,h,d,color,slot=-1){list.push({home,stage,x,y,z,w,h,d,color,slot});}
function pushRound(list,home,stage,x,y,z,r,h,color,slot=-1){list.push({home,stage,x,y,z,r,h,color,slot});}
function buildParts(profile,boxes,cylinders,spheres){
 const wood=townRoleColor('wood'),dark=townRoleColor('darkMetal'),cream=0xe5d7b4,steel=0x72817e;
 for(const stage of profile.stages){
  const x=stage.x,z=stage.z,home=profile.index;
  if(stage.id==='harvest'){
   pushBox(boxes,home,stage.id,x,1.35,z,.84,.08,.82,wood);
   for(const side of [-1,1]){pushBox(boxes,home,stage.id,x+side*.41,1.52,z,.08,.42,.82,wood);pushBox(boxes,home,stage.id,x,1.52,z+side*.37,.74,.42,.08,wood);}
   for(let slot=0;slot<3;slot++)pushRound(cylinders,home,stage.id,x+(slot-1)*.22,1.55,z,.12,.34,cream,slot);
  }else if(stage.id==='shape'){
   pushBox(boxes,home,stage.id,x,1.35,z,.9,.08,.86,steel);
   for(const side of [-1,1]){pushBox(boxes,home,stage.id,x+side*.43,1.43,z,.06,.16,.86,dark);pushBox(boxes,home,stage.id,x,1.43,z+side*.41,.8,.16,.06,dark);}
   for(let slot=0;slot<3;slot++)pushRound(spheres,home,stage.id,x+(slot-1)*.24,1.5,z,.13,.18,cream,slot);
  }else{
   pushBox(boxes,home,stage.id,x,1.36,z,.84,.1,.8,steel);
   pushBox(boxes,home,stage.id,x,1.62,z+.36,.84,.42,.08,steel);
   for(const side of [-1,1])pushBox(boxes,home,stage.id,x+side*.39,1.52,z,.08,.32,.72,steel);
   pushBox(boxes,home,stage.id,x,1.43,z-.33,.7,.2,.08,dark);
   for(let slot=0;slot<3;slot++)pushBox(boxes,home,stage.id,x+(slot-1)*.22,1.6,z,.18,.34,.08,cream,slot);
  }
 }
}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92,metalness:0,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),matrix=new THREE.Object3D(),color=new THREE.Color();
 mesh.userData.items=items;for(let i=0;i<items.length;i++){const item=items[i];matrix.position.set(item.x,item.y,item.z);matrix.scale.set(item.w??item.r*2,item.h,item.d??item.r*2);matrix.updateMatrix();mesh.setMatrixAt(i,matrix.matrix);mesh.setColorAt(i,color.setHex(item.color));}
 mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}
function updateBatch(mesh,view,colors){
 const matrix=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<mesh.userData.items.length;i++){const item=mesh.userData.items[i],stage=view.stages[item.stage],show=view.visible&&item.home===view.home&&(item.slot<0||item.slot<stage.slots.length);
  matrix.position.set(item.x,item.y,item.z);matrix.scale.set(show?(item.w??item.r*2):0,show?item.h:0,show?(item.d??item.r*2):0);matrix.updateMatrix();mesh.setMatrixAt(i,matrix.matrix);
  const type=item.slot>=0?stage.slots[item.slot]:-1,stageColor=type>=0&&finite(colors?.[type])?colors[type]:item.color;mesh.setColorAt(i,color.setHex(stageColor));
 }
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
}

export function createProductionContainers({scene,homes=PRODUCTION_CONTAINER_HOMES,quality='balanced'}={}){
 if(!scene||!Array.isArray(homes))throw new TypeError('Production containers need a scene and home records.');
 const profiles=(homes===PRODUCTION_CONTAINER_HOMES?PRODUCTION_CONTAINER_PROFILES:homes.map((home,index)=>productionContainerProfile(home,index))).filter(profile=>profile&&productionContainersOnTable(profile)),boxes=[],cylinders=[],spheres=[];
 for(const profile of profiles)buildParts(profile,boxes,cylinders,spheres);
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),cylinderMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,10),cylinders),sphereMesh=makeBatch(scene,new THREE.SphereGeometry(1,10,7),spheres);
 let current=productionContainerState();const update=(state,colors=[])=>{const next=productionContainerState(state);if(next.key!==current.key){current=next;for(const mesh of [boxMesh,cylinderMesh,sphereMesh])updateBatch(mesh,current,colors);}return current;};
 for(const mesh of [boxMesh,cylinderMesh,sphereMesh])updateBatch(mesh,current,[]);
 const setQuality=q=>{for(const mesh of [boxMesh,cylinderMesh,sphereMesh])mesh.visible=true;boxMesh.castShadow=q!=='performance';cylinderMesh.castShadow=q==='high';sphereMesh.castShadow=q==='high';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,cylinderMesh,sphereMesh,update,snapshot:()=>current,setQuality,drawCalls:3,counts:Object.freeze({homes:profiles.length,stages:profiles.length*3,boxes:boxes.length,cylinders:cylinders.length,spheres:spheres.length,colliders:0})});
}
