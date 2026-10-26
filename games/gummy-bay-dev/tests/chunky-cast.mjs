import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import fs from 'node:fs';
import {createResidentProportionRig,applyResidentProportionRig} from '../dist/resident-proportions.mjs';
import {CHUNKY_CAST_COLLIDERS,CHUNKY_CAST_PROFILES,CHUNKY_CAST_ROLES,CHUNKY_PART_LAYOUT,CHUNKY_PART_INDEX,CHUNKY_BOX_GEOMETRY,chunkyCastProfile,chunkyCastRole,chunkyPartEnabled,chunkyCastLook,chunkyCastPose,chunkyPlayerHandPose,concealSculptedResident,createChunkyCast,createChunkyPlayerHand,updateChunkyPlayerHand} from '../dist/chunky-cast.mjs';

assert.equal(CHUNKY_CAST_COLLIDERS.length,0);
assert.ok(CHUNKY_CAST_PROFILES.length>=6);
assert.ok(CHUNKY_CAST_PROFILES.filter(profile=>profile.glasses).length>=3);
assert.ok(CHUNKY_CAST_PROFILES.filter(profile=>profile.hood).length>=2);
assert.equal(new Set(CHUNKY_CAST_PROFILES.map(profile=>JSON.stringify(profile))).size,CHUNKY_CAST_PROFILES.length);
for(const id of [0,1,2,3,4,5,6,7,8,-3])assert.equal(chunkyCastProfile(id),CHUNKY_CAST_PROFILES[Math.abs(Math.trunc(id))%8]);
assert.deepEqual(CHUNKY_CAST_ROLES,['police','worker','seller','dealer','customer','townsfolk']);

const customer={userData:{}},dealer={userData:{}},cop={userData:{cop:true,crew:'worker'}},worker={userData:{crew:'worker'}},seller={userData:{crew:'seller'}},neighbour={userData:{}};
const points=[{actor:customer,type:'customer'},{actor:dealer,type:'dealer'},{actor:neighbour,type:'hardware'}];
assert.equal(chunkyCastRole(cop,points),'police');
assert.equal(chunkyCastRole(worker,points),'worker');
assert.equal(chunkyCastRole(seller,points),'seller');
assert.equal(chunkyCastRole(dealer,points),'dealer');
assert.equal(chunkyCastRole(customer,points),'customer');
assert.equal(chunkyCastRole(neighbour,points),'townsfolk');
assert.equal(chunkyCastRole(null,points),'townsfolk');
const partNamed=name=>CHUNKY_PART_LAYOUT.find(part=>part.name===name);
assert.equal(chunkyPartEnabled(partNamed('badge'),'police',chunkyCastProfile(0)),true);
assert.equal(chunkyPartEnabled(partNamed('badge'),'customer',chunkyCastProfile(1)),false);
assert.equal(chunkyPartEnabled(partNamed('band'),'police',chunkyCastProfile(2)),true,'police wear a banded cap');
assert.equal(chunkyPartEnabled(partNamed('hoodUp'),'police',chunkyCastProfile(2)),false);
assert.equal(chunkyPartEnabled(partNamed('hoodDown'),'police',chunkyCastProfile(2)),false);
assert.equal(chunkyPartEnabled(partNamed('head'),'customer',chunkyCastProfile(0)),true);
const copLook=chunkyCastLook({userData:{}},'police',4),workerLook=chunkyCastLook({userData:{}},'worker',4);
assert.equal(copLook.top,0x1f2f4d,'navy uniform');assert.equal(copLook.hairStyle,'police');assert.equal(workerLook.topStyle,'jacket');
assert.ok(new Set(Array.from({length:16},(_,id)=>chunkyCastLook({userData:{}},'townsfolk',id).top)).size>=6,'townsfolk mix clothing colours');

const idle=chunkyCastPose({clip:'Idle',blink:0,now:0}),talk=chunkyCastPose({clip:'Talk',blink:0,now:.4}),blink=chunkyCastPose({clip:'Idle',blink:1}),work=chunkyCastPose({clip:'Work'});
assert.ok(talk.mouthH>idle.mouthH);assert.ok(talk.reach>idle.reach);assert.ok(blink.eyeY<idle.eyeY);assert.ok(work.reach>0&&work.reach<talk.reach);
assert.equal(chunkyCastPose({clip:'Nope',blink:NaN,now:NaN}).eyeY,idle.eyeY);
const offer=chunkyPlayerHandPose({offering:true}),wave=chunkyPlayerHandPose({walking:true,phase:1});
assert.ok(offer.rotX<wave.rotX);assert.ok(offer.curl>wave.curl);

