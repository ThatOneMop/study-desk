import assert from 'node:assert/strict';
import {worldLighting,sunOffset,clockDaylight,selectPracticalLights} from '../dist/world-lighting.mjs';
for(let t=-1440;t<=2880;t+=.5){
 const a=worldLighting(t),b=worldLighting(t+1440);assert(Math.abs(a.daylight-b.daylight)<1e-10);
 for(const v of Object.values(a))assert(Number.isFinite(v));
 assert(a.daylight>=0&&a.daylight<=1&&a.night>=0&&a.night<=1&&a.sunIntensity>=.18&&a.hemisphereIntensity>=.48&&a.streetIntensity>=0&&a.streetIntensity<=8);
 const next=worldLighting(t+.001);assert(Math.abs(next.night-a.night)<.0001,'smooth street-lamp transition');assert(Math.abs(next.skyMix-a.skyMix)<.0001,'smooth sky transition');
}
assert.equal(worldLighting(720).daylight,1);assert.equal(worldLighting(0).daylight,0);assert.equal(worldLighting(720).streetIntensity,0);assert.equal(worldLighting(0).streetIntensity,8);
for(const t of [0,360,720,1080,NaN,Infinity,undefined]){assert.deepEqual(worldLighting(t,false),{...worldLighting(0,false),minutes:Number.isFinite(t)?((t%1440)+1440)%1440:540});assert(Number.isFinite(worldLighting(t).exposure));}
const anchors=[{id:'shop',x:20,y:2.8,z:0},{id:'work',x:0,y:2.8,z:0,home:1},{id:'stock',x:3,y:2.8,z:0,home:1},{id:'other',x:0,y:2.8,z:1,home:2}],camera={x:0,z:0},before=JSON.stringify([anchors,camera]);
assert.equal(selectPracticalLights(camera,anchors,{house:1,room:false}).length,0);
for(const quality of ['balanced','high']){const lights=selectPracticalLights(camera,anchors,{house:1,room:true,quality});assert.equal(lights.length,2);assert(lights.every(l=>l.home===1));assert(Math.abs(lights.reduce((n,l)=>n+l.intensity,0)-18)<1e-9);}
assert.equal(selectPracticalLights(camera,anchors,{house:1,room:true,quality:'performance'}).length,0);
assert.equal(selectPracticalLights(camera,anchors,{house:1,room:true,active:false}).length,0);
assert.equal(selectPracticalLights({x:1e9,z:0},anchors,{room:true,house:1}).length,0);
assert.equal(selectPracticalLights({x:NaN,z:0},anchors,{room:true}).length,0);
assert.equal(selectPracticalLights(camera,[{x:0,y:NaN,z:0}],{}).length,0);
assert.equal(selectPracticalLights(camera,Array.from({length:10000},()=>({x:0,y:2,z:0}))).length,2);
assert.equal(JSON.stringify([anchors,camera]),before);
const noon=worldLighting(13*60),midnight=worldLighting(0),dawn=worldLighting(6.5*60);
assert.equal(noon.sunColor,0xfff1dc);assert.equal(noon.fogColor,0xc7dae2);assert.equal(noon.elevation,60);assert.equal(noon.bloom,.3);assert.equal(noon.exposure,.92);
assert.equal(midnight.sunColor,0x7b8fc4);assert.equal(midnight.fogColor,0x1b2433);assert.equal(midnight.hemiSky,0x22304d);assert.equal(midnight.bloom,.6);
assert.equal(dawn.sunColor,0xffb27a);assert.equal(dawn.elevation,6);
const golden=worldLighting(18*60+45);
assert(golden.daylight>0.2&&golden.daylight<0.5,'golden hour keeps a low sun');
assert(clockDaylight(12*60)===1&&clockDaylight(0)===0&&clockDaylight(20*60)===0);
assert((golden.sunColor>>16)>(golden.sunColor&255),'golden sun stays warm');
assert((noon.sunColor>>16)>(noon.sunColor&255),'noon sun is warm');assert((midnight.sunColor&255)>(midnight.sunColor>>16),'night sun is blue');
assert.equal(worldLighting(6*60).azimuth,0);assert(Math.abs(worldLighting(19*60+30).azimuth-Math.PI)<1e-9);
assert(sunOffset(midnight).y>0,'shadow light stays above the horizon');
const inactive=worldLighting(900,false);assert.equal(inactive.exposure,.83);assert.equal(inactive.fogColor,0x26352f);assert.equal(inactive.sunColor,worldLighting(0,false).sunColor);
console.log('PASS: periodic finite clock/sky/water/light projection, smooth dawn/dusk, title fallback, owned-workshop selection, strict two-light/18-intensity budget, quality/range/invalid limits and immutable input. Not rendered lighting acceptance.');
