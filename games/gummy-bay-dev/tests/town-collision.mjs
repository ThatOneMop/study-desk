import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {TOWN_SHELL_PAD,townGapColliders} from '../dist/town-collision.mjs';
import {DOORWAY_REVEAL_SITES} from '../dist/doorway-reveals.mjs';
import {DISTRICT_BUILDING_SITES} from '../dist/district-architecture.mjs';
import {STEP_RISE,riseTooSteep,strideBob,dampedTravel} from '../dist/player-view.mjs';
import {sweepWalk} from '../dist/town-experience.mjs';
import {createFixedStepper} from '../dist/sim-clock.mjs';

assert.equal(TOWN_SHELL_PAD,.65);
assert.equal(STEP_RISE,.35);
assert.deepEqual(townGapColliders(null),[]);
assert.equal(riseTooSteep(0,.94,false),true,'a side step onto the RV floor is a wall, not a stair');
assert.equal(riseTooSteep(0,.3,false),false);
assert.equal(riseTooSteep(.94,0,false),false,'drops stay walkable');
assert.equal(riseTooSteep(0,2,true),false,'airborne motion is not a step check');
assert.equal(riseTooSteep(Number.NaN,1,false),false);
const standing=strideBob(Math.PI/2,{moving:true});
assert.ok(Math.abs(standing.y-.023)<1e-9&&standing.roll>0);
const crouched=strideBob(Math.PI/2,{moving:true,crouch:.5});
assert.equal(crouched.y,0);
assert.deepEqual(strideBob(1,{moving:false}),{y:0,roll:0});
assert.deepEqual(strideBob(1,{moving:true,airborne:true}),{y:0,roll:0});
assert.deepEqual(strideBob(Number.NaN,{moving:true}),{y:0,roll:0});

const wall=sweepWalk({x:0,z:0},2,1,(x,z)=>x>.7&&x<.9);
assert.ok(wall.x<=.7&&Math.abs(wall.z-1)<1e-9&&wall.hitX,'a narrow wall still stops only the blocked axis');
const corner=sweepWalk({x:.2,z:.2},1,1,(x,z)=>x>=.5&&z>=.5);
assert.ok(corner.x<.5||corner.z<.5,'corner slide does not finish inside the obstacle');
assert.ok(corner.x>.2||corner.z>.2);

function distance(frame,frames){
 const clock=createFixedStepper();
 let velocity=0,travelled=0;
 for(let i=0;i<frames;i++)for(const dt of clock.consume(frame)){
  const step=dampedTravel(velocity,4.3,dt,18);
  velocity=step.velocity;travelled+=step.distance;
 }
 return travelled;
}
const slow=distance(1/30,30),fast=distance(1/120,120);
assert.ok(Math.abs(slow-fast)<1e-6,`walk distance matches across frame rates (${slow} vs ${fast})`);

const geometry=new THREE.BufferGeometry();
geometry.setAttribute('position',new THREE.Float32BufferAttribute([
 -2,0,-1, 2,0,-1, 2,3,-1,
 -2,0,-1, 2,3,-1, -2,3,-1,
 -2,0,1, 2,0,1, 2,.02,1,
 -2,0,1, 2,.02,1, -2,.02,1
],3));
const group=new THREE.Group();
group.add(new THREE.Mesh(geometry,new THREE.MeshBasicMaterial()));
const shells=townGapColliders(group);
const covers=(list,x,z)=>list.some(box=>Math.abs(x-box.x)<box.w/2&&Math.abs(z-box.z)<box.d/2);
assert.ok(covers(shells,0,-1),'vertical wall becomes a shell');
assert.equal(covers(shells,0,1),false,'flat floor is not a wall');
assert.equal(covers(shells,0,0),false,'the gap between wall and floor stays open');
assert.equal(townGapColliders(group,{ignoreName:name=>name==='Room'}).length,shells.length);
const named=new THREE.Group();named.name='RV';named.add(group.children[0].clone());
assert.equal(townGapColliders(named,{ignoreName:name=>name==='RV'}).length,0,'named RV keeps its measured doorway');
assert.equal(townGapColliders(group,{openFootprints:[{x:0,z:-1,w:6,d:2}]}).length,0);
assert.equal(townGapColliders(group,{covered:()=>true}).length,0);
assert.deepEqual(townGapColliders(group),shells);
assert.ok(Object.isFrozen(shells)&&shells.every(box=>box.townShell&&Object.isFrozen(box)));

const bytes=fs.readFileSync(new URL('../dist/assets/environment-v11-final.glb',import.meta.url));
const town=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const preserve=DOORWAY_REVEAL_SITES.map(site=>({x:site.x,z:site.z+site.d/2,w:2,d:2.8})).concat([{x:-55.6,z:26.75,w:8,d:2.2}]);
const covered=(x,z)=>DISTRICT_BUILDING_SITES.some(site=>Math.abs(x-site.x)<site.w/2&&Math.abs(z-site.z)<site.d/2);
const townShells=townGapColliders(town.scene,{covered,openFootprints:DOORWAY_REVEAL_SITES,preserve,ignoreName:name=>name==='RV'});
assert.ok(townShells.length>20&&townShells.length<1200,`shell count ${townShells.length}`);
assert.deepEqual(townGapColliders(town.scene,{covered,openFootprints:DOORWAY_REVEAL_SITES,preserve,ignoreName:name=>name==='RV'}),townShells);
const orphan=town.scene.getObjectByName('Building_08');
const orphanBox=new THREE.Box3().setFromObject(orphan);
const orphanCenter={x:(orphanBox.min.x+orphanBox.max.x)/2,z:(orphanBox.min.z+orphanBox.max.z)/2};
assert.equal(covers(townShells,orphanCenter.x,orphanCenter.z),false,'the orphan building interior stays walkable');
assert.equal(covers(townShells,orphanCenter.x,orphanBox.min.z+.2),true,'the orphan back wall blocks');
assert.equal(covers(townShells,orphanCenter.x,orphanBox.max.z+.4),false,'the orphan open front stays open');
for(const site of DOORWAY_REVEAL_SITES){
 const front=site.z+site.d/2;
 for(const x of [site.x-.6,site.x,site.x+.6])for(const z of [front-1.15,front,front+1.15])assert.equal(covers(townShells,x,z),false,`door lane stays open at ${site.id} ${x},${z}`);
}
for(const z of [26.3,27.2])for(const x of [-58,-55,-53.2])assert.equal(covers(townShells,x,z),false,`RV lane stays open at ${x},${z}`);
for(const site of DISTRICT_BUILDING_SITES)assert.equal(covers(townShells,site.x,site.z),false,'district centres stay on their authored solids, not a second shell');
console.log(`PASS: ${townShells.length} Blender walk-height shells block the orphan wall and facade lips, leave door and RV lanes open, and walk distance matches at 30 and 120 FPS.`);
