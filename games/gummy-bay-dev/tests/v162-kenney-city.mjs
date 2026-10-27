import assert from 'node:assert/strict';import fs from 'node:fs';
import * as THREE from '../dist/vendor/three.module.min.js';
import {KENNEY_MODELS,KENNEY_FRONT,placeLot,mergePlacements,createKenneyCity} from '../dist/kenney-city.mjs';
import {createCityExpansion,KENNEY_LOT_TYPES} from '../dist/city-expansion.mjs';
// A fake model set: unit boxes named like the kit.
const box=(w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d).translate(0,h/2,0);return {pos:g.attributes.position.array,nor:g.attributes.normal.array,uv:g.attributes.uv.array,index:Uint32Array.from(g.index.array),size:[w,h,d]};};
const models={};for(const n of new Set(Object.values(KENNEY_MODELS).flat()))models[n]=box(.9,1.3,1);
const lot={x:40,z:-60,w:10,d:12,rot:Math.PI/2,type:'shop',seed:7,floors:2};
const p=placeLot(lot,models);assert.ok(KENNEY_MODELS.shop.includes(p.model));assert.equal(p.rot,Math.PI/2+KENNEY_FRONT);
assert.ok(Math.abs(p.sx*.9-9.6)<1e-6&&Math.abs(p.sz-11.52)<1e-6,'fitted to the lot footprint with a small margin');
assert.ok(p.height>8&&p.height<20,'player-scale height (about 3 m storeys)');
const g=mergePlacements([p,placeLot({...lot,x:-40,seed:9},models)],models);
assert.equal(g.index.count,72);assert.ok(g.getAttribute('color')&&g.getAttribute('uv'));
g.computeBoundingBox();const b=g.boundingBox;assert.ok(b.max.x-b.min.x>80-12&&b.min.y>=-1e-6);
// Stays inside its lot (rotated footprint) so lot colliders still match.
const one=mergePlacements([p],models);one.computeBoundingBox();const bb=one.boundingBox;assert.ok(bb.max.x-bb.min.x<=lot.d+1e-6&&bb.max.z-bb.min.z<=lot.w+1e-6);
// Built state: merged cells, not one mesh per building.
const scene=new THREE.Scene();const lots=Array.from({length:30},(_,i)=>({x:(i%6)*30-80,z:Math.floor(i/6)*30-200,w:9,d:11,rot:0,type:KENNEY_LOT_TYPES[i%3],seed:i+1,floors:3}));
const city=createKenneyCity({scene,lots});const fakeMap=new THREE.Texture();for(const m of Object.values(models))m.material={map:fakeMap};
city.build(models);assert.ok(city.ready&&city.placements.length===30&&city.cells.length<=4,'30 buildings in at most 4 draw calls');assert.equal(city.materials.length,1);
city.update({camera:{position:new THREE.Vector3(5000,0,5000)},quality:'performance'});assert.ok(city.cells.every(c=>!c.mesh.visible),'far cells are hidden');
// City planner hands generic lots over, keeps named businesses on the painted kit.
const ce=createCityExpansion({scene:new THREE.Scene(),kenney:true});assert.ok(ce.kenneyLots.length>40);assert.ok(ce.kenneyLots.every(l=>!l.key&&KENNEY_LOT_TYPES.includes(l.type)));
assert.ok(ce.businesses.length>=5,'named businesses still built');
const plain=createCityExpansion({scene:new THREE.Scene()});assert.equal(plain.kenneyLots.length,0);
// Asset budget and licence.
let glb=0;for(const kit of ['commercial','suburban']){glb+=fs.statSync('dist/assets/kenney/city-'+kit+'.glb').size;
 assert.ok(/Creative Commons Zero, CC0/.test(fs.readFileSync('dist/assets/kenney/License-city-kit-'+kit+'.txt','utf8')));}
assert.ok(glb<2.2e6,'both kits under 2.2 MB');
const cr=fs.readFileSync('dist/CREDITS.md','utf8');assert.ok(/Kenney City Kit \(Commercial\)/.test(cr)&&/Kenney City Kit \(Suburban\)/.test(cr));
assert.ok(ce.kenneyLots.some(l=>l.type==='house'),'houses use the Suburban kit');
const src=fs.readFileSync('dist/game.js','utf8');assert.ok(src.includes("from './kenney-city.mjs?v=162'")&&src.includes('kenney:typeof createKenneyCity'));
console.log('PASS: v162 Kenney City Kit (Commercial + Suburban) buildings fitted to generic lots, merged per 160 m cell, credited CC0, '+(glb/1e6).toFixed(2)+' MB');
