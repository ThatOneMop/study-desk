import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {vertexColorKey,batchCandidate} from '../dist/static-batch.mjs';
import {worldLighting} from '../dist/world-lighting.mjs';
import {readabilityGrade,streetLampSpots,treeSpots,dressingSpots,createStreetDressing} from '../dist/light-grade.mjs';
// Fill always present, stronger at night; pools only after dark; colours finite.
let dayFill=0,nightFill=0;
for(let t=0;t<1440;t+=15){const p=worldLighting(t),g=readabilityGrade(p);
 for(const v of Object.values(g))assert(Number.isFinite(v),'finite '+t);
 assert(g.fill>=.4&&g.fill<=.75&&g.hemiScale>=1.15&&g.hemiScale<=1.4);
 if(p.night<.04)assert.equal(g.pools,0,'no light pools by day');
 if(p.night>.9){assert(g.pools>.9);nightFill=g.fill;}
 if(p.daylight>.95)dayFill=g.fill;
 // hemisphere ground never sinks to the old near-black night value
 const lum=((g.hemiGround>>16)&255)+((g.hemiGround>>8)&255)+(g.hemiGround&255);assert(lum>120,'lifted ground '+t);}
assert(nightFill>dayFill,'moon fill');
// Lamps keep clear of obstacles, points, junctions and skipped roads.
const obstacles=[{x:30,z:-160+9.6,w:6,d:4}],points=[{x:-60,z:-150.4}];
const spots=streetLampSpots({roadsZ:[0,-90,-160],roadsX:[105],skipZ:[0,-90],obstacles,points});
assert(spots.length>10);
for(const s of spots){assert(!obstacles.some(o=>Math.abs(s.x-o.x)<o.w/2+1.2&&Math.abs(s.z-o.z)<o.d/2+1.2));assert(!points.some(p=>Math.hypot(p.x-s.x,p.z-s.z)<2.5));
 if(s.axis==='z'){assert(Math.abs(Math.abs(s.z+160)-9.6)<1e-9);assert(Math.abs(s.x-105)>=13);}}
// Trees only on free cells; never in a blocked frontage band.
const free=(x,z)=>Math.abs(z+78)>14&&Math.abs(x)<200;
const ts=treeSpots({free,bounds:{minX:-200,maxX:200,minZ:-150,maxZ:0},max:60});
assert(ts.length>20&&ts.length<=60);for(const t of ts)assert(free(t.x,t.z));
assert.deepEqual(treeSpots({free,bounds:{minX:-200,maxX:200,minZ:-150,maxZ:0},max:60}),ts,'deterministic');
// Static parts are plain single-colour meshes (static-batcher candidates); pools + head glow are one night mesh.
const scene=new THREE.Scene(),planters=[{x:4,z:4,hue:.2}];
const sd=createStreetDressing({scene,lamps:spots,soffit:[{x:10,y:7.2,z:-94}],trees:ts,planters});
assert.equal(scene.children.length,sd.meshes.length+1);assert(sd.meshes.length<=10);
for(const o of sd.meshes){assert(!o.geometry.attributes.color&&!o.material.transparent&&!o.material.emissiveMap&&!Object.keys(o.userData).length,'batchable');assert(vertexColorKey(o.material)&&batchCandidate(o,scene));}
assert.equal(sd.trees,ts.length);assert.equal(sd.lamps,spots.length);assert(sd.verts<120000);
assert.equal(sd.pools.geometry.attributes.position.count,(spots.length+1)*(6+36));
sd.update(readabilityGrade(worldLighting(13*60)));assert.equal(sd.pools.visible,false,'pools cost nothing by day');
sd.update(readabilityGrade(worldLighting(22*60)));assert.equal(sd.pools.visible,true);assert(sd.pools.material.opacity>.7);
assert(sd.pools.material.blending===THREE.AdditiveBlending&&sd.pools.material.depthWrite===false);
// Dressing never lands on a road band, collider, door point, police lane or crowd line.
const routes=[[[6,-30],[6,4],[-11,4]]],crowd=[{a:[-40,20],b:[40,20]},{a:[30,-30]}],cols=[{x:-30,z:-25,w:10,d:8}],pts=[{x:50,z:30}];
const ds=dressingSpots({roadBands:[{axis:'z',at:0,half:11.5}],colliders:cols,points:pts,routes,crowd});
assert(ds.length>5);
for(const d of ds){assert(Math.abs(d.z)>=11.5);assert(!(Math.abs(d.x+30)<7.4&&Math.abs(d.z+25)<6.4));assert(Math.hypot(d.x-50,d.z-30)>=5);assert(Math.abs(d.z-20)>=2.2||Math.abs(d.x)>40);assert(Math.hypot(d.x-30,d.z+30)>=2.6);
 for(const e of ds)if(e!==d)assert(Math.hypot(e.x-d.x,e.z-d.z)>=5);}
console.log('light-grade ok',spots.length,'lamps',ts.length,'trees',ds.length,'dressing',sd.verts,'verts');
