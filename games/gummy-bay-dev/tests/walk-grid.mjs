import assert from 'node:assert/strict';
import {createWalkGrid} from '../dist/walk-grid.mjs';
// A wall from x=-10..10 at z=0 with one gap at x=8..10 forces a detour.
const wall=(x,z)=>Math.abs(z)<.5&&x>-10&&x<8;
const grid=createWalkGrid({blocked:wall,minX:-20,maxX:20,minZ:-20,maxZ:20,res:.5});
assert.deepEqual(grid.route(-15,-5,-15,5),[[-15,5]],'clear line is one leg');
const path=grid.route(0,-5,0,5);
assert.ok(path&&path.length>=2,'detour found');
for(let i=0,ax=0,az=-5;i<path.length;i++){assert.ok(grid.lineClear(ax,az,path[i][0],path[i][1]),'each leg is walkable');[ax,az]=path[i];}
const walk=grid.length(0,-5,path);
assert.ok(walk>10&&walk<26,'detour length sane '+walk.toFixed(1));
const boxed=(x,z)=>Math.abs(x-5)<3&&Math.abs(z-5)<3&&!(Math.abs(x-5)<2&&Math.abs(z-5)<2);
assert.equal(createWalkGrid({blocked:boxed,minX:-10,maxX:15,minZ:-10,maxZ:15}).route(-5,-5,5,5,{reach:.5}),null,'sealed room has no route');
console.log('PASS: walk grid finds string-pulled detours through gaps, never cuts walls, and reports sealed goals', walk.toFixed(1)+'m');