const bytes=fs.readFileSync(new URL('../dist/assets/citizen-v11.glb',import.meta.url));
const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const body=gltf.scene;body.scale.set(.86,.86,.86);
const rig=createResidentProportionRig({body,id:1});applyResidentProportionRig(rig);
const skinned=[];body.traverse(object=>{if(object.isSkinnedMesh)skinned.push(object);});
assert.ok(skinned.length>=3);assert.equal(concealSculptedResident(body),skinned.length);assert.ok(skinned.every(mesh=>mesh.visible===false));
assert.equal(concealSculptedResident(null),0);
const hat=new THREE.Mesh(CHUNKY_BOX_GEOMETRY);body.add(hat);concealSculptedResident(body);assert.equal(hat.visible,true);

const root=new THREE.Group();root.userData={id:1,palette:{color:0xc67562,skin:0xc68d6a,hair:0x544833}};body.position.set(2,0,-4);root.add(body);
const actors=[{g:root,body,current:'Idle',speed:0}];
const scene=new THREE.Scene();
assert.throws(()=>createChunkyCast({scene:null,actors}),TypeError);
assert.throws(()=>createChunkyCast({scene,actors,capacity:0}),RangeError);
const cast=createChunkyCast({THREE,scene,actors,points:[],quality:'balanced',capacity:4});
assert.equal(cast.drawCalls,3);assert.equal(cast.counts.colliders,0);assert.equal(cast.counts.materials,2);
assert.ok(cast.counts.trianglesPerActor<=1500,'v146 soft bodies stay under 1.5k triangles a person');assert.equal(cast.mesh.material.vertexColors,false);assert.equal(cast.mesh.geometry,CHUNKY_BOX_GEOMETRY);
assert.equal(CHUNKY_BOX_GEOMETRY.index.count/3,12);
cast.update({now:0});
const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),quaternion=new THREE.Quaternion(),scale=new THREE.Vector3();
const faces=cast.faceMesh.geometry.getAttribute('aFace'),FACE_ROW=24;
assert.equal(cast.headMesh.count,cast.headMesh.geometry.getAttribute('aTaper').count/4,'only the one live actor is drawn from a capacity of four');
assert.equal(Math.floor(faces.getX(0)/FACE_ROW),0,'idle face is the resting cell');
cast.headMesh.getMatrixAt(CHUNKY_PART_INDEX.head,matrix);matrix.decompose(position,quaternion,scale);
assert.ok(Math.abs(scale.x-.29*1.12)<.01&&Math.abs(scale.y-.31*1.12)<.01,'bone stretch no longer turns heads into tall blocks; v146 heads are a deliberate 1.12x');
assert.ok(position.y>1.4,'head rides the animated head bone');
actors[0].current='Talk';
let talked=false;for(let t=0;t<3&&!talked;t+=.05){cast.update({now:t});if(Math.floor(faces.getX(0)/FACE_ROW)===2)talked=true;}
assert.equal(talked,true,'talking swaps to the open-mouth face');
actors[0].current='Idle';
let blinked=false;
for(let t=0;t<6&&!blinked;t+=.05){cast.update({now:t});if(Math.floor(faces.getX(0)/FACE_ROW)===1)blinked=true;}
assert.equal(blinked,true,'blink swaps to the closed-eye face');
cast.faceMesh.getMatrixAt(0,matrix);matrix.decompose(position,quaternion,scale);
assert.ok(position.length()>0);
root.visible=false;cast.update({now:0});cast.mesh.getMatrixAt(0,matrix);matrix.decompose(position,quaternion,scale);assert.equal(scale.x,0);assert.equal(cast.mesh.visible,false,'no live actors draws nothing');
root.visible=true;actors[0].current='Idle';cast.update({now:0});
const before=cast.mesh.geometry;cast.setQuality('performance');assert.equal(cast.mesh.castShadow,false);assert.equal(cast.mesh.receiveShadow,false);cast.setQuality('high');assert.equal(cast.mesh.castShadow,true);cast.setQuality('balanced');assert.equal(cast.mesh.geometry,before);

const group=new THREE.Group();const playerHand=createChunkyPlayerHand(group);
assert.equal(playerHand.palm.geometry,playerHand.fingers.geometry);assert.equal(playerHand.palm.geometry,CHUNKY_BOX_GEOMETRY);
assert.ok(['PlayerPalm','PlayerThumb','PlayerFingers','PlayerCuff'].every(name=>group.children.some(child=>child.name===name)));
assert.equal(updateChunkyPlayerHand(playerHand,{walking:true,phase:1,now:1}),true);
const walked=playerHand.fingers.rotation.x;updateChunkyPlayerHand(playerHand,{offering:true,now:1});
assert.notEqual(playerHand.group.rotation.x,0);assert.notEqual(playerHand.fingers.rotation.x,walked);
assert.equal(updateChunkyPlayerHand(null),false);assert.throws(()=>createChunkyPlayerHand(null),TypeError);
console.log('PASS: chunky cast builds one shared box batch, varies eight outfits, distinguishes police/worker/seller/dealer/customer/townsfolk, and animates blink, talk and the player mitten without collision.');
