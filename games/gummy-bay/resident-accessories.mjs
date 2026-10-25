import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const RESIDENT_ACCESSORY_PROFILES=freezeRecords([
 {type:'reception',label:'key visor',style:'visor',primary:0x496967,accent:0xd8bd74},
 {type:'dealer',label:'sprout cap',style:'sprout-cap',primary:0x6e8755,accent:0xb8cf72},
 {type:'hardware',label:'work earmuffs',style:'earmuffs',primary:0x5b625d,accent:0xc48258},
 {type:'store',label:'parcel beanie',style:'beanie',primary:0x51798a,accent:0xe1c986},
 {type:'laundry',label:'knotted wrap',style:'head-wrap',primary:0x6f9b9d,accent:0xf0e3c4},
 {type:'property',label:'lettings hat',style:'wide-brim',primary:0x6b7652,accent:0xd4aa66},
 {type:'helpers',label:'roster clip',style:'side-clip',primary:0x766c91,accent:0xe0cd98},
 {type:'servo',label:'service helmet',style:'hard-hat',primary:0x68765f,accent:0xd8914e}
]);
export const RESIDENT_ACCESSORY_COLLIDERS=Object.freeze([]);

const hairBox=(x,y,z,w,h,d,rz=0)=>Object.freeze({kind:'box',x,y,z,w,h,d,rz});
const hairRound=(kind,x,y,z,r,h=0,rz=0)=>Object.freeze({kind,x,y,z,r,h,rz});
export const RESIDENT_HAIRSTYLE_PROFILES=freezeRecords([
 {id:0,label:'swept crop',parts:Object.freeze([hairBox(0,.56,.05,.56,.12,.44),hairBox(-.18,.66,-.04,.22,.14,.18,-.28),hairBox(.12,.64,-.05,.28,.11,.18,.12)])},
 {id:1,label:'side part',parts:Object.freeze([hairRound('cylinder',0,.6,.06,.34,.15),hairBox(-.31,.62,.07,.14,.3,.34,-.18),hairBox(.12,.7,-.08,.34,.08,.2,.18)])},
 {id:2,label:'sugar crest',parts:Object.freeze([hairBox(-.18,.68,.05,.15,.3,.2,-.24),hairBox(0,.76,.03,.17,.46,.2,0),hairBox(.18,.67,.05,.15,.28,.2,.24)])},
 {id:3,label:'harbor bun',parts:Object.freeze([hairRound('cylinder',0,.6,.07,.32,.15),hairRound('sphere',.28,.69,.2,.18),hairBox(-.14,.59,-.16,.25,.12,.1,-.12)])},
 {id:4,label:'tide curls',parts:Object.freeze([hairRound('cylinder',0,.61,.07,.32,.15),hairRound('cylinder',-.43,.54,.09,.1,.26),hairRound('cylinder',.43,.54,.09,.1,.26),hairRound('sphere',-.43,.4,.11,.115),hairRound('sphere',.43,.4,.11,.115)])}
]);
export const RESIDENT_HAIRSTYLE_COLLIDERS=Object.freeze([]);
const HAIR_FACE_WINDOW=Object.freeze({minX:-.3,maxX:.3,minY:.18,maxY:.45,minZ:-.46,maxZ:-.34});
export const RESIDENT_HAIRSTYLE_FACE_WINDOW=HAIR_FACE_WINDOW;
const baseHairGeometries={box:new THREE.SphereGeometry(.5,12,8).toNonIndexed(),cylinder:new THREE.CylinderGeometry(1,1,1,8).toNonIndexed(),sphere:new THREE.SphereGeometry(1,16,10).toNonIndexed()};
function mergedHairGeometry(parts){
 const positions=[],normals=[],position=new THREE.Vector3(),normal=new THREE.Vector3(),quaternion=new THREE.Quaternion(),matrix=new THREE.Matrix4(),normalMatrix=new THREE.Matrix3();
 for(const part of parts){
  const source=baseHairGeometries[part.kind],scale=part.kind==='box'?new THREE.Vector3(part.w,part.h,part.d):part.kind==='cylinder'?new THREE.Vector3(part.r,part.h,part.r):new THREE.Vector3(part.r,part.r,part.r);
  quaternion.setFromEuler(new THREE.Euler(0,0,part.rz||0));matrix.compose(new THREE.Vector3(part.x,part.y,part.z),quaternion,scale);normalMatrix.getNormalMatrix(matrix);
  const sourcePosition=source.getAttribute('position'),sourceNormal=source.getAttribute('normal');
  for(let i=0;i<sourcePosition.count;i++){position.fromBufferAttribute(sourcePosition,i).applyMatrix4(matrix);normal.fromBufferAttribute(sourceNormal,i).applyMatrix3(normalMatrix).normalize();positions.push(position.x,position.y,position.z);normals.push(normal.x,normal.y,normal.z);}
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}
const HAIR_GEOMETRIES=RESIDENT_HAIRSTYLE_PROFILES.map(profile=>mergedHairGeometry(profile.parts)),hairMaterials=new Map();
function hairMaterial(color){color=Number.isFinite(color)?color:0x4c4034;if(!hairMaterials.has(color))hairMaterials.set(color,new THREE.MeshStandardMaterial({color,roughness:.9,metalness:0,flatShading:false}));return hairMaterials.get(color);}
export function residentHairstyleProfile(id=0){id=Number.isFinite(id)?Math.abs(Math.trunc(id))%RESIDENT_HAIRSTYLE_PROFILES.length:0;return RESIDENT_HAIRSTYLE_PROFILES[id];}
// Face-local geometry: the eyes sit at y=.46, z=.356 relative to Head.
// Keep the mouth gap open and reuse these meshes across both animation LODs.
export const FACIAL_HAIR_STYLES=Object.freeze(['clean shaven','moustache','chin beard','sideburns','short beard']);
const beardParts=[[],
 [hairBox(-.065,.305,.302,.13,.045,.05,-.12),hairBox(.065,.305,.302,.13,.045,.05,.12)],
 [hairBox(0,.205,.245,.16,.11,.075)],
 [hairBox(-.285,.34,.13,.055,.17,.08,-.15),hairBox(.285,.34,.13,.055,.17,.08,.15)],
 [hairBox(0,.19,.23,.25,.09,.08),hairBox(-.18,.255,.215,.09,.15,.08,-.5),hairBox(.18,.255,.215,.09,.15,.08,.5)]
];
const beardGeometries=beardParts.map(parts=>parts.length?mergedHairGeometry(parts):null);
export function residentFacialHairStyle(id=0){return Math.abs(Math.trunc(Number.isFinite(id)?id:0))%7%5;}
export function createResidentHairstyleRig({head,id=0,hairColor}={}){
 if(!head||typeof head.add!=='function')throw new TypeError('A resident hairstyle needs an animated head.');
 const profile=residentHairstyleProfile(id),mesh=new THREE.Mesh(HAIR_GEOMETRIES[profile.id],hairMaterial(hairColor));mesh.name='ResidentHair-'+profile.label;mesh.castShadow=false;mesh.receiveShadow=false;mesh.frustumCulled=false;head.add(mesh);const style=residentFacialHairStyle(id);let facialHair=null;if(style){facialHair=new THREE.Mesh(beardGeometries[style],hairMaterial(hairColor));facialHair.name='ResidentFacialHair-'+FACIAL_HAIR_STYLES[style];facialHair.frustumCulled=false;head.add(facialHair);}return Object.freeze({mesh,profile,facialHair});
}
export function residentHairstyleResources(){return Object.freeze({geometries:HAIR_GEOMETRIES,materialCount:hairMaterials.size,faceWindow:HAIR_FACE_WINDOW});}

export function residentAccessoryProfile(type){
 if(typeof type!=='string')return null;
 return RESIDENT_ACCESSORY_PROFILES.find(profile=>profile.type===type)||null;
}
const box=(part,x,y,z,w,h,d,color,rz=0)=>Object.freeze({kind:'box',part,x,y,z,w,h,d,color,rz});
const round=(part,x,y,z,r,h,color,rx=0)=>Object.freeze({kind:'cylinder',part,x,y,z,r,h,color,rx});
export function residentAccessoryParts(type){
 const p=residentAccessoryProfile(type);if(!p)return Object.freeze([]);
 let parts=[];
 if(p.style==='visor')parts=[box('crown-band',0,2.13,0,.72,.09,.5,p.primary),box('brow-brim',0,2.075,.23,.62,.05,.42,p.accent),round('left-key-pin',-.35,2.13,.03,.07,.05,p.accent,Math.PI/2),round('right-key-pin',.35,2.13,.03,.07,.05,p.accent,Math.PI/2)];
 if(p.style==='sprout-cap')parts=[round('soft-crown',0,2.19,-.02,.32,.25,p.primary),box('leaf-brim',0,2.075,.25,.56,.05,.42,p.accent),box('left-sprout',-.1,2.4,.01,.11,.26,.05,p.accent,-.55),box('right-sprout',.1,2.4,.01,.11,.26,.05,p.accent,.55)];
 if(p.style==='earmuffs')parts=[box('top-band',0,2.2,0,.57,.08,.22,p.primary),box('left-arm',-.35,2.04,0,.08,.3,.18,p.primary,-.25),box('right-arm',.35,2.04,0,.08,.3,.18,p.primary,.25),round('left-cup',-.48,1.91,0,.12,.16,p.accent,Math.PI/2),round('right-cup',.48,1.91,0,.12,.16,p.accent,Math.PI/2)];
 if(p.style==='beanie')parts=[round('knit-crown',0,2.19,-.02,.31,.3,p.primary),box('folded-band',0,2.09,.02,.66,.1,.48,p.accent),round('top-pom',0,2.42,-.02,.1,.12,p.accent),box('parcel-tab',.18,2.1,.265,.13,.07,.03,p.primary)];
 if(p.style==='head-wrap')parts=[box('wrap-band',0,2.1,0,.72,.11,.5,p.primary),box('left-knot',-.08,2.25,.05,.17,.22,.12,p.accent,-.6),box('right-knot',.08,2.25,.05,.17,.22,.12,p.accent,.6),round('knot-pin',0,2.22,.08,.08,.07,p.accent,Math.PI/2)];
 if(p.style==='wide-brim')parts=[box('wide-brim',0,2.12,.02,.9,.055,.72,p.primary),round('hat-crown',0,2.27,-.02,.32,.26,p.primary),box('document-ribbon',0,2.18,.25,.62,.07,.035,p.accent),round('brass-badge',.22,2.19,.28,.05,.03,p.accent,Math.PI/2)];
 if(p.style==='side-clip')parts=[box('roster-band',0,2.1,0,.7,.09,.48,p.primary),box('side-tab',.34,2.22,.03,.12,.28,.07,p.accent,.3),box('roster-card',.4,2.04,.04,.12,.16,.04,p.accent),round('clip-fastener',.35,2.17,.08,.045,.025,p.primary,Math.PI/2)];
 if(p.style==='hard-hat')parts=[round('helmet-shell',0,2.21,-.03,.35,.28,p.primary),box('safety-brim',0,2.09,.26,.7,.055,.42,p.accent),box('centre-rib',0,2.36,-.02,.07,.22,.42,p.accent),round('left-bolt',-.32,2.15,.03,.045,.04,p.accent,Math.PI/2),round('right-bolt',.32,2.15,.03,.045,.04,p.accent,Math.PI/2)];
 return Object.freeze(parts);
}

export function selectResidentAccessories(points){
 if(!Array.isArray(points))return Object.freeze([]);
 const seen=new Set(),entries=[];
 for(const point of points){
  const profile=residentAccessoryProfile(point?.type),actor=point?.actor;
  if(!profile||!actor||typeof actor.updateMatrixWorld!=='function'||seen.has(actor))continue;
  seen.add(actor);entries.push(Object.freeze({type:profile.type,label:profile.label,actor,profile,parts:residentAccessoryParts(profile.type)}));
 }
 return Object.freeze(entries);
}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.82,metalness:0,vertexColors:true,flatShading:false}),mesh=new THREE.InstancedMesh(geometry,material,items.length),color=new THREE.Color();
 mesh.userData.items=items;for(let i=0;i<items.length;i++)mesh.setColorAt(i,color.setHex(items[i].part.color));
 mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;scene.add(mesh);return mesh;
}
function updateBatch(mesh,active,heads){
 const local=new THREE.Object3D(),world=new THREE.Matrix4();
 for(let i=0;i<mesh.userData.items.length;i++){
  const item=mesh.userData.items[i],part=item.part;item.actor.updateMatrixWorld(true);
  const head=heads.get(item.actor),shown=active&&head!==false;local.position.set(part.x,part.y-(head?1.43:0),part.z);local.rotation.set(part.rx||0,part.ry||0,part.rz||0);local.scale.set(shown?(part.w??part.r*2):0,shown?part.h:0,shown?(part.d??part.r*2):0);local.updateMatrix();
  world.multiplyMatrices(head?head.matrixWorld:item.actor.matrixWorld,local.matrix);mesh.setMatrixAt(i,world);
 }
 mesh.instanceMatrix.needsUpdate=true;
}
export function createResidentAccessories({scene,points,quality='balanced'}={}){
 if(!scene||!Array.isArray(points))throw new TypeError('Resident accessories need a scene and authored interaction points.');
 const entries=selectResidentAccessories(points),boxes=[],cylinders=[];
 for(const entry of entries)for(const part of entry.parts)(part.kind==='box'?boxes:cylinders).push({actor:entry.actor,type:entry.type,part});
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),cylinderMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,10),cylinders);
 const update=({active=true}={})=>{const heads=new Map();for(const entry of entries){const body=entry.actor.children.find(child=>child.visible&&child.getObjectByName('Head'));heads.set(entry.actor,body?.getObjectByName('Head')||(entry.actor.getObjectByName('Head')?false:null));entry.actor.updateMatrixWorld(true);}updateBatch(boxMesh,!!active,heads);updateBatch(cylinderMesh,!!active,heads);return !!active;};
 const setQuality=q=>{boxMesh.visible=true;cylinderMesh.visible=true;boxMesh.castShadow=q!=='performance';cylinderMesh.castShadow=q==='high';};
 update({active:false});setQuality(quality);
 return Object.freeze({entries,boxMesh,cylinderMesh,update,setQuality,drawCalls:2,counts:Object.freeze({actors:entries.length,styles:new Set(entries.map(entry=>entry.profile.style)).size,boxes:boxes.length,cylinders:cylinders.length,colliders:0})});
}
