// Original townsfolk for the bay streets. One instanced batch, with face detail
// up close and a shorter silhouette past 40 m. Schedules are visual only.
import * as THREE from './vendor/three.module.min.js';
import {PERSON_PARTS,PERSON_SLOT,PEOPLE_BOX_GEOMETRY,personLook,namedLook,proceduralJoints,createJointSet,writePerson,createPeopleMeshes,flushPeopleMeshes,breathe,personTriangles} from './people-kit.mjs?v=154';

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
const STREET=Object.freeze([...[-70,-52,-34,-16,2,20,38,56,72,-60,-28,8,44].map(x=>spot(x,4,x%2?Math.PI/2:-Math.PI/2)),
 // v166: loiterers on the winding-lane footpaths (Gutter Lane, Drain Row)
 spot(28.6,-61.65,1.9),spot(56.93,-58.65,-1.4),spot(90.74,-65.6,2.2),spot(-25.74,-62.91,.8),spot(-35.64,-73.06,-2.6)]);

const SKINS=Object.freeze([0xf0c7a2,0xd7a574,0xc68658,0xa56b43,0x8d5524,0x6b442f,0x4e3424,0xe7b898]);
const HAIR=Object.freeze([0x2a241f,0x4a3428,0x6b5034,0x8a6840,0x202428,0x5c4030,0x3a2a22,0xd8d2c6]);
const OUTFITS=Object.freeze([0xc47b62,0x4f7d8a,0x7d6a9a,0xb08948,0x5d7a55,0x8d4d55,0x3f6f78,0xa36b48]);
const PANTS=Object.freeze([0x2c3444,0x3a332c,0x243044,0x3d342e,0x2a3330,0x353044]);

// v146: story characters stand where their cutscenes frame them. Gramps only
// comes home to the pier once the story is complete (namedVisible hook).
export const STREET_NAMED=Object.freeze([
 Object.freeze({key:'marge',label:'Marge',x:0,z:82,yaw:Math.atan2(3,-7),pose:'idle'}),
 Object.freeze({key:'tilly',label:'Tilly',x:-2.6,z:78.4,yaw:Math.PI*.85,pose:'idle'}),
 Object.freeze({key:'gramps',label:'Gramps Gus',x:1.9,z:83.2,yaw:Math.PI*.9,pose:'idle',story:true}),
 Object.freeze({key:'lemon larry',label:'Lemon Larry',x:-92,z:-24,yaw:Math.atan2(11,12),pose:'idle'}),
 Object.freeze({key:'mayor prudence',label:'Mayor Prudence Plum',x:3,z:5.2,yaw:0,pose:'idle'})
]);
// v126: parts come from the shared person kit (soft bodies, rounded heads, painted faces).
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
 const bare=topStyle==='tee'||topStyle==='polo'||topStyle==='overalls',eyewear=colors.glasses?(id%3===0?2:1):base.eyewear===2?2:0;
 return Object.freeze({...base,topStyle,top:colors.outfit,sleeve:bare?colors.skin:colors.outfit,arm:topStyle==='overalls'?base.inner:colors.outfit,pants:topStyle==='overalls'?base.pants:colors.pants,hood:colors.hood,glasses:eyewear>0,eyewear,hoodUp:colors.hoodie&&base.hoodUp});
}
function clearSpot(x,z,blocked){
 if(typeof blocked!=='function'||!blocked(x,z))return {x,z};
 for(let ring=1;ring<=6;ring++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const nx=x+dx*ring,nz=z+dz*ring;
  if(!blocked(nx,nz))return {x:nx,z:nz};
 }
 return {x,z};
}

