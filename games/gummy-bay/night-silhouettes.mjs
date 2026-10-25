import * as THREE from './vendor/three.module.min.js';
import {worldLighting} from './world-lighting.mjs?v=41';
import {STREET_PROP_PROFILES} from './contextual-street-props.mjs?v=76';

const freezeRecords=records=>Object.freeze(records.map(record=>Object.freeze(record)));
const finite=n=>Number.isFinite(n);

export function nightSilhouettePlan(time,active=true){
 const lighting=worldLighting(time,!!active),night=active?lighting.night:0;
 return Object.freeze({active:!!active,night,emissiveIntensity:.04+night*.52,residentVisible:!!active,obstacleVisible:!!active});
}

export function nightObstacleProfile(profile,index=0){
 if(!profile||typeof profile.id!=='string'||!profile.id||![profile.x,profile.z,profile.roadZ,profile.footprint?.w,profile.footprint?.d,index].every(finite)||profile.footprint.w<=0||profile.footprint.d<=0)return null;
 const roadSign=Math.sign(profile.z-profile.roadZ)||1,frontZ=profile.z-roadSign*profile.footprint.d*.42,offset=Math.max(.32,profile.footprint.w*.34);
 const tags=freezeRecords([-1,1].map(side=>({part:side<0?'left-reflector':'right-reflector',x:profile.x+side*offset,y:.46,z:frontZ,w:.28,h:.34,d:.035,color:0xd8c889})));
 return Object.freeze({id:profile.id,index,x:profile.x,z:profile.z,roadZ:profile.roadZ,footprint:profile.footprint,collider:profile.collider,tags});
}

export const NIGHT_OBSTACLE_PROFILES=Object.freeze(STREET_PROP_PROFILES.map(nightObstacleProfile));
export const NIGHT_SILHOUETTE_COLLIDERS=Object.freeze([]);

const makeMaterial=()=>new THREE.MeshStandardMaterial({color:0xafa77c,emissive:0xd6c27a,emissiveIntensity:.04,roughness:.72,metalness:.04,flatShading:true});
function makeResidentBatch(scene,capacity){
 const mesh=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1,1,12),makeMaterial(),capacity*2);
 mesh.count=0;mesh.userData.capacity=capacity;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.castShadow=false;mesh.receiveShadow=true;mesh.frustumCulled=false;scene.add(mesh);return mesh;
}
function makeObstacleBatch(scene,profiles){
 const items=profiles.flatMap(profile=>profile.tags.map(tag=>Object.freeze({profile,tag}))),mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),makeMaterial(),items.length),object=new THREE.Object3D(),color=new THREE.Color();
 mesh.userData.items=items;for(const [index,item] of items.entries()){const p=item.tag;object.position.set(p.x,p.y,p.z);object.scale.set(p.w,p.h,p.d);object.updateMatrix();mesh.setMatrixAt(index,object.matrix);mesh.setColorAt(index,color.setHex(p.color));}
 mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=false;mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
const uniqueActors=actors=>[...new Set(actors.filter(actor=>actor&&typeof actor.updateMatrixWorld==='function'))];
function updateResidents(mesh,actors,active,scratch){
 const {local,world,current,seen}=scratch,bands=[{y:1.03,r:.345,h:.065},{y:.34,r:.16,h:.055}];current.length=0;seen.clear();
 for(const actor of actors)if(actor&&typeof actor.updateMatrixWorld==='function'&&!seen.has(actor)&&current.length<mesh.userData.capacity){seen.add(actor);current.push(actor);}mesh.count=current.length*2;
 for(const [actorIndex,actor] of current.entries()){
  actor.updateMatrixWorld(true);
  for(const [bandIndex,band] of bands.entries()){
   const index=actorIndex*2+bandIndex;local.position.set(0,band.y,0);local.scale.set(active?band.r:0,active?band.h:0,active?band.r:0);local.updateMatrix();world.multiplyMatrices(actor.matrixWorld,local.matrix);mesh.setMatrixAt(index,world);
  }
 }
 mesh.instanceMatrix.needsUpdate=true;
}

export function createNightSilhouettes({scene,actors=[],obstacles=STREET_PROP_PROFILES,quality='balanced'}={}){
 if(!scene||!Array.isArray(actors)||!Array.isArray(obstacles)||actors.some(actor=>!actor||typeof actor.updateMatrixWorld!=='function'))throw new TypeError('Night silhouettes need a scene, actor roots and obstacle records.');
 const actorSource=actors,capacity=Math.max(32,uniqueActors(actorSource).length),profiles=Object.freeze(obstacles.map(nightObstacleProfile).filter(Boolean)),residentMesh=makeResidentBatch(scene,capacity),obstacleMesh=makeObstacleBatch(scene,profiles),residentScratch={local:new THREE.Object3D(),world:new THREE.Matrix4(),current:[],seen:new Set()};let activeState=false;
 const update=({active=true,time=540}={})=>{const plan=nightSilhouettePlan(time,active);activeState=plan.active;updateResidents(residentMesh,actorSource,activeState,residentScratch);residentMesh.visible=plan.residentVisible;obstacleMesh.visible=plan.obstacleVisible;residentMesh.material.emissiveIntensity=plan.emissiveIntensity;obstacleMesh.material.emissiveIntensity=plan.emissiveIntensity;return plan;};
 const setQuality=q=>{residentMesh.castShadow=false;obstacleMesh.castShadow=false;residentMesh.receiveShadow=q!=='performance';obstacleMesh.receiveShadow=q!=='performance';residentMesh.visible=activeState;obstacleMesh.visible=activeState;};
 update({active:false});setQuality(quality);
 const counts={};Object.defineProperties(counts,{actors:{enumerable:true,get:()=>uniqueActors(actorSource).length},residentBands:{enumerable:true,get:()=>uniqueActors(actorSource).length*2},obstacles:{enumerable:true,value:profiles.length},obstacleTags:{enumerable:true,value:profiles.length*2},parts:{enumerable:true,get:()=>uniqueActors(actorSource).length*2+profiles.length*2},colliders:{enumerable:true,value:0}});Object.freeze(counts);
 const result={get actors(){return Object.freeze(uniqueActors(actorSource));},obstacleProfiles:profiles,residentMesh,obstacleMesh,update,setQuality,drawCalls:2,counts};return Object.freeze(result);
}
