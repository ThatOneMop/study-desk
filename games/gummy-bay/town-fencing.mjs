import * as THREE from './vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile} from './district-architecture.mjs?v=77';
import {townRoleColor} from './town-palette.mjs?v=76';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const TOWN_FENCE_SITES=freezeRecords([
 {id:'west-grid-yard',label:'West Grid service yard',supportId:'district-building-1',roadZ:-160},
 {id:'bay-workshop-yard',label:'Bay Workshop service yard',supportId:'district-building-3',roadZ:-160},
 {id:'east-grid-yard',label:'East Grid service yard',supportId:'district-building-6',roadZ:-160},
 {id:'market-workshop-yard',label:'Market Workshop service yard',supportId:'district-building-8',roadZ:-160}
]);

const finite=n=>Number.isFinite(n);
function frozenCollider(record){return Object.freeze(record);}
export function townFenceProfile(site,index=0,supports=DISTRICT_BUILDING_SITES){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||typeof site.supportId!=='string'||![site.roadZ,index].every(finite)||!Array.isArray(supports))return null;
 const supportIndex=supports.findIndex(record=>record?.id===site.supportId);if(supportIndex<0)return null;
 const support=supports[supportIndex],building=districtArchitectureProfile(support,supportIndex);if(!building||building.front.axis!=='z')return null;
 const backSign=-building.front.sign,yardW=9,yardD=5,gateWidth=2.8,x=support.x,z=support.z+backSign*(support.d/2+yardD/2+.25),gateZ=z+backSign*yardD/2;
 const sideVisual=.18,playerPad=.65,backRun=(yardW-gateWidth)/2,backOffset=gateWidth/2+backRun/2;
 const colliders=Object.freeze([
  frozenCollider({x:x-yardW/2,z,w:sideVisual+playerPad,d:yardD+playerPad,fence:site.id+'-left'}),
  frozenCollider({x:x+yardW/2,z,w:sideVisual+playerPad,d:yardD+playerPad,fence:site.id+'-right'}),
  frozenCollider({x:x-backOffset,z:gateZ,w:backRun+playerPad,d:sideVisual+playerPad,fence:site.id+'-gate-left'}),
  frozenCollider({x:x+backOffset,z:gateZ,w:backRun+playerPad,d:sideVisual+playerPad,fence:site.id+'-gate-right'})
 ]);
 const roadClearance=Math.abs(site.roadZ-z)-yardD/2-10.1,visibilityRatio=1-(2*.12/1.35+2*.14/yardD);
 if(roadClearance<2||visibilityRatio<.55)return null;
 return Object.freeze({...site,index,support,supportIndex,building,backSign,x,z,yardW,yardD,gateWidth,gateZ,roadClearance,visibilityRatio,colliders});
}
export const TOWN_FENCE_PROFILES=Object.freeze(TOWN_FENCE_SITES.map((site,index)=>townFenceProfile(site,index)));
export const TOWN_FENCE_COLLIDERS=Object.freeze(TOWN_FENCE_PROFILES.flatMap(profile=>profile.colliders));

export function fencePointBlocked(profile,x,z){
 if(!profile||![x,z].every(finite)||!Array.isArray(profile.colliders))return true;
 return profile.colliders.some(collider=>Math.abs(x-collider.x)<collider.w/2&&Math.abs(z-collider.z)<collider.d/2);
}
export function fenceGateClear(profile,margin=.325){
 if(!profile||![profile.gateWidth,profile.x,profile.gateZ,profile.backSign,margin].every(finite)||margin<0||profile.gateWidth<=margin*2)return false;
 for(let step=0;step<=40;step++){const z=profile.gateZ+profile.backSign*(2-step*.1);if(fencePointBlocked(profile,profile.x,z))return false;}
 return true;
}

function pushBox(list,x,y,z,w,h,d,color){list.push({x,y,z,w,h,d,color});}
function pushCylinder(list,x,y,z,r,h,color){list.push({x,y,z,r,h,color});}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92,metalness:.03,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),object=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const part=items[i];object.position.set(part.x,part.y,part.z);object.scale.set(part.w??part.r*2,part.h,part.d??part.r*2);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);mesh.setColorAt(i,color.setHex(part.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createTownFencing({scene,sites=TOWN_FENCE_SITES,supports=DISTRICT_BUILDING_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites)||!Array.isArray(supports))throw new TypeError('Town fencing needs a scene, fence sites and building supports.');
 const profiles=(sites===TOWN_FENCE_SITES&&supports===DISTRICT_BUILDING_SITES?TOWN_FENCE_PROFILES:sites.map((site,index)=>townFenceProfile(site,index,supports))).filter(profile=>profile&&fenceGateClear(profile)),rails=[],posts=[],railColor=townRoleColor('streetMetal'),postColor=townRoleColor('wood');
 for(const p of profiles){const run=(p.yardW-p.gateWidth)/2,offset=p.gateWidth/2+run/2;
  for(const x of [p.x-p.yardW/2,p.x+p.yardW/2])for(const y of [.44,1.04])pushBox(rails,x,y,p.z,.12,.12,p.yardD,railColor);
  for(const x of [p.x-offset,p.x+offset])for(const y of [.44,1.04])pushBox(rails,x,y,p.gateZ,run,.12,.12,railColor);
  for(const x of [p.x-p.yardW/2,p.x+p.yardW/2])for(const z of [p.z-p.yardD/2,p.z+p.yardD/2])pushCylinder(posts,x,.68,z,.075,1.36,postColor);
  for(const x of [p.x-p.gateWidth/2,p.x+p.gateWidth/2])pushCylinder(posts,x,.68,p.gateZ,.075,1.36,postColor);
 }
 const railMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),rails),postMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,8),posts);
 const setQuality=q=>{railMesh.visible=true;postMesh.visible=true;railMesh.castShadow=q!=='performance';postMesh.castShadow=q==='high';};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),railMesh,postMesh,setQuality,drawCalls:2,counts:Object.freeze({yards:profiles.length,rails:rails.length,posts:posts.length,colliders:profiles.reduce((sum,p)=>sum+p.colliders.length,0)})});
}
