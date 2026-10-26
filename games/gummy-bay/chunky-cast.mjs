// Original low-poly people for Gummy Bay. One instanced box batch follows the
// existing animated bones: oversized heads, flat faces, mitten hands, role colours.
import * as THREE from './vendor/three.module.min.js';
import {residentExpressionState} from './resident-expressions.mjs';

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

const part=(name,bone,x,y,z,w,h,d,slot,when='always')=>Object.freeze({name,bone,x,y,z,w,h,d,slot,when});
export const CHUNKY_PART_LAYOUT=freeze([
 part('head','Head',0,.36,-.02,.50,.48,.42,'skin'),
 part('face','Head',0,.42,.30,.34,.30,.04,'face'),
 part('eyeL','Head',-.09,.48,.345,.055,.07,.02,'ink','eye'),
 part('eyeR','Head',.09,.48,.345,.055,.07,.02,'ink','eye'),
 part('browL','Head',-.09,.575,.335,.11,.022,.018,'hair','brow'),
 part('browR','Head',.09,.575,.335,.11,.022,.018,'hair','brow'),
 part('mouth','Head',0,.30,.34,.11,.016,.016,'mouth','mouth'),
 part('neck','Head',0,.04,0,.14,.12,.12,'skin'),
 part('torso','Chest',0,.22,.02,.46,.40,.28,'outfit'),
 part('collar','Chest',0,.40,.12,.30,.06,.06,'collar','collar'),
 part('pelvis','Hips',0,.08,0,.38,.18,.24,'pants'),
 part('armL','UpperArm-1',0,.16,0,.14,.30,.14,'outfit'),
 part('armR','UpperArm1',0,.16,0,.14,.30,.14,'outfit'),
 part('foreL','Forearm-1',0,.12,0,.11,.22,.11,'skin'),
 part('foreR','Forearm1',0,.12,0,.11,.22,.11,'skin'),
 part('handL','Hand-1',.015,.075,-.02,.12,.14,.08,'skin','hand'),
 part('handR','Hand1',-.015,.075,-.02,.12,.14,.08,'skin','hand'),
 part('thumbL','Hand-1',.075,.04,-.015,.045,.07,.045,'skin'),
 part('thumbR','Hand1',-.075,.04,-.015,.045,.07,.045,'skin'),
 part('thighL','Thigh-1',0,.16,0,.16,.30,.16,'pants'),
 part('thighR','Thigh1',0,.16,0,.16,.30,.16,'pants'),
 part('shinL','Shin-1',0,.13,0,.12,.22,.12,'pants'),
 part('shinR','Shin1',0,.13,0,.12,.22,.12,'pants'),
 part('glassesL','Head',-.09,.48,.325,.10,.09,.012,'frame','glasses'),
 part('glassesR','Head',.09,.48,.325,.10,.09,.012,'frame','glasses'),
 part('bridge','Head',0,.50,.328,.08,.016,.012,'frame','glasses'),
 part('hood','Head',0,.52,-.06,.58,.30,.40,'hood','hood'),
 part('strapL','Chest',-.09,.24,.15,.045,.34,.02,'strap','worker'),
 part('strapR','Chest',.09,.24,.15,.045,.34,.02,'strap','worker'),
 part('shirt','Chest',0,.16,.145,.22,.16,.02,'shirt','worker'),
 part('badge','Chest',.12,.24,.155,.06,.07,.018,'badge','police'),
 part('pocket','Chest',-.12,.12,.15,.12,.1,.03,'pocket','pocket')
]);
export const CHUNKY_PART_INDEX=Object.freeze(Object.fromEntries(CHUNKY_PART_LAYOUT.map((item,index)=>[item.name,index])));
export const CHUNKY_BOX_GEOMETRY=new THREE.BoxGeometry(1,1,1);
const CAST_MATERIAL=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,metalness:0,vertexColors:true,flatShading:true});
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
export function chunkyPartEnabled(part,role,profile){
 if(part.when==='always'||part.when==='eye'||part.when==='brow'||part.when==='mouth'||part.when==='hand')return true;
 if(part.when==='glasses')return !!profile?.glasses;
 if(part.when==='hood')return !!profile?.hood&&role!=='police'&&role!=='worker';
 if(part.when==='collar')return !!profile?.collar&&role!=='worker';
 if(part.when==='worker')return role==='worker';
 if(part.when==='police')return role==='police';
 if(part.when==='pocket')return role==='dealer'||role==='seller';
 return false;
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
function paletteOf(actor,role,id){
 const palette=actor?.g?.userData?.palette||actor?.userData?.palette||{};
 const skin=Number.isFinite(palette.skin)?palette.skin:0xd5af88;
 const hair=Number.isFinite(palette.hair)?palette.hair:0x65503e;
 const outfit=role==='police'?0x243c58:role==='worker'?0x4a6d96:role==='seller'?0xc47b45:role==='dealer'?0x657f51:Number.isFinite(palette.color)?palette.color:0x497d89;
 return {skin,face:shift(skin,.04),hair,ink:0x1b1a17,mouth:0x6a3b38,outfit,pants:role==='police'?0x1a2838:role==='worker'?0x2a3c58:PANTS[id%PANTS.length],frame:0x23262b,hood:shift(outfit,-.08),strap:0x2c4a72,shirt:0xe4d2b4,badge:0xd1af61,pocket:role==='dealer'?0xc7d995:0x8d5a32,collar:shift(outfit,-.12)};
}
function shift(hex,amount){
 const color=new THREE.Color(hex);
 color.offsetHSL(0,0,amount);
 return color.getHex();
}

export function concealSculptedResident(body){
 let hidden=0;
 body?.traverse?.(object=>{if(object.isSkinnedMesh){object.visible=false;hidden++;}});
 return hidden;
}
function uncoverChunkyFace(body){
 body?.traverse?.(object=>{if(object.isMesh)object.visible=false;});
}

const local=new THREE.Object3D(),world=new THREE.Matrix4(),scratch=new THREE.Color();
export function createChunkyCast({THREE:three=THREE,scene,actors,points,quality='balanced',capacity=48}={}){
 if(!scene?.add||!Array.isArray(actors))throw new TypeError('A chunky cast needs a scene and the live actor list.');
 if(!Number.isSafeInteger(capacity)||capacity<1)throw new RangeError('Chunky cast capacity must be a positive integer.');
 const geometry=CHUNKY_BOX_GEOMETRY,material=CAST_MATERIAL;
 const mesh=new three.InstancedMesh(geometry,material,capacity*CHUNKY_PART_LAYOUT.length);
 mesh.name='Chunky cast';mesh.count=0;mesh.frustumCulled=false;mesh.castShadow=false;mesh.receiveShadow=quality!=='performance';
 mesh.instanceMatrix.setUsage(three.DynamicDrawUsage);scene.add(mesh);
 const update=({now=0,camera=null}={})=>{
  let count=0,written=0;
  for(const actor of actors){
   if(count>=capacity)break;
   const body=actor?.body,root=actor?.g;
   const show=!!body&&body.visible!==false&&root?.visible!==false&&typeof body.getObjectByName==='function';
   const id=Number.isFinite(root?.userData?.id)?root.userData.id:count;
   const role=chunkyCastRole(root,points),profile=chunkyCastProfile(id);
   const clip=typeof actor?.current==='string'?actor.current:'Idle';
   const distance=camera?.position&&root?.position?.distanceTo?root.position.distanceTo(camera.position):0;
   const expression=residentExpressionState({now,id,talking:clip==='Talk',working:clip==='Work'||clip==='Search',moving:(actor?.speed||0)>.08,active:show,distance});
   const pose=chunkyCastPose({clip,blink:expression.blink,browLift:expression.browLift,now});
   const colors=paletteOf(actor,role,Math.abs(Math.trunc(id)));
   if(show){uncoverChunkyFace(body);body.updateWorldMatrix(true,true);}
   for(const item of CHUNKY_PART_LAYOUT){
    const bone=show?body.getObjectByName(item.bone):null;
    const enabled=!!bone&&chunkyPartEnabled(item,role,profile);
    let y=item.y,z=item.z,h=item.h,w=item.w;
    local.rotation.set(0,0,0);
    if(item.when==='eye')h=pose.eyeY;
    if(item.when==='brow'){y+=pose.brow;local.rotation.z=(item.name==='browL'?1:-1)*(.12+expression.browTilt);}
    if(item.when==='mouth')h=pose.mouthH;
    if(item.when==='hand'&&pose.reach){z-=pose.reach*(item.name==='handR'||pose.working?1:.35);y-=pose.reach*.25;}
    local.position.set(item.x,y,z);local.scale.set(enabled?w:0,enabled?h:0,enabled?item.d:0);local.updateMatrix();
    if(enabled)world.multiplyMatrices(bone.matrixWorld,local.matrix);else world.makeScale(0,0,0);
    mesh.setMatrixAt(written,world);
    mesh.setColorAt(written,scratch.setHex(colors[item.slot]??colors.outfit));
    written++;
   }
   count++;
  }
  mesh.count=written;mesh.visible=written>0;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  return count;
 };
 const setQuality=q=>{mesh.castShadow=q==='high';mesh.receiveShadow=q!=='performance';mesh.visible=true;};
 setQuality(quality);update();
 const triangles=CHUNKY_BOX_GEOMETRY.index.count/3*CHUNKY_PART_LAYOUT.length;
 return Object.freeze({mesh,update,setQuality,drawCalls:1,capacity,counts:Object.freeze({parts:CHUNKY_PART_LAYOUT.length,trianglesPerActor:triangles,colliders:0,materials:1})});
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
