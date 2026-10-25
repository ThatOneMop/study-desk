import assert from 'node:assert/strict';
import {STANDING_EYE,VEHICLE_EYE,playerViewHeights,firstPersonVisibility} from '../dist/player-view.mjs';
assert.equal(STANDING_EYE,1.72);assert.equal(VEHICLE_EYE,1.55);
for(const ground of [0,.01,.375,.75,5]){
 assert.deepEqual(playerViewHeights({ground}),{eye:ground+1.72,cameraEye:ground+1.72});
 assert.deepEqual(playerViewHeights({ground,crouch:.5}),{eye:ground+1.22,cameraEye:ground+1.22});
 assert.deepEqual(playerViewHeights({ground,crouch:.5,jump:1,bob:.023,driving:true}),{eye:ground+1.55,cameraEye:ground+1.55});
}
for(const ground of [NaN,Infinity,-Infinity,-1e8,1e8])for(const crouch of [NaN,-10,10])for(const jump of [NaN,-1,1e8])for(const bob of [NaN,-10,10]){
 const pose=playerViewHeights({ground,crouch,jump,bob});assert.ok(Object.values(pose).every(Number.isFinite));assert.ok(Math.abs(pose.cameraEye-pose.eye)<=.023000001);
}
const input={ground:.75,crouch:.2,jump:.3,bob:.01},before=JSON.stringify(input);playerViewHeights(input);assert.equal(JSON.stringify(input),before);
assert.deepEqual(firstPersonVisibility(),{hand:false,pack:false,can:false});
assert.deepEqual(firstPersonVisibility({active:true,equipped:'packs'}),{hand:true,pack:true,can:false});
assert.deepEqual(firstPersonVisibility({active:true,equipped:'can'}),{hand:true,pack:false,can:true});
for(const context of [{active:false},{panel:'pause'},{panel:'bag'},{panel:'title'},{station:true},{driving:true},{placing:true}])for(const equipped of [null,'can','packs'])assert.deepEqual(firstPersonVisibility({active:true,equipped,...context}),{hand:false,pack:false,can:false});
assert.equal(firstPersonVisibility({active:true,work:{tool:true}}).can,true);
assert.equal(firstPersonVisibility({active:true,work:{tool:false},equipped:'can'}).can,false);
assert.deepEqual(firstPersonVisibility({active:true,work:{tool:true},equipped:'packs'}),{hand:true,pack:false,can:true});
assert.equal(firstPersonVisibility({active:true,panel:'pause',work:{tool:true}}).can,false);
console.log('PASS: shared standing/crouch/jump/raised-floor/vehicle eye projection, bounded finite inputs, camera-only bob, immutable inputs and consistent hand/pack/can visibility across work, menus and vehicles. Not rendered world-scale acceptance.');
