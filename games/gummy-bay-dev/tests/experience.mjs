import assert from 'node:assert/strict';
import {turnTowards,sweepWalk,stockSummary,workerPoseValid,createBalanceFeedback} from '../dist/town-experience.mjs';
import {createCoastalBackdrop} from '../dist/coastal-backdrop.mjs';
import * as THREE from '../dist/vendor/three.module.min.js';
// Cross a narrow obstacle in a single lagged step: no tunnelling; free axis slides.
const hit=sweepWalk({x:0,z:0},2,1,(x,z)=>x>.7&&x<.9);
assert(hit.x<=.7);assert(Math.abs(hit.z-1)<1e-9);assert(hit.hitX);
const clear=sweepWalk({x:0,z:0},2,1,()=>false);assert(Math.abs(clear.x-2)<1e-9);
const nearPi=turnTowards(Math.PI-.02,-Math.PI+.02,.1);assert(nearPi>Math.PI-.02&&nearPi<Math.PI+.02);
assert.equal(turnTowards(1,2,0),1);
const s={raw:[4],gummies:[2],packs:[8],storedPacks:[5],deals:[{qty:3}],wrappers:6,crafterCargo:{phase:'input'}};
const before=JSON.stringify(s);assert.deepEqual(stockSummary(s),{raw:4,loose:2,carried:8,stored:5,reserved:3,available:5,wrappers:6,transit:1});assert.equal(JSON.stringify(s),before);
const balance=createBalanceFeedback();assert.deepEqual(balance.sample(400,0),[]);assert.deepEqual(balance.sample(325,0),[{account:'cash',amount:-75}]);assert.deepEqual(balance.sample(325,0),[]);balance.reset();assert.deepEqual(balance.sample(1200,25),[]);
assert(workerPoseValid({x:1,z:2,angle:0},{minX:0,maxX:5,minZ:0,maxZ:5}));assert(!workerPoseValid({x:Infinity,z:2,angle:0},{minX:0,maxX:5,minZ:0,maxZ:5}));
const bounds={minX:-280,maxX:280,minZ:-448,maxZ:95},scene=new THREE.Scene(),hills=createCoastalBackdrop(scene,bounds),matrix=new THREE.Matrix4(),pos=new THREE.Vector3();
for(let i=0;i<hills.count;i++){hills.getMatrixAt(i,matrix);pos.setFromMatrixPosition(matrix);assert(pos.x<bounds.minX||pos.x>bounds.maxX||pos.z<bounds.minZ);assert(matrix.elements.every(Number.isFinite));}
assert.equal(hills.castShadow,false);
console.log('PASS: swept walking, shortest-arc facing, read-only stock, balance reset, remote pose bounds, and backdrop placement. No browser rendering or live co-op tested.');
