import * as THREE from './vendor/three.module.min.js';
import {townDistrictPalette,townRoleColor} from './town-palette.mjs?v=76';

const freezeSites=sites=>Object.freeze(sites.map(site=>Object.freeze({...site,view:Object.freeze({...site.view}),target:Object.freeze({...site.target})})));
export const SHOP_APPROACH_SITES=freezeSites([
 {id:'westside-seeds-entry',label:'Westside Seeds leaf arch',kind:'seed-arch',view:{x:-70,z:-160},target:{x:-70,z:-147},width:5.4,height:3.15},
 {id:'east-market-entry',label:'East Market striped awning',kind:'parcel-awning',view:{x:140,z:-160},target:{x:140,z:-147},width:6,height:2.85},
 {id:'north-heights-entry',label:'North Heights tool portal',kind:'tool-portal',view:{x:-30,z:-300},target:{x:-30,z:-287},width:5.7,height:3.35},
 {id:'north-servo-entry',label:'North Servo droplet totem',kind:'servo-totem',view:{x:70,z:-370},target:{x:70,z:-357},width:5.6,height:3.55}
]);

const KINDS=Object.freeze({
 'seed-arch':Object.freeze({signature:'leaf-arch-4-4-2',boxes:4,cylinders:4,cones:2}),
 'parcel-awning':Object.freeze({signature:'striped-awning-9-0-0',boxes:9,cylinders:0,cones:0}),
 'tool-portal':Object.freeze({signature:'braced-tool-portal-5-4-0',boxes:5,cylinders:4,cones:0}),
 'servo-totem':Object.freeze({signature:'droplet-totem-3-3-1',boxes:3,cylinders:3,cones:1})
});
const finite=n=>Number.isFinite(n);
const freezeCollider=record=>Object.freeze(record);

export function shopApproachProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!KINDS[site.kind]||!site.view||!site.target||![site.view.x,site.view.z,site.target.x,site.target.z,site.width,site.height,index].every(finite)||site.width<5.4||site.width>6.2||site.height<2.8||site.height>3.7)return null;
 const dx=site.target.x-site.view.x,dz=site.target.z-site.view.z,distance=Math.hypot(dx,dz);if(distance<10)return null;
 const direction=Object.freeze({x:dx/distance,z:dz/distance}),lateral=Object.freeze({x:-direction.z,z:direction.x}),setback=1.8,anchor=Object.freeze({x:site.target.x+direction.x*setback,z:site.target.z+direction.z*setback}),postOffset=site.width/2-.2,postSize=.55,playerPad=.65;
 const posts=Object.freeze([-1,1].map((side,i)=>{const x=anchor.x+lateral.x*postOffset*side,z=anchor.z+lateral.z*postOffset*side;return Object.freeze({id:site.id+'-'+(i?'right':'left'),x,z,side});}));
 const colliderW=Math.abs(lateral.x)*(postSize+playerPad)+Math.abs(direction.x)*(postSize+playerPad),colliderD=Math.abs(lateral.z)*(postSize+playerPad)+Math.abs(direction.z)*(postSize+playerPad);
 const colliders=Object.freeze(posts.map(post=>freezeCollider({x:post.x,z:post.z,w:colliderW,d:colliderD,shopApproach:post.id})));
 const centralClearWidth=2*postOffset-(postSize+playerPad),targetClearance=setback-(postSize+playerPad)/2,palette=townDistrictPalette(site.target.x,site.target.z).palette,kind=KINDS[site.kind];
 if(centralClearWidth<3.8||targetClearance<1.1)return null;
 return Object.freeze({...site,index,distance,direction,lateral,setback,anchor,postOffset,postSize,playerPad,posts,colliders,centralClearWidth,targetClearance,palette,signature:kind.signature,partCounts:Object.freeze({boxes:kind.boxes,cylinders:kind.cylinders,cones:kind.cones})});
}
export const SHOP_APPROACH_PROFILES=Object.freeze(SHOP_APPROACH_SITES.map((site,index)=>shopApproachProfile(site,index)));
export const SHOP_APPROACH_COLLIDERS=Object.freeze(SHOP_APPROACH_PROFILES.flatMap(profile=>profile.colliders));

export function shopApproachPointBlocked(profile,x,z){
 if(!profile||![x,z].every(finite)||!Array.isArray(profile.colliders))return true;
 return profile.colliders.some(collider=>Math.abs(x-collider.x)<collider.w/2&&Math.abs(z-collider.z)<collider.d/2);
}
export function shopApproachSightlineClear(profile,margin=.325){
 if(!profile||![profile.view?.x,profile.view?.z,profile.target?.x,profile.target?.z,margin].every(finite)||margin<0)return false;
 for(let step=0;step<=52;step++){const t=step/52,x=profile.view.x+(profile.target.x-profile.view.x)*t,z=profile.view.z+(profile.target.z-profile.view.z)*t;
  if(profile.colliders.some(collider=>Math.abs(x-collider.x)<collider.w/2+margin&&Math.abs(z-collider.z)<collider.d/2+margin))return false;
 }
 return true;
}

