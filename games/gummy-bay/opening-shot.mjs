// The fresh start used to leave the camera inside the exported RV shell.
// That shell is a solid tan box, so the first frame read as a clipping bug.
// This shot stays outside the shell, shows the campsite and the town, then
// hands the player the doorstep. It does not touch saves by itself.
const RV_SHELL=Object.freeze({minX:-60,maxX:-55.4,minZ:21.7,maxZ:30.2});

const clamp01=t=>Math.max(0,Math.min(1,Number.isFinite(t)?t:0));
const smooth=t=>{const u=clamp01(t);return u*u*(3-2*u);};
const mix=(a,b,t)=>a+(b-a)*t;

export function insideRvShell(x,z){
 return Number.isFinite(x)&&Number.isFinite(z)&&x>RV_SHELL.minX&&x<RV_SHELL.maxX&&z>RV_SHELL.minZ&&z<RV_SHELL.maxZ;
}

// East of the ramp, beside the payphone, looking toward Main Street (+X).
export function openingDoorstep(){
 return Object.freeze({x:-52.6,y:1.72,z:28.2,yaw:-Math.PI/2});
}

// 4.5s exterior move. Starts wide over the bay and settles outside the door.
export function openingCamera(seconds=0){
 const t=smooth((Number.isFinite(seconds)?seconds:0)/4.5);
 const wide={x:16,y:11.5,z:46,lookX:-36,lookY:2.2,lookZ:18};
 const door={x:-48.5,y:3.4,z:34,lookX:-18,lookY:2.4,lookZ:12};
 const pose={
  x:mix(wide.x,door.x,t),y:mix(wide.y,door.y,t),z:mix(wide.z,door.z,t),
  lookX:mix(wide.lookX,door.lookX,t),lookY:mix(wide.lookY,door.lookY,t),lookZ:mix(wide.lookZ,door.lookZ,t)
 };
 return Object.freeze({...pose,outside:!insideRvShell(pose.x,pose.z),t});
}
