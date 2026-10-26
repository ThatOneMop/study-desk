// Sugar Squad sight. A wide, short cone: 135° across, 100° up-and-down, 45 m.
// Yaw matches the town: angle 0 looks toward +z, and forward is (sin θ, cos θ).
export const VISION_RANGE=45;
export const VISION_YAW=135*Math.PI/180;
export const VISION_PITCH=100*Math.PI/180;

const finite=value=>Number.isFinite(value)?value:0;
export function inVision(viewer,target,{range=VISION_RANGE,yaw=VISION_YAW,pitch=VISION_PITCH,sight=null}={}){
 if(!viewer||!target)return {seen:false,distance:Infinity,reason:'missing'};
 const eye=Number.isFinite(viewer.y)?viewer.y:1.55;
 const height=Number.isFinite(target.y)?target.y:1.2;
 const dx=finite(target.x)-finite(viewer.x),dy=height-eye,dz=finite(target.z)-finite(viewer.z);
 const distance=Math.hypot(dx,dy,dz);
 if(!(distance>0))return {seen:false,distance:0,reason:'same'};
 if(distance>range)return {seen:false,distance,reason:'range'};
 const flat=Math.hypot(dx,dz);
 const facing=Number.isFinite(viewer.angle)?viewer.angle:0;
 const dot=flat>1e-6?(Math.sin(facing)*dx+Math.cos(facing)*dz)/flat:1;
 const yawOff=Math.acos(Math.max(-1,Math.min(1,dot)));
 if(yawOff>yaw/2)return {seen:false,distance,reason:'yaw'};
 const pitchOff=Math.abs(Math.atan2(dy,Math.max(flat,1e-6)));
 if(pitchOff>pitch/2)return {seen:false,distance,reason:'pitch'};
 if(typeof sight==='function'&&!sight(viewer,target))return {seen:false,distance,reason:'blocked'};
 return {seen:true,distance,reason:'clear'};
}
