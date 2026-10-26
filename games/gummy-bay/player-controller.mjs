// Kinematic body for the authored town. Eye height stays 1.72 because the
// RV, tents and saves are built to that camera. Speeds, gravity and the
// step/slope rules follow the movement recipe.
import {sweepWalk} from './town-experience.mjs?v=122';

export const WALK_SPEED=3.6,SPRINT_SPEED=6.2,CROUCH_SPEED=1.8;
export const BACK_SCALE=.8,STRAFE_SCALE=.95;
export const ACCEL_RESPONSE=14,BRAKE_RESPONSE=18,AIR_RESPONSE=3;
export const GRAVITY_RISE=16,GRAVITY_FALL=20,TERMINAL_FALL=-30;
export const JUMP_HEIGHT=1,JUMP_LAUNCH=Math.sqrt(2*GRAVITY_RISE*JUMP_HEIGHT),JUMP_CUT=.55;
export const COYOTE_TIME=.1,JUMP_COST=5;
export const SNAP_DISTANCE=.4,STEP_UP=.35,SLOPE_LIMIT=Math.PI/4,SLIDE_ACCEL=4;
export const STAMINA_DRAIN=10,STAMINA_REGEN=15,STAMINA_DELAY=1;
export const LOOK_SENSITIVITY=.0022,PITCH_LIMIT=88*Math.PI/180;
export const FOV_BASE=75,FOV_SPRINT=80,FOV_RESPONSE=6;
export const BOB_AMOUNT=.7;
export const CAPSULE_RADIUS=.32,CAPSULE_SKIN=.02,SLIDE_ITERATIONS=3;
export const LANDING_DIP=.06,LANDING_REF=8;

export function wishAxes(dx,dz){
 let x=Number.isFinite(dx)?dx:0,z=Number.isFinite(dz)?dz:0;
 if(z>0)z*=BACK_SCALE;
 if(x)x*=STRAFE_SCALE;
 return {dx:x,dz:z};
}
export function groundSpeed({crouching=false,sprinting=false}={}){
 return crouching?CROUCH_SPEED:sprinting?SPRINT_SPEED:WALK_SPEED;
}
// v143: sprint winds up over ~0.25 s (0.17 s felt like a teleport); walk and braking stay snappy.
export const SPRINT_RESPONSE=9;
export function moveResponse(moving,airborne,sprinting=false){
 return airborne?AIR_RESPONSE:moving?(sprinting?SPRINT_RESPONSE:ACCEL_RESPONSE):BRAKE_RESPONSE;
}
export function capAirWish(tx,tz,airSpeed){
 if(!Number.isFinite(airSpeed)||airSpeed<0)return {tx,tz};
 const wish=Math.hypot(tx,tz);
 if(!(wish>airSpeed)&&wish>0)return {tx,tz};
 if(!(wish>0))return {tx:0,tz:0};
 const scale=airSpeed/wish;
 return {tx:tx*scale,tz:tz*scale};
}
export function verticalGravity(vertical){
 return vertical>0?GRAVITY_RISE:GRAVITY_FALL;
}
export function cutJump(vertical,releasing){
 if(!releasing||!(vertical>0))return vertical;
 return vertical*JUMP_CUT;
}
export function clampFall(vertical){
 return Math.max(TERMINAL_FALL,vertical);
}
export function cliffDrop(fromY,toY,jump=0,snap=SNAP_DISTANCE){
 if(jump>0||!Number.isFinite(fromY)||!Number.isFinite(toY))return 0;
 const drop=fromY-toY;
 return drop>snap?drop:0;
}
// Uphill samples steeper than 45° push the body back down. A rise inside the
// step allowance is a curb, not a ramp, and does not slide.
export function slopePush(fromY,toY,dx,dz){
 const run=Math.hypot(dx,dz);
 if(!(run>=.5)||!Number.isFinite(fromY)||!Number.isFinite(toY))return {x:0,z:0};
 const rise=toY-fromY;
 if(rise<=STEP_UP||Math.atan2(rise,run)<=SLOPE_LIMIT+1e-8)return {x:0,z:0};
 return {x:-dx/run*SLIDE_ACCEL,z:-dz/run*SLIDE_ACCEL};
}
export function staminaStep(current,sprinting,wait,dt,{jumping=false}={}){
 const value=Number.isFinite(current)?current:100;
 const delay=Number.isFinite(wait)?wait:0;
 const slice=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
 let stamina=Math.max(0,Math.min(100,value-(jumping?JUMP_COST:0)));
 let nextWait=delay;
 if(sprinting&&slice>0){stamina=Math.max(0,stamina-STAMINA_DRAIN*slice);nextWait=STAMINA_DELAY;}
 else{nextWait=Math.max(0,delay-slice);if(nextWait===0)stamina=Math.min(100,stamina+STAMINA_REGEN*slice);}
 return {stamina,wait:nextWait};
}
export function coyoteLeft(current,grounded,dt){
 if(grounded)return COYOTE_TIME;
 const left=(Number.isFinite(current)?current:0)-(Number.isFinite(dt)?Math.max(0,dt):0);
 return Math.max(0,left);
}
// A press on the last millimetres of a jump waits for landing. Coyote time
// only covers a real step off a ledge, which is already past the snap distance.
export function canJumpNow(jump,vertical,coyote){
 if(!(jump>0))return true;
 return coyote>0&&vertical<=0&&jump>=SNAP_DISTANCE;
}
export function landingDip(impact){
 if(!Number.isFinite(impact)||impact>=0)return 0;
 return -LANDING_DIP*Math.min(1,Math.abs(impact)/LANDING_REF);
}
export function decayDip(dip,dt){
 const value=Number.isFinite(dip)?dip:0;
 const slice=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
 const next=value*Math.exp(-10*slice);
 // A finished landing must leave the camera exactly on the eye. Sub-tenth-millimetre leftovers fail that and never read as motion.
 return Math.abs(next)<1e-4?0:next;
}
// Distance phase is radians. 1.8 Hz at a walk, 2.6 Hz at a sprint. Amount is the comfort slider.
export function headBob(phase,speed,{crouch=0,airborne=false,moving=false,amount=BOB_AMOUNT,sprinting=false}={}){
 if(!moving||airborne||!Number.isFinite(phase))return {y:0,lateral:0,roll:0};
 const stand=1-Math.max(0,Math.min(1,(Number.isFinite(crouch)?crouch:0)/.5));
 // v143: sprint bob capped at 1.2x walk (was 1.4x, ~7 cm peak-to-peak read as seasick).
 const pace=Math.max(0,Math.min(1.2,(Number.isFinite(speed)?speed:0)/WALK_SPEED));
 const scale=Math.max(0,Math.min(1,Number.isFinite(amount)?amount:0))*pace*stand;
 const wave=sprinting?phase*(2.6/1.8):phase;
 return {y:Math.sin(wave)*.035*scale,lateral:Math.cos(wave*.5)*.015*scale,roll:Math.sin(wave*.5)*(0.4*Math.PI/180)*scale};
}
// Five floor samples under the capsule. Only a rise inside the step allowance
// can lift the support, so a nearby wall or the RV interior cannot pop the body.
export function groundSupport(x,z,floorAt,radius=CAPSULE_RADIUS){
 if(typeof floorAt!=='function'||!Number.isFinite(x)||!Number.isFinite(z))return 0;
 const center=floorAt(x,z);
 if(!Number.isFinite(center))return 0;
 let support=center;
 const reach=Number.isFinite(radius)?Math.max(0,Math.min(radius,.5)):CAPSULE_RADIUS;
 for(const [dx,dz] of [[reach,0],[-reach,0],[0,reach],[0,-reach]]){
  const height=floorAt(x+dx,z+dz);
  const rise=height-center;
  if(Number.isFinite(height)&&rise>0&&rise<=STEP_UP&&height>support)support=height;
 }
 return support;
}
export function slideMotion(position,dx,dz,blocked){
 let x=position.x,z=position.z;
 let remX=Number.isFinite(dx)?dx:0,remZ=Number.isFinite(dz)?dz:0,hitX=false,hitZ=false;
 for(let i=0;i<SLIDE_ITERATIONS;i++){
  if(Math.hypot(remX,remZ)<1e-5)break;
  const step=sweepWalk({x,z},remX,remZ,blocked);
  const movedX=step.x-x,movedZ=step.z-z;
  x=step.x;z=step.z;hitX=hitX||step.hitX;hitZ=hitZ||step.hitZ;
  if(!step.hitX&&!step.hitZ)break;
  remX-=movedX;remZ-=movedZ;
  if(step.hitX)remX=0;
  if(step.hitZ)remZ=0;
 }
 return {x,z,hitX,hitZ};
}

