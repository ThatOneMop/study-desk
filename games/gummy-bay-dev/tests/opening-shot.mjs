import assert from 'node:assert/strict';
import {insideRvShell,openingCamera,openingDoorstep} from '../dist/opening-shot.mjs';
assert(insideRvShell(-58,26.7),'fresh spawn sits inside the RV shell');
assert(!insideRvShell(openingDoorstep().x,openingDoorstep().z),'doorstep is outside the shell');
for(let t=0;t<=5;t+=.25){const pose=openingCamera(t);assert(pose.outside&&pose.y>3&&[pose.x,pose.y,pose.z,pose.lookX,pose.lookY,pose.lookZ].every(Number.isFinite));}
assert(openingCamera(0).y>openingCamera(4.5).y,'the shot descends toward the door');
assert(openingCamera(0).z>40&&openingCamera(4.5).x<-40,'the shot travels from the bay toward the campsite');
assert.equal(openingDoorstep().yaw,-Math.PI/2);
console.log('PASS: opening camera stays outside the RV shell and ends on the campsite doorstep.');
