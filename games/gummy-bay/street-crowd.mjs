// Original townsfolk for the bay streets. One instanced batch, with face detail
// up close and a shorter silhouette past 40 m. Schedules are visual only.
import * as THREE from './vendor/three.module.min.js';
import {PERSON_PARTS,PERSON_SLOT,PEOPLE_BOX_GEOMETRY,personLook,proceduralJoints,createJointSet,writePerson,createPeopleMeshes,flushPeopleMeshes} from './people-kit.mjs?v=126';

export const STREET_CROWD_COLLIDERS=Object.freeze([]);
export const STREET_CROWD_FAR=40;
export const STREET_CROWD_SIZE=32;

const spot=(x,z,yaw=0)=>Object.freeze({x,z,yaw});
const HOMES=Object.freeze([-64,-48,-32,-16,0,16,32,48,64,-56,-24,8,40,-40,24,56].map(x=>spot(x,46,Math.PI)));
const JOBS=Object.freeze([
 spot(-25,29,Math.PI),spot(-18,29,Math.PI),spot(25,34,Math.PI),spot(32,34,Math.PI),
 spot(-24,-11,0),spot(-16,-11,0),spot(24,-12,0),spot(32,-12,0),
 spot(53,33,Math.PI),spot(-53,-16,0),spot(54,-14,0),spot(-70,-28,0)
]);
const BENCHES=Object.freeze([spot(-36,8,Math.PI),spot(-8,8,Math.PI),spot(22,8,Math.PI),spot(52,8,Math.PI)]);
const VENDING=Object.freeze([spot(-12,5,0),spot(38,5,0),spot(-52,2,0)]);
const ATMS=Object.freeze([spot(16,-9.2,Math.PI),spot(-17,30,0)]);
const STREET=Object.freeze([-70,-52,-34,-16,2,20,38,56,72,-60,-28,8,44].map(x=>spot(x,4,x%2?Math.PI/2:-Math.PI/2)));

const SKINS=Object.freeze([0xf0c7a2,0xd7a574,0xc68658,0xa56b43,0x8d5524,0x6b442f,0x4e3424,0xe7b898]);
const HAIR=Object.freeze([0x2a241f,0x4a3428,0x6b5034,0x8a6840,0x202428,0x5c4030,0x3a2a22,0xd8d2c6]);
const OUTFITS=Object.freeze([0xc47b62,0x4f7d8a,0x7d6a9a,0xb08948,0x5d7a55,0x8d4d55,0x3f6f78,0xa36b48]);
const PANTS=Object.freeze([0x2c3444,0x3a332c,0x243044,0x3d342e,0x2a3330,0x353044]);

// v126: parts come from the shared person kit (box bodies, rounded heads, painted faces).
export const STREET_CROWD_PARTS=PERSON_PARTS;
export const STREET_CROWD_PART_INDEX=PERSON_SLOT;
export const STREET_BOX=PEOPLE_BOX_GEOMETRY;
const PROP_MATERIAL=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92,metalness:0,flatShading:true});

