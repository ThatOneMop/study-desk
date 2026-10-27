import assert from 'node:assert/strict';import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {placeSite,SITE_MODELS,placeLot,KENNEY_MODELS,nightWindowShader,WINDOW_STYLES,WINDOW_GLSL} from '../dist/kenney-city.mjs';
import {createKerbBuildOuts,planBuildOuts,KERB_INNER,KERB_OUTER,BUILD_OUT_SEGMENTS} from '../dist/kerb-buildouts.mjs';
import {drivingSurfaceZone,KERB_BUILD_OUTS,VEHICLE_ROADS} from '../dist/road-zones.mjs';
// Narrower spawn streets: asphalt reads under 9 m, kerb clutter keeps the lanes clear.
assert.ok(2*KERB_INNER<9&&KERB_OUTER>6,'asphalt narrows from 12 m to '+(2*KERB_INNER)+' m');
assert.equal(KERB_BUILD_OUTS.length,BUILD_OUT_SEGMENTS.length*2);
const p=planBuildOuts();assert.ok(p.items.length>30&&p.colliders.length>20);
for(const c of p.colliders){const s=BUILD_OUT_SEGMENTS.find(s=>s.axis==='x'?Math.abs(c.z-s.line)<7&&c.x>=s.from&&c.x<=s.to:Math.abs(c.x-s.line)<7&&c.z>=s.from&&c.z<=s.to);assert.ok(s,'collider on a build-out');
 const off=s.axis==='x'?Math.abs(c.z-s.line)-c.d/2:Math.abs(c.x-s.line)-c.w/2;assert.ok(off>=4.2,'lane stays clear: inner edge '+off.toFixed(2));}
const avoid=[{x:5,z:-40}],q=planBuildOuts({avoid});assert.ok(q.items.every(i=>Math.hypot(i.x-5,i.z+40)>=3.2),'interaction points stay clear');
const scene=new THREE.Scene(),k=createKerbBuildOuts({scene});assert.equal(scene.children.length,1,'one instanced draw');assert.equal(k.mesh.castShadow,false);
// Van on a build-out is on a pedestrian way; lane centre is still road.
assert.equal(drivingSurfaceZone({x:5.4,z:-40,angle:0},{halfWidth:.3,halfLength:.5}).key,'pavement');
assert.equal(drivingSurfaceZone({x:-40,z:2,angle:Math.PI/2}).key,'road');
assert.ok(VEHICLE_ROADS.every(r=>r.d===12||r.w===12),'vehicle zones unchanged');
// Asymmetric blocks: uneven column widths, mixed models and heights.
const box=(w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);return {pos:g.attributes.position.array,nor:g.attributes.normal.array,uv:g.attributes.uv.array,index:Uint32Array.from(g.index.array),size:[w,h,d]};};
const models={};for(const n of Object.values(SITE_MODELS).flat())models[n]=box(1,1.29,1);
let asym=0;for(let seed=1;seed<40;seed++){const f=placeSite({x:0,z:0,w:22,d:12,h:11,mode:'full',front:1,seed},models);if(f.length>1){const hs=f.map(x=>x.height),ws=f.map(x=>x.sx);if(Math.max(...hs)-Math.min(...hs)>1&&Math.max(...ws)-Math.min(...ws)>.5)asym++;}}
assert.ok(asym>15,'most split sites are asymmetric: '+asym);
const lm={};for(const n of KENNEY_MODELS.flats)lm[n]=box(1,1.2,1);const hs=new Set();for(let seed=1;seed<20;seed++)hs.add(placeLot({x:0,z:0,w:10,d:10,type:'flats',seed},lm).height.toFixed(1));assert.ok(hs.size>8,'lot heights vary');
// Window styles per cell.
assert.deepEqual([...WINDOW_STYLES],['blinds','curtains','boarded','dark','glass']);
const sh={vertexShader:'#include <common>\n#include <project_vertex>',fragmentShader:'#include <common>\n#include <color_fragment>\n#include <emissivemap_fragment>'};nightWindowShader(sh);
assert.ok(sh.fragmentShader.includes(WINDOW_GLSL)&&WINDOW_GLSL.includes('vEmissiveMapUv'));
const src=fs.readFileSync('dist/game.js','utf8');for(const s of ["kerb-buildouts.mjs?v=164",'createKerbBuildOuts({scene,avoid:points})','colliders.push(...kerbBuildOuts.colliders)'])assert.ok(src.includes(s),s);
assert.ok(/game\.js\?v=(16[4-9]|1[7-9]\d)/.test(fs.readFileSync('dist/index.html','utf8')));
console.log('PASS: v164 narrower spawn streets (kerb build-outs '+(2*KERB_INNER)+' m asphalt, '+p.items.length+' clutter items, 1 draw), asymmetric mixed-height blocks ('+asym+'/39), five window styles');
