// Camera-space presentation and physical eye position share the authored scale.
export const STANDING_EYE=1.72,VEHICLE_EYE=1.55;
export const PLAYER_HEAD_MARGIN=.2;
const bounded=(value,min,max,fallback=0)=>Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
export function limitPlayerJump({ground=0,crouch=0,jump=0,vertical=0,ceiling=Infinity}={}){
 const requested=bounded(jump,0,2),velocity=bounded(vertical,-30,30);
 const room=Number.isFinite(ceiling)?Math.max(0,Math.min(2,ceiling-bounded(ground,-1000,1000)-STANDING_EYE+bounded(crouch,0,.5)-PLAYER_HEAD_MARGIN)):2;
 return {jump:Math.min(requested,room),vertical:requested>=room&&velocity>0?0:velocity};
}
export function playerViewHeights({ground=0,crouch=0,jump=0,bob=0,driving=false}={}){
 const floor=bounded(ground,-1000,1000);
 const eye=floor+(driving?VEHICLE_EYE:STANDING_EYE-bounded(crouch,0,.5)+bounded(jump,0,2));
 return {eye,cameraEye:eye+(driving?0:bounded(bob,-.06,.06))};
}
export function playerHeadFits({ground=0,crouch=0,jump=0,ceiling=Infinity}={}){
 return !Number.isFinite(ceiling)||playerViewHeights({ground,crouch,jump}).eye+PLAYER_HEAD_MARGIN<=ceiling+.000001;
}
export function firstPersonVisibility({active=false,panel='',station=false,driving=false,placing=false,work=null,equipped=null}={}){
 const visible=!!active&&!panel&&!station&&!driving&&!placing;
 return {hand:visible,pack:visible&&!work&&equipped==='packs',can:visible&&(work?work.tool===true:equipped==='can')};
}

// Exact integral of exponential velocity response: travel is stable across frame rates.
export function dampedTravel(velocity,target,dt,response=16){
 dt=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
 const decay=Math.exp(-response*dt),difference=velocity-target;
 return {velocity:target+difference*decay,distance:target*dt+difference*(1-decay)/response};
}
export function jumpStep(height,velocity,dt,gravity=12){
 dt=Number.isFinite(dt)?Math.max(0,Math.min(.1,dt)):0;
 const next=height+velocity*dt-.5*gravity*dt*dt;
 return next>0?{height:next,velocity:velocity-gravity*dt}:{height:0,velocity:0};
}

// Remember a fresh press briefly through landing; a held key never queues another jump.
export function bufferedJump(queued,pressed,grounded,allowed,dt){
 if(!allowed)return {queued:0,launch:false};
 const remaining=pressed?.12:Math.max(0,(Number.isFinite(queued)?queued:0)-Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0)));
 const launch=!!grounded&&remaining>0;
 return {queued:launch?0:remaining,launch};
}

// Never stand through a roof after releasing crouch. Exponential easing keeps
// the transition independent of render rate; minimum clearance is immediate.
export function crouchStep(current,pressed,ground,ceiling,dt){
 const minimum=Number.isFinite(ceiling)?bounded(ground+STANDING_EYE+PLAYER_HEAD_MARGIN-ceiling,0,.5):0;
 const target=pressed?.5:minimum;
 const value=target+(bounded(current,0,.5)-target)*Math.exp(-12*bounded(dt,0,.1));
 return Math.max(minimum,Math.abs(value-target)<.00001?target:value);
}

// A single simulation step may climb a curb or stair, not a wall.
export const STEP_RISE=.35;
export function riseTooSteep(fromY,toY,airborne=false){
 if(airborne)return false;
 if(!Number.isFinite(fromY)||!Number.isFinite(toY))return false;
 return toY-fromY>STEP_RISE;
}

// Standing stride matches the previous sine. Crouch shortens it; air time removes it.
export function strideBob(phase,{crouch=0,airborne=false,moving=false}={}){
 if(!moving||airborne||!Number.isFinite(phase))return {y:0,roll:0};
 const stand=1-Math.max(0,Math.min(1,(Number.isFinite(crouch)?crouch:0)/.5));
 return {y:Math.sin(phase)*.023*stand,roll:Math.sin(phase*.5)*.012*stand};
}