const finite=value=>Number.isFinite(value)?value:0;
const minuteOf=time=>{const t=finite(time);return ((t%1440)+1440)%1440;};
const mix=(a,b,t,yaw)=>Object.freeze({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,yaw});
export function crowdRoute(id=0){
 const n=Math.abs(Math.trunc(finite(id)));
 // People who share a spot stand side by side instead of inside each other.
 const lane=(list,index=n,gap=.85)=>{const base=list[index%list.length],k=Math.floor(index/list.length);if(!k)return base;const side=k%2?1:-1,step=Math.ceil(k/2)*gap;return spot(base.x+Math.cos(base.yaw)*side*step,base.z-Math.sin(base.yaw)*side*step,base.yaw);};
 return Object.freeze({
  id:n,kind:n%4,
  home:lane(HOMES),job:lane(JOBS),bench:lane(BENCHES,(n>>2)%4+4*(n>>4),.5),
  vend:lane(VENDING),atm:lane(ATMS),street:lane(STREET)
 });
}
export function crowdPlan(id=0,time=540){
 const minute=minuteOf(time),route=crowdRoute(id),span=route.kind;
 if(minute>=1200||minute<360)return Object.freeze({activity:'home',pose:'sit',...route.home});
 if(minute<480)return Object.freeze({activity:'commute',pose:'walk',...mix(route.home,route.job,(minute-360)/120,Math.atan2(route.job.x-route.home.x,route.job.z-route.home.z))});
 if(minute<720){
  if(span===0||span===3)return Object.freeze({activity:'work',pose:'idle',...route.job});
  if(span===1)return Object.freeze({activity:'street',pose:'walk',...route.street});
  return Object.freeze({activity:'sit',pose:'sit',...route.bench});
 }
 if(minute<840){
  if(span===0)return Object.freeze({activity:'sit',pose:'sit',...route.bench});
  if(span===1)return Object.freeze({activity:'vend',pose:'use',...route.vend});
  if(span===2)return Object.freeze({activity:'atm',pose:'use',...route.atm});
  return Object.freeze({activity:'street',pose:'walk',...route.street});
 }
 if(minute<1020){
  if(span===2&&minute<930)return Object.freeze({activity:'atm',pose:'use',...route.atm});
  if(span===0||span===3)return Object.freeze({activity:'work',pose:'idle',...route.job});
  return Object.freeze({activity:'street',pose:'walk',...route.street});
 }
 return Object.freeze({activity:'commute',pose:'walk',...mix(route.job,route.home,(minute-1020)/180,Math.atan2(route.home.x-route.job.x,route.home.z-route.job.z))});
}
export function crowdPalette(id=0){
 const n=Math.abs(Math.trunc(finite(id)));
 const outfit=n%4===0?0x4a6d96:n%13===0?0x6d3050:OUTFITS[n%OUTFITS.length];
 return Object.freeze({
  skin:SKINS[n%SKINS.length],face:SKINS[n%SKINS.length],hair:n%9===0?0xe07a28:HAIR[n%HAIR.length],
  ink:0x1c1916,mouth:0x6d3a38,outfit,pants:n%4===0?0x2a3c58:PANTS[n%PANTS.length],
  hood:n%3===1?0x2e3844:outfit,frame:0x23262b,hoodie:n%3===1,glasses:n%5===0
 });
}
export function crowdLook(id=0){
 const colors=crowdPalette(id),base=personLook(id,'townsfolk',{skin:colors.skin,hair:colors.hair,color:colors.outfit});
 const topStyle=colors.hoodie?'hoodie':base.topStyle==='hoodie'?'jacket':base.topStyle;
 return Object.freeze({...base,topStyle,top:colors.outfit,sleeve:topStyle==='tee'?colors.skin:colors.outfit,pants:colors.pants,hood:colors.hood,glasses:colors.glasses,hoodUp:colors.hoodie&&base.hoodUp});
}
function clearSpot(x,z,blocked){
 if(typeof blocked!=='function'||!blocked(x,z))return {x,z};
 for(let ring=1;ring<=6;ring++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const nx=x+dx*ring,nz=z+dz*ring;
  if(!blocked(nx,nz))return {x:nx,z:nz};
 }
 return {x,z};
}

