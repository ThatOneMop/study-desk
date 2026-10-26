import assert from 'node:assert/strict';
import {WALK_SPEED,SPRINT_SPEED,CROUCH_SPEED,JUMP_LAUNCH,JUMP_HEIGHT,GRAVITY_RISE,GRAVITY_FALL,wishAxes,groundSpeed,moveResponse,capAirWish,cutJump,cliffDrop,slopePush,staminaStep,coyoteLeft,canJumpNow,landingDip,decayDip,headBob,slideMotion,groundSupport,LOOK_SENSITIVITY,FOV_BASE,FOV_SPRINT} from '../dist/player-controller.mjs';
import {jumpStep,dampedTravel} from '../dist/player-view.mjs';
import {createFixedStepper} from '../dist/sim-clock.mjs';

assert.equal(WALK_SPEED,3.6);assert.equal(SPRINT_SPEED,6.2);assert.equal(CROUCH_SPEED,1.8);
assert.equal(groundSpeed({}),WALK_SPEED);assert.equal(groundSpeed({sprinting:true}),SPRINT_SPEED);assert.equal(groundSpeed({crouching:true,sprinting:true}),CROUCH_SPEED);
assert.deepEqual(wishAxes(1,1),{dx:.95,dz:.8});assert.deepEqual(wishAxes(0,-1),{dx:0,dz:-1});
assert.equal(moveResponse(true,false),14);assert.equal(moveResponse(false,false),18);assert.equal(moveResponse(true,true),3);
assert.ok(Math.abs(JUMP_LAUNCH-Math.sqrt(2*GRAVITY_RISE*JUMP_HEIGHT))<1e-12);
assert.ok(Math.abs(JUMP_LAUNCH-5.656854249)<1e-6,'one metre jump under rising gravity');
assert.equal(cutJump(4,true),2.2);assert.equal(cutJump(-2,true),-2);assert.equal(cutJump(4,false),4);
assert.equal(cliffDrop(1,.7,0),0);assert.equal(cliffDrop(1,.5,0),.5);assert.equal(cliffDrop(2,1,0),1);assert.equal(cliffDrop(2,0,1),0);
assert.deepEqual(slopePush(0,1,1,0),{x:0,z:0});
assert.deepEqual(slopePush(0,.2,.6,0),{x:0,z:0});
const steep=slopePush(0,1,.6,0);assert.ok(steep.x<0&&steep.z===0);
assert.equal(capAirWish(8,0,3).tx,3);assert.equal(capAirWish(1,0,3).tx,1);
let stamina=100,wait=0;for(let i=0;i<600;i++){const step=staminaStep(stamina,true,wait,1/60);stamina=step.stamina;wait=step.wait;}
assert.ok(Math.abs(stamina)<1e-6,'sprint drains a full bar in 10 s');
stamina=0;wait=1;for(let i=0;i<59;i++){const step=staminaStep(stamina,false,wait,1/60);stamina=step.stamina;wait=step.wait;}
assert.equal(stamina,0);assert.ok(wait>0,'regen waits about a second after sprinting');
stamina=0;wait=0;for(let i=0;i<360;i++){const step=staminaStep(stamina,false,wait,1/60);stamina=step.stamina;wait=step.wait;}
assert.ok(Math.abs(stamina-90)<1e-6,'regen is 15 per second after the delay');
const jumped=staminaStep(40,false,0,0,{jumping:true});assert.equal(jumped.stamina,35);
assert.equal(coyoteLeft(.1,false,.1),0);assert.equal(coyoteLeft(0,true,.5),.1);
assert.equal(canJumpNow(0,-1,.1),true);assert.equal(canJumpNow(.005,-1,.1),false);assert.equal(canJumpNow(.5,-1,.1),true);assert.equal(canJumpNow(.5,-1,0),false);
assert.equal(landingDip(-8),-.06);assert.equal(landingDip(2),0);
assert.ok(Math.abs(decayDip(-.06,.06)+.06*Math.exp(-.6))<1e-12,'one frame keeps a visible landing dip');
let settled=-.06;for(let i=0;i<90;i++)settled=decayDip(settled,1/60);assert.equal(settled,0,'a finished landing dip returns the camera exactly to the eye');
const bob=headBob(Math.PI/2,WALK_SPEED,{moving:true});assert.ok(Math.abs(bob.y-.035*.7)<1e-9);assert.equal(headBob(1,WALK_SPEED,{moving:true,airborne:true}).y,0);
const support=groundSupport(0,0,(x,z)=>x>0?.3:0,.32);assert.equal(support,.3);
const flat=groundSupport(0,0,()=>1,.32);assert.equal(flat,1);
const wall=slideMotion({x:0,z:0},1,0,x=>x>.4);assert.ok(wall.x<=.4+.02&&wall.hitX);
const corner=slideMotion({x:0,z:0},1,1,(x,z)=>x>.5&&z>.5);assert.ok(corner.x>.2||corner.z>.2);assert.ok(!(corner.x>.5&&corner.z>.5));

const clock=createFixedStepper({maxFrame:1});
let velocity=0,height=0,held=true,space=false,peak=0;
const frames=clock.consume(1);
for(const dt of frames){
 const pressed=held&&!space;space=held;if(frames.indexOf(dt)>0)held=false;
 const response=moveResponse(true,height>0);
 const step=dampedTravel(velocity,WALK_SPEED,dt,response);velocity=step.velocity;
 if(pressed&&height===0)velocity=velocity;
 if(height===0&&pressed){const launched=JUMP_LAUNCH;height=0;const next=jumpStep(height,cutJump(launched,false),dt,GRAVITY_RISE);height=next.height;}
 peak=Math.max(peak,height);
}
assert.equal(frames.length,60,'one slow frame still takes sixty collision slices');
let h=0,v=JUMP_LAUNCH,peakJump=0;
const first=jumpStep(h,v,.06,GRAVITY_RISE);h=first.height;v=cutJump(first.velocity,true);
for(let i=0;i<90&&h>0;i++){const g=v>0?GRAVITY_RISE:GRAVITY_FALL;const step=jumpStep(h,v,1/60,g);h=step.height;v=step.velocity;peakJump=Math.max(peakJump,first.height,h);}
assert.ok(peakJump>.5&&peakJump<1,'releasing jump after one 60 ms frame stays under the one-metre apex');
assert.equal(LOOK_SENSITIVITY,.0022);assert.equal(FOV_BASE,75);assert.equal(FOV_SPRINT,80);
console.log('PASS: walk 3.6 / sprint 6.2 / crouch 1.8, 1 m jump, coyote, stamina, step, slope slide, bob and 60 Hz catch-up.');
