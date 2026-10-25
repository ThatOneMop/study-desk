import * as THREE from './vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile} from './district-architecture.mjs?v=77';
export {TOWN_UTILITY_SITES,TOWN_UTILITY_KINDS,utilityInsideSupport,createTownUtilities} from './town-utilities.mjs?v=79';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const SKYLINE_LANDMARK_SITES=freezeRecords([
 {id:'syrup-stack',label:'Syrup Stack',kind:'water-tower',approach:'west',supportId:'district-building-0',structureHeight:15,color:0x78908b,accent:0xe2b969},
 {id:'market-clock',label:'Market Clock',kind:'clock-tower',approach:'east',supportId:'district-building-19',structureHeight:14,color:0x8e705f,accent:0xe6d39a},
 {id:'sugarworks-stack',label:'Sugarworks Stack',kind:'chimney',approach:'north',supportId:'district-building-44',structureHeight:20,color:0x806a60,accent:0xc99466},
 {id:'harbor-signal',label:'Harbor Signal',kind:'signal-mast',approach:'south',supportId:'district-building-50',structureHeight:12,color:0x617b79,accent:0xe18d69}
]);
export const SKYLINE_APPROACHES=Object.freeze({
 west:Object.freeze({x:-340,z:-250,landmark:'syrup-stack',signature:'tank-and-cone'}),
 east:Object.freeze({x:340,z:-250,landmark:'market-clock',signature:'square-clock-and-spire'}),
 north:Object.freeze({x:0,z:-520,landmark:'sugarworks-stack',signature:'tall-ringed-stack'}),
 south:Object.freeze({x:0,z:135,landmark:'harbor-signal',signature:'crossarm-and-beacon'})
});

const finite=n=>Number.isFinite(n);
const KINDS=Object.freeze(['water-tower','clock-tower','chimney','signal-mast']);
export function skylineLandmarkProfile(site,index=0,supports=DISTRICT_BUILDING_SITES){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||!KINDS.includes(site.kind)||!Object.hasOwn(SKYLINE_APPROACHES,site.approach)||typeof site.supportId!=='string'||![site.structureHeight,site.color,site.accent,index].every(finite)||site.structureHeight<10||site.structureHeight>24||!Array.isArray(supports))return null;
 const supportIndex=supports.findIndex(record=>record?.id===site.supportId);if(supportIndex<0)return null;
 const support=supports[supportIndex],building=districtArchitectureProfile(support,supportIndex);if(!building)return null;
 const baseY=building.height+1.25,footprintRadius=site.kind==='clock-tower'?2.7:site.kind==='water-tower'?2.35:1.85;
 if(footprintRadius*2>Math.min(building.w,building.d)-1)return null;
 return Object.freeze({...site,index,support,supportIndex,x:building.x,z:building.z,baseY,topY:baseY+site.structureHeight,footprintRadius,signature:SKYLINE_APPROACHES[site.approach].signature});
}
export const SKYLINE_LANDMARK_PROFILES=Object.freeze(SKYLINE_LANDMARK_SITES.map((site,index)=>skylineLandmarkProfile(site,index)));

export function skylineFootprintOnSupport(profile,margin=.5){
 if(!profile||!profile.support||![profile.x,profile.z,profile.footprintRadius,profile.support.x,profile.support.z,profile.support.w,profile.support.d,margin].every(finite)||margin<0)return false;
 return Math.abs(profile.x-profile.support.x)+profile.footprintRadius+margin<=profile.support.w/2&&Math.abs(profile.z-profile.support.z)+profile.footprintRadius+margin<=profile.support.d/2;
}

function box(list,x,y,z,sx,sy,sz,color,ry=0){list.push({x,y,z,sx,sy,sz,color,ry});}
function cylinder(list,x,y,z,sx,sy,sz,color){list.push({x,y,z,sx,sy,sz,color});}
function cone(list,x,y,z,sx,sy,sz,color){list.push({x,y,z,sx,sy,sz,color});}
function makeBatch(scene,geometry,items){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.88,metalness:.04,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),dummy=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const item=items[i];dummy.position.set(item.x,item.y,item.z);dummy.rotation.set(0,item.ry||0,0);dummy.scale.set(item.sx,item.sy,item.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,color.setHex(item.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createTownSkyline({scene,sites=SKYLINE_LANDMARK_SITES,supports=DISTRICT_BUILDING_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites)||!Array.isArray(supports))throw new TypeError('Town skyline needs a scene, landmark sites and building supports.');
 const profiles=sites.map((site,index)=>skylineLandmarkProfile(site,index,supports)).filter(profile=>profile&&skylineFootprintOnSupport(profile)),boxes=[],cylinders=[],cones=[];
 for(const p of profiles){const {x,z,baseY:b,color:c,accent:a,structureHeight:h}=p;
  if(p.kind==='water-tower'){
   for(const dx of [-1,1])for(const dz of [-1,1])cylinder(cylinders,x+dx*1.45,b+h*.18,z+dz*1.45,.16,h*.36,.16,c);
   box(boxes,x,b+h*.36,z,3.4,.18,.18,a);box(boxes,x,b+h*.36,z,.18,.18,3.4,a);
   cylinder(cylinders,x,b+h*.56,z,2.25,h*.34,2.25,c);cone(cones,x,b+h*.865,z,2.55,h*.27,2.55,a);
  }else if(p.kind==='clock-tower'){
   box(boxes,x,b+h*.35,z,3.8,h*.7,3.8,c);box(boxes,x,b+h*.76,z,5.1,h*.12,5.1,a);
   for(const [dx,dz,ry] of [[0,-2.58,0],[0,2.58,0],[-2.58,0,Math.PI/2],[2.58,0,Math.PI/2]])box(boxes,x+dx,b+h*.76,z+dz,1.8,1.8,.08,0x31474b,ry);
   cone(cones,x,b+h*.91,z,3.05,h*.18,3.05,c);
  }else if(p.kind==='chimney'){
   cylinder(cylinders,x,b+h*.47,z,1.65,h*.94,1.65,c);cylinder(cylinders,x,b+h*.25,z,1.82,.38,1.82,a);cylinder(cylinders,x,b+h*.55,z,1.65,.34,1.65,a);cylinder(cylinders,x,b+h*.91,z,1.48,.48,1.48,a);
   cone(cones,x,b+h-.35,z,1.8,.7,1.8,0x596764);
  }else{
   cylinder(cylinders,x,b+h*.45,z,.38,h*.9,.38,c);box(boxes,x,b+h*.48,z,5.8,.34,.34,a);box(boxes,x,b+h*.67,z,3.4,.28,.28,a);box(boxes,x,b+1.8,z,2.4,.25,2.4,c,Math.PI/4);
   cone(cones,x,b+h-.9,z,1.3,1.8,1.3,a);
  }
 }
 const boxMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),boxes),cylinderMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,8),cylinders),coneMesh=makeBatch(scene,new THREE.ConeGeometry(1,1,8),cones);
 const setQuality=q=>{boxMesh.visible=true;cylinderMesh.visible=true;coneMesh.visible=true;boxMesh.castShadow=q==='high';cylinderMesh.castShadow=q==='high';coneMesh.castShadow=false;};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),boxMesh,cylinderMesh,coneMesh,setQuality,drawCalls:3,counts:Object.freeze({landmarks:profiles.length,boxes:boxes.length,cylinders:cylinders.length,cones:cones.length})});
}