// ---- v143 feel pass ---------------------------------------------------------
// Kerbs and stairs lift the body in one frame; the camera follows over ~0.15 s
// instead of popping. Only small grounded rises/drops inside the step allowance
// are eased; jumps, ledges and teleports pass straight through.
export const STEP_EASE=16,STEP_EASE_MIN=.02;
export function stepEyeOffset(offset,rise,dt,{grounded=true,driving=false}={}){
 let value=Number.isFinite(offset)?offset:0;
 if(driving)return 0;
 if(grounded&&Number.isFinite(rise)&&Math.abs(rise)>=STEP_EASE_MIN&&Math.abs(rise)<=STEP_UP+.001)value-=rise;
 value=Math.max(-STEP_UP,Math.min(STEP_UP,value));
 const slice=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
 const next=value*Math.exp(-STEP_EASE*slice);
 return Math.abs(next)<1e-4?0:next;
}
// Van steering: the wheel turns in over ~0.25 s (no instant snap) and the
// yaw rate tapers at speed so a full lock at the top end is a wide arc, not a spin.
export const STEER_RESPONSE=9,STEER_RETURN=12;
export function steerStep(current,input,dt){
 const target=Math.max(-1,Math.min(1,Number.isFinite(input)?input:0));
 const value=Number.isFinite(current)?Math.max(-1,Math.min(1,current)):0;
 const slice=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
 const response=Math.abs(target)<Math.abs(value)||Math.sign(target)!==Math.sign(value)?STEER_RETURN:STEER_RESPONSE;
 const next=target+(value-target)*Math.exp(-response*slice);
 return Math.abs(next-target)<1e-4?target:next;
}
export function driveYawRate(steering,speed,top=16){
 const v=Math.abs(Number.isFinite(speed)?speed:0),limit=Number.isFinite(steering)?Math.max(0,steering):0,ceiling=Math.max(1,Number.isFinite(top)?top:16);
 const taper=1-.38*Math.max(0,Math.min(1,(v-ceiling*.5)/(ceiling*.5)));
 return Math.min(limit,v*.15)*taper;
}
// A touch of speed in the van view, behind the same comfort toggle as sprint FOV.
export function driveFov(base,speed,top=16,enabled=true){
 const b=Number.isFinite(base)?base:FOV_BASE;
 if(!enabled)return b;
 const k=Math.max(0,Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/Math.max(1,top)));
 return Math.min(100,b+4*k*k);
}
