import assert from 'node:assert/strict';
import {propReachable,stepProp,PROP_HALF_WIDTH,PROP_HALF_DEPTH} from '../dist/prop-motion.mjs';
import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {GLTFLoader} from '../dist/vendor/gltf-loader.js';
import {rvPropBands,RV_PROP_ROOF,RV_PROP_VENT} from '../dist/rv-support.mjs';
import {tentPropBands,TENT_PROP_ROOF,TENT_PROP_LAMP} from '../dist/tent-access.mjs';
const clear={blocked:()=>false,floorHeight:()=>0};
const fresh=()=>({x:0,y:.3,z:0,vx:0,vy:0,vz:0,owner:null});
const roof={...clear,overheadBands:()=>[{bottom:2.25,top:2.35}]};
const roofHit=stepProp({...fresh(),y:1.8,vy:20},.06,roof);
assert.ok(roofHit.y+.325<=2.250001&&roofHit.vy<0,'upward crate sweep hits the roof underside rather than tunnelling through it');
const actor={x:0,y:1.72,z:0,yaw:0},crate={...fresh(),x:2};
assert(propReachable(actor,crate,clear.blocked));
assert(!propReachable(actor,{...crate,x:3},clear.blocked));
assert(!propReachable(actor,crate,(x,z)=>x>.8&&x<1));
assert(!propReachable({...actor,x:NaN},crate,clear.blocked));
const immutable=Object.freeze({...fresh(),y:1,vx:30,vz:3});
const wall={...clear,blocked:x=>x>.47&&x<.6};
const hit=stepProp(immutable,.06,wall);
assert(hit.x<.47&&hit.vx<0);assert(hit.z>0,'free axis slides');assert.equal(immutable.x,0);
assert.equal(PROP_HALF_WIDTH,.335);assert.equal(PROP_HALF_DEPTH,.295);
const recoveredSide=stepProp({...fresh(),x:.33,y:.325},.06,{...clear,blocked:(x,z)=>x>.325&&x<.5&&Math.abs(z)<1});
assert.ok(recoveredSide.x<=.325&&!((recoveredSide.x>.325&&recoveredSide.x<.5)&&Math.abs(recoveredSide.z)<1),'old centre-clear crate position recovers from the measured bevel overlap');
const carriedRecovery=stepProp({...fresh(),x:.33,y:1.18,owner:'host'},.06,{...clear,holder:{...actor,x:0,yaw:Math.PI/2},blocked:(x,z)=>x>.325&&x<.5&&Math.abs(z)<1,reachBlocked:()=>false});
assert.equal(carriedRecovery.owner,'host');assert.ok(carriedRecovery.x<=.325,'actor sight uses actor blockers while carried motion recovers against the wider crate envelope');
const followed=stepProp({...fresh(),y:1.18,owner:'host'},.06,{...clear,holder:{...actor,x:1,yaw:-Math.PI/2},blocked:x=>x>1.7&&x<1.9});
assert(followed.x<1.7&&followed.owner==='host','carried movement checks the path, not only the target');
for(const holder of [null,{...actor,x:10},{...actor,x:1}]){
 const dropped=stepProp({...fresh(),y:1.18,owner:'guest'},.06,{...clear,holder,blocked:x=>x>.4&&x<.6});
 assert.equal(dropped.owner,null);assert.equal(dropped.x,0,'lost contact never teleports the crate');
}
let falling={...fresh(),y:3,vx:2,vy:3};for(let i=0;i<300;i++)falling=stepProp(falling,.06,clear);
assert.equal(falling.y,.325);assert.equal(falling.vx,0);assert.equal(falling.vy,0);
const elevated=stepProp({...fresh(),y:.9,vy:-1},.06,{...clear,floorHeight:()=>.75});assert.equal(elevated.y,1.075);
assert.deepEqual(stepProp(immutable,NaN,clear),immutable);assert.deepEqual(stepProp(immutable,-1,clear),immutable);
assert.deepEqual(stepProp(immutable,100,clear),stepProp(immutable,.06,clear));
assert(Number.isFinite(stepProp({...fresh(),vx:Infinity},.06,clear).x));
const topHit=stepProp({...fresh(),y:3.2,vy:-30},.06,roof);assert.ok(topHit.y>=2.675-1e-8&&topHit.vy>0,'falling crate hits roof top instead of being pulled below it');
let rooftop={...fresh(),y:3.2,vy:-30,vx:0};for(let i=0;i<300;i++)rooftop=stepProp(rooftop,.06,roof);assert.ok(Math.abs(rooftop.y-2.675)<1e-8&&rooftop.vy===0,'crate settles on roof top');
const roofEdge={...clear,overheadBands:x=>x>=.5&&x<=1?[{bottom:2.25,top:2.35}]:[]};
const sideHit=stepProp({...fresh(),x:0,y:2.3,vx:30,vz:1},.06,roofEdge);assert.ok(sideHit.x<.5&&sideHit.vx<0&&sideHit.z>0,'height-aware sweep hits thin roof side and slides, despite a clear endpoint beyond it');
assert.ok(stepProp({...fresh(),x:0,y:3,vx:30},.06,roofEdge).x>1,'crate above roof may cross its side without being snapped down');
const overlapping={...clear,overheadBands:()=>[{bottom:2.05,top:2.16},{bottom:2.25,top:2.35}]};
for(const y of [1.8,2.1,2.3,2.5]){const fixed=stepProp({...fresh(),y},.06,overlapping);assert.ok(fixed.y<=1.725+1e-8||fixed.y>=2.675-1e-8,'legacy recovery leaves union of expanded lamp/roof slabs');assert.ok(Math.abs(fixed.y-y)<1,'recovery stays locally bounded for original fixture envelope');}
const roofCrate={...fresh(),y:2.675};assert.equal(propReachable(actor,roofCrate,clear.blocked,3,roof.overheadBands),false,'cannot grab through thin roof even with identical x/z');
assert.equal(propReachable({...actor,y:3.5},roofCrate,clear.blocked,3,roof.overheadBands),true,'clear same-side top reach remains possible');
for(const range of [Infinity,NaN,-1,4])assert.equal(propReachable(actor,fresh(),clear.blocked,range),false);
const carryAcross=stepProp({...fresh(),y:2.675,owner:'host'},.06,{...roof,holder:{...actor,y:1.72}});assert.equal(carryAcross.owner,null);assert.equal(carryAcross.y,2.675,'lost overhead line of contact releases in place without crossing roof');
const invalid={...clear,overheadBands:()=>[{bottom:NaN,top:3},{bottom:3,top:2},null]};assert.deepEqual(stepProp({...fresh(),y:1,vy:3},.06,invalid),stepProp({...fresh(),y:1,vy:3},.06,clear),'malformed bands are ignored');
assert.ok(Object.isFrozen(RV_PROP_ROOF)&&Object.isFrozen(RV_PROP_VENT)&&Object.isFrozen(TENT_PROP_ROOF)&&Object.isFrozen(TENT_PROP_LAMP));
assert.ok(Object.isFrozen(rvPropBands(-58,26.7)));assert.equal(rvPropBands(0,0).length,0);
assert.deepEqual(rvPropBands(-58,24.3),[RV_PROP_ROOF,RV_PROP_VENT]);assert.deepEqual(rvPropBands(-58,26.7),[RV_PROP_ROOF]);
for(const bad of [[NaN,26],[-58,Infinity]])assert.equal(rvPropBands(...bad).length,0);
for(let i=0;i<128;i++){
 const a=i*Math.PI/64,m=new THREE.Matrix4().makeRotationY(a);
 for(const [x,z,roofExpected,lampExpected]of [[0,1.2,true,false],[0,.5,true,true],[0,2,false,false],[1.7,1.7,false,false]]){
  const q=new THREE.Vector3(x,0,z).applyMatrix4(m),bands=tentPropBands(q.x+30,q.z-40,30,-40,a);
  assert.equal(bands.includes(TENT_PROP_ROOF),roofExpected);assert.equal(bands.includes(TENT_PROP_LAMP),lampExpected);
 }
 const pad=.335*(Math.abs(Math.cos(a))+Math.abs(Math.sin(a))),q=new THREE.Vector3(1.2+pad-.001,0,0).applyMatrix4(m);
 assert.ok(tentPropBands(q.x,q.z,0,0,a).includes(TENT_PROP_ROOF),'rotated query includes world-axis crate corner projection');
}
for(const bad of [[NaN,0,0,0,0],[0,0,NaN,0,0],[0,0,0,0,Infinity]])assert.equal(tentPropBands(...bad).length,0);
async function asset(file){const b=fs.readFileSync(new URL('../dist/assets/'+file,import.meta.url));return (await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'')).scene;}
const environment=await asset('environment-v11-final.glb'),tent=(await asset('equipment-v11.glb')).getObjectByName('Tent');environment.updateMatrixWorld(true);tent.updateMatrixWorld(true);
function verticalHits(object,x,z,y,dy){return new THREE.Raycaster(new THREE.Vector3(x,y,z),new THREE.Vector3(0,dy,0),0,8).intersectObject(object,true);}
for(const x of [-58,-57.5]){const top=verticalHits(environment,x,26.7,5,-1)[0],under=verticalHits(environment,x,26.7,2.8,1)[0];assert.ok(Math.abs(top.point.y-RV_PROP_ROOF.top)<1e-6&&Math.abs(under.point.y-RV_PROP_ROOF.bottom)<1e-6,'RV slab bottom/top match actual exported triangles');}
const ventMesh=environment.getObjectByName('RV_metal'),ventPosition=ventMesh.geometry.attributes.position,ventPoint=new THREE.Vector3(),ventPoints=[];for(let i=0;i<ventPosition.count;i++){ventPoint.fromBufferAttribute(ventPosition,i).applyMatrix4(ventMesh.matrixWorld);if(ventPoint.y>RV_PROP_ROOF.top+1e-6)ventPoints.push(ventPoint.clone());}const ventBox=new THREE.Box3().setFromPoints(ventPoints);assert.ok(Math.abs(RV_PROP_VENT.minX-(ventBox.min.x-PROP_HALF_WIDTH))<1e-6&&Math.abs(RV_PROP_VENT.maxX-(ventBox.max.x+PROP_HALF_WIDTH))<1e-6&&Math.abs(RV_PROP_VENT.minZ-(ventBox.min.z-PROP_HALF_DEPTH))<1e-6&&Math.abs(RV_PROP_VENT.maxZ-(ventBox.max.z+PROP_HALF_DEPTH))<1e-6&&Math.abs(RV_PROP_VENT.top-ventBox.max.y)<1e-6&&RV_PROP_VENT.bottom===RV_PROP_ROOF.top,'finite RV vent band is the exported high-vertex footprint padded by measured crate axes');
for(const [x,z] of [[-58,24.3],[-58.6,24],[-57.4,24.8]]){const top=verticalHits(environment,x,z,5,-1)[0];assert.ok(Math.abs(top.point.y-RV_PROP_VENT.top)<1e-6,'RV vent top matches original exported triangles');}
const ventRoof={...clear,overheadBands:rvPropBands};let ventCrate={...fresh(),x:-58,y:4.5,z:24.3,vy:-30};for(let i=0;i<300;i++)ventCrate=stepProp(ventCrate,.06,ventRoof);assert.ok(Math.abs(ventCrate.y-(RV_PROP_VENT.top+.325))<1e-8&&ventCrate.vy===0,'crate settles on finite rooftop vent top');
let adjacentCrate={...fresh(),x:-58,y:4.5,z:26.7,vy:-30};for(let i=0;i<300;i++)adjacentCrate=stepProp(adjacentCrate,.06,ventRoof);assert.ok(Math.abs(adjacentCrate.y-(RV_PROP_ROOF.top+.325))<1e-8&&adjacentCrate.vy===0,'adjacent rooftop remains at main roof height');
for(const z of [.95,1.05,1.15]){const top=verticalHits(tent,0,z,5,-1)[0],under=verticalHits(tent,0,z,1.15,1)[0];assert.ok(TENT_PROP_ROOF.top>=top.point.y&&TENT_PROP_ROOF.bottom<=under.point.y&&TENT_PROP_ROOF.top-top.point.y<.006&&under.point.y-TENT_PROP_ROOF.bottom<.006,'roof slab bounds union exported/procedural surfaces within .006');}
const lampHits=verticalHits(tent,0,0,1.15,1).filter(h=>h.point.y<2.2);assert.ok(lampHits.length&&lampHits.every(h=>h.point.y>=TENT_PROP_LAMP.bottom-1e-6&&h.point.y<=TENT_PROP_LAMP.top+1e-6),'original diffuser/frame undersides and tops fit lamp band');
console.log('PASS: measured x/z/y crate bounds, bounded horizontal legacy recovery, 3D reach/roof occlusion, swept wall/carry/throw and roof/finite-RV-vent contacts, settled tops, union-safe recovery, finite immutable inputs, 128 rotated envelopes and original GLB roof/vent/lamp rays. No rendered physics or live co-op claim.');
