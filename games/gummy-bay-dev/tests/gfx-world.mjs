import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {OCEAN_VERTEX,OCEAN_FRAGMENT,SKY_FRAGMENT,applyCarPaint,tuftSpots,createGrassTufts,createShoreFoam,worldTuning,isLowWorld} from '../dist/gfx-world.mjs';
import {CAR_MATERIAL,CAR_PALETTE,carGeometry} from '../dist/car-kit.mjs';
import {createAtmosphereOverhaul} from '../dist/graphics-atmosphere.mjs';
// Quality plan: Low keeps simple water, no tufts and lighter gloss; headlights follow the night.
assert.ok(isLowWorld('performance')&&!isLowWorld('high'));
assert.deepEqual({...worldTuning('performance',0)},{waterQ:0,gloss:.65,headlights:0,tufts:false});
assert.equal(worldTuning('high',1).headlights,1);assert.equal(worldTuning('balanced',.2).headlights,0);
// Shaders: water keeps weather/fog uniforms and adds fresnel, glint and foam; sky keeps stars and halo.
for(const k of ['uCloud','uFogNear','uSkyTop','fres','foam','colorspace_fragment'])assert.ok(OCEAN_FRAGMENT.includes(k),k);
for(const k of ['uCloud','fbm','star','night'])assert.ok(SKY_FRAGMENT.includes(k),k);
assert.ok(OCEAN_VERTEX.includes('uQ'));
const sky={top:{value:new THREE.Color()},bottom:{value:new THREE.Color()},night:{value:1}};
const skyMesh=new THREE.Mesh(new THREE.SphereGeometry(),new THREE.ShaderMaterial({uniforms:sky})),water=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.ShaderMaterial({uniforms:{}}));
createAtmosphereOverhaul({sky:skyMesh,water});assert.equal(skyMesh.material.fragmentShader,SKY_FRAGMENT);assert.equal(water.material.fragmentShader,OCEAN_FRAGMENT);
// Car paint patches the shared body material once, keyed for program caching; chrome hubs are in the body.
const paint=applyCarPaint(CAR_MATERIAL,CAR_PALETTE,sky);assert.equal(CAR_MATERIAL.customProgramCacheKey(),'gummy-car-paint-v155');
const sh={uniforms:{},fragmentShader:['common','roughnessmap_fragment','metalnessmap_fragment','emissivemap_fragment','lights_fragment_end'].map(c=>'#include <'+c+'>').join('\n')};CAR_MATERIAL.onBeforeCompile(sh);
for(const k of ['cLamp','cGlass','cChrome','indirectSpecular','uNight'])assert.ok(sh.fragmentShader.includes(k),k);assert.equal(sh.uniforms.uNight,paint.uNight);
const g=carGeometry('pickup',0x3366aa,0x222222),c=g.attributes.color,ch=new THREE.Color(CAR_PALETTE.CHROME);let chrome=0;for(let i=0;i<c.count;i++)if(Math.abs(c.getX(i)-ch.r)<1e-4&&Math.abs(c.getZ(i)-ch.b)<1e-4)chrome++;assert.ok(chrome>0,'wheel hubs are chrome');
// Grass tufts: one instanced draw, deterministic, hidden on Low.
const spots=tuftSpots([{x:0,z:0},{x:10,z:4,s:1.2}],[{x:3,z:3}]);assert.deepEqual(spots,tuftSpots([{x:0,z:0},{x:10,z:4,s:1.2}],[{x:3,z:3}]));assert.equal(spots.length,15);
const tufts=createGrassTufts(spots);assert.ok(tufts.mesh.isInstancedMesh);assert.equal(tufts.mesh.count,15);tufts.update(1,'performance');assert.ok(!tufts.mesh.visible);tufts.update(1,'high');assert.ok(tufts.mesh.visible);
// Shore foam: one closed ribbon along the coast outline, Medium/High only.
const outline=[[0,0],[10,0],[10,10],[0,10]].map(([x,z])=>({inner:{x,z},outer:{x:x*1.5-2.5,z:z*1.5-2.5}}));const foam=createShoreFoam(outline);
assert.equal(foam.mesh.geometry.attributes.position.count,8);assert.equal(foam.mesh.geometry.index.count,24);foam.update(2,1,'performance');assert.ok(!foam.mesh.visible);foam.update(2,1,'balanced');assert.ok(foam.mesh.visible);
console.log('PASS: v155 world graphics: water waves/fresnel/glint/foam and drifting sky clouds through the coastal stage, glossy car paint with chrome hubs and night lamps, instanced grass tufts and a shore foam ribbon, all off or lighter on Low. CPU only.');
