// Original townsfolk for the bay streets. One instanced batch, with face detail
// up close and a shorter silhouette past 40 m. Schedules are visual only.
import * as THREE from './vendor/three.module.min.js';

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

const part=(name,x,y,z,w,h,d,slot,far)=>Object.freeze({name,x,y,z,w,h,d,slot,far});
export const STREET_CROWD_PARTS=Object.freeze([
 part('head',0,1.56,0,.46,.34,.38,'skin',true),
 part('face',0,1.57,.21,.30,.24,.025,'face',false),
 part('eyeL',-.09,1.63,.232,.06,.055,.02,'ink',false),
 part('eyeR',.09,1.63,.232,.06,.055,.02,'ink',false),
 part('browL',-.09,1.70,.228,.11,.02,.016,'hair',false),
 part('browR',.09,1.70,.228,.11,.02,.016,'hair',false),
 part('mouth',0,1.48,.232,.11,.02,.016,'mouth',false),
 part('nose',0,1.56,.25,.05,.045,.04,'skin',false),
 part('neck',0,1.34,0,.12,.12,.12,'skin',true),
 part('torso',0,1.05,0,.36,.42,.24,'outfit',true),
 part('pelvis',0,.74,0,.34,.18,.22,'pants',true),
 part('armL',-.24,1.08,0,.11,.34,.11,'outfit',true),
 part('armR',.24,1.08,0,.11,.34,.11,'outfit',true),
 part('handL',-.24,.86,.02,.1,.1,.08,'skin',false),
 part('handR',.24,.86,.02,.1,.1,.08,'skin',false),
 part('thighL',-.09,.48,0,.13,.32,.13,'pants',true),
 part('thighR',.09,.48,0,.13,.32,.13,'pants',true),
 part('shinL',-.09,.2,0,.11,.28,.11,'pants',true),
 part('shinR',.09,.2,0,.11,.28,.11,'pants',true),
 part('hood',0,1.68,-.02,.52,.16,.42,'hood',false),
 part('glasses',0,1.63,.24,.28,.07,.012,'frame',false)
]);
export const STREET_CROWD_PART_INDEX=Object.freeze(Object.fromEntries(STREET_CROWD_PARTS.map((item,index)=>[item.name,index])));
export const STREET_BOX=new THREE.BoxGeometry(1,1,1);
const CROWD_MATERIAL=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:0,vertexColors:true,flatShading:true});
const PROP_MATERIAL=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92,metalness:0,vertexColors:true,flatShading:true});

