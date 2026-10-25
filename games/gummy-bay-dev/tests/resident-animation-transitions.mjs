import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {RESIDENT_ANIMATION_POLICY,residentLocomotionClip,residentActionRate,residentTransitionPlan,applyResidentTransition} from '../dist/resident-animation.mjs';

assert.equal(Object.isFrozen(RESIDENT_ANIMATION_POLICY),true);
assert.equal(residentLocomotionClip(NaN),'Idle');assert.equal(residentLocomotionClip(.09),'Walk');assert.equal(residentLocomotionClip(2.11),'Run');
assert.equal(residentLocomotionClip(2.2,'Walk'),'Walk');assert.equal(residentLocomotionClip(2.26,'Walk'),'Run');assert.equal(residentLocomotionClip(1.9,'Run'),'Run');assert.equal(residentLocomotionClip(1.84,'Run'),'Walk');assert.equal(residentLocomotionClip(.05,'Walk'),'Idle');
assert.equal(residentActionRate('Idle',99),1);assert.equal(residentActionRate('Walk',0),.25);assert.equal(residentActionRate('Run',99),2);assert.ok(residentActionRate('Walk',1.2*.86)===1);
const plan=residentTransitionPlan('Walk','Run',.6875,1.375,2);assert.equal(plan.phaseSynced,true);assert.equal(plan.phase,.5);assert.equal(plan.targetTime,1);assert.equal(plan.fade,.24);
assert.equal(residentTransitionPlan('Talk','Search',.5,1.375,1.375).phaseSynced,false);assert.equal(residentTransitionPlan('Idle','Walk').fade,.2);assert.equal(residentTransitionPlan('Talk','Work').fade,.16);
const files=['citizen-v11.glb','citizen-v11-1.glb','citizen-v11-2.glb','citizen-lod-v12-0.glb','citizen-lod-v12-1.glb','citizen-lod-v12-2.glb'],root=new URL('../dist/assets/',import.meta.url);
for(const file of files){
 const bytes=fs.readFileSync(new URL(file,root)),gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const mixer=new THREE.AnimationMixer(gltf.scene),actions={};for(const clip of gltf.animations)actions[clip.name]=mixer.clipAction(clip);
 for(const name of ['Idle','Walk','Run','Talk','Search'])assert.ok(actions[name],file+' '+name+' clip');
 actions.Walk.reset().play();actions.Walk.time=actions.Walk.getClip().duration*.62;
 const walkPhase=actions.Walk.time/actions.Walk.getClip().duration,walkRun=applyResidentTransition(actions,'Walk','Run');assert.equal(walkRun.phaseSynced,true);assert.ok(Math.abs(actions.Run.time/actions.Run.getClip().duration-walkPhase)<1e-9,file+' Walk to Run phase');
 mixer.update(.016);assert.ok(actions.Run.time>walkRun.targetTime,file+' Run advances from retained phase');
 const runPhase=actions.Run.time/actions.Run.getClip().duration,runWalk=applyResidentTransition(actions,'Run','Walk');assert.ok(Math.abs(actions.Walk.time/actions.Walk.getClip().duration-runPhase)<1e-9,file+' Run to Walk phase');
 const gesture=applyResidentTransition(actions,'Walk','Talk');assert.equal(gesture.phaseSynced,false);assert.equal(actions.Talk.time,0,file+' gesture starts cleanly');mixer.update(.016);assert.ok(Number.isFinite(actions.Talk.time));
}
assert.equal(applyResidentTransition({},'Walk','Run'),null);
console.log('PASS: bounded gait hysteresis, clip-speed rates and normalized Walk/Run phase-preserving blends execute on all six real high/low resident GLBs; gestures reset cleanly. CPU animation state only; no rendered foot-slide claim.');
