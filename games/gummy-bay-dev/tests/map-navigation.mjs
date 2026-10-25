import assert from 'node:assert/strict';
import {projectMapMarker,projectMapPoint,mapRectVisible,travelDistrictContext,travelMapCaption,TRAVEL_DISTRICTS} from '../dist/town-experience.mjs';

const center={x:0,z:0},inside={x:10,z:5},before=JSON.stringify([center,inside,TRAVEL_DISTRICTS]);
assert.deepEqual(projectMapMarker(inside,center,1,100,80,10),{x:60,y:45,offscreen:false,angle:Math.atan2(10,-5),distance:Math.hypot(10,5)});
const right=projectMapMarker({x:200,z:0},center,1,100,80,10);
const left=projectMapMarker({x:-200,z:0},center,1,100,80,10);
const north=projectMapMarker({x:0,z:-200},center,1,100,80,10);
const south=projectMapMarker({x:0,z:200},center,1,100,80,10);
assert.deepEqual([right.x,right.y,left.x,left.y,north.x,north.y,south.x,south.y],[90,40,10,40,50,10,50,70]);
assert(right.offscreen&&left.offscreen&&north.offscreen&&south.offscreen);
assert.equal(right.angle,Math.PI/2);assert.equal(left.angle,-Math.PI/2);assert.equal(north.angle,0);assert.equal(south.angle,Math.PI);
const diagonal=projectMapMarker({x:200,z:100},center,1,100,80,10);
assert.equal(diagonal.x,90);assert.equal(diagonal.y,60);assert(diagonal.offscreen&&Number.isFinite(diagonal.angle));
assert.deepEqual(projectMapPoint(inside,center,1,100,80,10),{x:60,y:45});
assert.deepEqual(projectMapPoint({x:40,z:0},center,1,100,80,10),{x:90,y:40});
assert.equal(projectMapPoint({x:40.01,z:0},center,1,100,80,10),null);
assert(mapRectVisible({x:100,z:0,w:120,d:2},center,1,100,80,10));
assert(!mapRectVisible({x:101,z:0,w:120,d:2},center,1,100,80,10));
assert(mapRectVisible({x:0,z:-50,w:2,d:40},center,1,100,80,10));
assert(!mapRectVisible({x:0,z:-50.01,w:2,d:40},center,1,100,80,10));
assert(!mapRectVisible({x:0,z:0,w:-1,d:2},center,1,100,80,10));
for(const bad of [
 projectMapMarker({x:Infinity,z:0},center,1,100,80,10),
 projectMapMarker(inside,{x:NaN,z:0},1,100,80,10),
 projectMapMarker(inside,center,0,100,80,10),
 projectMapMarker(inside,center,1,20,20,10)
])assert.equal(bad,null);
assert.deepEqual(travelDistrictContext({x:0,z:-160},TRAVEL_DISTRICTS),{district:'Westside',neighbor:'East Market'});
assert.deepEqual(travelDistrictContext({x:20,z:-160},TRAVEL_DISTRICTS),{district:'East Market',neighbor:null});
assert.deepEqual(travelDistrictContext({x:0,z:0},[{name:'First',x:-1,z:0},{name:'Second',x:1,z:0}]),{district:'First',neighbor:'Second'});
assert.deepEqual(travelDistrictContext({x:NaN,z:0},TRAVEL_DISTRICTS),{district:'Gummy Bay',neighbor:null});
assert.equal(travelMapCaption({x:-108,z:-160},{driving:true,targetOffscreen:true}),'DRIVE · WESTSIDE · WESTSIDE SEEDS 40 m · N ↑ · EDGE TARGET');
assert.equal(travelMapCaption(null,{districts:[],landmarks:[]}),'WALK · GUMMY BAY · N ↑');
assert.equal(JSON.stringify([center,inside,TRAVEL_DISTRICTS]),before);
console.log('PASS: immutable local-map projection keeps inside targets exact, clamps four axes and diagonals, filters point/rectangle viewport edges, formats district/landmark context and reports deterministic district borders. No canvas rendering tested.');