const local=new THREE.Object3D(),root=new THREE.Matrix4(),scratch=new THREE.Color(),up=new THREE.Vector3(0,1,0),quat=new THREE.Quaternion(),pos=new THREE.Vector3(),unit=new THREE.Vector3(1,1,1),joints=createJointSet();
export function createStreetCrowd({THREE:three=THREE,scene,blocked=null,floorHeight=()=>0,capacity=STREET_CROWD_SIZE,time=540}={}){
 if(!scene?.add)throw new TypeError('A street crowd needs a scene.');
 if(!Number.isSafeInteger(capacity)||capacity<8)throw new RangeError('Street crowd capacity must be an integer of at least 8.');
 const meshes=createPeopleMeshes(three,scene,capacity,'Street crowd'),mesh=meshes.box;
 const people=Array.from({length:capacity},(_,id)=>({id,x:0,z:0,yaw:0,activity:'home',pose:'idle',phase:id,look:crowdLook(id)}));
 const props=[];
 for(const bench of BENCHES){props.push({x:bench.x,y:.48,z:bench.z,w:1.15,h:.08,d:.42,color:0x8a6244},{x:bench.x,y:.78,z:bench.z+.18,w:1.15,h:.42,d:.08,color:0x6d4c34});}
 for(const machine of VENDING){props.push({x:machine.x,y:.95,z:machine.z,w:.72,h:1.7,d:.5,color:0x3c6e62},{x:machine.x,y:1.15,z:machine.z+.28,w:.5,h:.72,d:.04,color:0xd5e2b4});}
 const propMesh=new three.InstancedMesh(STREET_BOX,PROP_MATERIAL,props.length);
 propMesh.name='Street crowd props';propMesh.frustumCulled=false;propMesh.castShadow=false;propMesh.receiveShadow=true;scene.add(propMesh);
 props.forEach((item,index)=>{local.position.set(item.x,item.y,item.z);local.rotation.set(0,0,0);local.scale.set(item.w,item.h,item.d);local.updateMatrix();propMesh.setMatrixAt(index,local.matrix);propMesh.setColorAt(index,scratch.setHex(item.color));});
 propMesh.count=props.length;propMesh.instanceMatrix.needsUpdate=true;if(propMesh.instanceColor)propMesh.instanceColor.needsUpdate=true;
 const place=(plan)=>clearSpot(plan.x,plan.z,blocked);
 const sync=timeValue=>{
  for(const person of people){
   const plan=crowdPlan(person.id,timeValue),spot=place(plan);
   person.x=spot.x;person.z=spot.z;person.yaw=plan.yaw;person.activity=plan.activity;person.pose=plan.pose;
  }
  return people.length;
 };
 const update=({dt=0,now=0,time:timeValue=540,camera=null,active=true,floorHeight:floor=floorHeight,blocked:wall=blocked}={})=>{
  const step=Math.max(0,Math.min(.08,finite(dt))),clock=finite(now);
  let near=0;
  for(const person of people){
   const plan=crowdPlan(person.id,timeValue),spot=clearSpot(plan.x,plan.z,wall);
   const dx=spot.x-person.x,dz=spot.z-person.z,dist=Math.hypot(dx,dz);
   let moving=false;
   if(dist>.15&&step>0){
    const speed=plan.pose==='walk'?1.35:.8,move=Math.min(dist,speed*step);
    person.x+=dx/dist*move;person.z+=dz/dist*move;person.phase+=move*2.6;person.yaw=Math.atan2(dx,dz);moving=true;
   }else person.yaw+=(Math.atan2(Math.sin(plan.yaw-person.yaw),Math.cos(plan.yaw-person.yaw)))*Math.min(1,step*4);
   person.activity=plan.activity;person.pose=plan.pose;
   const ground=typeof floor==='function'?finite(floor(person.x,person.z)):0;
   const sitting=person.pose==='sit',walking=moving||person.pose==='walk';
   const cameraDistance=camera?.position?Math.hypot(camera.position.x-person.x,camera.position.z-person.z):0;
   const detail=cameraDistance<STREET_CROWD_FAR;
   if(detail)near++;
   const swing=walking?Math.sin(person.phase):0;
   const blink=Math.abs(Math.sin(clock*.9+person.id*1.7))>.97;
   pos.set(person.x,ground,person.z);quat.setFromAxisAngle(up,person.yaw);root.compose(pos,quat,unit);
   proceduralJoints(joints,root,{swing,sit:sitting,bob:walking?Math.abs(Math.cos(person.phase))*.03:0,raise:person.pose==='use'?-1.1:0,sway:person.pose==='idle'?Math.sin(clock*1.2+person.id)*.03:0,nod:person.pose==='use'?.12:0});
   writePerson(meshes,person.id,joints,person.look,{detail,face:blink?'blink':'open',active});
  }
  flushPeopleMeshes(meshes,active);
  propMesh.visible=active;
  return {count:people.length,near,written:people.length*STREET_CROWD_PARTS.length};
 };
 const setQuality=q=>{for(const m of [meshes.box,meshes.round])m.castShadow=q==='high',m.receiveShadow=q!=='performance';propMesh.castShadow=q==='high';propMesh.receiveShadow=q!=='performance';};
 const focus=mode=>{
  if(mode==='sit')return people.find(person=>person.pose==='sit')||people[0];
  if(mode==='close')return people.find(person=>person.pose==='idle'||person.pose==='use')||people[0];
  return people[Math.floor(people.length/2)];
 };
 const nearCount=camera=>people.filter(person=>camera?.position&&Math.hypot(camera.position.x-person.x,camera.position.z-person.z)<STREET_CROWD_FAR).length;
 setQuality('balanced');sync(time);update({time,active:true,floorHeight,blocked});
 const boxTris=12,roundTris=48,count=(list,far)=>list.filter(p=>!far||p.far);
 const tris=far=>count(PERSON_PARTS.filter(p=>p.mesh==='box'),far).length*boxTris+count(PERSON_PARTS.filter(p=>p.mesh==='round'),far).length*roundTris+(far?0:2);
 return Object.freeze({mesh,headMesh:meshes.round,faceMesh:meshes.face,propMesh,people,sync,update,setQuality,focus,nearCount,place,drawCalls:4,count:capacity,counts:Object.freeze({people:capacity,parts:STREET_CROWD_PARTS.length,farParts:STREET_CROWD_PARTS.filter(item=>item.far).length,props:props.length,trianglesNear:tris(false),trianglesFar:tris(true),colliders:0})});
}
