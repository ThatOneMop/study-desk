import * as THREE from './vendor/three.module.min.js';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
const northXs=Object.freeze([-242,-220,-180,-145,-65,-42,42,65,145,180,220,242]);
const sideZs=Object.freeze([-125,-195,-265,-335,-400]);
const sites=[];
for(const [index,x] of northXs.entries())sites.push({id:`north-windbreak-${index}`,zone:'north',x,z:-462,height:8+(index*5)%7,lean:(index%3-1)*.035});
for(const side of [-1,1])for(const [index,z] of sideZs.entries())sites.push({id:`${side<0?'west':'east'}-windbreak-${index}`,zone:side<0?'west':'east',x:side*292,z,height:9+(index*3+(side>0?2:0))%6,lean:side*.025});
export const HORIZON_TREE_SITES=freezeRecords(sites);
export const HORIZON_VIEW_CORRIDORS=Object.freeze({north:Object.freeze([-270,-105,0,105,270]),sides:Object.freeze([-90,-160,-230,-300,-370,-435])});

const finite=n=>Number.isFinite(n);
export function horizonTreeProfile(site,index=0){
 if(!site||typeof site.id!=='string'||!site.id||!['north','west','east'].includes(site.zone)||![site.x,site.z,site.height,site.lean,index].every(finite)||site.height<7||site.height>16||Math.abs(site.lean)>.08)return null;
 const crownRadius=1.9+(index%4)*.22,trunkRadius=.24+(index%3)*.035;
 return Object.freeze({...site,index,crownRadius,trunkRadius,trunkColor:index%2?0x665c4e:0x716452,crownColor:index%3===0?0x546c5a:index%3===1?0x617a62:0x6c8067,scrubColor:index%2?0x71846b:0x7c8b70});
}

export const HORIZON_TREE_PROFILES=Object.freeze(HORIZON_TREE_SITES.map(horizonTreeProfile));

export function horizonSiteOutsideBounds(profile,bounds,padding=8){
 if(!profile||!bounds||![profile.x,profile.z,bounds.minX,bounds.maxX,bounds.minZ,bounds.maxZ,padding].every(finite)||padding<0)return false;
 return profile.x<=bounds.minX-padding||profile.x>=bounds.maxX+padding||profile.z<=bounds.minZ-padding||profile.z>=bounds.maxZ+padding;
}

export function horizonViewGap(profile,corridors=HORIZON_VIEW_CORRIDORS){
 if(!profile||!corridors||!Array.isArray(corridors.north)||!Array.isArray(corridors.sides))return null;
 const values=profile.zone==='north'?corridors.north:corridors.sides,coordinate=profile.zone==='north'?profile.x:profile.z;
 if(!values.length||!values.every(finite)||!finite(coordinate))return null;
 return Math.min(...values.map(value=>Math.abs(value-coordinate)))-profile.crownRadius;
}

function makeBatch(scene,geometry,items,roughness){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness,metalness:0,vertexColors:true,flatShading:true}),mesh=new THREE.InstancedMesh(geometry,material,items.length),dummy=new THREE.Object3D(),color=new THREE.Color();
 for(let i=0;i<items.length;i++){const item=items[i];dummy.position.set(item.x,item.y,item.z);dummy.rotation.set(item.rx||0,item.ry||0,item.rz||0);dummy.scale.set(item.sx,item.sy,item.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,color.setHex(item.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);return mesh;
}

export function createDistrictHorizon({scene,bounds,sites=HORIZON_TREE_SITES,quality='balanced'}={}){
 if(!scene||!bounds||!Array.isArray(sites))throw new TypeError('District horizon needs a scene, bounds and authored sites.');
 const profiles=sites.map(horizonTreeProfile).filter(profile=>profile&&horizonSiteOutsideBounds(profile,bounds)&&horizonViewGap(profile)>=18),trunks=[],crowns=[],scrub=[];
 for(const p of profiles){
  trunks.push({x:p.x,y:p.height*.34,z:p.z,sx:p.trunkRadius,sy:p.height*.68,sz:p.trunkRadius,color:p.trunkColor,rz:p.lean});
  crowns.push({x:p.x-p.lean*p.height*.18,y:p.height*.63,z:p.z,sx:p.crownRadius,sy:p.height*.32,sz:p.crownRadius,color:p.crownColor,rz:p.lean});
  crowns.push({x:p.x-p.lean*p.height*.3,y:p.height*.83,z:p.z,sx:p.crownRadius*.72,sy:p.height*.27,sz:p.crownRadius*.72,color:p.crownColor,rz:p.lean});
  const side=p.index%2?-1:1;scrub.push({x:p.x+side*2.7,y:.62,z:p.z+(p.zone==='north'?1.2:side*1.1),sx:2.4+(p.index%3)*.35,sy:.75+(p.index%2)*.18,sz:1.8+(p.index%4)*.22,color:p.scrubColor,ry:p.index*.71});
 }
 const trunkMesh=makeBatch(scene,new THREE.CylinderGeometry(1,1,1,7),trunks,.94),crownMesh=makeBatch(scene,new THREE.ConeGeometry(1,1,7),crowns,1),scrubMesh=makeBatch(scene,new THREE.IcosahedronGeometry(1,1),scrub,1);
 const setQuality=q=>{trunkMesh.visible=true;crownMesh.visible=true;scrubMesh.visible=true;trunkMesh.castShadow=q==='high';crownMesh.castShadow=q==='high';scrubMesh.castShadow=false;};setQuality(quality);
 return Object.freeze({profiles:Object.freeze(profiles),trunkMesh,crownMesh,scrubMesh,setQuality,drawCalls:3,counts:Object.freeze({trees:profiles.length,trunks:trunks.length,crowns:crowns.length,scrub:scrub.length})});
}
