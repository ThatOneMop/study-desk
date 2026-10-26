import * as THREE from './vendor/three.module.min.js';
import {townMaterialOptions} from './town-materials.mjs?v=75';
import {townRoleColor} from './town-palette.mjs?v=76';

const freezeSites=sites=>Object.freeze(sites.map(site=>Object.freeze({...site,anchor:Object.freeze({...site.anchor}),footprint:Object.freeze({...site.footprint})})));
export const STREET_PROP_SITES=freezeSites([
 {id:'westside-seed-planters',label:'Westside seed planters',purpose:'shop planting display',kind:'planter',x:-78,z:-150.8,roadZ:-160,angle:0,anchor:{x:-70,z:-147},footprint:{w:3,d:.8}},
 {id:'east-market-cart-return',label:'East Market cart return',purpose:'packing pickup',kind:'trolley',x:150,z:-150.8,roadZ:-160,angle:0,anchor:{x:140,z:-147},footprint:{w:3.2,d:.8}},
 {id:'north-heights-loading-rack',label:'North Heights loading rack',purpose:'hardware loading',kind:'rack',x:-40,z:-290.8,roadZ:-300,angle:0,anchor:{x:-30,z:-287},footprint:{w:3.4,d:.9}},
 {id:'north-servo-air-pump',label:'North Servo air pump',purpose:'vehicle service',kind:'pump',x:80,z:-360.8,roadZ:-370,angle:0,anchor:{x:70,z:-357},footprint:{w:2.2,d:.9}},
 {id:'harbor-safety-station',label:'Harbor safety station',purpose:'waterside safety',kind:'life',x:-198,z:9.2,roadZ:0,angle:0,anchor:{x:-185,z:-3},footprint:{w:2.4,d:.8}},
 {id:'northgate-shelter',label:'Northgate waiting shelter',purpose:'shuttle waiting',kind:'shelter',x:26,z:-425.8,roadZ:-435,angle:0,anchor:{x:-3,z:-435},footprint:{w:4.2,d:1}},
 {id:'east-coast-bike-rack',label:'East Coast bicycle rack',purpose:'short-stay cycle parking',kind:'bike',x:184,z:-9.2,roadZ:0,angle:0,anchor:{x:185,z:-3},footprint:{w:3.6,d:.9}},
 {id:'west-harbor-bollards',label:'West Harbor mooring bollards',purpose:'harbor edge',kind:'mooring',x:-184,z:9.2,roadZ:0,angle:0,anchor:{x:-185,z:-3},footprint:{w:3.4,d:.8}}
]);

const KINDS=Object.freeze(['planter','trolley','rack','pump','life','shelter','bike','mooring']);
const finite=n=>Number.isFinite(n);
export function contextualStreetPropProfile(site,index=0){
 if(!site||![site.x,site.z,site.roadZ,site.angle,site.anchor?.x,site.anchor?.z,site.footprint?.w,site.footprint?.d,index].every(finite)||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||typeof site.purpose!=='string'||!site.purpose||!KINDS.includes(site.kind)||site.footprint.w<=0||site.footprint.w>6||site.footprint.d<=0||site.footprint.d>1.25)return null;
 const offset=Math.abs(site.z-site.roadZ),collider=Object.freeze({x:site.x,z:site.z,w:site.footprint.w+.65,d:site.footprint.d+.65,streetProp:site.id});
 // Expanded horizontal roads are 12 m wide. Their .22 m curb extends to 6.22 m.
 const clearCorridor=offset-collider.d/2-6.22;
 const contextDistance=Math.hypot(site.x-site.anchor.x,site.z-site.anchor.z);
 if(clearCorridor<1.8||contextDistance>32)return null;
 return Object.freeze({id:site.id,index,label:site.label,purpose:site.purpose,kind:site.kind,x:site.x,z:site.z,roadZ:site.roadZ,angle:site.angle,anchor:site.anchor,footprint:site.footprint,collider,clearCorridor,contextDistance});
}

export const STREET_PROP_PROFILES=Object.freeze(STREET_PROP_SITES.map(contextualStreetPropProfile));
export const STREET_PROP_COLLIDERS=Object.freeze(STREET_PROP_PROFILES.map(profile=>profile.collider));

