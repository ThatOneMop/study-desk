import assert from 'node:assert/strict';
import {LOCATION_MEMORY,locationKeyForType,locationMemoryCopy,normalizeLocationVisits,readLocationVisit,recordLocationVisit} from '../dist/location-memory.mjs';

assert(Object.isFrozen(LOCATION_MEMORY));assert(Object.isFrozen(LOCATION_MEMORY.hardware));assert(Object.isFrozen(LOCATION_MEMORY.hardware.types));
assert.equal(Object.keys(LOCATION_MEMORY).length,9);assert.equal(locationKeyForType('hardware'),'hardware');assert.equal(locationKeyForType('staffboard'),'helpers');assert.equal(locationKeyForType('__proto__'),null);
const visits={};let result=recordLocationVisit(visits,'hardware',1,540);assert(result.changed);assert.deepEqual(visits.hardware,{count:1,lastDay:1,lastTime:540});
assert(!recordLocationVisit(visits,'hardware',1,549.999).changed);assert.equal(visits.hardware.count,1);
result=recordLocationVisit(visits,'hardware',1,550);assert(result.changed);assert.deepEqual(result.record,{count:2,lastDay:1,lastTime:550});
result=recordLocationVisit(visits,'hardware',2,5);assert(result.changed);assert.equal(result.record.count,3);
assert(!recordLocationVisit(visits,'missing',2,20).changed);assert(!recordLocationVisit(visits,'hardware',0,20).changed);assert(!recordLocationVisit([], 'hardware',2,20).changed);
assert.deepEqual(readLocationVisit({hardware:{count:1,lastDay:1,lastTime:NaN}},'hardware'),{count:0,lastDay:null,lastTime:null});
const hostile={hardware:{count:4,lastDay:3,lastTime:75.5},dealer:{count:-1,lastDay:1,lastTime:2},unknown:{count:2,lastDay:1,lastTime:3},__proto__:{count:2,lastDay:1,lastTime:3}};
assert.deepEqual(normalizeLocationVisits(hostile),{hardware:{count:4,lastDay:3,lastTime:75.5}});assert.deepEqual(normalizeLocationVisits(null),{});
const before=JSON.stringify(hostile);normalizeLocationVisits(hostile);assert.equal(JSON.stringify(hostile),before);
const copy=locationMemoryCopy(visits,'hardware');assert.equal(copy.greeting,LOCATION_MEMORY.hardware.returning);assert.equal(copy.detail,'Visit 3 · last here Day 2 at 00:05');assert(Object.isFrozen(copy));
assert.equal(locationMemoryCopy({},'dealer').count,0);assert.equal(locationMemoryCopy({},'dealer').detail,'No visit recorded yet');assert.equal(locationMemoryCopy({},'missing'),null);
console.log('PASS: nine fictional place memories, type mapping, ten-minute repeat gating, day rollover, hostile-save cleanup, immutable authored copy and finite visit wording.');
