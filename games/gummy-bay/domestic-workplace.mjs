import * as THREE from './vendor/three.module.min.js';
import {townRoleColor} from './town-palette.mjs?v=76';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const DOMESTIC_WORKPLACE_HOMES=freezeRecords([
 {id:'room-04-ledger',label:'Room 04 recipe ledger',x:-25,z:40,w:18,d:17,board:0x766b55,notes:Object.freeze([0xe2d39f,0x9bb6a0,0xc58b72])},
 {id:'harbor-tide-board',label:'Old Harbor tide board',x:-54,z:55,w:24,d:20,board:0x607472,notes:Object.freeze([0xa8c2bd,0xe1c58f,0xb88b79])},
 {id:'hillside-orders-board',label:'Hillside household orders',x:54,z:51,w:27,d:22,board:0x6d765e,notes:Object.freeze([0xd9c99a,0x96ad82,0xc29a7a])}
]);
export const DOMESTIC_WORKPLACE_COLLIDERS=Object.freeze([]);
export const EQUIPMENT_REPETITION_SLOTS=Object.freeze(['can','trimmers','pack','mixer']);

const finite=n=>Number.isFinite(n);
export function domesticWorkplaceProfile(home,index=0){
 if(!home||typeof home.id!=='string'||!home.id||typeof home.label!=='string'||!home.label||!Array.isArray(home.notes)||home.notes.length!==3||![home.x,home.z,home.w,home.d,index,...home.notes].every(finite)||home.w<8||home.d<8)return null;
 const anchorX=home.x-home.w*.22,railX=home.x+home.w*.22,wallZ=home.z-home.d/2+.16,boardWidth=2.8,boardHeight=.95,shelfWidth=2.2,railWidth=3.2,slotSpacing=.72,lowestY=1.48,frontEdge=wallZ+.3;
 const inside=Math.min(anchorX-boardWidth/2,railX-railWidth/2)>=home.x-home.w/2+.1&&Math.max(anchorX+boardWidth/2,railX+railWidth/2)<=home.x+home.w/2-.1&&frontEdge<=home.z+home.d/2-.1&&wallZ>=home.z-home.d/2;
 if(!inside)return null;
 const slots=Object.freeze(EQUIPMENT_REPETITION_SLOTS.map((slot,i)=>Object.freeze({slot,x:railX+(i-1.5)*slotSpacing,y:1.92,z:wallZ+.2})));
 return Object.freeze({...home,index,anchorX,railX,wallZ,boardWidth,boardHeight,shelfWidth,railWidth,slotSpacing,slots,lowestY,frontEdge,inside,decorativeOnly:true});
}
export const DOMESTIC_WORKPLACE_PROFILES=Object.freeze(DOMESTIC_WORKPLACE_HOMES.map((home,index)=>domesticWorkplaceProfile(home,index)));

export function domesticPanelInsideHome(profile,margin=.1){
 if(!profile||![profile.anchorX,profile.railX,profile.wallZ,profile.boardWidth,profile.railWidth,profile.x,profile.z,profile.w,profile.d,margin].every(finite)||margin<0)return false;
 return Math.min(profile.anchorX-profile.boardWidth/2,profile.railX-profile.railWidth/2)>=profile.x-profile.w/2+margin&&Math.max(profile.anchorX+profile.boardWidth/2,profile.railX+profile.railWidth/2)<=profile.x+profile.w/2-margin&&profile.wallZ>=profile.z-profile.d/2&&profile.frontEdge<=profile.z+profile.d/2-margin;
}

export function equipmentRepetitionState(state={}){
 const home=Number.isInteger(state.home)&&state.home>=0&&state.home<DOMESTIC_WORKPLACE_HOMES.length?state.home:-1,visible=!!state.active&&!!state.room&&home>=0;
 const owned=Object.freeze({can:!!state.can,trimmers:!!state.trimmers,pack:!!state.packStation,mixer:!!state.mixer});
 return Object.freeze({visible,home:visible?home:-1,owned,key:[visible?home:-1,...EQUIPMENT_REPETITION_SLOTS.map(slot=>Number(owned[slot]))].join('|')});
}