const finite=value=>Number.isFinite(value)?value:0;
const minuteOf=time=>{const t=finite(time);return ((t%1440)+1440)%1440;};
const mix=(a,b,t,yaw)=>Object.freeze({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,yaw});
export function crowdRoute(id=0){
 const n=Math.abs(Math.trunc(finite(id)));
 return Object.freeze({
  id:n,kind:n%4,
  home:HOMES[n%HOMES.length],job:JOBS[n%JOBS.length],bench:BENCHES[n%BENCHES.length],
  vend:VENDING[n%VENDING.length],atm:ATMS[n%ATMS.length],street:STREET[n%STREET.length]
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
function clearSpot(x,z,blocked){
 if(typeof blocked!=='function'||!blocked(x,z))return {x,z};
 for(let ring=1;ring<=6;ring++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const nx=x+dx*ring,nz=z+dz*ring;
  if(!blocked(nx,nz))return {x:nx,z:nz};
 }
 return {x,z};
}

const local=new THREE.Object3D(),root=new THREE.Matrix4(),world=new THREE.Matrix4(),scratch=new THREE.Color(),up=new THREE.Vector3(0,1,0),quat=new THREE.Quaternion(),pos=new THREE.Vector3(),unit=new THREE.Vector3(1,1,1);
export function createStreetCrowd({THREE:three=THREE,scene,blocked=null,floorHeight=()=>0,capacity=STREET_CROWD_SIZE,time=540}={}){
 if(!scene?.add)throw new TypeError('A street crowd needs a scene.');
 if(!Number.isSafeInteger(capacity)||capacity<8)throw new RangeError('Street crowd capacity must be an integer of at least 8.');
 const geometry=STREET_BOX,material=CROWD_MATERIAL;
 const mesh=new three.InstancedMesh(geometry,material,capacity*STREET_CROWD_PARTS.length);
 mesh.name='Street crowd';mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=true;
 mesh.instanceMatrix.setUsage(three.DynamicDrawUsage);scene.add(mesh);
 const people=Array.from({length:capacity},(_,id)=>({id,x:0,z:0,yaw:0,activity:'home',pose:'idle',phase:id}));
 const props=[];
 for(const bench of BENCHES){props.push({x:bench.x,y:.48,z:bench.z,w:1.15,h:.08,d:.42,color:0x8a6244},{x:bench.x,y:.78,z:bench.z+.18,w:1.15,h:.42,d:.08,color:0x6d4c34});}
 for(const machine of VENDING){props.push({x:machine.x,y:.95,z:machine.z,w:.72,h:1.7,d:.5,color:0x3c6e62},{x:machine.x,y:1.15,z:machine.z+.28,w:.5,h:.72,d:.04,color:0xd5e2b4});}
 const propMesh=new three.InstancedMesh(geometry,PROP_MATERIAL,props.length);
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
  let written=0,near=0;
  for(const person of people){
   const plan=crowdPlan(person.id,timeValue),spot=clearSpot(plan.x,plan.z,wall);
   const dx=spot.x-person.x,dz=spot.z-person.z,dist=Math.hypot(dx,dz);
   if(dist>.15&&step>0){
    const speed=plan.pose==='walk'?1.35:.8,move=Math.min(dist,speed*step);
    person.x+=dx/dist*move;person.z+=dz/dist*move;person.phase+=move*2.4;person.yaw=Math.atan2(dx,dz);
   }else person.yaw+=(Math.atan2(Math.sin(plan.yaw-person.yaw),Math.cos(plan.yaw-person.yaw)))*Math.min(1,step*4);
   person.activity=plan.activity;person.pose=plan.pose;
   const ground=typeof floor==='function'?finite(floor(person.x,person.z)):0;
   const sitting=person.pose==='sit';
   const cameraDistance=camera?.position?Math.hypot(camera.position.x-person.x,camera.position.z-person.z):0;
   const detail=cameraDistance<STREET_CROWD_FAR;
   if(detail)near++;
   const colors=crowdPalette(person.id);
   const swing=person.pose==='walk'?Math.sin(person.phase):Math.sin(clock*1.3+person.id)*.08;
   const blink=Math.abs(Math.sin(clock*.9+person.id*1.7))>.97;
   const raised=person.pose==='use'?-.7:0;
   pos.set(person.x,ground+(sitting?-0.42:0),person.z);quat.setFromAxisAngle(up,person.yaw);root.compose(pos,quat,unit);
   for(const item of STREET_CROWD_PARTS){
    const enabled=active&&(detail||item.far)&&(item.name!=='hood'||colors.hoodie)&&(item.name!=='glasses'||colors.glasses);
    let y=item.y,h=item.h,rotX=0,rotZ=0;
    if(item.name.startsWith('thigh'))rotX=sitting?1.15:swing*(item.name.endsWith('L')?1:-1)*.55;
    if(item.name.startsWith('shin'))rotX=sitting?-.9:0;
    if(item.name.startsWith('arm'))rotX=(item.name==='armR'?raised:0)+swing*(item.name.endsWith('L')?-1:1)*.45;
    if(item.name.startsWith('hand'))rotX=(item.name==='handR'?raised:0);
    if(item.name==='eyeL'||item.name==='eyeR')h=blink?.012:item.h;
    if(item.name==='torso')rotZ=person.pose==='idle'?Math.sin(clock*1.2+person.id)*.05:0;
    local.position.set(item.x,y,item.z);local.rotation.set(rotX,0,rotZ);local.scale.set(enabled?item.w:0,enabled?h:0,enabled?item.d:0);local.updateMatrix();
    if(enabled)world.multiplyMatrices(root,local.matrix);else world.makeScale(0,0,0);
    mesh.setMatrixAt(written,world);
    mesh.setColorAt(written,scratch.setHex(colors[item.slot]||colors.outfit));
    written++;
   }
  }
  mesh.count=written;mesh.visible=active&&written>0;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  propMesh.visible=active;
  return {count:people.length,near,written};
 };
 const setQuality=q=>{mesh.castShadow=q==='high';mesh.receiveShadow=q!=='performance';propMesh.castShadow=q==='high';propMesh.receiveShadow=q!=='performance';};
 const focus=mode=>{
  if(mode==='sit')return people.find(person=>person.pose==='sit')||people[0];
  if(mode==='close')return people.find(person=>person.pose==='idle'||person.pose==='use')||people[0];
  return people[Math.floor(people.length/2)];
 };
 const nearCount=camera=>people.filter(person=>camera?.position&&Math.hypot(camera.position.x-person.x,camera.position.z-person.z)<STREET_CROWD_FAR).length;
 setQuality('balanced');sync(time);update({time,active:true,floorHeight,blocked});
 const nearParts=STREET_CROWD_PARTS.length,farParts=STREET_CROWD_PARTS.filter(item=>item.far).length,boxTris=STREET_BOX.index.count/3;
 return Object.freeze({mesh,propMesh,people,sync,update,setQuality,focus,nearCount,place,drawCalls:2,count:capacity,counts:Object.freeze({people:capacity,parts:nearParts,farParts,props:props.length,trianglesNear:boxTris*nearParts,trianglesFar:boxTris*farParts,colliders:0})});
}
