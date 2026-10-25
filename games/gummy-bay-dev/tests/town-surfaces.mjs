import assert from 'node:assert/strict';
import {TOWN_PROP_SURFACES,townPropFloorHeight} from '../dist/town-surfaces.mjs';
import {PROP_HALF_WIDTH,PROP_HALF_DEPTH} from '../dist/prop-motion.mjs';

assert.ok(Object.isFrozen(TOWN_PROP_SURFACES)&&TOWN_PROP_SURFACES.length===31);
assert.ok(TOWN_PROP_SURFACES.every(Object.isFrozen));
assert.equal(townPropFloorHeight(20,9),.105,'old-town pavement supports the full crate footprint');
assert.equal(townPropFloorHeight(-261.9,-160),.085,'expanded vertical pavement is finite support');
assert.equal(townPropFloorHeight(-200,-151.9),.085,'expanded horizontal pavement is finite support');
assert.equal(townPropFloorHeight(0,85),.09,'pier deck supports crates');
for(const p of [[20,0],[-270,-160],[0,70],[0,0]])assert.equal(townPropFloorHeight(...p),0);
const oldNorth=TOWN_PROP_SURFACES.find(r=>r.id==='old-north');
assert.equal(townPropFloorHeight(20,oldNorth.z+oldNorth.d/2+PROP_HALF_DEPTH),oldNorth.top);
assert.equal(townPropFloorHeight(20,oldNorth.z+oldNorth.d/2+PROP_HALF_DEPTH+.0001),0);
const pier=TOWN_PROP_SURFACES.find(r=>r.id==='pier');
assert.equal(townPropFloorHeight(pier.x,pier.z+pier.d/2+PROP_HALF_DEPTH),pier.top);
assert.equal(townPropFloorHeight(pier.x,pier.z+pier.d/2+PROP_HALF_DEPTH+.0001),0);
for(const bad of [[NaN,9],[20,Infinity],[-Infinity,0]])assert.equal(townPropFloorHeight(...bad),0);
console.log('PASS: 31 finite original-town pavement, expanded-district pavement and pier-deck crate supports with measured x/z footprint padding, exact boundaries and invalid-input fallback. Player support is not changed.');
