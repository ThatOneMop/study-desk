const finite=Number.isFinite;
// World colliders already include pedestrian clearance. This is a conservative
// clear approach for a handoff, not a rendered eye-ray or a navigation fallback.
export function exchangeAccess(actor,recipient,blocked,floorHeight=()=>0){
 if(!actor||!recipient||![actor.x,actor.y,actor.z,recipient.x,recipient.z].every(finite))return {ok:false,reason:'Customer position is unavailable. Try again shortly.'};
 const distance=Math.hypot(actor.x-recipient.x,actor.z-recipient.z);
 if(distance>4.5)return {ok:false,reason:'Walk closer to the customer before handing over stock.'};
 const ground=floorHeight(recipient.x,recipient.z);
 if(!finite(ground)||Math.abs(actor.y-ground-1.72)>.9)return {ok:false,reason:'Meet the customer at street level to hand over stock.'};
 const steps=Math.max(1,Math.ceil(distance/.1));
 for(let i=0;i<=steps;i++)if(blocked(actor.x+(recipient.x-actor.x)*i/steps,actor.z+(recipient.z-actor.z)*i/steps))return {ok:false,reason:'Move around the obstruction to meet the customer.'};
 return {ok:true,reason:'Within reach · ready for a clear handoff.'};
}
export function freshExchangePose(peer,claimed,seenAt,now){
 return !!(peer&&claimed&&[peer.x,peer.z,claimed.x,claimed.z,seenAt,now].every(finite)&&now>=seenAt&&now-seenAt<=2000&&Math.hypot(peer.x-claimed.x,peer.z-claimed.z)<=3);
}
