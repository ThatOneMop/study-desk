// Original low-poly people for Gummy Bay. One instanced box batch follows the
// existing animated bones: oversized heads, flat faces, mitten hands, role colours.
import * as THREE from './vendor/three.module.min.js';
import {residentExpressionState} from './resident-expressions.mjs';
import {PERSON_PARTS,PERSON_SLOT,PEOPLE_BOX_GEOMETRY,personLook,personPartEnabled,createJointSet,writePerson,createPeopleMeshes,flushPeopleMeshes,poseArms} from './people-kit.mjs?v=142';

export const CHUNKY_CAST_COLLIDERS=Object.freeze([]);
const freeze=records=>Object.freeze(records.map(record=>Object.freeze(record)));
export const CHUNKY_CAST_PROFILES=freeze([
 {id:'plain',glasses:false,hood:false,collar:false},
 {id:'glasses',glasses:true,hood:false,collar:false},
 {id:'hood',glasses:false,hood:true,collar:false},
 {id:'specs',glasses:true,hood:false,collar:true},
 {id:'jacket',glasses:false,hood:false,collar:true},
 {id:'bundle',glasses:true,hood:true,collar:false},
 {id:'collar',glasses:false,hood:false,collar:true},
 {id:'shades',glasses:true,hood:false,collar:false}
]);
export const CHUNKY_CAST_ROLES=Object.freeze(['police','worker','seller','dealer','customer','townsfolk']);
const PANTS=[0x2c3444,0x3a332c,0x243044,0x3d342e,0x2a3330,0x353044,0x3e2c28,0x2e3840];

// v126: the cast shares the person kit with the street crowd. Parts ride the
// animated bones by position and rotation only; bone stretch from the sculpted
// rig is ignored, which is what made v125 heads tall blocks on thin limbs.
export const CHUNKY_PART_LAYOUT=PERSON_PARTS;
export const CHUNKY_PART_INDEX=PERSON_SLOT;
export const CHUNKY_BOX_GEOMETRY=PEOPLE_BOX_GEOMETRY;
export const CHUNKY_JOINT_BONES=Object.freeze({hips:'Hips',chest:'Chest',head:'Head',armL:'UpperArm-1',armR:'UpperArm1',foreL:'Forearm-1',foreR:'Forearm1',thighL:'Thigh-1',thighR:'Thigh1',shinL:'Shin-1',shinR:'Shin1'});
const LIMB_JOINTS=new Set(['armL','armR','foreL','foreR','thighL','thighR','shinL','shinR']);
const HAND_MATERIALS=new Map();
function handMaterial(color){
 if(!HAND_MATERIALS.has(color))HAND_MATERIALS.set(color,new THREE.MeshStandardMaterial({color,roughness:.88,metalness:0,flatShading:true}));
 return HAND_MATERIALS.get(color);
}

