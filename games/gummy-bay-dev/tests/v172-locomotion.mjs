import assert from 'node:assert/strict';import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {LOCOMOTION_STRIDE,locomotionWeights,gaitStyle,strideMetres,advancePhase,footPlanted,turnPose,idleFidget,beginLocomotion,endLocomotion,createBobSmoother} from '../dist/rigged-locomotion.mjs';
import {headBob,WALK_SPEED} from '../dist/player-controller.mjs';

// Blend: standing stays idle, a walk overlaps into a run, weights always sum to 1.
const idle=locomotionWeights(0,'Idle');assert.equal(idle.idle,1);assert.equal(idle.walk+idle.run,0);
const walk=locomotionWeights(1.3,'Walk');assert.ok(walk.walk>.9&&walk.run===0);
const mid=locomotionWeights(3.1,'Walk');assert.ok(mid.walk>.2&&mid.run>.2,'walk and run overlap');assert.ok(Math.abs(mid.idle+mid.walk+mid.run-1)<1e-9);
const sprint=locomotionWeights(6,'Run');assert.ok(sprint.run>.95);
assert.equal(locomotionWeights(9,'Idle').run,0,'an Idle clip never sprints from position noise');
assert.equal(locomotionWeights(0,'Sit').single,'Sit');
// Gait varies and stays put for the same person.
const a=gaitStyle(4),b=gaitStyle(4),c=gaitStyle(9);
assert.deepEqual(a,b);assert.ok(a.phase!==c.phase||a.fidget!==c.fidget);
assert.ok(a.strideScale>=.96&&a.strideScale<=1.05);
assert.equal(strideMetres('Walk',.4,1),LOCOMOTION_STRIDE.Walk*.4);
assert.ok(Math.abs(advancePhase(.9,.5,1)-.4)<1e-9);
assert.equal(footPlanted('Walk','FootL',.5),true);assert.equal(footPlanted('Walk','FootL',.1),false);
const turn=turnPose(8);assert.ok(Math.abs(turn.torso)<=.4&&Math.abs(turn.bank)<=.08);
const fidget=idleFidget(2,1.2,1);assert.ok(Math.abs(fidget.headY)<=.2&&Math.abs(fidget.hipZ)<=.06&&Math.abs(fidget.shoulder)<=.1);
assert.deepEqual(idleFidget(2,1.2,0),{headX:0,headY:0,hipZ:0,shoulder:0});

// Distance-locked playback on the real CC0 rig keeps a stance foot nearly still.
const bytes=fs.readFileSync(new URL('../dist/assets/people/people-man.glb',import.meta.url));
const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
function rig(){
 const obj=gltf.scene.clone(true);
 // clone() does not retarget the skeleton; drive the source scene instead.
 return gltf.scene;
}
const scene=rig();scene.position.set(0,0,0);scene.rotation.set(0,0,0);scene.scale.set(1,1,1);scene.updateMatrixWorld(true);
const mixer=new THREE.AnimationMixer(scene),actions={};
for(const clip of gltf.animations)actions[clip.name]=mixer.clipAction(clip);
let head=null;const shoulders=[];scene.traverse(o=>{if(!o.isBone)return;if(o.name==='Head')head=o;else if(o.name==='ShoulderL'||o.name==='ShoulderR')shoulders.push(o);});
const entry={obj:scene,mixer,actions,head,shoulders};entry._gait={phase:0,strideScale:1,fidget:0,arm:1};
const foot=scene.getObjectByName('FootL'),v=new THREE.Vector3();
const speed=1.7,dt=1/30;let z=0;const planted=[];
for(let i=0;i<80;i++){z+=speed*dt;scene.position.z=z;scene.rotation.set(0,0,0);
 beginLocomotion(entry,{dt,speed,yaw:0,clip:'Walk',id:4});mixer.update(dt);endLocomotion(entry,{now:i*dt,id:4});
 if(footPlanted('Walk','FootL',entry._phase)){foot.getWorldPosition(v);planted.push(v.clone());}}
assert.ok(planted.length>=8,'walk has a stance');
const ax=planted.reduce((s,p)=>s+p.x,0)/planted.length,az=planted.reduce((s,p)=>s+p.z,0)/planted.length;
const radius=Math.max(...planted.map(p=>Math.hypot(p.x-ax,p.z-az)));
assert.ok(radius<0.08,'planted foot drifted '+radius.toFixed(3)+' model units');
// The same body speed with the old clock-driven rate (speed/1.35, no lock) slides much further.
mixer.stopAllAction();scene.position.set(0,0,0);const clocked=actions.Walk;clocked.enabled=true;clocked.setEffectiveWeight(1);clocked.timeScale=speed/1.35;clocked.play();
const old=[];z=0;
for(let i=0;i<80;i++){z+=speed*dt;scene.position.z=z;clocked.time=(i*dt*clocked.timeScale)%clocked.getClip().duration;mixer.update(dt);
 const phase=(clocked.time%clocked.getClip().duration)/clocked.getClip().duration;
 if(footPlanted('Walk','FootL',phase)){foot.getWorldPosition(v);old.push(v.clone());}}
const ox=old.reduce((s,p)=>s+p.x,0)/old.length,oz=old.reduce((s,p)=>s+p.z,0)/old.length;
const oldRadius=Math.max(...old.map(p=>Math.hypot(p.x-ox,p.z-oz)));
assert.ok(oldRadius>radius*3,'new plant should be much steadier than clock-driven playback ('+oldRadius.toFixed(3)+' vs '+radius.toFixed(3)+')');

// Camera bob eases in instead of hitting the full stride on the first moving frame.
const smoother=createBobSmoother();
const full=headBob(Math.PI/2,WALK_SPEED,{moving:true,amount:.7}).y;
const first=smoother.step(Math.PI/2,WALK_SPEED,{moving:true,amount:.7},1/60).y;
assert.ok(Math.abs(first)<Math.abs(full)*.5,'first step eases in');
let settled=first;for(let i=0;i<90;i++)settled=smoother.step(Math.PI/2,WALK_SPEED,{moving:true,amount:.7},1/30).y;
assert.ok(Math.abs(settled-full)<Math.abs(full)*.25,'settled bob stays near the stride');
const off=createBobSmoother();assert.deepEqual(off.step(1,WALK_SPEED,{moving:true,amount:0},1/30),{y:0,lateral:0,roll:0});
let faded=1;const fade=createBobSmoother();for(let i=0;i<10;i++)faded=fade.step(1,WALK_SPEED,{moving:true,amount:.7},1/30).y;
for(let i=0;i<40;i++)faded=fade.step(1,0,{moving:false,amount:.7},1/30).y;
assert.ok(Math.abs(faded)<1e-3,'bob settles when you stop');

const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/createBobSmoother/);assert.match(game,/rigged-locomotion\.mjs\?v=172/);assert.match(game,/cc0-people\.mjs\?v=172/);
const people=fs.readFileSync(new URL('../dist/cc0-people.mjs',import.meta.url),'utf8');
assert.match(people,/beginLocomotion/);assert.match(people,/endLocomotion/);
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert.match(html,/game\.js\?v=(17[4-9]|1[8-9]\d)/);
const credits=fs.readFileSync(new URL('../dist/CREDITS.md',import.meta.url),'utf8');
assert.match(credits,/Rigged locomotion/);assert.match(credits,/Quaternius/);
console.log('PASS v172 locomotion: blended gait, planted foot radius '+radius.toFixed(3)+' (was '+oldRadius.toFixed(3)+'), eased camera bob');
