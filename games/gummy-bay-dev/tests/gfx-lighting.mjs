import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {worldLighting} from '../dist/world-lighting.mjs';
import {gfxLightGrade,occlusionSkirts,createGroundOcclusion,gfxLerpHex as lerpHex} from '../dist/gfx-lighting.mjs';
// Golden hour is warmer than noon; night has a moon key and lifted exposure; Low never asks for real shadows.
const noon=gfxLightGrade(worldLighting(12*60),'high'),gold=gfxLightGrade(worldLighting(18*60+30),'high'),night=gfxLightGrade(worldLighting(23*60),'high'),low=gfxLightGrade(worldLighting(23*60),'performance');
assert.ok(gold.sunColorMix>noon.sunColorMix&&gold.sunScale>noon.sunScale,'golden hour warmer');
assert.ok(night.moon>.3&&night.exposureScale>1.1,'moonlit night');
assert.ok(noon.fillScale<1,'daytime flat fill trimmed');
assert.equal(low.shadowIntensity,0);assert.ok(low.occlusion>night.occlusion,'Low leans on occlusion');
for(let t=0;t<1440;t+=30)for(const q of ['performance','balanced','high']){const g=gfxLightGrade(worldLighting(t),q);for(const v of Object.values(g))assert.ok(Number.isFinite(v),'finite '+t);}
assert.equal(lerpHex(0x000000,0xffffff,.5),0x808080);
// Skirts: 16 verts / 48 indices per footprint; slivers skipped; one mesh.
const s=occlusionSkirts([{x:0,z:0,w:10,d:8},{x:5,z:5,w:1,d:9}]);
assert.equal(s.verts,16);assert.equal(s.idx.length,48);
const scene=new THREE.Scene(),o=createGroundOcclusion(THREE,scene,[{x:0,z:0,w:10,d:8},{x:30,z:0,w:6,d:6}]);
assert.equal(scene.children.length,1);assert.equal(o.verts,32);o.set(0);assert.equal(o.mesh.visible,false);o.set(.4);assert.ok(o.mesh.visible);
console.log('gfx-lighting ok');
