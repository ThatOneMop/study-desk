import assert from 'node:assert/strict';
import {occupiedWindowLighting as project} from '../dist/window-lighting.mjs';
import {worldLighting} from '../dist/world-lighting.mjs';
const state=Object.freeze({room:true,house:0,cash:400}),options={night:1};
assert.deepEqual(project(0,state,options),{occupied:true,windowEmission:.18,fittingEmission:.45});
assert.deepEqual(project(null,{room:false},options),{occupied:true,windowEmission:.22,fittingEmission:.45});
assert.equal(project(0,state,{night:1,side:-1}).windowEmission,.18*.8);
for(const home of [undefined,-1,3,NaN,'0',{},1,2])assert.deepEqual(project(home,state,options),{occupied:false,windowEmission:0,fittingEmission:0});
for(const home of [0,1,2])for(const activeHouse of [0,1,2])assert.equal(project(home,{room:true,house:activeHouse},options).occupied,home===activeHouse);
for(const bad of [undefined,null,{}, {room:false,house:0},{room:1,house:0},{room:true,house:'0'}])assert.equal(project(0,bad,options).occupied,false);
for(const home of [null,0])assert.deepEqual(project(home,state,{...options,active:false}),{occupied:false,windowEmission:0,fittingEmission:0});
assert.deepEqual(project(0,state,{...options,available:false}),{occupied:false,windowEmission:0,fittingEmission:0});
assert.equal(project(null,state,{...options,available:false}).occupied,true); // permanent public shop, not invented shared-player occupation
for(const night of [0,-1,NaN,Infinity,undefined])assert.equal(project(0,state,{night}).windowEmission,0);
assert.equal(project(null,state,{night:10}).windowEmission,.22);
let previous;
for(let time=-1440;time<=2880;time+=.5){
 const light=project(0,state,{night:worldLighting(time).night});
 assert.ok(light.windowEmission>=0&&light.windowEmission<=.18&&light.fittingEmission===.45);
 if(previous!==undefined)assert.ok(Math.abs(light.windowEmission-previous)<.003,'dawn/dusk does not switch glass abruptly');
 previous=light.windowEmission;
}
assert.equal(project(0,state,{night:worldLighting(720).night}).windowEmission,0);
assert.equal(project(0,state,{night:worldLighting(0).night}).windowEmission,.18);
assert.deepEqual(state,{room:true,house:0,cash:400});
console.log('PASS: all-home/public-shop occupancy, active/current-state gates, safe invalid inputs, bounded asymmetric emission, coherent dawn/dusk over 8641 samples and immutable state. No rendered glass/interior acceptance.');