const local=new THREE.Object3D(),root=new THREE.Matrix4(),scratch=new THREE.Color(),up=new THREE.Vector3(0,1,0),quat=new THREE.Quaternion(),pos=new THREE.Vector3(),unit=new THREE.Vector3(1,1,1),scale=new THREE.Vector3(1,1,1),joints=createJointSet();
// Roughly one in three pedestrians carries an umbrella on rainy days.
export const crowdUmbrella=person=>!!person&&((person.id*7+3)%3===0);
export function createStreetCrowd({THREE:three=THREE,scene,blocked=null,floorHeight=()=>0,capacity=STREET_CROWD_SIZE,time=540,named=STREET_NAMED,followSlots=6}={}){
 if(!scene?.add)throw new TypeError('A street crowd needs a scene.');
 if(!Number.isSafeInteger(capacity)||capacity<8)throw new RangeError('Street crowd capacity must be an integer of at least 8.');
 const cast=Array.isArray(named)?named:[];
 const spare=Math.max(0,Math.trunc(finite(followSlots)));
 const meshes=createPeopleMeshes(three,scene,capacity+cast.length+spare,'Street crowd'),mesh=meshes.box;
 const people=Array.from({length:capacity},(_,id)=>({id,x:0,z:0,yaw:0,activity:'home',pose:'idle',phase:id,look:crowdLook(id)}));
 const stars=cast.map((entry,index)=>({...entry,slot:capacity+index,look:namedLook(entry.key,null,200+index),visible:!entry.story,spotX:entry.x,spotZ:entry.z}));
 // Followers: named people whose position comes from a game object (the Sweet
 // Network dealers). The object's own visibility decides whether they show.
 const followers=[];
 const follow=(label,object)=>{
  if(!object?.position)return null;
  const existing=followers.find(entry=>entry.object===object);if(existing)return existing;
  if(followers.length>=spare)return null;
  const entry={label:String(label||''),object,slot:capacity+stars.length+followers.length,look:namedLook(label,personLook(300+followers.length,'dealer'),300+followers.length),visible:false};
  followers.push(entry);return entry;
 };
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
  for(const star of stars){const at=clearSpot(star.x,star.z,blocked);star.spotX=at.x;star.spotZ=at.z;}
  return people.length;
 };
 const update=({dt=0,now=0,time:timeValue=540,camera=null,active=true,floorHeight:floor=floorHeight,blocked:wall=blocked,rain=0,namedVisible=null}={})=>{
  const pace=Math.max(0,Math.min(.08,finite(dt))),clock=finite(now);
  let near=0;
  for(const person of people){
   const step=person.pinchLock?0:pace;
   const plan=crowdPlan(person.id,timeValue),spot=clearSpot(plan.x,plan.z,wall);
   const dx=spot.x-person.x,dz=spot.z-person.z,dist=Math.hypot(dx,dz);
   let moving=false;
   const knocked=person.koUntil>clock;
   const calling=!knocked&&person.callUntil>clock;
   // P1-6 reactions: {kind,until,x,z,pose}. flee/backoff move away from x,z; the rest hold and face it.
   const react=!knocked&&person.react&&person.react.until>clock?person.react:null;
   const away=react&&(react.kind==='flee'||react.kind==='backoff');
   let turn=0;
   if(away&&step>0){
    const ax=person.x-react.x,az=person.z-react.z,ad=Math.hypot(ax,az)||1,move=(react.kind==='flee'?3.4:1.3)*step;
    const nx=person.x+ax/ad*move,nz=person.z+az/ad*move;
    if(typeof wall!=='function'||!wall(nx,nz)){person.x=nx;person.z=nz;person.phase+=move*(react.kind==='flee'?2:2.6);moving=true;}
    person.yaw=Math.atan2(ax,az);
   }else if(react){
    const want=Math.atan2(react.x-person.x,react.z-person.z),diff=Math.atan2(Math.sin(want-person.yaw),Math.cos(want-person.yaw));
    if(react.kind==='look')turn=Math.max(-1,Math.min(1,diff));else person.yaw+=diff*Math.min(1,step*6);
   }
   if((!react||react.kind==='look')&&dist>.15&&step>0&&!knocked&&!calling){
    // In rain, pedestrians without an umbrella hurry for cover.
    const hurry=rain>.2&&!crowdUmbrella(person)?2.3:1,speed=(plan.pose==='walk'?1.35:.8)*hurry,move=Math.min(dist,speed*step);
    person.x+=dx/dist*move;person.z+=dz/dist*move;person.phase+=move*2.6;person.yaw=Math.atan2(dx,dz);moving=true;
   }else if(!react||react.kind==='look')person.yaw+=(Math.atan2(Math.sin(plan.yaw-person.yaw),Math.cos(plan.yaw-person.yaw)))*Math.min(1,step*4);
   person.activity=knocked?'ko':calling?'phone':react?react.kind:plan.activity;person.pose=knocked?'sit':calling?'use':away?'walk':react&&react.kind!=='look'?'idle':plan.pose;
   const ground=typeof floor==='function'?finite(floor(person.x,person.z)):0;
   const sitting=person.pose==='sit',walking=!knocked&&(moving||person.pose==='walk');
   const cameraDistance=camera?.position?Math.hypot(camera.position.x-person.x,camera.position.z-person.z):0;
   const detail=cameraDistance<STREET_CROWD_FAR;
   if(detail)near++;
   // v154: ease in and out of the walk instead of snapping, and give idlers their own habits.
   person.walkBlend=finite(person.walkBlend)+((walking?1:0)-finite(person.walkBlend))*Math.min(1,step*6);
   const wb=sitting||knocked?0:person.walkBlend,swing=Math.sin(person.phase)*wb;
   const habit=person.id%4,idling=!walking&&!sitting&&!knocked&&!react&&!calling&&person.pose!=='use';
   const idlePose=idling?(habit===1?{turn:Math.sin(clock*.45+person.id)*.45}:habit===2?{armL:{x:.28,z:.12,fore:-.7},armR:{x:.28,z:.12,fore:-.7}}:habit===3?{sway:Math.sin(clock*.7+person.id)*.06}:null):null;
   const blink=Math.abs(Math.sin(clock*.9+person.id*1.7))>.97;
   pos.set(person.x,ground,person.z);quat.setFromAxisAngle(up,person.yaw);root.compose(pos,quat,scale.setScalar(person.look.height||1));
   proceduralJoints(joints,root,{swing,sit:sitting,breath:knocked?0:breathe(clock,person.id)*(1-wb),bob:Math.abs(Math.cos(person.phase))*.04*wb,raise:person.pose==='use'&&!calling?-1.1:0,sway:person.pose==='idle'?Math.sin(clock*1.2+person.id)*.03:0,nod:person.pose==='use'?.12:0,turn,...(react&&!away?react.pose:null),...(calling?{armR:{x:-.45,z:.55,fore:-2.3}}:null),...idlePose});
   writePerson(meshes,person.id,joints,person.look,{detail,face:blink?'blink':'open',active:active&&!person.cc0});
  }
  for(const star of stars){
   star.visible=!star.story||(typeof namedVisible==='function'&&!!namedVisible(star.key));
   if(!star.visible||!active){writePerson(meshes,star.slot,joints,star.look,{active:false});continue;}
   const ground=typeof floor==='function'?finite(floor(star.spotX,star.spotZ)):0;
   const cameraDistance=camera?.position?Math.hypot(camera.position.x-star.spotX,camera.position.z-star.spotZ):0;
   const detail=cameraDistance<STREET_CROWD_FAR;if(detail)near++;
   pos.set(star.spotX,ground,star.spotZ);quat.setFromAxisAngle(up,star.yaw);root.compose(pos,quat,scale.setScalar(star.look.height||1));
   const chat=Math.sin(clock*.5+star.slot)>.55;
   proceduralJoints(joints,root,{sway:Math.sin(clock*1.1+star.slot)*.035,breath:breathe(clock,star.slot),nod:chat?Math.sin(clock*5)*.06:0,armR:chat?{x:-.5+Math.sin(clock*2.2)*.15,z:.25,fore:-1.1}:null});
   const blink=Math.abs(Math.sin(clock*.9+star.slot*1.7))>.97;
   writePerson(meshes,star.slot,joints,star.look,{detail,face:blink?'blink':chat&&Math.sin(clock*9)>0?'talk':'open',active:!star.cc0});
  }
  for(const entry of followers){
   const o=entry.object;entry.visible=!!(active&&o.visible!==false&&o.parent);
   if(!entry.visible){writePerson(meshes,entry.slot,joints,entry.look,{active:false});continue;}
   const x=o.position.x,z=o.position.z,ground=typeof floor==='function'?finite(floor(x,z)):0;
   const detail=!camera?.position||Math.hypot(camera.position.x-x,camera.position.z-z)<STREET_CROWD_FAR;if(detail)near++;
   pos.set(x,ground,z);quat.setFromAxisAngle(up,finite(o.rotation?.y));root.compose(pos,quat,scale.setScalar(entry.look.height||1));
   const pitch=Math.sin(clock*.7+entry.slot)>.4;
   proceduralJoints(joints,root,{sway:Math.sin(clock*1.3+entry.slot)*.03,breath:breathe(clock,entry.slot),bob:Math.abs(Math.sin(clock*1.6+entry.slot))*.012,armR:pitch?{x:-.7,z:.2,fore:-.9}:null,turn:Math.sin(clock*.4+entry.slot)*.35});
   writePerson(meshes,entry.slot,joints,entry.look,{detail,face:Math.abs(Math.sin(clock*.9+entry.slot*1.7))>.97?'blink':pitch&&Math.sin(clock*8)>0?'talk':'open',active:!entry.cc0});
  }
  for(let slot=capacity+stars.length+followers.length;slot<capacity+stars.length+spare;slot++)writePerson(meshes,slot,joints,null,{active:false});
  flushPeopleMeshes(meshes,active,capacity+stars.length+followers.length);
  propMesh.visible=active;
  return {count:people.length,near,written:people.length*STREET_CROWD_PARTS.length};
 };
 const knock=(id,seconds,at=0)=>{const person=people[id];if(!person)return null;person.koUntil=finite(at)+Math.max(0,finite(seconds));person.koStyle=person.koStyle||'stars';return person;};
 const setQuality=q=>{for(const m of [meshes.box,meshes.round])m.castShadow=q==='high',m.receiveShadow=q!=='performance';propMesh.castShadow=q==='high';propMesh.receiveShadow=q!=='performance';};
 const focus=mode=>{
  if(mode==='sit')return people.find(person=>person.pose==='sit')||people[0];
  if(mode==='close')return people.find(person=>person.pose==='idle'||person.pose==='use')||people[0];
  return people[Math.floor(people.length/2)];
 };
 const nearCount=camera=>people.filter(person=>camera?.position&&Math.hypot(camera.position.x-person.x,camera.position.z-person.z)<STREET_CROWD_FAR).length;
 setQuality('balanced');sync(time);update({time,active:true,floorHeight,blocked});
 const tris=far=>personTriangles(far);
 return Object.freeze({mesh,headMesh:meshes.round,bodyMesh:meshes.round,faceMesh:meshes.face,propMesh,people,named:stars,followers,follow,sync,update,knock,setQuality,focus,nearCount,place,drawCalls:4,count:capacity,counts:Object.freeze({people:capacity,named:stars.length,parts:STREET_CROWD_PARTS.length,farParts:STREET_CROWD_PARTS.filter(item=>item.far).length,props:props.length,trianglesNear:tris(false),trianglesFar:tris(true),colliders:0})});
}
