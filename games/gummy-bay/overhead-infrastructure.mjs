import * as THREE from './vendor/three.module.min.js';
import {DISTRICT_BUILDING_SITES,districtArchitectureProfile} from './district-architecture.mjs?v=126';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const OVERHEAD_INFRASTRUCTURE_SITES=freezeRecords([
 {id:'east-grid-market',label:'East Grid market span',roadX:105,z:-125,leftSupportId:'district-building-6',rightSupportId:'district-building-7'},
 {id:'east-grid-workshops',label:'East Grid workshop span',roadX:105,z:-195,leftSupportId:'district-building-16',rightSupportId:'district-building-17'},
 {id:'east-grid-heights',label:'East Grid heights span',roadX:105,z:-335,leftSupportId:'district-building-36',rightSupportId:'district-building-37'},
 {id:'east-grid-coast',label:'East Grid coast span',roadX:105,z:-405,leftSupportId:'district-building-46',rightSupportId:'district-building-47'}
]);

const finite=n=>Number.isFinite(n);
export function overheadInfrastructureProfile(site,index=0,supports=DISTRICT_BUILDING_SITES){
 if(!site||typeof site.id!=='string'||!site.id||typeof site.label!=='string'||!site.label||typeof site.leftSupportId!=='string'||typeof site.rightSupportId!=='string'||![site.roadX,site.z,index].every(finite)||!Array.isArray(supports))return null;
 const leftIndex=supports.findIndex(record=>record?.id===site.leftSupportId),rightIndex=supports.findIndex(record=>record?.id===site.rightSupportId);if(leftIndex<0||rightIndex<0||leftIndex===rightIndex)return null;
 const leftSupport=supports[leftIndex],rightSupport=supports[rightIndex],leftBuilding=districtArchitectureProfile(leftSupport,leftIndex),rightBuilding=districtArchitectureProfile(rightSupport,rightIndex);if(!leftBuilding||!rightBuilding||leftBuilding.x>=rightBuilding.x||Math.abs(leftBuilding.z-rightBuilding.z)>.01)return null;
 if(!(site.roadX>leftBuilding.x&&site.roadX<rightBuilding.x)||Math.abs(site.z-leftBuilding.z)>.01)return null;
 const mastBaseY=Math.max(leftBuilding.height,rightBuilding.height)+1.25,mastTopY=mastBaseY+3.4,cableLowY=mastTopY-1.1;
 return Object.freeze({...site,index,leftSupport,rightSupport,leftIndex,rightIndex,leftBuilding,rightBuilding,leftX:leftBuilding.x,rightX:rightBuilding.x,mastBaseY,mastTopY,cableLowY,clearance:cableLowY,span:rightBuilding.x-leftBuilding.x});
}
export const OVERHEAD_INFRASTRUCTURE_PROFILES=Object.freeze(OVERHEAD_INFRASTRUCTURE_SITES.map((site,index)=>overheadInfrastructureProfile(site,index)));

export function roofSupportsContain(profile,margin=.55){
 if(!profile||!profile.leftSupport||!profile.rightSupport||![profile.leftX,profile.rightX,profile.z,margin].every(finite)||margin<0)return false;
 return Math.abs(profile.leftX-profile.leftSupport.x)+margin<=profile.leftSupport.w/2&&Math.abs(profile.z-profile.leftSupport.z)+margin<=profile.leftSupport.d/2&&Math.abs(profile.rightX-profile.rightSupport.x)+margin<=profile.rightSupport.w/2&&Math.abs(profile.z-profile.rightSupport.z)+margin<=profile.rightSupport.d/2;
}

export function overheadCableSegments(profile){
 if(!profile||![profile.leftX,profile.rightX,profile.z,profile.mastTopY,profile.cableLowY].every(finite)||profile.leftX>=profile.rightX||profile.cableLowY<0||profile.cableLowY>=profile.mastTopY)return Object.freeze([]);
 const records=[];
 for(const offset of [-1.1,0,1.1]){
  const points=[{x:profile.leftX,y:profile.mastTopY-.18},{x:profile.roadX,y:profile.cableLowY},{x:profile.rightX,y:profile.mastTopY-.18}];
  for(let i=0;i<2;i++)records.push(Object.freeze({x1:points[i].x,y1:points[i].y,x2:points[i+1].x,y2:points[i+1].y,z:profile.z+offset}));
 }
 return Object.freeze(records);
}

function pushBox(list,x,y,z,sx,sy,sz,color,rz=0){list.push({x,y,z,sx,sy,sz,color,rz});}
function pushCylinder(list,x,y,z,sx,sy,sz,color){list.push({x,y,z,sx,sy,sz,color,rz:0});}
function pushSegment(list,segment,color){const dx=segment.x2-segment.x1,dy=segment.y2-segment.y1;pushBox(list,(segment.x1+segment.x2)/2,(segment.y1+segment.y2)/2,segment.z,Math.hypot(dx,dy),.055,.055,color,Math.atan2(dy,dx));}
function makeBatch(scene,geometry,items,{roughness=.88,metalness=.08}={}){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness,metalness,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),dummy=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const item=items[i];dummy.position.set(item.x,item.y,item.z);dummy.rotation.set(0,0,item.rz||0);dummy.scale.set(item.sx,item.sy,item.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,color.setHex(item.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createOverheadInfrastructure({scene,sites=OVERHEAD_INFRASTRUCTURE_SITES,supports=DISTRICT_BUILDING_SITES,quality='balanced'}={}){
 if(!scene||!Array.isArray(sites)||!Array.isArray(supports))throw new TypeError('Overhead infrastructure needs a scene, span sites and building supports.');
 const profiles=sites.map((site,index)=>overheadInfrastructureProfile(site,index,supports)).filter(profile=>profile&&roofSupportsContain(profile)&&profile.clearance>=6.5),supportsParts=[],arms=[],cables=[];
 for(const p of profiles){
  for(const x of [p.leftX,p.rightX]){
   pushCylinder(supportsParts,x,(p.mastBaseY+p.mastTopY)/2,p.z,.14,p.mastTopY-p.mastBaseY,.14,0x65736e);
   pushBox(arms,x,p.mastTopY,p.z,.34,.22,3.25,0x6f6654);
   for(const offset of [-1.1,0,1.1])pushCylinder(supportsParts,x,p.mastTopY+.17,p.z+offset,.075,.34,.075,0xd6c88f);
  }
  for(const segment of overheadCableSegments(p))pushSegment(cables,segment,0x344846);
 }
 const supportMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,8),supportsParts,{roughness:.82,metalness:.18}),armMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),arms,{roughness:.9,metalness:.04}),cableMesh=makeBatch(scene,new THREE.BoxGeometry(1,1,1),cables,{roughness:.78,metalness:.22});
 const setQuality=q=>{supportMesh.visible=true;armMesh.visible=true;cableMesh.visible=true;supportMesh.castShadow=q==='high';armMesh.castShadow=q==='high';cableMesh.castShadow=false;};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),supportMesh,armMesh,cableMesh,setQuality,drawCalls:3,counts:Object.freeze({spans:profiles.length,supportParts:supportsParts.length,arms:arms.length,cables:cables.length})});
}
