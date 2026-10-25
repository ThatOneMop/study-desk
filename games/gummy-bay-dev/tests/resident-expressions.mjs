import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {RESIDENT_EXPRESSION_COLLIDERS,RESIDENT_FACE_FOCUS_BOUNDS,residentExpressionState,applyResidentBlinkMorph,createResidentExpressionRig,updateResidentExpressionRig,residentExpressionResources} from '../dist/resident-expressions.mjs';

assert.equal(RESIDENT_EXPRESSION_COLLIDERS.length,0);
const idle=residentExpressionState({now:1,id:2}),talk=residentExpressionState({now:1,id:2,talking:true}),work=residentExpressionState({now:1,id:2,working:true}),moving=residentExpressionState({now:1,id:2,moving:true}),far=residentExpressionState({now:1,id:2,distance:125});
for(const state of [idle,talk,work,moving,residentExpressionState({now:NaN,id:Infinity})]){
 assert.equal(Object.isFrozen(state),true);assert.ok(state.blink>=0&&state.blink<=1);assert.ok(state.eyeOpen>=0&&state.eyeOpen<=1-state.blink+1e-9);assert.ok(Math.abs(state.browLift)<=.055);assert.ok(Math.abs(state.browTilt)<=.16);assert.ok(Math.abs(state.gazeX)<=.018);assert.ok(Math.abs(state.gazeY)<=.012);
}
assert.ok(talk.browLift>idle.browLift);assert.ok(work.browTilt<idle.browTilt);assert.equal(moving.gazeX,0);assert.equal(moving.gazeY,0);assert.equal(idle.focus,0);assert.equal(far.focus,1);
const blink=residentExpressionState({now:5.075-.61*3,id:3});assert.ok(blink.blink>.99);
const headA=new THREE.Bone(),headB=new THREE.Bone(),rigA=createResidentExpressionRig({head:headA,hairColor:0x443322,skinColor:0xc58f6c}),rigB=createResidentExpressionRig({head:headB,hairColor:0x776655,skinColor:0xd8b991});
assert.equal(rigA.group.parent,headA);assert.equal(rigA.group.children.length,7);assert.equal(rigA.leftBrow.geometry,rigB.leftBrow.geometry);assert.equal(rigA.leftGlint.geometry,rigB.leftGlint.geometry);assert.equal(rigA.leftLid.geometry,rigB.leftLid.geometry);assert.equal(rigA.faceFocus.geometry,rigB.faceFocus.geometry);assert.notEqual(rigA.leftBrow.material,rigB.leftBrow.material);assert.notEqual(rigA.faceFocus.material,rigB.faceFocus.material);
updateResidentExpressionRig(rigA,talk);assert.equal(rigA.group.visible,true);assert.ok(rigA.leftBrow.position.y>.35);assert.ok(rigA.leftGlint.position.x>=-.158&&rigA.leftGlint.position.x<=-.122);
updateResidentExpressionRig(rigA,blink);assert.equal(rigA.leftGlint.visible,false);assert.equal(rigA.rightGlint.visible,false);assert.equal(rigA.leftLid.visible,true);assert.equal(rigA.rightLid.visible,true);assert.ok(rigA.leftGlint.scale.y<=.03);assert.ok(rigA.leftLid.scale.y>.99);
updateResidentExpressionRig(rigA,{...idle,blink:.5,eyeOpen:.5});assert.equal(rigA.leftGlint.visible,true);assert.equal(rigA.leftLid.visible,true);assert.ok(rigA.leftGlint.scale.y>=.49&&rigA.leftGlint.scale.y<=.51);assert.equal(rigA.leftLid.scale.y,.5);
updateResidentExpressionRig(rigA,far);assert.ok(rigA.leftGlint.scale.x>1.16&&rigA.leftBrow.scale.y>1.19&&rigA.faceFocus.scale.x>1.09);
updateResidentExpressionRig(rigA,residentExpressionState({active:false}));assert.equal(rigA.group.visible,false);
rigA.faceFocus.geometry.computeBoundingBox();const bounds=rigA.faceFocus.geometry.boundingBox;assert.ok(bounds.min.x>=RESIDENT_FACE_FOCUS_BOUNDS.minX-.001&&bounds.max.x<=RESIDENT_FACE_FOCUS_BOUNDS.maxX+.001&&bounds.min.y>=RESIDENT_FACE_FOCUS_BOUNDS.minY-.001&&bounds.max.y<=RESIDENT_FACE_FOCUS_BOUNDS.maxY+.001);
const resources=residentExpressionResources();assert.equal(resources.browGeometry,rigA.leftBrow.geometry);assert.equal(resources.glintGeometry,rigA.leftGlint.geometry);assert.equal(resources.lidGeometry,rigA.leftLid.geometry);assert.equal(resources.faceFocusGeometry,rigA.faceFocus.geometry);assert.ok(resources.browMaterialCount>=2&&resources.faceMaterialCount>=2);
assert.throws(()=>createResidentExpressionRig({}),TypeError);
const morph=new THREE.Object3D(),body=new THREE.Group();morph.morphTargetDictionary={Blink:0};morph.morphTargetInfluences=[0];body.add(morph);assert.equal(applyResidentBlinkMorph(body,{blink:.7}),1);assert.equal(morph.morphTargetInfluences[0],.7);assert.equal(applyResidentBlinkMorph(null,blink),0);
console.log('PASS: bounded blink, gaze and talk/work expression plus distance-aware shared cheek/nose focus geometry keeps eye glints synchronized with closed lids and drives animated head bones with zero collision. CPU transforms only; no rendered-expression claim.');

assert.equal(new Set(Array.from({length:5},(_,id)=>residentExpressionState({id,now:0}).eyeOpen)).size,5,'five distinct resting eyelid personalities');
