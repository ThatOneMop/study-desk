import assert from 'node:assert/strict';
import {BUSINESS_STAGES,businessPortrait,progressionSummary} from '../dist/progression-portrait.mjs';

const fresh={room:false,house:0,xp:0,bank:0,tents:0,installed:[],helpers:{gardener:false,crafter:false,seller:false},sold:0,earned:0};
const rv=businessPortrait(fresh);assert.equal(rv.stage,0);assert.equal(rv.current.name,'Old RV start');assert.equal(rv.current.spaces,0);assert.match(rv.next,/Rent Room 04/);assert.equal(progressionSummary(rv),'Old RV start · 0/0 grow spaces installed · 0/3 crew · 0 sold');
const roomState={...fresh,room:true,tents:3,installed:[0,0,1,7,-1],can:true,trimmers:true,packStation:true,xp:220,bank:1199,sold:4,earned:120},room=businessPortrait(roomState);
assert.equal(room.stage,1);assert.equal(room.level,3);assert.equal(room.installed,2);assert.equal(room.ownedTents,3);assert.equal(room.equipment,3);assert.match(room.next,/\$1,200/);assert.equal(room.current.stock,64);assert.equal(room.current.storage,40);
assert.match(businessPortrait({...roomState,bank:1200}).next,/deed is ready/);
const harborState={...fresh,room:true,house:1,xp:119,bank:3499,tents:5,installed:[0,1,2,3,4],helpers:{gardener:true,crafter:false,seller:false}},harbor=businessPortrait(harborState);
assert.equal(harbor.stage,2);assert.equal(harbor.current.name,'Harbor workshop');assert.equal(harbor.installed,4);assert.equal(harbor.crew,1);assert.match(harbor.next,/level 5/);
const hillsideState={...harborState,house:2,xp:120,bank:0,installed:[0,1,2,3,4,5,6,7],helpers:{gardener:true,crafter:true,seller:false},mixer:true,vehicleOwned:true,irrigation:true},hillside=businessPortrait(hillsideState);
assert.equal(hillside.stage,3);assert.equal(hillside.current.spaces,8);assert.equal(hillside.current.stock,640);assert.equal(hillside.current.storage,400);assert.equal(hillside.crew,2);assert.match(hillside.next,/Hire 1 more helper/);
assert.match(businessPortrait({...hillsideState,helpers:{gardener:true,crafter:true,seller:true}}).next,/complete/);
const hostile=businessPortrait({room:true,house:99,xp:Infinity,bank:NaN,tents:-4,installed:[0,8,'1'],helpers:Object.create({gardener:true}),sold:-2,earned:-8});
assert.equal(hostile.stage,3);assert.equal(hostile.level,1);assert.equal(hostile.installed,1);assert.equal(hostile.crew,0);assert.equal(hostile.sold,0);assert.equal(hostile.earned,0);
assert.ok(Object.isFrozen(rv)&&Object.isFrozen(rv.stages)&&rv.stages.every(Object.isFrozen)&&BUSINESS_STAGES.every(Object.isFrozen));
assert.deepEqual(fresh,{room:false,house:0,xp:0,bank:0,tents:0,installed:[],helpers:{gardener:false,crafter:false,seller:false},sold:0,earned:0});
console.log('PASS: immutable RV/Room/Harbor/Hillside business portraits, exact capacity/crew/equipment transitions, next-expansion guidance and hostile legacy fallbacks.');
