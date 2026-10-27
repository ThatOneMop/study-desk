import assert from 'node:assert/strict';import fs from 'node:fs';
import {SUPPLIER,DROP_WAIT,PICKUP_RANGE,dropSpots,pickDrop,seedPrice,orderTotal,dropState,supplierThread} from '../dist/seed-drops.mjs';
import {laneSurface} from '../dist/winding-lanes.mjs';
// Drops are on the back-lane footpaths, spread over all three lanes, and deterministic per day/order.
const spots=dropSpots();assert.ok(spots.length>=10);assert.ok(new Set(spots.map(p=>p.lane)).size===3);
for(const p of spots)assert.equal(laneSurface(p.x,p.z),'pavement');
assert.deepEqual(pickDrop(3,2),pickDrop(3,2));assert.notDeepEqual(pickDrop(1,1),pickDrop(1,2));
// Pricing: a little dearer than the old shop, quantity clamped 1–10.
assert.equal(seedPrice(10),12);assert.equal(orderTotal(10,3),36);assert.equal(orderTotal(10,50),120);
// State machine: waiting until the bag is down, then ready, then 'here' within pickup range.
const d={...pickDrop(1,1),ready:100};
assert.equal(dropState(null,0),'none');assert.equal(dropState(d,99,{x:d.x,z:d.z}),'waiting');assert.equal(dropState(d,101,{x:0,z:0}),'ready');
assert.equal(dropState(d,101,{x:d.x+PICKUP_RANGE*.5,z:d.z}),'here');assert.ok(DROP_WAIT>0);
// Thread reads like texting a dodgy contact; the location text only appears once the drop is ready.
assert.equal(supplierThread(null,0).length,1);assert.ok(!supplierThread(d,50,{strain:'Pine Pops',qty:3}).some(l=>l.text.includes(d.lane)));
assert.ok(supplierThread(d,150,{strain:'Pine Pops',qty:3}).some(l=>l.text.includes(d.lane)&&l.text.includes(d.note)));
const game=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
assert.match(game,/seed-drops\.mjs\?v=169/);assert.match(game,/function supplierOrder\(t,qty\)/);assert.match(game,/net\.role==='guest'/);assert.match(game,/s\.seeds\[d\.t\]=\(s\.seeds\[d\.t\]\|\|0\)\+d\.qty/);
console.log('PASS v169 seeds by text: '+SUPPLIER.name+', paid up front, dead drop on '+spots.length+' lane spots, pick up in person');
