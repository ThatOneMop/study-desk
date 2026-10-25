import assert from 'node:assert/strict';
import {PARKING_BAYS,parkingGuide,parkingSnapPose,parkingGuideLine} from '../dist/parking-guide.mjs';

assert.equal(PARKING_BAYS.length,5);
assert(Object.isFrozen(PARKING_BAYS)&&PARKING_BAYS.every(Object.isFrozen));
for(const bay of PARKING_BAYS){
 const frontDistance=Math.hypot(bay.x-bay.frontX,bay.z-bay.frontZ);
 assert(frontDistance>=8&&frontDistance<=11,'bay leaves a useful storefront setback');
 const ready=parkingGuide({x:bay.x+.5,z:bay.z,angle:bay.angle},.5);
 assert.equal(ready.key,'ready');assert.equal(ready.label,bay.label);assert(ready.ready);
 const snap=parkingSnapPose({x:bay.x+.5,z:bay.z,angle:bay.angle},.5);
 assert.deepEqual(snap,{x:bay.x,z:bay.z,angle:bay.angle,label:bay.label,index:PARKING_BAYS.indexOf(bay)});
 assert(Object.isFrozen(snap));
}
assert.equal(parkingGuide({x:-70,z:-158,angle:0},0).key,'align');
assert.equal(parkingGuide({x:-70,z:-158,angle:Math.PI/2},1.01).key,'stop');
assert.equal(parkingGuide({x:-70,z:-150,angle:Math.PI/2},0).key,'approach');
assert.equal(parkingGuide({x:250,z:80,angle:0},0),null);
assert.equal(parkingSnapPose({x:-70,z:-158,angle:Math.PI*1.5},0).angle,Math.PI*1.5,'opposite bay direction is preserved');
assert.equal(parkingSnapPose({x:-70,z:-158,angle:0},0),null,'misaligned pose never snaps');
assert.equal(parkingSnapPose({x:-70,z:-158,angle:Math.PI/2},2),null,'moving pose never snaps');
for(const bad of [null,{x:NaN,z:0,angle:0},{x:0,z:0,angle:Infinity}])assert.equal(parkingGuide(bad,0),null);
assert.equal(parkingGuide({x:0,z:0,angle:0},NaN),null);
assert.equal(parkingGuide({x:-70,z:-158,angle:Math.PI/2},0,[{...PARKING_BAYS[1],label:''}]),null);
assert.equal(parkingGuideLine(null),'PARKING · No marked storefront bay nearby');
assert.equal(parkingGuideLine(parkingGuide({x:-70,z:-158,angle:Math.PI/2},0)),'PARKING · Westside seeds · BAY READY · F align / exit');
const pose={x:-70,z:-158,angle:Math.PI/2},before=JSON.stringify(pose);parkingGuide(pose,0);parkingSnapPose(pose,0);assert.equal(JSON.stringify(pose),before,'input stays immutable');
console.log('PASS: five immutable storefront bays, setbacks, nearest guidance, parallel/opposite alignment, stopped-only snapping, hostile fallbacks and immutable inputs. No rendered parking acceptance.');
