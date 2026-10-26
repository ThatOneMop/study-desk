import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {dayWeather,rainAt,wetnessAt,forecast,weatherSky,weatherBudget,RAIN_RAMP} from '../dist/weather.mjs';
import {createRainFX,createRainAudio} from '../dist/weather-fx.mjs';
import {createStreetCrowd,crowdUmbrella} from '../dist/street-crowd.mjs';
// Deterministic schedule, some rainy days, never the first two days.
assert.deepEqual(dayWeather(9),dayWeather(9));assert(!dayWeather(1).rain&&!dayWeather(2).rain,'days 1-2 stay dry');
let wet=0;for(let d=1;d<=300;d++){const w=dayWeather(d);if(w.rain){wet++;assert(w.start>=420&&w.end>w.start&&w.end<=1410&&w.peak>=.45&&w.peak<=1,'shower window is sane');}}
assert(wet>=60&&wet<=120,'roughly a quarter to a third of days are rainy: '+wet);
const rainy=[...Array(60)].map((_,i)=>dayWeather(i+3)).find(w=>w.rain),dry=[...Array(60)].map((_,i)=>dayWeather(i+3)).find(w=>!w.rain);
assert.equal(rainAt(rainy.day,rainy.start-1),0);assert(rainAt(rainy.day,rainy.start+RAIN_RAMP+1)>=rainy.peak-.001,'rain ramps up to the peak');assert.equal(rainAt(rainy.day,rainy.end+1),0);assert.equal(rainAt(dry.day,720),0);
assert(rainAt(rainy.day,rainy.start+5)<rainAt(rainy.day,rainy.start+20),'smooth ramp');
assert(wetnessAt(rainy.day,rainy.end+10)>0&&wetnessAt(rainy.day,rainy.end+10)<wetnessAt(rainy.day,rainy.end),'roads dry gradually after rain');assert.equal(wetnessAt(rainy.day,rainy.end+200),0);
// Forecast agrees with the schedule.
const f=forecast(3,30);assert.equal(f.length,30);for(const day of f){const w=dayWeather(day.day);assert.equal(day.kind==='clear',!w.rain);if(w.rain){assert.equal(day.start,w.start);assert(rainAt(day.day,Math.round((day.start+day.end)/2))>0,'forecast window has rain');assert(/\d(am|pm)–\d/.test(day.label));}}
// Overcast sky follows the rain.
const sky=weatherSky({cloud:.1,mist:.05},rainy.day,rainy.start+60);assert(sky.cloud>.5&&sky.mist>.05&&sky.rain>0);assert.equal(weatherSky({cloud:.1,mist:0},dry.day,720).rain,0);
assert(rainAt(NaN,NaN)===0&&wetnessAt(-5,1e9)===0,'junk input is safe');
// Budgets: Low is the smallest and every layer is one draw call that respects it.
const lo=weatherBudget('low'),hi=weatherBudget('high');assert(Object.keys(lo).every(k=>lo[k]<hi[k]));assert(lo.drops<=600&&lo.splashes<=40&&lo.puddles<=12);
const scene=new THREE.Scene(),fx=createRainFX({scene,quality:'low'}),cam=new THREE.PerspectiveCamera();cam.position.set(0,2,0);
const people=Array.from({length:40},(_,id)=>({id,x:id%10,z:Math.floor(id/10),yaw:0}));
let stats;for(let i=0;i<40;i++)stats=fx.update({camera:cam,rain:1,wet:1,dt:1/30,people,umbrellaFor:crowdUmbrella});
assert(stats.drops<=lo.drops&&stats.splashes<=lo.splashes&&stats.puddles<=lo.puddles&&stats.umbrellas<=lo.umbrellas&&stats.drops>0&&stats.puddles>0&&stats.umbrellas>0,'low budget respected');
assert.equal(scene.children.length,4,'four rain layers, one object each');
fx.setQuality('high');stats=fx.update({camera:cam,rain:1,wet:1,dt:1/30,people,umbrellaFor:crowdUmbrella});assert(stats.drops>lo.drops&&stats.drops<=hi.drops);
stats=fx.update({camera:cam,rain:0,wet:0,dt:1/30,people});assert(!fx.drops.visible&&!fx.puddles.visible&&!fx.umbrellas.visible&&stats.drops===0,'dry weather draws nothing');
const m=new THREE.MeshStandardMaterial({roughness:.94,color:0xffffff});fx.addWetMaterials([m]);fx.update({camera:cam,rain:0,wet:1,dt:0});assert(m.roughness<.4&&m.color.r<1,'wet roads lose roughness and darken');fx.update({camera:cam,rain:0,wet:0,dt:0});assert(Math.abs(m.roughness-.94)<1e-9&&m.color.r===1,'and dry back');
assert.equal(createRainAudio(null).live,false);
// Crowd: umbrella carriers keep strolling; the rest hurry for cover.
const crowdScene=new THREE.Scene(),crowd=createStreetCrowd({THREE,scene:crowdScene,capacity:16,time:600});crowd.sync(600);
const step=(rain)=>{const before=crowd.people.map(p=>[p.x,p.z]);crowd.update({dt:.05,now:1,time:420,rain});return crowd.people.map((p,i)=>Math.hypot(p.x-before[i][0],p.z-before[i][1]));};
crowd.sync(400);const dryMoves=step(0);crowd.sync(400);const wetMoves=step(1);
const runners=crowd.people.filter(p=>!crowdUmbrella(p)&&dryMoves[p.id]>1e-4),walkers=crowd.people.filter(p=>crowdUmbrella(p)&&dryMoves[p.id]>1e-4);
assert(runners.length&&runners.every(p=>wetMoves[p.id]>dryMoves[p.id]*1.5),'people without umbrellas run in the rain');assert(walkers.every(p=>Math.abs(wetMoves[p.id]-dryMoves[p.id])<1e-9),'umbrella carriers keep their pace');
console.log('PASS: seeded rain schedule (dry days 1-2, ~30% rain days, ramps, drying), forecast agrees, overcast sky, low/high budgets with one draw call per layer, wet sheen, umbrellas and running pedestrians. CPU only.');
