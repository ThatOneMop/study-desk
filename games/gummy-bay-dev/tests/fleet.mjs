import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.min.js';
import {FLEET,activeFleet,fleetOwned,fleetRequest,createFleetModels} from '../dist/fleet.mjs';
const legacy={vehicleOwned:true,xp:120,cash:5000,bank:4000,payment:'cash'};
assert.equal(activeFleet(legacy).id,'van');assert(fleetOwned(legacy,'van'));assert(!fleetOwned(legacy,'compact'));
assert(!fleetRequest({...legacy,vehicleOwned:false},'compact').ok);assert(!fleetRequest({...legacy,xp:0},'compact').ok);assert(!fleetRequest({...legacy,cash:1599},'compact').ok);
assert(fleetRequest({...legacy,cash:0,payment:'card'},'compact').ok);assert(!fleetRequest({...legacy,payment:'card',bank:0},'compact').ok);
assert(!fleetRequest(legacy,'__proto__').ok);assert(!fleetRequest(legacy,'compact',true).ok);
const selected={...legacy,fleetUnlocks:['compact'],fleetSelected:'compact'};assert.equal(activeFleet(selected).id,'compact');assert(!fleetRequest(selected,'compact').ok);assert(fleetRequest(selected,'compact',true).ok);
assert.equal(activeFleet({...selected,fleetSelected:'estate'}).id,'van');assert.equal(activeFleet({...selected,vehicleOwned:false}).id,'van');
const model=createFleetModels(),resources=[];model.group.traverse(o=>{if(o.isMesh)resources.push(o.geometry)});
for(const id of ['compact','estate']){model.select(id);assert(model.models.get(id).visible);const bounds=new THREE.Box3().setFromObject(model.models.get(id));assert(bounds.max.x<=.9&&bounds.min.x>=-.9&&bounds.max.z<=1.61&&bounds.min.z>=-1.61,'new body fits conservative van envelope');}
model.select('van');assert(!model.group.visible);for(let i=0;i<1000;i++)model.select(FLEET[i%3].id);const after=[];model.group.traverse(o=>{if(o.isMesh)after.push(o.geometry)});assert.deepEqual(after,resources);
assert(FLEET.every(p=>p.acceleration>0&&p.top<=16&&p.reverse<=5));console.log('PASS: legacy fleet fallback, ownership, level, payment and replay eligibility, bounded distinct models and stable shared resources. CPU only.');