function local(profile,along,depth){return {x:profile.anchor.x+profile.lateral.x*along+profile.direction.x*depth,z:profile.anchor.z+profile.lateral.z*along+profile.direction.z*depth};}
function pushBox(list,p,along,y,depth,w,h,d,color,rx=0,rz=0){const q=local(p,along,depth);list.push({x:q.x,y,z:q.z,w,h,d,color,rx,ry:Math.atan2(p.direction.x,p.direction.z),rz});}
function pushCylinder(list,p,along,y,depth,r,h,color,rx=0,rz=0){const q=local(p,along,depth);list.push({x:q.x,y,z:q.z,r,h,color,rx,ry:Math.atan2(p.direction.x,p.direction.z),rz});}
function buildParts(p,boxes,cylinders,cones){
 const wood=townRoleColor('wood'),dark=townRoleColor('darkMetal'),cream=0xe5d6ab,green=0x748e62,parcel=0xb57f65,service=townRoleColor('service');
 for(const side of [-1,1])pushBox(boxes,p,side*p.postOffset,p.height/2,0,p.postSize,p.height,p.postSize,p.kind==='tool-portal'?dark:wood);
 pushBox(boxes,p,0,p.height-.18,0,p.width,.36,.58,p.kind==='parcel-awning'?parcel:p.kind==='servo-totem'?service:p.palette.trim);
 if(p.kind==='seed-arch'){
  pushBox(boxes,p,0,p.height-.55,.04,p.width-.8,.14,.46,green);
  for(const side of [-1.45,-.48,.48,1.45])pushCylinder(cylinders,p,side,p.height-.56,.09,.19,.16,side<0?0x789363:0x8ca66e,Math.PI/2,0);
  for(const side of [-1,1])pushCylinder(cones,p,side*.95,p.height+.14,.02,.32,.48,green);
 }else if(p.kind==='parcel-awning'){
  for(let i=0;i<6;i++)pushBox(boxes,p,(i-2.5)*.86,p.height-.48,-.12,.8,.12,1.02,i%2?cream:parcel,0,-.13);
 }else if(p.kind==='tool-portal'){
  for(const side of [-1,1])pushBox(boxes,p,side*1.55,p.height-.72,.02,.16,1.18,.16,wood,0,side*.68);
  for(const side of [-1.8,-.6,.6,1.8])pushCylinder(cylinders,p,side,p.height-.18,-.31,.11,.08,cream,Math.PI/2,0);
 }else{
  for(const side of [-1,1])pushCylinder(cylinders,p,side*1.55,p.height-.55,.02,.2,.56,cream);
  pushCylinder(cylinders,p,0,p.height+.12,-.05,.48,.16,service,Math.PI/2,0);
  pushCylinder(cones,p,0,p.height+.63,-.05,.3,.72,0x6fa8ad);
 }
}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:0,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const part=items[i];object.position.set(part.x,part.y,part.z);object.rotation.set(part.rx||0,part.ry||0,part.rz||0);object.scale.set(part.w??part.r*2,part.h,part.d??part.r*2);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createShopApproaches({scene,sites=SHOP_APPROACH_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites))throw new TypeError('Shop approaches need a scene and site records.');
 const profiles=(sites===SHOP_APPROACH_SITES?SHOP_APPROACH_PROFILES:sites.map((site,index)=>shopApproachProfile(site,index))).filter(profile=>profile&&shopApproachSightlineClear(profile)),boxes=[],cylinders=[],cones=[];
 for(const profile of profiles)buildParts(profile,boxes,cylinders,cones);
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),cylinderMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,10),cylinders),coneMesh=makeBatch(scene,new THREE.ConeGeometry(1,1,10),cones);
 const setQuality=q=>{for(const mesh of [boxMesh,cylinderMesh,coneMesh])mesh.visible=true;boxMesh.castShadow=q!=='performance';cylinderMesh.castShadow=q==='high';coneMesh.castShadow=false;};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,cylinderMesh,coneMesh,setQuality,drawCalls:3,counts:Object.freeze({approaches:profiles.length,boxes:boxes.length,cylinders:cylinders.length,cones:cones.length,colliders:profiles.reduce((sum,p)=>sum+p.colliders.length,0)})});
}
