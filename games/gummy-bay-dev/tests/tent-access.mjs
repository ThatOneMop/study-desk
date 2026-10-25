import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {tentPointBlocked as blocked,tentPropBlocked as propBlocked,tentFootprintBlocked as footprint,TENT_COLLISION as body,tentFloorHeight as floor,tentCeilingHeight as ceiling,TENT_SUPPORT as support} from '../dist/tent-access.mjs';
import {limitPlayerJump,playerViewHeights,playerHeadFits} from '../dist/player-view.mjs';
import {escapeEnclosure} from '../dist/furniture-access.mjs';
assert.ok(Object.isFrozen(body));
const samples=[[1.15,0,true],[-1.15,0,true],[0,-1.15,true],[0,0,true],[0,1.1,false],[0,1.6,false],[2,0,false],[0,2,false],[.5,1.2,false],[1.15,1.5,true],[1.15,1.6,false]];
for(let i=0;i<128;i++){
 const angle=i*Math.PI/64,matrix=new THREE.Matrix4().makeRotationY(angle);
 for(const [x,z,expected]of samples){const world=new THREE.Vector3(x,0,z).applyMatrix4(matrix);assert.equal(blocked(world.x+30,world.z-40,30,-40,angle),expected,'THREE-compatible rotated open front/solid body');assert.equal(footprint(world.x+30,world.z-40,30,-40,angle),Math.abs(x)<body.front&&Math.abs(z)<body.front,'conservative footprint rotates and leaves the authored front approach clear');}
}
for(const a of [[NaN,0,0,0,0],[0,Infinity,0,0,0],[0,0,NaN,0,0],[0,0,0,0,NaN]])assert.equal(blocked(...a),false);
let crateCornerGains=0;
for(let i=0;i<128;i++){
 const angle=i*Math.PI/64,matrix=new THREE.Matrix4().makeRotationY(angle);
 const projectedX=Math.abs(Math.cos(angle))*.335+Math.abs(Math.sin(angle))*.295;
 for(const [x,z,playerExpected,propExpected]of [[.77,1,false,.77>1.1-projectedX],[0,1.8,false,false],[1.7,0,false,false]]){
  const world=new THREE.Vector3(x,0,z).applyMatrix4(matrix);
  assert.equal(blocked(world.x+30,world.z-40,30,-40,angle),playerExpected,'player collision remains unchanged');
  assert.equal(propBlocked(world.x+30,world.z-40,30,-40,angle),propExpected,'measured world-axis crate envelope meets rotated tent body');
  if(!playerExpected&&propExpected)crateCornerGains++;
 }
}
assert.ok(crateCornerGains>0&&crateCornerGains<128,'crate-specific rotation adds only measured corner cases, not a generic player/body expansion');
const collision=(x,z,ignored)=>!ignored?.has(0)&&blocked(x,z,0,0);
const safe=escapeEnclosure({x:1.15,z:0},new Set([0]),collision);assert.ok(safe&&safe.distance<=3&&!collision(safe.x,safe.z));
assert.equal(escapeEnclosure({x:1.15,z:0},new Set([0]),()=>true),null,'do not force escape across another enclosing wall');
const bytes=fs.readFileSync(new URL('../dist/assets/equipment-v11.glb',import.meta.url)),asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const tent=asset.scene.getObjectByName('Tent');assert.ok(tent);tent.updateMatrixWorld(true);
const ray=(o,d)=>new THREE.Raycaster(new THREE.Vector3(...o),new THREE.Vector3(...d),0,10).intersectObject(tent,true)[0];
const side=ray([-3,1.15,0],[1,0,0]),back=ray([0,1.15,-3],[0,0,1]),front=ray([0,1.15,3],[0,0,-1]),pot=ray([0,.35,3],[0,0,-1]);
assert.ok(side&&back&&front&&pot);
assert.ok(Math.abs(side.point.x+1.19)<1e-6&&Math.abs(back.point.z+1.19)<1e-6);
assert.ok(front.point.z<-1,'centre-height front is open until back wall, not a closed front slab');
assert.ok(Math.abs(pot.point.z-.58)<1e-6&&body.potRadius>=pot.point.z+.325);
const aisleFloor=ray([0,1.15,1.05],[0,-1,0]),aisleRoof=ray([0,1.15,1.05],[0,1,0]),lamp=ray([0,1.15,0],[0,1,0]);
assert.ok(aisleFloor&&aisleRoof&&lamp);
console.log('CPU original Tent rays (not rendered acceptance): '+JSON.stringify({side:side.point.toArray(),back:back.point.toArray(),openFrontFirstHit:front.point.toArray(),pot:pot.point.toArray(),aisleFloor:aisleFloor.point.y,aisleRoof:aisleRoof.point.y,centralLamp:lamp.point.y}));
assert.ok(Object.isFrozen(support));
for(let i=0;i<128;i++){
 const a=i*Math.PI/64,m=new THREE.Matrix4().makeRotationY(a);
 for(const [x,z,f,h]of [[0,1.05,.08,2.255],[0,1.2,.08,2.255],[0,1.3,0,2.255],[0,1.4,0,2.255],[0,1.41,0,Infinity],[.7,.7,.08,2.0525],[1,.9,.08,2.0525],[-1.2,-1.2,.08,2.255],[1.21,0,0,2.255],[3,3,0,Infinity]]){
  const q=new THREE.Vector3(x,0,z).applyMatrix4(m).add(new THREE.Vector3(30,0,-40));
  assert.equal(floor(q.x,q.z,30,-40,a),f,'THREE-compatible rotated exact floor footprint');
  assert.equal(ceiling(q.x,q.z,30,-40,a),h,'conservative head/lamp footprint rotates, without a phantom floor outside');
 }
}
for(const args of [[NaN,0,0,0,0],[0,Infinity,0,0,0],[0,0,0,NaN,0],[0,0,0,0,Infinity],[1e300,1e300,0,0,0]]){assert.equal(floor(...args),0);assert.equal(ceiling(...args),Infinity);}
let measured=0;
for(const x of [-.65,0,.65])for(const z of [.95,1.05,1.15]){
 const f=ray([x,1.15,z],[0,-1,0]),r=ray([x,1.15,z],[0,1,0]);
 assert.ok(f&&r&&Math.abs(f.point.y-floor(x,z,0,0))<1e-6&&Math.abs(r.point.y-ceiling(x,z,0,0))<1e-6,'runtime aisle support/roof agree with original exported triangles');measured++;
}
assert.ok(Math.abs(lamp.point.y-support.lamp)<1e-6);
for(const x of [-.8,0,.8])for(const z of [-.6,0,.6]){const r=ray([x,1.15,z],[0,1,0]);assert.ok(r&&ceiling(x,z,0,0)<=r.point.y+1e-6,'conservative lamp guard is not above the measured fixture underside');}
for(const roof of [2.255,2.0525])for(const crouch of [0,.25,.5])for(const jump of [0,.1,.4,.8]){
 const limited=limitPlayerJump({ground:.08,crouch,jump,vertical:4.6,ceiling:roof});
 assert.ok(playerViewHeights({ground:.08,crouch,jump:limited.jump}).eye+.2<=roof+1e-6);
 assert.ok(playerHeadFits({ground:.08,crouch,jump:limited.jump,ceiling:roof}));
}
console.log('PASS: 128 rotations preserve player open-front collision while measured rectangular crate corners use a separate tent envelope; exact floor/conservative roof/lamp height fields, '+measured+' aisle triangle pairs, lamp rays, finite probes and jump caps. No rendered contact or full 3D physics claim.');
