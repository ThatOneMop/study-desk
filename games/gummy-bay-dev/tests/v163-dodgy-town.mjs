import assert from 'node:assert/strict';import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {placeSite,SITE_MODELS,STOREY,glassMask,KENNEY_TINTS,mergePlacements,createKenneyCity,nightWindowShader} from '../dist/kenney-city.mjs';
import {planDressing,createDodgyDressing,TAGS} from '../dist/dodgy-dressing.mjs';
import {planCity,FRONT_OFFSET} from '../dist/city-expansion.mjs';
const box=(w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d).translate(0,h/2,0);return {pos:g.attributes.position.array,nor:g.attributes.normal.array,uv:g.attributes.uv.array,index:Uint32Array.from(g.index.array),size:[w,h,d]};};
const models={};for(const n of Object.values(SITE_MODELS).flat())models[n]=box(1,1.29,1);
// Blender town blocks: walk-in shops keep their ground floor and get Kenney upper storeys; others are replaced.
const up=placeSite({id:'Building_03',x:-24,z:-23,w:20.6,d:17.6,h:10.5,base:3.83,mode:'upper',front:1},models);
assert.ok(up.length>=1&&up.every(p=>p.cut===STOREY&&p.y===3.83),'upper storeys start on the shop roof');
const g=mergePlacements(up,models);g.computeBoundingBox();assert.ok(g.boundingBox.min.y>=3.83-1e-6&&g.boundingBox.max.y>3.83+2&&g.boundingBox.max.y<10.5+4,'stack tops out near the old block height (v164: columns vary in height)');
assert.ok(g.boundingBox.max.x-g.boundingBox.min.x<=20.6+1e-6&&g.boundingBox.max.z-g.boundingBox.min.z<=17.6+1e-6,'inside the old footprint');
const full=placeSite({id:'Building_13',x:-30,z:-124.5,w:18.4,d:20.2,h:10.2,mode:'full',front:-1},models);assert.ok(full.every(p=>!p.cut&&p.y===0));
// Lit windows: the kit's blue glass swatches are the emissive mask; walls are not.
const px=(r,g,b)=>new Uint8ClampedArray([r,g,b,255]);
assert.equal(glassMask(px(208,232,255))[0],255);assert.equal(glassMask(px(100,150,220))[0],255);assert.equal(glassMask(px(150,190,240))[0],255);
for(const wall of [[95,101,124],[240,240,240],[190,200,240],[160,120,230],[200,100,80]])assert.equal(glassMask(px(...wall))[0],0,'wall swatch '+wall+' stays dark');
// Grime shader: window hash and dirt both injected.
const sh={vertexShader:'#include <common>\n#include <project_vertex>',fragmentShader:'#include <common>\n#include <color_fragment>\n#include <emissivemap_fragment>'};nightWindowShader(sh);
assert.ok(sh.fragmentShader.includes('kGrime(diffuseColor.rgb,vKWorld)')&&sh.fragmentShader.includes('totalEmissiveRadiance*=step'));
// Tints are tired and grubby, not toy-white.
assert.ok(KENNEY_TINTS.every(t=>{const c=new THREE.Color(t);return Math.max(c.r,c.g,c.b)<.95;}),'no pure white walls');
// Compact streets: fronts about a metre off the pavement, tight alleys, denser lots.
assert.ok(FRONT_OFFSET<=11&&FRONT_OFFSET>10.1);
const plan=planCity({});assert.ok(plan.lots.length>800,'denser city: '+plan.lots.length);
assert.ok(plan.alleys.length>60&&plan.alleys.every(a=>a.width>=2.6&&a.width<=3.4),'cramped but walkable alleys');
// Dodgy dressing: shutters, AC units, stains, tags, fire escapes, bins, lamps and rooftop signs in two draw calls.
const fronts=Array.from({length:40},(_,i)=>({x:(i%8)*14,z:Math.floor(i/8)*30,rot:Math.PI,w:12,d:10,height:9+(i%3)*3,base:0,storey:3.2}));
const alleys=Array.from({length:12},(_,i)=>({x:i*20,z:-60,along:i%2?'x':'z',width:3,len:14}));
const roofSigns=[{text:'HANK’S HARDWARE',x:0,y:12,z:5,w:8,yaw:0},{text:'CORNER STORE',x:20,y:12,z:5,w:8,yaw:0}];
const p=planDressing({fronts,alleys,roofSigns});
for(const k of ['ac','pipes','shutters','escapes','tags','stains','bins','puddles','lamps'])assert.ok(p.counts[k]>0,'has '+k);assert.equal(p.counts.signs,2);
assert.ok(TAGS.every(t=>/^[A-Z0-9 ?!]+$/.test(t)&&!/(KILL|DIE|DRUG|WEED|F\*)/.test(t)),'family-friendly tags');
const scene=new THREE.Scene(),d=createDodgyDressing({scene,fronts,alleys,roofSigns});
assert.equal(Object.keys(d.meshes).length,2,'props + decals only');assert.ok(d.triangles<60000);
d.update({night:1});assert.ok(d.materials.decalMat.emissiveIntensity>1.5);d.update({night:0});assert.ok(d.materials.decalMat.emissiveIntensity<.2);
assert.ok(d.colliders.every(c=>c.w<=1.2&&c.d<=1.2),'alley props stay small');
// Kenney exposes facades for the dressing.
const city=createKenneyCity({scene:new THREE.Scene(),lots:[{x:0,z:-200,w:9,d:11,rot:0,type:'shop',seed:3,floors:3}]});const fakeMap=new THREE.Texture();
const all={...models};for(const n of ['building-c','building-e','building-k'])all[n]=box(1,1.29,1);for(const m of Object.values(all))m.material={map:fakeMap};
let changed=0;city.onChange=()=>changed++;city.build(all);city.addSites([{id:'B',x:50,z:-124.5,w:18,d:20,h:10,mode:'full',front:1}]);
assert.ok(changed>=2&&city.facades().length>=2&&city.facades().some(f=>f.site==='B'));
// game.js wiring: Blender blocks hidden and swapped, signs, dressing, cache-busted imports.
const src=fs.readFileSync('dist/game.js','utf8');
for(const s of ['function installKenneyTown(','installKenneyTown(town)','HANK’S HARDWARE','CORNER STORE','function installDodgyDressing(','dodgyDressing?.update?.({night})',"dodgy-dressing.mjs?v=16","city-expansion.mjs?v=16"])assert.ok(src.includes(s),'game.js has '+s);
assert.ok(/game\.js\?v=(16[3-9]|1[7-9]\d)/.test(fs.readFileSync('dist/index.html','utf8')));
console.log('PASS: v163 Kenney town blocks (shop upper storeys + full swaps), lit glass, grime shader, compact streets ('+plan.lots.length+' lots, '+plan.alleys.length+' alleys), dodgy dressing in 2 draw calls');
