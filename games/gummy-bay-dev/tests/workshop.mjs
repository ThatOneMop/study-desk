import assert from 'node:assert/strict';
import {stockSlots,taskFraction,restoreComfort} from '../dist/workshop-state.mjs';
const stock=[2,0,3];assert.deepEqual(stockSlots(stock),[0,0,2,2,2]);assert.deepEqual(stock,[2,0,3]);
assert.equal(stockSlots([8000000]).length,12);assert.deepEqual(stockSlots([-2,0,1]),[2]);
assert.equal(taskFraction({step:1,progress:.5},[['first','tap',1],['second','hold',1]]),.75);
assert.deepEqual(restoreComfort('bad'),{bob:true,sprintFov:true,stationFocus:false});assert.equal(restoreComfort('{"bob":false}').bob,false);
console.log('PASS: inventory projections, allocation bound, task progress, comfort fallback');

assert.equal(restoreComfort('{"stationFocus":true}').stationFocus,true);
