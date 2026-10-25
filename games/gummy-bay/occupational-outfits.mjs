import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const OCCUPATIONAL_OUTFIT_PROFILES=freezeRecords([
 {type:'reception',label:'motel reception',base:0x547f7d,accent:0xd6bd79,style:'lanyard'},
 {type:'dealer',label:'seed grower',base:0x657f51,accent:0xc7d995,style:'leaf-pocket'},
 {type:'hardware',label:'hardware fitter',base:0x9a654b,accent:0x4f5d59,style:'tool-belt'},
 {type:'store',label:'packaging clerk',base:0x537f91,accent:0xe1ca91,style:'striped-apron'},
 {type:'laundry',label:'laundry banker',base:0x5f9195,accent:0xeee4c8,style:'long-apron'},
 {type:'property',label:'property agent',base:0x6c7b55,accent:0xd0ad72,style:'document-vest'},
 {type:'helpers',label:'staff coordinator',base:0x766b91,accent:0xe0cf9d,style:'roster-sash'},
 {type:'servo',label:'servo attendant',base:0x697761,accent:0xd89b55,style:'safety-vest'}
]);
export const OCCUPATIONAL_OUTFIT_COLLIDERS=Object.freeze([]);

const finite=n=>Number.isFinite(n);
export function occupationOutfitProfile(type){
 if(typeof type!=='string')return null;
 return OCCUPATIONAL_OUTFIT_PROFILES.find(profile=>profile.type===type)||null;
}

const box=(part,x,y,z,w,h,d,color,rz=0)=>Object.freeze({kind:'box',part,x,y,z,w,h,d,color,rz});
const round=(part,x,y,z,r,h,color,rx=Math.PI/2)=>Object.freeze({kind:'cylinder',part,x,y,z,r,h,color,rx});
export function occupationOutfitParts(type){
 const p=occupationOutfitProfile(type);if(!p)return Object.freeze([]);
 const parts=[
  box('bib',0,1.02,.235,.43,.48,.035,p.base),
  box('waist',0,.79,.22,.52,.07,.045,p.accent),
  box('left-strap',-.16,1.27,.21,.065,.38,.035,p.base,-.08),
  box('right-strap',.16,1.27,.21,.065,.38,.035,p.base,.08)
 ];
 if(p.style==='lanyard'){parts.push(box('key-card',.12,.98,.265,.13,.17,.025,p.accent),round('lanyard-ring',0,1.18,.25,.055,.018,p.accent));}
 if(p.style==='leaf-pocket'){parts.push(box('seed-pocket',-.13,.91,.267,.2,.18,.028,p.accent),round('leaf-mark',.13,1.08,.265,.075,.02,p.accent));}
 if(p.style==='tool-belt'){parts.push(box('left-pouch',-.2,.73,.245,.17,.22,.07,p.base),box('right-pouch',.2,.73,.245,.17,.22,.07,p.base),round('metal-rivet',0,.8,.27,.07,.02,0xb7b59e));}
 if(p.style==='striped-apron'){parts.push(box('centre-stripe',0,1.02,.26,.09,.45,.022,p.accent),box('double-pocket',-.13,.9,.275,.18,.16,.025,p.accent),box('double-pocket',.13,.9,.275,.18,.16,.025,p.accent));}
 if(p.style==='long-apron'){parts[0]=box('long-bib',0,.94,.235,.45,.65,.035,p.base);parts.push(box('clean-pocket',0,.86,.27,.27,.19,.025,p.accent),round('soap-mark',0,1.15,.265,.07,.02,p.accent));}
 if(p.style==='document-vest'){parts[0]=box('left-panel',-.13,1.04,.235,.18,.5,.035,p.base);parts.push(box('right-panel',.13,1.04,.235,.18,.5,.035,p.base),box('document-pocket',.13,.91,.27,.18,.2,.03,p.accent),round('brass-pin',-.12,1.15,.265,.055,.02,p.accent));}
 if(p.style==='roster-sash'){parts.push(box('sash',0,1.06,.263,.09,.58,.026,p.accent,.3),box('roster-pocket',-.13,.88,.27,.2,.2,.03,p.accent),round('crew-mark',.14,1.14,.265,.065,.02,p.accent));}
 if(p.style==='safety-vest'){parts.push(box('upper-reflector',0,1.12,.263,.43,.055,.022,p.accent),box('lower-reflector',0,.91,.263,.43,.055,.022,p.accent),box('side-pocket',.16,.82,.27,.16,.16,.03,p.accent));}
 return Object.freeze(parts);
}

export function selectOccupationalActors(points){
 if(!Array.isArray(points))return Object.freeze([]);
 const seen=new Set(),entries=[];
 for(const point of points){
  const profile=occupationOutfitProfile(point?.type),actor=point?.actor;
  if(!profile||!actor||typeof actor.updateMatrixWorld!=='function'||seen.has(actor))continue;
  seen.add(actor);entries.push(Object.freeze({type:profile.type,label:profile.label,actor,profile,parts:occupationOutfitParts(profile.type)}));
 }
 return Object.freeze(entries);
}

function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.88,metalness:0,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),color=new THREE.Color();
 mesh.userData.items=items;for(let i=0;i<items.length;i++)mesh.setColorAt(i,color.setHex(items[i].part.color));
 mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;scene.add(mesh);return mesh;
}
function updateBatch(mesh,active){
 const local=new THREE.Object3D(),world=new THREE.Matrix4();
 for(let i=0;i<mesh.userData.items.length;i++){
  const item=mesh.userData.items[i],part=item.part;item.actor.updateMatrixWorld(true);
  local.position.set(part.x,part.y,part.z);local.rotation.set(part.rx||0,part.ry||0,part.rz||0);local.scale.set(active?(part.w??part.r*2):0,active?part.h:0,active?(part.d??part.r*2):0);local.updateMatrix();
  world.multiplyMatrices(item.actor.matrixWorld,local.matrix);mesh.setMatrixAt(i,world);
 }
 mesh.instanceMatrix.needsUpdate=true;
}

export function createOccupationalOutfits({scene,points,quality='balanced'}={}){
 if(!scene||!Array.isArray(points))throw new TypeError('Occupational outfits need a scene and authored interaction points.');
 const entries=selectOccupationalActors(points),boxes=[],cylinders=[];
 for(const entry of entries)for(const part of entry.parts)(part.kind==='box'?boxes:cylinders).push({actor:entry.actor,type:entry.type,part});
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),cylinderMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,10),cylinders);
 let activeState=false;const update=({active=true}={})=>{activeState=!!active;updateBatch(boxMesh,activeState);updateBatch(cylinderMesh,activeState);return activeState;};
 const setQuality=q=>{boxMesh.visible=true;cylinderMesh.visible=true;boxMesh.castShadow=q!=='performance';cylinderMesh.castShadow=q==='high';};
 update({active:false});setQuality(quality);
 return Object.freeze({entries,boxMesh,cylinderMesh,update,setQuality,drawCalls:2,counts:Object.freeze({actors:entries.length,roles:new Set(entries.map(entry=>entry.type)).size,boxes:boxes.length,cylinders:cylinders.length,colliders:0})});
}
