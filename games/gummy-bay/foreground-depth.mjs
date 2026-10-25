import * as THREE from './vendor/three.module.min.js';
import {townDistrictPalette,townRoleColor} from './town-palette.mjs?v=76';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const FOREGROUND_DEPTH_SITES=freezeRecords([
 {id:'westside-seeds-approach',label:'Westside Seeds approach',view:Object.freeze({x:-70,z:-160}),target:Object.freeze({x:-70,z:-147})},
 {id:'east-market-approach',label:'East Market packaging approach',view:Object.freeze({x:140,z:-160}),target:Object.freeze({x:140,z:-147})},
 {id:'north-heights-approach',label:'North Heights hardware approach',view:Object.freeze({x:-30,z:-300}),target:Object.freeze({x:-30,z:-287})},
 {id:'north-servo-approach',label:'North servo ingredients approach',view:Object.freeze({x:70,z:-370}),target:Object.freeze({x:70,z:-357})}
]);

const finite=n=>Number.isFinite(n);
const freezeCollider=record=>Object.freeze(record);
export function foregroundDepthProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!site.view||!site.target||![site.view.x,site.view.z,site.target.x,site.target.z,index].every(finite))return null;
 const dx=site.target.x-site.view.x,dz=site.target.z-site.view.z,targetDistance=Math.hypot(dx,dz);if(targetDistance<8)return null;
 const direction=Object.freeze({x:dx/targetDistance,z:dz/targetDistance}),lateral=Object.freeze({x:-direction.z,z:direction.x}),along=8,lateralOffset=3.8,bedWidth=1.6,bedDepth=.6,playerPad=.65;
 const beds=Object.freeze([-1,1].map((side,bedIndex)=>{
  const x=site.view.x+direction.x*along+lateral.x*lateralOffset*side,z=site.view.z+direction.z*along+lateral.z*lateralOffset*side;
  return Object.freeze({id:site.id+'-'+(bedIndex?'right':'left'),x,z,side});
 }));
 const colliders=Object.freeze(beds.map(bed=>freezeCollider({x:bed.x,z:bed.z,w:bedWidth+playerPad,d:bedDepth+playerPad,foregroundDepth:bed.id})));
 const centralClearWidth=2*(lateralOffset-(bedWidth+playerPad)/2),depthRatio=along/targetDistance,palette=townDistrictPalette(site.target.x,site.target.z).palette;
 if(centralClearWidth<4.5||depthRatio<=.5||depthRatio>=.75)return null;
 return Object.freeze({...site,index,targetDistance,direction,lateral,along,lateralOffset,bedWidth,bedDepth,playerPad,beds,colliders,centralClearWidth,depthRatio,palette});
}
export const FOREGROUND_DEPTH_PROFILES=Object.freeze(FOREGROUND_DEPTH_SITES.map((site,index)=>foregroundDepthProfile(site,index)));
export const FOREGROUND_DEPTH_COLLIDERS=Object.freeze(FOREGROUND_DEPTH_PROFILES.flatMap(profile=>profile.colliders));

export function foregroundPointBlocked(profile,x,z){
 if(!profile||![x,z].every(finite)||!Array.isArray(profile.colliders))return true;
 return profile.colliders.some(collider=>Math.abs(x-collider.x)<collider.w/2&&Math.abs(z-collider.z)<collider.d/2);
}
export function foregroundSightlineClear(profile,margin=.325){
 if(!profile||![profile.view?.x,profile.view?.z,profile.target?.x,profile.target?.z,margin].every(finite)||margin<0)return false;
 for(let step=0;step<=52;step++){const t=step/52,x=profile.view.x+(profile.target.x-profile.view.x)*t,z=profile.view.z+(profile.target.z-profile.view.z)*t;
  if(profile.colliders.some(collider=>Math.abs(x-collider.x)<collider.w/2+margin&&Math.abs(z-collider.z)<collider.d/2+margin))return false;
 }
 return true;
}

function pushBox(list,x,y,z,w,h,d,color){list.push({x,y,z,w,h,d,color});}
function pushCylinder(list,x,y,z,r,h,color){list.push({x,y,z,r,h,color});}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.96,metalness:0,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const part=items[i];object.position.set(part.x,part.y,part.z);object.scale.set(part.w??part.r*2,part.h,part.d??part.r*2);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createForegroundDepth({scene,sites=FOREGROUND_DEPTH_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites))throw new TypeError('Foreground depth needs a scene and approach sites.');
 const profiles=(sites===FOREGROUND_DEPTH_SITES?FOREGROUND_DEPTH_PROFILES:sites.map((site,index)=>foregroundDepthProfile(site,index))).filter(profile=>profile&&foregroundSightlineClear(profile)),boxes=[],plants=[];
 for(const profile of profiles)for(const bed of profile.beds){
  pushBox(boxes,bed.x,.21,bed.z,profile.bedWidth,.42,profile.bedDepth,profile.palette.trim);
  pushBox(boxes,bed.x,.45,bed.z,1.35,.06,.46,townRoleColor('soil'));
  for(let i=0;i<3;i++){const x=bed.x+(i-1)*.4,color=(profile.index+i)%2?0x72865d:0x829967;
   pushCylinder(plants,x,.66,bed.z,.035,.38,0x5e7654);pushCylinder(plants,x,.84,bed.z,.2,.24,color);
  }
 }
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),plantMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,8),plants);
 const setQuality=q=>{boxMesh.visible=true;plantMesh.visible=true;boxMesh.castShadow=q!=='performance';plantMesh.castShadow=q==='high';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,plantMesh,setQuality,drawCalls:2,counts:Object.freeze({approaches:profiles.length,beds:profiles.reduce((sum,p)=>sum+p.beds.length,0),boxes:boxes.length,plants:plants.length,colliders:profiles.reduce((sum,p)=>sum+p.colliders.length,0)})});
}