function local(profile,dx,dz){const c=Math.cos(profile.angle),s=Math.sin(profile.angle);return {x:profile.x+dx*c+dz*s,z:profile.z-dx*s+dz*c};}
function pushBox(list,p,dx,y,dz,w,h,d,color,rx=0,ry=0,rz=0){const q=local(p,dx,dz);list.push({x:q.x,y,z:q.z,w,h,d,color,rx,ry:ry+p.angle,rz});}
function pushCylinder(list,p,dx,y,dz,r,h,color,rx=0,rz=0){const q=local(p,dx,dz);list.push({x:q.x,y,z:q.z,r,h,color,rx,ry:p.angle,rz});}
function buildParts(profile,boxes,cylinders){
 const green=0x708566,wood=townRoleColor('wood'),dark=townRoleColor('darkMetal'),steel=0x71807c,cream=0xd7c9a5,orange=townRoleColor('emergency');
 if(profile.kind==='planter'){
  pushBox(boxes,profile,0,.34,0,2.8,.68,.72,wood);pushBox(boxes,profile,0,.7,0,2.55,.08,.58,townRoleColor('soil'));
  for(const x of [-.9,-.3,.3,.9]){pushCylinder(cylinders,profile,x,1.02,0,.06,.62,green);pushBox(boxes,profile,x,1.34,0,.48,.2,.42,green,0,x*.18,0);}
 }else if(profile.kind==='trolley'){
  pushBox(boxes,profile,0,.62,0,2.5,.85,.64,steel);pushBox(boxes,profile,-1.42,1.02,0,.12,1.35,.12,dark);pushBox(boxes,profile,-1.02,1.62,0,.82,.1,.1,dark);
  for(const x of [-.95,.95])for(const z of [-.31,.31])pushCylinder(cylinders,profile,x,.22,z,.17,.12,dark,Math.PI/2,0);
 }else if(profile.kind==='rack'){
  for(const x of [-1.48,1.48])pushBox(boxes,profile,x,.9,0,.14,1.8,.75,dark);
  for(const y of [.32,.92,1.5])pushBox(boxes,profile,0,y,0,3.1,.12,.76,wood);
  for(const x of [-.85,0,.85])pushBox(boxes,profile,x,1.68,0,.55,.2,.58,cream);
 }else if(profile.kind==='pump'){
  pushBox(boxes,profile,0,.75,0,1.05,1.5,.7,townRoleColor('service'));pushBox(boxes,profile,0,1.18,-.37,.72,.48,.05,cream);pushBox(boxes,profile,.74,.22,0,.2,.44,.2,dark);
  pushCylinder(cylinders,profile,.72,.78,0,.06,1.1,dark);pushCylinder(cylinders,profile,.72,1.34,0,.13,.18,orange);
 }else if(profile.kind==='life'){
  pushBox(boxes,profile,0,1.05,0,.14,2.1,.14,dark);pushBox(boxes,profile,0,1.78,0,1.7,.14,.14,dark);pushBox(boxes,profile,0,1.28,0,1.15,.82,.08,cream);
  pushCylinder(cylinders,profile,0,1.3,-.07,.34,.12,orange,Math.PI/2,0);pushCylinder(cylinders,profile,0,1.3,-.14,.13,.14,cream,Math.PI/2,0);
 }else if(profile.kind==='shelter'){
  pushBox(boxes,profile,0,2.22,0,4.05,.18,.95,green);pushBox(boxes,profile,0,1.18,.38,3.9,2.1,.1,0x6d8989);
  for(const x of [-1.82,1.82])pushBox(boxes,profile,x,1.12,0,.14,2.24,.14,dark);
  pushBox(boxes,profile,0,.52,-.12,2.7,.16,.58,wood);pushBox(boxes,profile,0,.9,.14,2.7,.72,.12,wood);
 }else if(profile.kind==='bike'){
  pushBox(boxes,profile,0,.08,0,3.4,.16,.24,dark);
  for(const x of [-1.2,-.4,.4,1.2]){pushCylinder(cylinders,profile,x,.48,0,.055,.82,steel);pushCylinder(cylinders,profile,x,.87,0,.055,.46,steel,0,Math.PI/2);}
 }else{
  pushBox(boxes,profile,0,.08,0,3.2,.16,.62,0x8a8779);
  for(const x of [-1.2,-.4,.4,1.2]){pushCylinder(cylinders,profile,x,.42,0,.18,.68,dark);pushCylinder(cylinders,profile,x,.78,0,.24,.12,dark);}
 }
}

function makeBatch(scene,geometry,items,style){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,...townMaterialOptions(style)}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const part=items[i];object.position.set(part.x,part.y,part.z);object.rotation.set(part.rx||0,part.ry||0,part.rz||0);object.scale.set(part.w??part.r*2,part.h,part.d??part.r*2);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createContextualStreetProps({scene,sites=STREET_PROP_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites))throw new TypeError('Contextual street props need a scene and site array.');
 const profiles=sites.map(contextualStreetPropProfile).filter(Boolean),boxes=[],cylinders=[];for(const profile of profiles)buildParts(profile,boxes,cylinders);
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes,'streetBody'),cylinderMesh=makeBatch(scene,new THREE.CylinderGeometry(.5,.5,1,12),cylinders,'streetMetal');
 const setQuality=q=>{boxMesh.visible=true;cylinderMesh.visible=true;boxMesh.castShadow=q!=='performance';cylinderMesh.castShadow=q!=='performance';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,cylinderMesh,setQuality,drawCalls:2,counts:Object.freeze({sites:profiles.length,boxes:boxes.length,cylinders:cylinders.length})});
}
