import assert from 'node:assert/strict';import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {SUNNY,sunnyStrength,applySunnyGrade} from '../dist/sunny-grade.mjs';
import {gritTexture} from '../dist/gritty-streets.mjs';
// Strength: full on a clear noon, none at night, reduced by cloud and rain
assert.equal(sunnyStrength({daylight:1}),1);assert.equal(sunnyStrength({daylight:.2}),0);
assert.ok(sunnyStrength({daylight:1,cloud:1})<.6&&sunnyStrength({daylight:1,cloud:1})>.4);
assert.ok(sunnyStrength({daylight:1,rain:1})<.2,'rainy days stay grey');
// Apply: bluer zenith, brighter warmer sun, stronger fill, clearer air
const sun=new THREE.DirectionalLight(0xffe2bb,2),hemi=new THREE.HemisphereLight(0xc6d5e2,0x71664d,1);
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xc7dae2,100,280);scene.background=new THREE.Color(0xc7dae2);
const sky={top:{value:new THREE.Color(0xc4d8ea)},bottom:{value:new THREE.Color(0xc7dae2)}};const renderer={toneMappingExposure:.92};
assert.equal(applySunnyGrade({THREE,k:0,sun,hemi,scene,skyUniforms:sky,renderer}),0);assert.equal(sun.intensity,2);
applySunnyGrade({THREE,k:1,sun,hemi,scene,skyUniforms:sky,renderer});
const hsl={};sky.top.value.getHSL(hsl);assert.ok(hsl.s>.5&&hsl.h>.55&&hsl.h<.65,'saturated blue zenith');
assert.ok(sun.intensity>2.6&&hemi.intensity>1.3&&renderer.toneMappingExposure>.95);
assert.ok(scene.fog.far>400&&scene.background.equals(scene.fog.color));
// Ground: lighter asphalt and green verges
const avg=k=>{const d=gritTexture(k).image.data;let r=0,g=0,b=0;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];}const n=d.length/4;return [r/n,g/n,b/n];};
const a=avg('asphalt'),e=avg('earth');assert.ok(a[0]>70,'asphalt is mid grey, not near-black');assert.ok(e[1]>e[0]+12&&e[1]>e[2]+30,'verges read green');
// First-person hand only shows while holding something
const src=fs.readFileSync('dist/game.js','utf8');assert.ok(/const held=!!equippedTool\|\|panel==='customer'/.test(src));
console.log('PASS: v161 sunny grade (blue zenith, warm sun, hemisphere fill, clearer air), lighter roads, green verges, empty hand hidden');
