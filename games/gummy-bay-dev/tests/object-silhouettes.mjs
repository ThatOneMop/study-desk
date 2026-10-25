import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {OBJECT_SILHOUETTE_COLLIDERS,OBJECT_SILHOUETTE_PROFILES,objectSilhouetteProfile,objectSilhouetteBounds,attachObjectSilhouette,setObjectSilhouetteQuality} from '../dist/object-silhouettes.mjs?v=93';

assert.equal(OBJECT_SILHOUETTE_COLLIDERS.length,0);assert(Object.isFrozen(OBJECT_SILHOUETTE_COLLIDERS));
assert.equal(OBJECT_SILHOUETTE_PROFILES.length,3);assert(OBJECT_SILHOUETTE_PROFILES.every(profile=>Object.isFrozen(profile)&&Object.isFrozen(profile.parts)&&profile.parts.every(Object.isFrozen)));
assert.deepEqual(OBJECT_SILHOUETTE_PROFILES.map(profile=>profile.kind),['rv','van','station']);
assert.equal(new Set(OBJECT_SILHOUETTE_PROFILES.map(profile=>profile.signature)).size,3);
for(const profile of OBJECT_SILHOUETTE_PROFILES){
 assert.equal(objectSilhouetteProfile(profile.kind),profile);const bounds=objectSilhouetteBounds(profile);
 assert(bounds&&Object.isFrozen(bounds)&&Object.isFrozen(bounds.min)&&Object.isFrozen(bounds.max));
 assert([bounds.width,bounds.height,bounds.depth].every(value=>Number.isFinite(value)&&value>0));
 assert(profile.parts.every(part=>['box','cylinder','cone'].includes(part.shape)&&part.w>0&&part.h>0&&part.d>0));
}
assert.equal(objectSilhouetteProfile('police'),null);assert.equal(objectSilhouetteBounds(null),null);

const root=new THREE.Group(),targets=OBJECT_SILHOUETTE_PROFILES.map(()=>new THREE.Group());targets.forEach(target=>root.add(target));
const rigs=OBJECT_SILHOUETTE_PROFILES.map((profile,index)=>attachObjectSilhouette(targets[index],profile.kind));
assert.deepEqual(rigs.map(rig=>rig.children.length),[4,4,4]);assert(rigs.every((rig,index)=>rig.parent===targets[index]&&rig.userData.profile===OBJECT_SILHOUETTE_PROFILES[index]));
assert.equal(attachObjectSilhouette(targets[0],'rv'),rigs[0],'attachment is idempotent');
const meshes=rigs.flatMap(rig=>rig.children),boxMeshes=meshes.filter(mesh=>mesh.geometry.type==='BoxGeometry'),cylinderMeshes=meshes.filter(mesh=>mesh.geometry.type==='CylinderGeometry');
assert.equal(new Set(boxMeshes.map(mesh=>mesh.geometry)).size,1);assert.equal(new Set(cylinderMeshes.map(mesh=>mesh.geometry)).size,1);
assert(meshes.every(mesh=>mesh.isMesh&&mesh.material.map==null&&mesh.matrix.elements.every(Number.isFinite)));
assert.equal(setObjectSilhouetteQuality(root,'performance'),12);assert(meshes.every(mesh=>!mesh.castShadow&&mesh.receiveShadow));
assert.equal(setObjectSilhouetteQuality(root,'high'),12);assert(meshes.every(mesh=>mesh.castShadow&&mesh.receiveShadow));
assert.throws(()=>attachObjectSilhouette(null,'rv'),/THREE object/);assert.throws(()=>attachObjectSilhouette(new THREE.Group(),'police'),/known kind/);
console.log('PASS: the existing RV, delivery vans and mixing stations receive three distinct shared-geometry outline signatures with zero collision; no police vehicle exists, and rendered recognition is not claimed.');
