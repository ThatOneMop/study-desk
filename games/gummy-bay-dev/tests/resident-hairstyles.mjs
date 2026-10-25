import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {RESIDENT_HAIRSTYLE_PROFILES,RESIDENT_HAIRSTYLE_COLLIDERS,RESIDENT_HAIRSTYLE_FACE_WINDOW,residentHairstyleProfile,createResidentHairstyleRig,residentHairstyleResources} from '../dist/resident-accessories.mjs';

assert.equal(Object.isFrozen(RESIDENT_HAIRSTYLE_PROFILES),true);assert.equal(RESIDENT_HAIRSTYLE_PROFILES.length,5);assert.equal(RESIDENT_HAIRSTYLE_COLLIDERS.length,0);
assert.equal(new Set(RESIDENT_HAIRSTYLE_PROFILES.map(profile=>profile.label)).size,5);assert.equal(new Set(RESIDENT_HAIRSTYLE_PROFILES.map(profile=>profile.parts.map(part=>part.kind+':'+[part.x,part.y,part.z,part.w,part.h,part.d,part.r,part.rz].join(',')).join('|'))).size,5);
for(const profile of RESIDENT_HAIRSTYLE_PROFILES){
 assert.equal(Object.isFrozen(profile),true);assert.equal(Object.isFrozen(profile.parts),true);assert.ok(profile.parts.length>=3&&profile.parts.length<=5,profile.label+' bounded part count');
 for(const part of profile.parts){const halfX=part.kind==='box'?part.w/2:part.r,halfY=part.kind==='box'?part.h/2:part.kind==='cylinder'?part.h/2:part.r;assert.ok(part.y-halfY>=RESIDENT_HAIRSTYLE_FACE_WINDOW.maxY||Math.abs(part.x)-halfX>=RESIDENT_HAIRSTYLE_FACE_WINDOW.maxX,profile.label+' leaves face window open');}
}
assert.equal(residentHairstyleProfile(NaN),RESIDENT_HAIRSTYLE_PROFILES[0]);assert.equal(residentHairstyleProfile(-7),RESIDENT_HAIRSTYLE_PROFILES[2]);
const rigs=[];for(let id=0;id<5;id++){const head=new THREE.Bone(),rig=createResidentHairstyleRig({head,id,hairColor:0x443322});assert.equal(rig.mesh.parent,head);assert.equal(rig.profile,RESIDENT_HAIRSTYLE_PROFILES[id]);assert.equal(rig.mesh.name,'ResidentHair-'+rig.profile.label);assert.equal(rig.mesh.castShadow,false);assert.equal(rig.mesh.receiveShadow,false);assert.ok(rig.mesh.geometry.boundingBox&&!rig.mesh.geometry.boundingBox.isEmpty());rigs.push(rig);}
assert.equal(new Set(rigs.map(rig=>rig.mesh.geometry)).size,5);const repeat=createResidentHairstyleRig({head:new THREE.Bone(),id:5,hairColor:0x443322});assert.equal(repeat.mesh.geometry,rigs[0].mesh.geometry);assert.equal(repeat.mesh.material,rigs[0].mesh.material);
const signatures=rigs.map(rig=>{const b=rig.mesh.geometry.boundingBox;return [b.min.x,b.max.x,b.min.y,b.max.y,b.min.z,b.max.z].map(value=>value.toFixed(3)).join('|');});assert.equal(new Set(signatures).size,5);
const files=['citizen-v11.glb','citizen-v11-1.glb','citizen-v11-2.glb','citizen-lod-v12-0.glb','citizen-lod-v12-1.glb','citizen-lod-v12-2.glb'],root=new URL('../dist/assets/',import.meta.url);
for(const [id,file] of files.entries()){const bytes=fs.readFileSync(new URL(file,root)),gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');const head=gltf.scene.getObjectByName('Head');assert.ok(head,file+' actual Head bone');const rig=createResidentHairstyleRig({head,id,hairColor:0x554438});assert.equal(rig.mesh.parent,head,file+' attached hairstyle');assert.ok(rig.mesh.geometry.getAttribute('position').count>=100,file+' merged silhouette geometry');}
const resources=residentHairstyleResources();assert.equal(resources.geometries.length,5);assert.equal(new Set(resources.geometries).size,5);assert.ok(resources.materialCount>=1);assert.equal(resources.faceWindow,RESIDENT_HAIRSTYLE_FACE_WINDOW);assert.throws(()=>createResidentHairstyleRig({}),TypeError);
console.log('PASS: five original face-open hairstyle silhouettes use one pre-merged shared mesh per animated Head bone across all six real high/low resident GLBs, with cached palette materials and zero collision. CPU geometry only; no rendered recognition claim.');
