import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {DOORWAY_REVEAL_SITES,DOORWAY_REVEAL_PROFILES,DOORWAY_REVEAL_COLLIDERS,doorwayRevealProfile,doorwayRevealCollisionAligned,doorwayRevealPathClear,createDoorwayReveals} from '../dist/doorway-reveals.mjs?v=95';

assert.equal(DOORWAY_REVEAL_SITES.length,10);assert.equal(DOORWAY_REVEAL_PROFILES.length,10);assert.equal(DOORWAY_REVEAL_COLLIDERS.length,0);
assert(Object.isFrozen(DOORWAY_REVEAL_SITES)&&DOORWAY_REVEAL_SITES.every(Object.isFrozen)&&Object.isFrozen(DOORWAY_REVEAL_PROFILES)&&DOORWAY_REVEAL_PROFILES.every(Object.isFrozen));
assert.deepEqual(DOORWAY_REVEAL_SITES.map((site,index)=>doorwayRevealProfile(site,index)),DOORWAY_REVEAL_PROFILES,'all doorway records derive deterministically');
const collisionFor=profile=>(x,z)=>[-1,1].some(side=>Math.abs(x-(profile.x+side*profile.w*.35))<(profile.w*.3+.65)/2&&Math.abs(z-profile.frontZ)<.45);
for(const profile of DOORWAY_REVEAL_PROFILES){
 assert.equal(profile.openingWidth,profile.w*.4);assert.equal(profile.playerClearWidth,profile.openingWidth-.65);assert(profile.playerClearWidth>=6.55);assert.equal(profile.depth,.55);assert.equal(profile.parts.length,7);assert.equal(new Set(profile.parts.map(part=>part.part)).size,7);
 assert(profile.parts.every(part=>Object.isFrozen(part)&&[part.x,part.y,part.z,part.w,part.h,part.d,part.color].every(Number.isFinite)&&part.w>0&&part.h>0&&part.d>0));
 const blocked=collisionFor(profile);assert(doorwayRevealCollisionAligned(profile,blocked),'jamb visuals align to the existing solid wall edges');assert(doorwayRevealPathClear(profile,blocked),'centre and two body-width lanes cross the existing opening');
 for(const part of profile.parts.filter(part=>part.part.includes('return')||part.part.includes('edge')))assert(blocked(part.x,part.z),'side reveal stays inside existing wall collision');
 for(const part of profile.parts.filter(part=>['threshold','lintel-soffit','inner-header'].includes(part.part)))assert(!blocked(part.x,part.z),'spanning reveal detail adds no central collision');
}
assert.equal(doorwayRevealProfile(null),null);assert.equal(doorwayRevealProfile({...DOORWAY_REVEAL_SITES[0],family:'unknown'}),null);assert.equal(doorwayRevealProfile({...DOORWAY_REVEAL_SITES[0],w:4}),null);assert.equal(doorwayRevealCollisionAligned(null,()=>false),false);assert.equal(doorwayRevealPathClear(DOORWAY_REVEAL_PROFILES[0],null),false);

const scene=new THREE.Scene(),layer=createDoorwayReveals({scene,quality:'balanced'});assert.equal(scene.children.length,1);assert.equal(layer.drawCalls,1);assert.deepEqual(layer.counts,{sites:10,parts:70,colliders:0});assert.equal(layer.mesh.count,70);assert(layer.mesh.isInstancedMesh&&layer.mesh.geometry.type==='BoxGeometry'&&layer.mesh.material.vertexColors&&layer.mesh.material.map==null&&layer.mesh.instanceMatrix.array.every(Number.isFinite)&&layer.mesh.instanceColor.array.every(Number.isFinite));
const resources=[layer.mesh,layer.mesh.geometry,layer.mesh.material,layer.mesh.instanceMatrix,layer.mesh.instanceColor];layer.setQuality('performance');assert(layer.mesh.visible&&!layer.mesh.castShadow&&!layer.mesh.receiveShadow);layer.setQuality('high');assert(layer.mesh.castShadow&&layer.mesh.receiveShadow);layer.setQuality('balanced');assert(!layer.mesh.castShadow&&layer.mesh.receiveShadow);assert.deepEqual([layer.mesh,layer.mesh.geometry,layer.mesh.material,layer.mesh.instanceMatrix,layer.mesh.instanceColor],resources);assert.throws(()=>createDoorwayReveals(),/scene/);

console.log('PASS: ten real walk-in buildings gain seven-part measured doorway reveals in one stable batch; visible jambs sit inside existing wall collision while centre and two body-width lanes stay clear. CPU geometry only; no rendered entry-visibility claim.');
