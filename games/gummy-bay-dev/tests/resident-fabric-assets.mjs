import fs from 'node:fs';
import assert from 'node:assert/strict';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {RESIDENT_FABRIC_PATTERN,createResidentClothing,residentFabricTexture} from '../dist/resident-clothing.mjs';

const root=new URL('../dist/assets/',import.meta.url);
const files=['citizen-v11.glb','citizen-v11-1.glb','citizen-v11-2.glb','citizen-lod-v12-0.glb','citizen-lod-v12-1.glb','citizen-lod-v12-2.glb'];
const texture=residentFabricTexture();
for(const [id,file] of files.entries()){
 const bytes=fs.readFileSync(new URL(file,root)),gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const shirtMeshes=[];gltf.scene.traverse(object=>{if(!object.isMesh)return;const materials=Array.isArray(object.material)?object.material:[object.material];if(materials.some(material=>material?.name==='Shirt'))shirtMeshes.push(object);});
 assert.equal(shirtMeshes.length,1,file+' has one authored Shirt mesh');
 const shirt=shirtMeshes[0],uv=shirt.geometry.getAttribute('uv'),position=shirt.geometry.getAttribute('position');assert.ok(uv,file+' Shirt has UVs');assert.equal(uv.count,position.count,file+' complete Shirt UV coverage');
 let minU=Infinity,minV=Infinity,maxU=-Infinity,maxV=-Infinity;for(let i=0;i<uv.count;i++){const u=uv.getX(i),v=uv.getY(i);assert.ok(Number.isFinite(u)&&Number.isFinite(v),file+' finite Shirt UV');minU=Math.min(minU,u);minV=Math.min(minV,v);maxU=Math.max(maxU,u);maxV=Math.max(maxV,v);}
 assert.ok(minU<=0&&minV<=0&&maxU>=1&&maxV>=1,file+' full Shirt UV range');
 const before=new Map();gltf.scene.traverse(object=>{if(object.isMesh)for(const material of Array.isArray(object.material)?object.material:[object.material])if(material?.name!=='Shirt')before.set(material,material.roughnessMap);});
 const wardrobe=createResidentClothing({body:gltf.scene,id,baseColor:0x527f91,isCop:id===5});assert.equal(wardrobe.materials.length,1);assert.equal(wardrobe.texture,texture);assert.equal(wardrobe.materials[0].roughnessMap,texture);assert.equal(wardrobe.materials[0].userData.fabricPattern,RESIDENT_FABRIC_PATTERN.id);
 for(const [material,map] of before)assert.equal(material.roughnessMap,map,file+' non-Shirt texture channel untouched');
}
console.log('PASS: all six real high/low resident GLBs provide complete 0-1 Shirt UVs and receive one shared code-authored diagonal-loom roughness texture without touching Skin, Hair or other materials. CPU asset/material checks only; no rendered fabric or deformation claim.');
