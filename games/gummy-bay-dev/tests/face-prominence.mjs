import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {RESIDENT_ACCESSORY_PROFILES,residentAccessoryParts} from '../dist/resident-accessories.mjs';
import {RESIDENT_FACE_FOCUS_BOUNDS,residentExpressionState,createResidentExpressionRig,updateResidentExpressionRig,residentExpressionResources} from '../dist/resident-expressions.mjs';

assert.equal(Object.isFrozen(RESIDENT_FACE_FOCUS_BOUNDS),true);
assert.deepEqual(Object.keys(RESIDENT_FACE_FOCUS_BOUNDS),['minX','maxX','minY','maxY','minZ','maxZ']);
assert.ok(RESIDENT_FACE_FOCUS_BOUNDS.minX>=-.32&&RESIDENT_FACE_FOCUS_BOUNDS.maxX<=.32&&RESIDENT_FACE_FOCUS_BOUNDS.minY>.28&&RESIDENT_FACE_FOCUS_BOUNDS.maxY<.46&&RESIDENT_FACE_FOCUS_BOUNDS.minZ>.25&&RESIDENT_FACE_FOCUS_BOUNDS.maxZ<.43);

const distances=[0,8,25,50,75,100,125],focus=distances.map(distance=>residentExpressionState({distance}).focus);
assert.equal(focus[0],0);assert.equal(focus[1],0);assert.equal(focus.at(-1),1);
for(let i=1;i<focus.length;i++)assert.ok(focus[i]>=focus[i-1]);
for(const distance of [NaN,Infinity,-Infinity,-100])assert.ok(residentExpressionState({distance}).focus>=0&&residentExpressionState({distance}).focus<=1);

const skinTones=[0xc68d6a,0xd8b991,0xb27e5b,0xe1b28f],rigs=[];
for(const [index,profile] of RESIDENT_ACCESSORY_PROFILES.entries()){
 const parts=residentAccessoryParts(profile.type);assert.ok(parts.length>=4);
 assert.ok(parts.every(part=>part.y>=2.07||Math.abs(part.x)>=.35),profile.type+' accessory geometry must stay above or outside the face window');
 const head=new THREE.Bone(),rig=createResidentExpressionRig({head,hairColor:0x443322+index,skinColor:skinTones[index%skinTones.length]});rigs.push(rig);
 assert.equal(rig.group.parent,head);assert.equal(rig.group.children.length,7);assert.equal(rig.faceFocus.name,'ExpressionFaceFocus');
 assert.equal(rig.faceFocus.castShadow,false);assert.equal(rig.faceFocus.receiveShadow,false);assert.equal(rig.faceFocus.frustumCulled,false);
 updateResidentExpressionRig(rig,residentExpressionState({distance:8,active:true}));const nearScale=rig.faceFocus.scale.x,nearGlint=rig.leftGlint.scale.x;
 updateResidentExpressionRig(rig,residentExpressionState({distance:125,active:true}));assert.ok(rig.faceFocus.scale.x>nearScale&&rig.leftGlint.scale.x>nearGlint);
 updateResidentExpressionRig(rig,residentExpressionState({distance:125,active:false}));assert.equal(rig.group.visible,false);
}
assert.equal(new Set(rigs.map(rig=>rig.faceFocus.geometry)).size,1);
assert.equal(new Set(rigs.map(rig=>rig.leftBrow.geometry)).size,1);
assert.equal(new Set(rigs.map(rig=>rig.leftGlint.geometry)).size,1);
const resources=residentExpressionResources();assert.equal(resources.faceFocusGeometry,rigs[0].faceFocus.geometry);assert.equal(resources.faceMaterialCount,skinTones.length);

console.log('PASS: all eight role-accessory silhouettes leave the face window open while shared cheek/nose facets, glints and brows receive bounded distance emphasis across both LOD-ready head rigs. CPU geometry only; no rendered face-readability claim.');