function pushBox(list,x,y,z,w,h,d,color,home=-1,slot=null,rz=0){list.push({x,y,z,w,h,d,color,home,slot,rz});}
function pushCylinder(list,x,y,z,r,h,color,home=-1,slot=null,rx=0){list.push({x,y,z,r,h,color,home,slot,rx});}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.94,metalness:0,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 mesh.userData.items=items;for(let i=0;i<items.length;i++){const part=items[i];object.position.set(part.x,part.y,part.z);object.rotation.set(part.rx||0,0,part.rz||0);object.scale.set(part.w??part.r*2,part.h,part.d??part.r*2);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}
function updateBatch(mesh,view){
 const object=new THREE.Object3D();
 for(let i=0;i<mesh.userData.items.length;i++){const part=mesh.userData.items[i],show=part.home<0||view.visible&&part.home===view.home&&(part.slot==='rail'||view.owned[part.slot]);
  object.position.set(part.x,part.y,part.z);object.rotation.set(part.rx||0,0,part.rz||0);object.scale.set(show?(part.w??part.r*2):0,show?part.h:0,show?(part.d??part.r*2):0);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);
 }
 mesh.instanceMatrix.needsUpdate=true;
}

export function createDomesticWorkplace({scene,homes=DOMESTIC_WORKPLACE_HOMES,quality='balanced'}={}){
 if(!scene||!Array.isArray(homes))throw new TypeError('Domestic workplace dressing needs a scene and home records.');
 const profiles=(homes===DOMESTIC_WORKPLACE_HOMES?DOMESTIC_WORKPLACE_PROFILES:homes.map((home,index)=>domesticWorkplaceProfile(home,index))).filter(profile=>profile&&domesticPanelInsideHome(profile)),boxes=[],jars=[];
 for(const p of profiles){
  const front=p.wallZ+.15,frame=townRoleColor('wood');
  pushBox(boxes,p.anchorX,2.18,p.wallZ,p.boardWidth,p.boardHeight,.055,p.board);
  pushBox(boxes,p.anchorX,2.68,front,p.boardWidth+.18,.06,.08,frame);pushBox(boxes,p.anchorX,1.68,front,p.boardWidth+.18,.06,.08,frame);
  for(const side of [-1,1])pushBox(boxes,p.anchorX+side*(p.boardWidth/2+.06),2.18,front,.06,p.boardHeight+.06,.08,frame);
  for(let i=0;i<3;i++)pushBox(boxes,p.anchorX+(i-1)*.82,2.22,front+.055,.55,.3,.025,p.notes[i]);
  pushBox(boxes,p.anchorX,1.52,p.wallZ+.3,p.shelfWidth,.08,.32,townRoleColor('wood'));
  for(const side of [-1,1])pushCylinder(jars,p.anchorX+side*.62,1.74,p.wallZ+.3,.16,.36,side<0?p.notes[0]:p.notes[1]);
  pushBox(boxes,p.railX,2.3,p.wallZ+.15,p.railWidth,.14,.1,townRoleColor('darkMetal'),p.index,'rail');
  for(const entry of p.slots)pushCylinder(jars,entry.x,2.3,p.wallZ+.22,.055,.16,townRoleColor('darkMetal'),p.index,'rail',Math.PI/2);
  const [can,trimmers,pack,mixer]=p.slots;
  pushBox(boxes,can.x,1.91,can.z,.34,.42,.12,0x78a6a4,p.index,'can');pushCylinder(jars,can.x,2.13,can.z+.01,.17,.08,0xa6c4bd,p.index,'can',Math.PI/2);
  pushBox(boxes,trimmers.x,1.92,trimmers.z,.08,.62,.08,0x6c7772,p.index,'trimmers',.55);pushBox(boxes,trimmers.x,1.92,trimmers.z+.015,.08,.62,.08,0xb58a62,p.index,'trimmers',-.55);
  pushBox(boxes,pack.x,1.92,pack.z,.44,.4,.1,0xb9a677,p.index,'pack');for(const side of [-1,1])pushBox(boxes,pack.x+side*.13,1.92,pack.z+.06,.035,.32,.025,0x6d7569,p.index,'pack');
  pushCylinder(jars,mixer.x,1.94,mixer.z,.17,.46,p.notes[1],p.index,'mixer');pushBox(boxes,mixer.x,2.2,mixer.z,.24,.08,.12,townRoleColor('darkMetal'),p.index,'mixer');
 }
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),jarMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,10),jars);
 let current=equipmentRepetitionState();const update=state=>{const next=equipmentRepetitionState(state);if(next.key!==current.key){current=next;updateBatch(boxMesh,current);updateBatch(jarMesh,current);}return current;};updateBatch(boxMesh,current);updateBatch(jarMesh,current);
 const setQuality=q=>{boxMesh.visible=true;jarMesh.visible=true;boxMesh.castShadow=q!=='performance';jarMesh.castShadow=q==='high';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,jarMesh,update,snapshot:()=>current,setQuality,drawCalls:2,counts:Object.freeze({homes:profiles.length,rails:profiles.length,slots:profiles.length*4,boxes:boxes.length,jars:jars.length,colliders:0})});
}