const finite=value=>Number.isFinite(value)?value:0;
export function chunkyCastProfile(id=0){
 const span=CHUNKY_CAST_PROFILES.length;
 const index=Number.isFinite(id)?Math.abs(Math.trunc(id))%span:0;
 return CHUNKY_CAST_PROFILES[index];
}
export function chunkyCastRole(actor,points){
 if(actor?.userData?.cop)return 'police';
 const crew=actor?.userData?.crew;
 if(crew==='worker')return 'worker';
 if(crew==='seller')return 'seller';
 const type=Array.isArray(points)?points.find(point=>point?.actor===actor)?.type:'';
 if(type==='customer')return 'customer';
 if(type==='dealer')return 'dealer';
 return 'townsfolk';
}
export function chunkyCastLook(actor,role,id){
 const palette=actor?.g?.userData?.palette||actor?.userData?.palette||{},profile=chunkyCastProfile(id);
 const base=personLook(id,role,palette);
 if(role==='police'||role==='worker')return base;
 const topStyle=profile.hood?'hoodie':base.topStyle==='hoodie'?'jacket':base.topStyle;
 return Object.freeze({...base,topStyle,glasses:profile.glasses,sleeve:topStyle==='tee'?base.skin:base.top,hood:base.top,hoodUp:topStyle==='hoodie'&&base.hoodUp});
}
export function chunkyPartEnabled(part,role,profile,id=0){
 return personPartEnabled(part,chunkyCastLook({userData:{}},role,Number.isFinite(profile?.index)?profile.index:id));
}
export function chunkyCastPose({clip='Idle',blink=0,browLift=0,now=0}={}){
 const talking=clip==='Talk',working=clip==='Work'||clip==='Search';
 const closed=Math.max(0,Math.min(1,finite(blink)));
 const pulse=talking?(Math.sin(finite(now)*8.5)+1)/2:0;
 return Object.freeze({
  talking,working,
  eyeY:Math.max(.012,.07*(1-closed)),
  brow:finite(browLift),
  mouthH:talking?.018+pulse*.05:working?.026:.016,
  reach:talking?.07:working?.045:0
 });
}
export function concealSculptedResident(body){
 let hidden=0;
 body?.traverse?.(object=>{if(object.isSkinnedMesh){object.visible=false;hidden++;}});
 return hidden;
}
function hideSculpted(actor){
 actor?.body?.traverse?.(object=>{if(object.isMesh)object.visible=false;});
 if(actor?.hairstyle?.mesh)actor.hairstyle.mesh.visible=false;
}
const bonePos=new THREE.Vector3(),boneQuat=new THREE.Quaternion(),boneScale=new THREE.Vector3(),chestPos=new THREE.Vector3(),flip=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI),unit=new THREE.Vector3(1,1,1),drop=new THREE.Matrix4();
// Upright, unstretched joint frames from the skeleton. Returns false when a bone is missing.
export function chunkyJointsFromBody(body,joints){
 for(const [joint,name] of Object.entries(CHUNKY_JOINT_BONES)){
  const bone=body.getObjectByName(name);if(!bone)return false;
  bone.matrixWorld.decompose(bonePos,boneQuat,boneScale);
  if(LIMB_JOINTS.has(joint))boneQuat.multiply(flip);
  joints[joint].compose(bonePos,boneQuat,unit);
 }
 // The sculpted rig keeps a long neck; seat the kit head 0.41 m above the chest bone.
 chestPos.setFromMatrixPosition(joints.chest);bonePos.setFromMatrixPosition(joints.head);
 const extra=Math.max(0,bonePos.distanceTo(chestPos)-.41);
 if(extra>0)joints.head.multiply(drop.makeTranslation(0,-extra,0));
 return true;
}
// P1-6: gummy effects and reactions ride on top of the bone pose. fx = {scale:[x,y,z], headTurn, arms:{armL,armR}, tint, face}.
const fxScale=new THREE.Matrix4(),fxTurn=new THREE.Matrix4();
export function applyChunkyFx(joints,fx){
 if(fx.arms)poseArms(joints,fx.arms);
 if(fx.headTurn)joints.head.multiply(fxTurn.makeRotationY(fx.headTurn));
 const sc=fx.scale;
 if(sc&&(sc[0]!==1||sc[1]!==1||sc[2]!==1)){fxScale.makeScale(sc[0],sc[1],sc[2]);for(const key of Object.keys(joints))joints[key].multiply(fxScale);}
 return joints;
}
export function createChunkyCast({THREE:three=THREE,scene,actors,points,quality='balanced',capacity=48}={}){
 if(!scene?.add||!Array.isArray(actors))throw new TypeError('A chunky cast needs a scene and the live actor list.');
 if(!Number.isSafeInteger(capacity)||capacity<1)throw new RangeError('Chunky cast capacity must be a positive integer.');
 const meshes=createPeopleMeshes(three,scene,capacity,'Chunky cast'),mesh=meshes.box,joints=createJointSet(),looks=new Map();
 const update=({now=0,camera=null}={})=>{
  let count=0;
  for(const actor of actors){
   if(count>=capacity)break;
   const body=actor?.body,root=actor?.g;
   let show=!!body&&body.visible!==false&&root?.visible!==false&&typeof body.getObjectByName==='function';
   const id=Number.isFinite(root?.userData?.id)?root.userData.id:count;
   const role=chunkyCastRole(root,points);
   const key=id+':'+role;if(!looks.has(key))looks.set(key,chunkyCastLook(actor,role,Math.abs(Math.trunc(id))));
   const clip=typeof actor?.current==='string'?actor.current:'Idle';
   const distance=camera?.position&&root?.position?.distanceTo?root.position.distanceTo(camera.position):0;
   const expression=residentExpressionState({now,id,talking:clip==='Talk',working:clip==='Work'||clip==='Search',moving:(actor?.speed||0)>.08,active:show,distance});
   const pose=chunkyCastPose({clip,blink:expression.blink,browLift:expression.browLift,now});
   if(show){hideSculpted(actor);body.updateWorldMatrix(true,true);show=chunkyJointsFromBody(body,joints);}
   const fx=actor?.fx;
   if(show&&fx)applyChunkyFx(joints,fx);
   const face=fx?.face||(expression.blink>.5?'blink':pose.talking&&pose.mouthH>.03?'talk':'open');
   writePerson(meshes,count,joints,looks.get(key),{detail:distance<45,face,active:show,tint:fx?.tint||null});
   count++;
  }
  for(let slot=count;slot<capacity;slot++)writePerson(meshes,slot,joints,null,{active:false});
  flushPeopleMeshes(meshes,count>0);
  return count;
 };
 const setQuality=q=>{for(const m of [meshes.box,meshes.round]){m.castShadow=q==='high';m.receiveShadow=q!=='performance';}};
 setQuality(quality);update();
 const triangles=PERSON_PARTS.filter(p=>p.mesh==='box').length*12+PERSON_PARTS.filter(p=>p.mesh==='round').length*48+2;
 return Object.freeze({mesh,headMesh:meshes.round,faceMesh:meshes.face,update,setQuality,drawCalls:3,capacity,counts:Object.freeze({parts:PERSON_PARTS.length,trianglesPerActor:triangles,colliders:0,materials:2})});
}

