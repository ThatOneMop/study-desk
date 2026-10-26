import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {worldLighting} from '../dist/world-lighting.mjs';
import {readabilityGrade,streetLampSpots,createStreetLighting,treeSpots,createStylisedTrees} from '../dist/light-grade.mjs';
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
const scene=new THREE.Scene(),sl=createStreetLighting({scene,spots,soffit:[{x:10,y:7.2,z:-94}]});
assert.equal(sl.poles.count,spots.length*2);assert.equal(sl.heads.count,spots.length+1);assert.equal(sl.pools.count,spots.length+1);
sl.update(readabilityGrade(worldLighting(13*60)));assert.equal(sl.pools.visible,false,'pools cost nothing by day');
sl.update(readabilityGrade(worldLighting(22*60)));assert.equal(sl.pools.visible,true);assert(sl.heads.material.emissiveIntensity>2);
assert(sl.pools.material.blending===THREE.AdditiveBlending&&sl.pools.material.depthWrite===false);
// Trees only on free cells; never in a blocked frontage band.
const free=(x,z)=>Math.abs(z+78)>14&&Math.abs(x)<200;
const ts=treeSpots({free,bounds:{minX:-200,maxX:200,minZ:-150,maxZ:0},max:60});
assert(ts.length>20&&ts.length<=60);for(const t of ts)assert(free(t.x,t.z));
assert.deepEqual(treeSpots({free,bounds:{minX:-200,maxX:200,minZ:-150,maxZ:0},max:60}),ts,'deterministic');
const tr=createStylisedTrees({scene,spots:ts});assert.equal(tr.trunks.count,ts.length);assert.equal(tr.leaves.count,ts.length*4);assert(tr.leaves.instanceColor);
console.log('light-grade ok',spots.length,'lamps',ts.length,'trees');
