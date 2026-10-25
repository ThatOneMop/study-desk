// CPU geometry measurements are evidence, not a rendered scale acceptance test.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {rvFloorHeight,rvCeilingHeight,RV_SUPPORT} from '../dist/rv-support.mjs';
import {verticalTownFloorHeight} from '../dist/vertical-town.mjs';
import {terrainHeight} from '../dist/gritty-terrain.mjs';
const root=new URL('../dist/',import.meta.url);
async function read(name){const bytes=fs.readFileSync(new URL('assets/'+name,root));return new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');}
const characterHeights=[];
for(let i=0;i<3;i++){
 const asset=await read('citizen-v11'+(i?'-'+i:'')+'.glb'),mixer=new THREE.AnimationMixer(asset.scene),idle=asset.animations.find(c=>c.name==='Idle');assert.ok(idle);
 mixer.clipAction(idle).play();mixer.update(0);asset.scene.updateMatrixWorld(true);asset.scene.traverse(o=>{if(o.isSkinnedMesh)o.computeBoundingBox();});
 const size=new THREE.Box3().setFromObject(asset.scene).getSize(new THREE.Vector3()).multiplyScalar(.86);assert.ok(size.toArray().every(Number.isFinite));
 characterHeights.push({variant:i,idleHeight:size.y,width:size.x,depth:size.z});
}
const environment=await read('environment-v11-final.glb');environment.scene.updateMatrixWorld(true);
const source=fs.readFileSync(new URL('game.js',root),'utf8'),floorSource=source.match(/function floorHeight\(x,z\)\{[^\n]+\}/)?.[0];assert.ok(floorSource);
// This audit samples the RV with no active workshop; compile both actual
// projection functions now that floorHeight also consults installed equipment.
// Active/default/custom tent cases execute in boot.cjs and tent-access.mjs.
const tentSupportSource=source.match(/function tentSupportHeight\(x,z,ceiling=false\)\{[\s\S]*?\n\}/)?.[0];assert.ok(tentSupportSource);
const floorHeight=new Function('rvFloorHeight','verticalTownFloorHeight','terrainHeight','const active=false;'+tentSupportSource+';'+floorSource+';return floorHeight;')(rvFloorHeight,verticalTownFloorHeight,terrainHeight);
const floors=[[-58,26.7],[-57.5,26.7]].map(([x,z])=>{
 const ray=new THREE.Raycaster(new THREE.Vector3(x,2.8,z),new THREE.Vector3(0,-1,0),0,5),hit=ray.intersectObject(environment.scene,true)[0];assert.ok(hit,'exported RV aisle floor');
 const roofRay=new THREE.Raycaster(new THREE.Vector3(x,2.8,z),new THREE.Vector3(0,1,0),0,5),roof=roofRay.intersectObject(environment.scene,true)[0];assert.ok(roof,'exported RV roof underside');
 assert.ok(Math.abs(roof.point.y-rvCeilingHeight(x,z))<.00001,'head limit matches actual exported roof underside');
 return {x,z,mesh:hit.object.name,meshY:hit.point.y,supportY:floorHeight(x,z),offset:hit.point.y-floorHeight(x,z),roofY:roof.point.y,ceilingY:rvCeilingHeight(x,z)};
});
assert.ok(floors.every(p=>[p.meshY,p.supportY,p.offset].every(Number.isFinite)));
assert.ok(floors.every(p=>Math.abs(p.offset)<.00001),'RV support must match actual exported aisle floor');
console.log('CPU SCALE AUDIT (not visual acceptance): '+JSON.stringify({standingEye:1.72,characterHeights,rvFloorSamples:floors}));
assert.equal(RV_SUPPORT.floor,.94);assert.equal(RV_SUPPORT.ceiling,3.02);
console.log('PASS: CPU RV floor support and roof limit agree with exported aisle triangles. This is not rendered doorway traversal, furniture-scale or head-contact acceptance.');
