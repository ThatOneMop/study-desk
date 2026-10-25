import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {coastalWeather} from '../dist/graphics-atmosphere.mjs';
import {createResidentHairstyleRig,residentFacialHairStyle} from '../dist/resident-accessories.mjs';
const styles=new Set();
for(let id=0;id<32;id++){
 const head=new THREE.Bone(),rig=createResidentHairstyleRig({head,id,hairColor:0x443322});styles.add(residentFacialHairStyle(id));
 if(!rig.facialHair)continue;
 const beard=rig.facialHair;assert.equal(beard.parent,head);beard.geometry.computeBoundingBox();const b=beard.geometry.boundingBox;
 assert(b.max.y<.43,'facial hair must not obscure eye centres');assert(b.min.z>0,'facial hair is on front of head');
 rig.mesh.visible=false;assert(beard.visible,'hats may hide hair without hiding beards');
 head.position.set(2,1,3);head.rotation.y=.6;head.updateMatrixWorld(true);const before=new THREE.Vector3();beard.getWorldPosition(before);head.position.x+=1;head.updateMatrixWorld(true);const after=new THREE.Vector3();beard.getWorldPosition(after);assert(Math.abs(after.x-before.x-1)<1e-8);
 const second=createResidentHairstyleRig({head:new THREE.Bone(),id,hairColor:0x443322});assert.equal(second.facialHair.geometry,beard.geometry);assert.equal(second.facialHair.material,beard.material);
}
assert.equal(styles.size,5);
assert.equal(coastalWeather(1,540).cloud,0);
for(let t=0;t<10000;t+=.5){const a=coastalWeather(1,t),b=coastalWeather(1,t+.5);assert(a.cloud>=0&&a.cloud<=1&&a.mist>=0&&a.mist<=.7);assert(Math.abs(a.cloud-b.cloud)<.002);assert(Math.abs(a.mist-b.mist)<.003);}
assert.deepEqual(coastalWeather(1,1440),coastalWeather(2,0));assert.deepEqual(coastalWeather(NaN,NaN),coastalWeather());
console.log('PASS: deterministic continuous marine weather and five face styles, clear eye bounds, shared resources, head attachment and hat independence. CPU only.');
