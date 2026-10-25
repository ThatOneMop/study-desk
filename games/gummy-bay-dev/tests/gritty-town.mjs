import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {roundResidentAsset} from '../dist/resident-rounding.mjs';
import {terrainHeight,WALKABLE_HILLS,createGrittyTerrain} from '../dist/gritty-terrain.mjs';
import {gritMaterial,gritTexture,createStreetWear} from '../dist/gritty-streets.mjs';
import {EXTRA_PATROL_ROUTES,expandPoliceRoster} from '../dist/patrol-expansion.mjs';
import {addStreetHat} from '../dist/street-hats.mjs';
import {dressPayphone} from '../dist/payphone-detail.mjs';
for(const h of WALKABLE_HILLS){assert.equal(terrainHeight(h.x,h.z),h.h);assert.equal(terrainHeight(h.x+h.r,h.z),0);for(let x=-h.r;x<h.r;x+=.2)assert(Math.abs(terrainHeight(h.x+x+.2,h.z)-terrainHeight(h.x+x,h.z))<.08);}
assert.equal(terrainHeight(NaN,1),0);assert.equal(terrainHeight(0,0),0);
const scene=new THREE.Scene(),bounds={minX:-280,maxX:280,minZ:-449,maxZ:95},terrain=createGrittyTerrain(scene,bounds,gritMaterial('earth'));
assert.equal(terrain.hills.length,2);const river=terrain.river.geometry.attributes.position;for(let i=0;i<river.count;i++)assert(river.getX(i)<-280);
const bank=terrain.banks.geometry.attributes.position;for(let i=0;i<bank.count;i++)assert(bank.getX(i)<=-280);
for(const k of ['earth','concrete','asphalt']){const t=gritTexture(k);assert.equal(t.image.data.length,128*128*4);assert(t.generateMipmaps);const m=gritMaterial(k),shader={vertexShader:'#include <worldpos_vertex>',fragmentShader:'#include <map_fragment>'};m.onBeforeCompile(shader);assert(shader.fragmentShader.includes('gritWorld.xz'));}
const litter=createStreetWear({scene,blocked:(x,z)=>Math.abs(x)<1,floorHeight:()=>.085,bounds});assert(litter.paper.length>500);assert(litter.cans.length>150);assert(litter.glass.length>150);assert(litter.paper.every(p=>p.y===.1));
const original={x:1,z:2,mode:'pursuit',suspicion:77},police={officers:[original],cooldown:7},routes=[[[0,0],[1,0]],...EXTRA_PATROL_ROUTES];expandPoliceRoster(police,routes);assert.equal(police.officers.length,5);assert.equal(police.officers[0],original);assert.equal(police.cooldown,7);expandPoliceRoster(police,routes);assert.equal(police.officers.length,5);const guest={officers:[original]};expandPoliceRoster(guest,routes,{guest:true});assert.equal(guest.officers.length,1);
let rounded=0;
for(const file of ['citizen-v11.glb','citizen-v11-1.glb','citizen-v11-2.glb','citizen-lod-v12-0.glb','citizen-lod-v12-1.glb','citizen-lod-v12-2.glb']){
 const b=fs.readFileSync(new URL('../dist/assets/'+file,import.meta.url)),g=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');const clips=g.animations.map(a=>[a.name,a.duration]);roundResidentAsset(g);
 g.scene.traverse(o=>{if(o.geometry?.userData.roundedHead){rounded++;const a=o.geometry.attributes;assert(a.position.count===a.skinIndex.count&&a.position.count===a.skinWeight.count);assert(o.geometry.userData.roundedHead.removedTriangles>=20);for(let i=0;i<a.position.count;i++){assert(Number.isFinite(a.position.getX(i)));assert(Math.abs(a.skinWeight.getX(i)+a.skinWeight.getY(i)+a.skinWeight.getZ(i)+a.skinWeight.getW(i)-1)<.001);}for(const targets of Object.values(o.geometry.morphAttributes))for(const t of targets)assert.equal(t.count,a.position.count);}});
 assert.deepEqual(g.animations.map(a=>[a.name,a.duration]),clips);const head=g.scene.getObjectByName('Head');const hat=addStreetHat(head,2);assert(hat.parts.length===2);assert.equal(addStreetHat(head,2,true),null);
}
assert(rounded>=3);const phone=new THREE.Group();dressPayphone(phone);assert(phone.children[0].children.length>=8);
console.log('PASS: hills/support, west river boundary, metre-scaled material shader source, dense litter, idempotent police migration/guest isolation, '+rounded+' rounded animated skin primitives, skin weights/morph alignment and hats/payphone. No WebGL rendering claim.');
