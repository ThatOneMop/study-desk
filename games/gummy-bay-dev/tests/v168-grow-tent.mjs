import assert from 'node:assert/strict';import fs from 'node:fs';
import {TENT,tentParts,soilWetness,addBox,addCyl} from '../dist/grow-tent.mjs';
// A real grow tent: black canvas shell + silver lining + LED strip, merged into three vertex-coloured buckets.
const p=tentParts();for(const k of ['matte','mylar','led']){assert.ok(p[k].pos.length>0,k);assert.equal(p[k].pos.length,p[k].col.length);assert.equal(p[k].idx.length%3,0);assert.ok(Math.max(...p[k].idx)<p[k].pos.length/3);}
assert.ok(p.matte.pos.length/3<4000,'cheap enough for eight tents');
// Fits the old 2.4 m footprint and keeps the plant on top of the soil.
for(let i=0;i<p.matte.pos.length;i+=3){assert.ok(Math.abs(p.matte.pos[i])<1.3&&Math.abs(p.matte.pos[i+2])<1.35,'inside the tent footprint');}
assert.ok(TENT.potH+.05<.75&&TENT.potH>.55,'soil sits just under the plant at y .7');
// Soil wetness: wet right after watering, drying with growth, dry when thirsty or dry.
const n=Date.now();assert.ok(soilWetness({phase:'growing',start:n,end:n+1000},n)>.9);assert.ok(soilWetness({phase:'growing',start:n-1000,end:n},n)<.5);
assert.ok(soilWetness({phase:'thirsty'})<soilWetness({phase:'growing',start:n,end:n+1000},n));assert.ok(soilWetness({phase:'dry'})<.1);assert.equal(soilWetness(null),0);
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/grow-tent\.mjs\?v=168/);assert.match(game,/GROW_TENT_V168\?buildGrowTent\(THREE\):tent\.clone\(true\)/);assert.match(game,/oldtent=1/);
console.log('PASS v168 grow tent: canvas/mylar/LED tent, fabric pot, soil wetness follows watering');
