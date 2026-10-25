import * as THREE from './vendor/three.module.min.js';

const freezeParts=parts=>Object.freeze(parts.map(part=>Object.freeze(part)));
const freezeProfile=profile=>Object.freeze({...profile,parts:freezeParts(profile.parts)});

export const OBJECT_SILHOUETTE_COLLIDERS=Object.freeze([]);
export const OBJECT_SILHOUETTE_PROFILES=Object.freeze([
 freezeProfile({kind:'rv',label:'Gramps’ RV',signature:'rear spare + offset roof aerial',parts:[
  {part:'spare',shape:'cylinder',x:0,y:1.38,z:-4.57,w:1.18,h:.16,d:1.18,rx:Math.PI/2,color:0x3f4744},
  {part:'spare-hub',shape:'cylinder',x:0,y:1.38,z:-4.68,w:.42,h:.08,d:.42,rx:Math.PI/2,color:0xbda77c},
  {part:'aerial-mast',shape:'cylinder',x:-1.45,y:4.18,z:-2.75,w:.08,h:1.42,d:.08,color:0x46534d},
  {part:'aerial-cap',shape:'box',x:-1.45,y:4.92,z:-2.75,w:.28,h:.14,d:.28,color:0xd5bc73}
 ]}),
 freezeProfile({kind:'van',label:'Delivery van',signature:'long roof pod + rear marker',parts:[
  {part:'roof-pod',shape:'box',x:0,y:2.12,z:-.18,w:1.18,h:.22,d:1.7,color:0xe7ddbd},
  {part:'roof-rail-left',shape:'box',x:-.62,y:2.02,z:-.18,w:.08,h:.12,d:2.25,color:0x3e504c},
  {part:'roof-rail-right',shape:'box',x:.62,y:2.02,z:-.18,w:.08,h:.12,d:2.25,color:0x3e504c},
  {part:'rear-marker',shape:'box',x:0,y:1.6,z:-2.04,w:.62,h:.18,d:.08,color:0xd8a866}
 ]}),
 freezeProfile({kind:'station',label:'Mixing station',signature:'tall hopper + offset control arm',parts:[
  {part:'hopper',shape:'cone',x:-.4,y:2.18,z:0,w:.78,h:.82,d:.78,color:0xb7bda8},
  {part:'hopper-cap',shape:'cylinder',x:-.4,y:2.61,z:0,w:.54,h:.08,d:.54,color:0x5d7169},
  {part:'control-arm',shape:'box',x:.62,y:2.02,z:0,w:.14,h:.86,d:.14,color:0x536b63},
  {part:'control-head',shape:'box',x:.62,y:2.45,z:.16,w:.52,h:.24,d:.42,color:0xd5c783}
 ]})
]);

const geometries=Object.freeze({
 box:new THREE.BoxGeometry(1,1,1),
 cylinder:new THREE.CylinderGeometry(.5,.5,1,10),
 cone:new THREE.ConeGeometry(.5,1,10)
});
const materials=new Map();
const material=color=>{
 if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.9,metalness:0,flatShading:true}));
 return materials.get(color);
};
const finitePart=part=>part&&geometries[part.shape]&&[part.x,part.y,part.z,part.w,part.h,part.d,part.color].every(Number.isFinite)&&part.w>0&&part.h>0&&part.d>0;

export function objectSilhouetteProfile(kind){
 return OBJECT_SILHOUETTE_PROFILES.find(profile=>profile.kind===kind)??null;
}

export function objectSilhouetteBounds(profile){
 if(!profile||!Array.isArray(profile.parts)||!profile.parts.length||!profile.parts.every(finitePart))return null;
 const min={x:Infinity,y:Infinity,z:Infinity},max={x:-Infinity,y:-Infinity,z:-Infinity};
 for(const part of profile.parts){
  const half={x:part.w/2,y:part.h/2,z:part.d/2};
  for(const axis of ['x','y','z']){min[axis]=Math.min(min[axis],part[axis]-half[axis]);max[axis]=Math.max(max[axis],part[axis]+half[axis]);}
 }
 return Object.freeze({min:Object.freeze(min),max:Object.freeze(max),width:max.x-min.x,height:max.y-min.y,depth:max.z-min.z});
}

export function attachObjectSilhouette(target,kind,{quality='balanced'}={}){
 if(!target?.isObject3D)throw new TypeError('Object silhouette needs a THREE object.');
 const profile=objectSilhouetteProfile(kind);if(!profile)throw new TypeError('Object silhouette needs a known kind.');
 const existing=target.children.find(child=>child.userData?.objectSilhouette===kind);if(existing)return existing;
 const group=new THREE.Group();group.name='Gummy Bay '+profile.label+' silhouette';group.userData.objectSilhouette=kind;group.userData.profile=profile;
 for(const part of profile.parts){
  const mesh=new THREE.Mesh(geometries[part.shape],material(part.color));mesh.name=part.part;mesh.position.set(part.x,part.y,part.z);mesh.scale.set(part.w,part.h,part.d);mesh.rotation.set(part.rx||0,part.ry||0,part.rz||0);mesh.castShadow=quality!=='performance';mesh.receiveShadow=true;mesh.userData.objectSilhouettePart=part.part;group.add(mesh);
 }
 target.add(group);return group;
}

export function setObjectSilhouetteQuality(root,quality='balanced'){
 if(!root?.traverse)return 0;let count=0;root.traverse(object=>{if(!object.isMesh||!object.userData?.objectSilhouettePart)return;object.castShadow=quality!=='performance';object.receiveShadow=true;count++;});return count;
}
