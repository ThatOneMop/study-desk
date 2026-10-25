import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {wakingPose,createWorkshopTerminals,createCampsiteFire,firePulse} from '../dist/arrival-workplace.mjs';
assert.equal(wakingPose(0).height,.86);assert.equal(wakingPose(3).height,1.72);assert.equal(wakingPose(3).roll,0);
let last=0;for(let t=0;t<3;t+=.01){const p=wakingPose(t);assert(p.height>=last);last=p.height;assert(p.height<=1.72&&p.height>=.86);}
const scene=new THREE.Scene(),homes=[{x:-25,z:40},{x:-54,z:55},{x:54,z:51}],terminals=createWorkshopTerminals({scene,homes});
terminals.update({active:true,room:true,house:1});assert.deepEqual(terminals.rows.map(r=>r.group.visible),[false,true,false]);
terminals.update({active:false,room:true,house:1});assert(terminals.rows.every(r=>!r.group.visible));
const fire=createCampsiteFire({scene,x:-69,z:24}),resources=fire.flames.map(f=>f.geometry);
for(let i=0;i<1000;i++){fire.update(i/60,i%2);assert(firePulse(i)>=.67&&firePulse(i)<=.97);assert(fire.flames.every((f,j)=>f.geometry===resources[j]&&f.scale.y>0));}
assert.equal(scene.children.length,4);console.log('PASS: continuous waking pose, owned-property terminal visibility, stable fire resources and bounded nonflashing flame motion. CPU only.');
const {workshopPlan}=await import('../dist/arrival-workplace.mjs');
const state={raw:[4,2],gummies:[2,1],packs:[5,3],storedPacks:[7,0],wrappers:4,packStation:true,day:2,time:100,deals:[{npc:1,t:0,qty:4,due:1600},{npc:0,t:1,qty:2,due:1550}],crafterCargo:{phase:'input'}};
const before=JSON.stringify(state),p=workshopPlan(state);
assert.equal(p.wrapNow,3);assert.equal(p.finishable,4);assert.equal(p.wrapperShortfall,5);assert.equal(p.available,2);assert.equal(p.reserved,6);assert.equal(p.stored,7);assert.equal(p.inTransit,1);assert.deepEqual(p.deadlines.map(d=>d.minutes),[10,60]);assert.equal(JSON.stringify(state),before);
assert.equal(workshopPlan({...state,packStation:false}).finishable,0);assert.equal(workshopPlan({...state,wrappers:0}).wrapNow,0);
const cargoOutput=workshopPlan({...state,crafterCargo:{phase:'output'}});assert.equal(cargoOutput.available,p.available,'transit packs cannot be offered for sale');
assert.equal(workshopPlan({...state,day:3}).deadlines[0].overdue,true);
console.log('PASS: planner conserves inventory, keeps reserved/stored/transit packs separate, handles absent equipment and sorts saved-clock deadlines.');
