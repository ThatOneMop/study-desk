import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {createResidentProportionRig,applyResidentProportionRig,createResidentFootSilhouettes} from '../dist/resident-proportions.mjs';

const root=new URL('../dist/assets/',import.meta.url),files=['citizen-v11.glb','citizen-v11-1.glb','citizen-v11-2.glb','citizen-lod-v12-0.glb','citizen-lod-v12-1.glb','citizen-lod-v12-2.glb'];
for(const [id,file] of files.entries()){
 const bytes=fs.readFileSync(new URL(file,root)),gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const scene=new THREE.Scene(),actorRoot=new THREE.Group(),body=gltf.scene;scene.add(actorRoot);actorRoot.add(body);body.scale.setScalar(.86);body.visible=true;
 const proportions=createResidentProportionRig({body,id}),actor={g:{userData:{id}},body,proportions},feet=createResidentFootSilhouettes({THREE,scene,actors:[actor],capacity:1});
 const mixer=new THREE.AnimationMixer(body),idle=gltf.animations.find(clip=>clip.name==='Idle');assert.ok(idle,file+' Idle clip');mixer.clipAction(idle).play();mixer.update(0);applyResidentProportionRig(proportions);
 assert.equal(body.getObjectByName('Hips').scale.y,1.18,file+' elongated body hierarchy');assert.ok(Math.abs(body.position.y-.78*.18*.86)<1e-9,file+' root compensates leg extension');assert.ok(Math.abs(proportions.head.scale.y*1.18-proportions.profile.head.y)<1e-9,file+' face height counteracts body elongation');assert.equal(feet.update({active:true}),2,file+' two feet');assert.equal(feet.upper.count,2);assert.equal(feet.sole.count,2);
 const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),quaternion=new THREE.Quaternion(),scale=new THREE.Vector3(),positions=[];
 for(let i=0;i<2;i++){feet.upper.getMatrixAt(i,matrix);matrix.decompose(position,quaternion,scale);assert.ok(position.toArray().every(Number.isFinite),file+' finite shoe placement');assert.ok(position.y>.02&&position.y<.16,file+' resting shoe remains near ground');assert.ok(scale.x>=.206&&scale.x<=.241,file+' bounded width');assert.ok(scale.y>=.121&&scale.y<=.143,file+' bounded height');assert.ok(scale.z>=.3&&scale.z<=.345,file+' bounded depth');positions.push(position.clone());}
 assert.ok(positions[0].distanceTo(positions[1])>.18,file+' feet remain separated');
 for(const name of ['Walk','Run','Talk','Work']){const clip=gltf.animations.find(candidate=>candidate.name===name);if(!clip)continue;mixer.stopAllAction();mixer.clipAction(clip).play();mixer.update(.2);applyResidentProportionRig(proportions);assert.equal(feet.update({active:true}),2,file+' '+name+' tracks both animated feet');for(let i=0;i<2;i++){feet.upper.getMatrixAt(i,matrix);assert.ok(matrix.elements.every(Number.isFinite),file+' '+name+' shoe matrix finite');}}
 assert.ok(['Thigh-1','Shin-1','Thigh1','Shin1'].every(name=>body.getObjectByName(name).scale.toArray().every(value=>Math.abs(value-1)<1e-9)),file+' leg scales unchanged');
}
console.log('PASS: all six real high/low citizen GLBs place two bounded ground-level shoe silhouettes from their animated terminal shin bones through Idle, Walk, Run, Talk and Work when present. CPU matrices only; no rendered fit or foot-contact claim.');