export function createChunkyPlayerHand(group){
 if(!group||typeof group.add!=='function')throw new TypeError('A player hand needs a camera-space group.');
 const add=(name,color,x,y,z,w,h,d)=>{const mesh=new THREE.Mesh(CHUNKY_BOX_GEOMETRY,handMaterial(color));mesh.name=name;mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.castShadow=false;mesh.receiveShadow=false;group.add(mesh);return mesh;};
 const sleeve=add('PlayerCuff',0x91a486,.36,-.56,-.5,.18,.16,.14);
 const palm=add('PlayerPalm',0xd8b58e,.36,-.42,-.56,.16,.2,.11);
 const thumb=add('PlayerThumb',0xd8b58e,.26,-.4,-.52,.06,.1,.055);
 const fingers=add('PlayerFingers',0xd8b58e,.36,-.3,-.6,.15,.09,.07);
 return Object.freeze({group,sleeve,palm,thumb,fingers});
}
export function chunkyPlayerHandPose({walking=false,phase=0,now=0,offering=false}={}){
 const swing=walking?Math.sin(finite(phase)):Math.sin(finite(now)*1.7);
 return Object.freeze({rotX:offering?-.42:swing*(walking?.12:.04),rotZ:offering?-.2:0,curl:offering?.65:walking?(Math.sin(finite(phase))+1)*.12:.04});
}
export function updateChunkyPlayerHand(rig,state={}){
 if(!rig?.group||!rig.fingers)return false;
 const pose=chunkyPlayerHandPose(state);
 rig.group.rotation.x=pose.rotX;rig.group.rotation.z=pose.rotZ;
 rig.fingers.rotation.x=pose.curl*.8;rig.fingers.position.y=-.3+pose.curl*.03;
 rig.thumb.rotation.z=pose.curl*.35;
 return true;
}
