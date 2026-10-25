// Eye-directed targeting prevents selecting crates beside or behind the player.
export function chooseParcel(props,actor,yaw,pitch=0,eligible=()=>true){
 if(!actor||![actor.x,actor.y,actor.z,yaw].every(Number.isFinite))return -1;
 pitch=Number.isFinite(pitch)?Math.max(-1.35,Math.min(1.35,pitch)):0;
 const c=Math.cos(pitch),fx=-Math.sin(yaw)*c,fy=Math.sin(pitch),fz=-Math.cos(yaw)*c;
 let best=Infinity,index=-1;
 for(let i=0;i<props.length;i++){
  const p=props[i];if(!p||p.owner||![p.x,p.y,p.z].every(Number.isFinite)||!eligible(p))continue;
  const dx=p.x-actor.x,dy=p.y-actor.y,dz=p.z-actor.z,d=Math.hypot(dx,dy,dz);if(d>3||d<.05)continue;
  const alignment=(dx*fx+dy*fy+dz*fz)/d;if(alignment<.65)continue;
  const score=(1-alignment)*3+d*.08;if(score<best){best=score;index=i;}
 }
 return index;
}
export function parcelVelocity(yaw,pitch=0,gentle=false){
 if(gentle||!Number.isFinite(yaw))return {vx:0,vy:0,vz:0};
 pitch=Number.isFinite(pitch)?Math.max(-1.2,Math.min(1.2,pitch)):0;
 const horizontal=Math.cos(pitch)*7;
 return {vx:-Math.sin(yaw)*horizontal,vy:Math.sin(pitch)*7+3,vz:-Math.cos(yaw)*horizontal};
}

export const PARCEL_NOTES=Object.freeze([
 Object.freeze({title:'Return to sender',text:'Three different names. The same room number. Someone has crossed out every return address except “Palm Court”. Under the tape: “Gramps paid in advance. Ask him what for.”'}),
 Object.freeze({title:'No night deliveries',text:'The dock receipt lists twelve boxes leaving and thirteen arriving. On the back: “The spare one belongs to nobody. Nobody collects after dark.”'}),
 Object.freeze({title:'Bay Salvage / 03',text:'A tool-shop invoice for one doorbell, forty metres of wire and six identical locks. Stamped twice: “Do not ring the bell.”'}),
 Object.freeze({title:'Not for the mayor',text:'A polite complaint about the smell from a workshop. The sender has also enclosed an order for twenty-four packs. Collection requested at the usual place.'})
]);
