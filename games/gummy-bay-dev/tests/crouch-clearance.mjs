import assert from 'node:assert/strict';
import {crouchStep,playerHeadFits} from '../dist/player-view.mjs';
for(const ground of [0,.94,5]){
 let crouch=.5;
 for(let i=0;i<180;i++){
  crouch=crouchStep(crouch,false,ground,ground+1.6,1/60);
  assert.ok(playerHeadFits({ground,crouch,ceiling:ground+1.6}),'release under roof preserves clearance');
 }
 assert.ok(Math.abs(crouch-.32)<.00001);
 for(let i=0;i<120;i++)crouch=crouchStep(crouch,false,ground,Infinity,1/60);
 assert.equal(crouch,0,'standing resumes outside roof');
}
const samples=[30,60,120].map(fps=>{let c=0;for(let i=0;i<fps/10;i++)c=crouchStep(c,true,0,Infinity,1/fps);return c;});
assert.ok(Math.max(...samples)-Math.min(...samples)<1e-12,'equal elapsed time gives equal posture');
assert.equal(crouchStep(.5,true,0,Infinity,NaN),.5);
console.log('PASS: crouch clearance on raised floors, standing recovery and frame-rate-independent transition.');
